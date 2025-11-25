package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.timeschedule.dto.CreateScheduleRequest;
import com.example.demo.domain.timeschedule.dto.ScheduleResponse;
import com.example.demo.domain.timeschedule.dto.UpdateScheduleRequest;
import com.example.demo.domain.timeschedule.entity.*;
import com.example.demo.domain.timeschedule.exception.ClassRoomNotFoundException;
import com.example.demo.domain.timeschedule.exception.ScheduleConflictException;
import com.example.demo.domain.timeschedule.exception.ScheduleNotFoundException;
import com.example.demo.domain.timeschedule.exception.TermNotFoundException;
import com.example.demo.domain.timeschedule.repository.ClassRoomRepository;
import com.example.demo.domain.timeschedule.repository.CourseTermRepository;
import com.example.demo.domain.timeschedule.repository.InstructorAssignmentRepository;
import com.example.demo.domain.timeschedule.repository.ScheduleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ScheduleServiceImpl implements ScheduleService {

    private final ScheduleRepository scheduleRepository;
    private final CourseTermRepository courseTermRepository;
    private final ClassRoomRepository classRoomRepository;
    private final InstructorAssignmentRepository instructorAssignmentRepository;

    @Override
    @Transactional
    public ScheduleResponse createSchedule(CreateScheduleRequest request) {
        CourseTerm term = courseTermRepository.findById(request.termId())
                .orElseThrow(() -> new TermNotFoundException(request.termId()));

        DayOfWeekEnum dayOfWeek = DayOfWeekEnum.valueOf(request.dayOfWeek());

        // 강사 시간표 충돌 검증
        validateInstructorConflict(request.termId(), request.scheduleDate(),
                request.startTime(), request.endTime(), null);

        Schedule schedule = Schedule.create(
                term,
                request.weekNumber(),
                dayOfWeek,
                request.scheduleDate(),
                request.startTime(),
                request.endTime()
        );

        if (request.note() != null) {
            schedule.updateNote(request.note());
        }

        if (request.classRoomId() != null) {
            ClassRoom classRoom = classRoomRepository.findById(request.classRoomId())
                    .orElseThrow(() -> new ClassRoomNotFoundException(request.classRoomId()));

            validateClassRoomConflict(classRoom.getId(), request.scheduleDate(),
                    request.startTime(), request.endTime(), null);

            schedule.assignClassRoom(classRoom);
        }

        Schedule saved = scheduleRepository.save(schedule);
        log.info("일정 생성 완료: termId={}, date={}", request.termId(), request.scheduleDate());

        return ScheduleResponse.from(saved);
    }

    @Override
    public ScheduleResponse findById(Long id) {
        Schedule schedule = scheduleRepository.findByIdWithTerm(id);
        if (schedule == null) {
            throw new ScheduleNotFoundException(id);
        }
        return ScheduleResponse.from(schedule);
    }

    @Override
    public List<ScheduleResponse> findByTermId(Long termId) {
        return scheduleRepository.findByTermIdWithDetails(termId).stream()
                .map(ScheduleResponse::from)
                .toList();
    }

    @Override
    public List<ScheduleResponse> findByTermIdAndWeekNumber(Long termId, Integer weekNumber) {
        return scheduleRepository.findByTermIdAndWeekNumber(termId, weekNumber).stream()
                .map(ScheduleResponse::from)
                .toList();
    }

    @Override
    public List<ScheduleResponse> findByDateRange(LocalDate startDate, LocalDate endDate) {
        return scheduleRepository.findByDateRangeWithDetails(startDate, endDate).stream()
                .map(ScheduleResponse::from)
                .toList();
    }

    @Override
    public List<ScheduleResponse> findAll() {
        return scheduleRepository.findAll().stream()
                .map(ScheduleResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public ScheduleResponse updateSchedule(Long id, UpdateScheduleRequest request) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ScheduleNotFoundException(id));

        // 시간 또는 날짜 변경 시 강사 충돌 검증
        LocalDate newDate = request.scheduleDate() != null ? request.scheduleDate() : schedule.getScheduleDate();
        java.time.LocalTime newStartTime = request.startTime() != null ? request.startTime() : schedule.getStartTime();
        java.time.LocalTime newEndTime = request.endTime() != null ? request.endTime() : schedule.getEndTime();

        if (request.scheduleDate() != null || request.startTime() != null || request.endTime() != null) {
            validateInstructorConflict(schedule.getTerm().getId(), newDate, newStartTime, newEndTime, id);
        }

        if (request.scheduleDate() != null && request.dayOfWeek() != null) {
            DayOfWeekEnum dayOfWeek = DayOfWeekEnum.valueOf(request.dayOfWeek());
            schedule.updateScheduleDate(request.scheduleDate(), dayOfWeek);
        }

        if (request.startTime() != null && request.endTime() != null) {
            schedule.updateTime(request.startTime(), request.endTime());
        }

        if (request.classRoomId() != null) {
            ClassRoom classRoom = classRoomRepository.findById(request.classRoomId())
                    .orElseThrow(() -> new ClassRoomNotFoundException(request.classRoomId()));

            validateClassRoomConflict(classRoom.getId(), schedule.getScheduleDate(),
                    schedule.getStartTime(), schedule.getEndTime(), id);

            schedule.assignClassRoom(classRoom);
        }

        if (request.scheduleType() != null) {
            ScheduleType type = ScheduleType.valueOf(request.scheduleType());
            switch (type) {
                case CANCELLED -> schedule.markAsCancelled(request.note());
                case MAKEUP -> schedule.markAsMakeup(request.note());
                case REGULAR -> schedule.markAsRegular();
            }
        }

        if (request.note() != null) {
            schedule.updateNote(request.note());
        }

        log.info("일정 수정 완료: id={}", id);
        return ScheduleResponse.from(schedule);
    }

    @Override
    @Transactional
    public void assignClassRoom(Long scheduleId, Long classRoomId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ScheduleNotFoundException(scheduleId));

        ClassRoom classRoom = classRoomRepository.findById(classRoomId)
                .orElseThrow(() -> new ClassRoomNotFoundException(classRoomId));

        validateClassRoomConflict(classRoomId, schedule.getScheduleDate(),
                schedule.getStartTime(), schedule.getEndTime(), scheduleId);

        schedule.assignClassRoom(classRoom);
        log.info("강의실 배정 완료: scheduleId={}, classRoomId={}", scheduleId, classRoomId);
    }

    @Override
    @Transactional
    public void removeClassRoom(Long scheduleId) {
        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new ScheduleNotFoundException(scheduleId));

        schedule.removeClassRoom();
        log.info("강의실 배정 해제: scheduleId={}", scheduleId);
    }

    @Override
    @Transactional
    public void markAsCancelled(Long id, String reason) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ScheduleNotFoundException(id));

        schedule.markAsCancelled(reason);
        log.info("일정 휴강 처리: id={}, reason={}", id, reason);
    }

    @Override
    @Transactional
    public void markAsMakeup(Long id, String note) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ScheduleNotFoundException(id));

        schedule.markAsMakeup(note);
        log.info("일정 보강 처리: id={}, note={}", id, note);
    }

    @Override
    @Transactional
    public void deleteSchedule(Long id) {
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new ScheduleNotFoundException(id));

        scheduleRepository.delete(schedule);
        log.info("일정 삭제 완료: id={}", id);
    }

    private void validateClassRoomConflict(Long classRoomId, LocalDate date,
                                           java.time.LocalTime startTime, java.time.LocalTime endTime,
                                           Long excludeScheduleId) {
        List<Schedule> existingSchedules = scheduleRepository.findByClassRoomIdAndScheduleDate(classRoomId, date);

        for (Schedule existing : existingSchedules) {
            if (excludeScheduleId != null && existing.getId().equals(excludeScheduleId)) {
                continue;
            }
            if (existing.isOverlapping(startTime, endTime)) {
                throw new ScheduleConflictException(
                        String.format("강의실 시간 충돌: %s %s-%s",
                                existing.getScheduleDate(), existing.getStartTime(), existing.getEndTime())
                );
            }
        }
    }

    /**
     * 강사 시간표 충돌 검증
     * 같은 강사가 같은 시간에 다른 기수에 배정되어 있는지 확인
     */
    public void validateInstructorConflict(Long termId, LocalDate date,
                                           java.time.LocalTime startTime, java.time.LocalTime endTime,
                                           Long excludeScheduleId) {
        // 해당 기수에 배정된 강사 목록 조회
        List<InstructorAssignment> assignments = instructorAssignmentRepository.findByTermId(termId);

        for (InstructorAssignment assignment : assignments) {
            if (assignment.getStatus() != AssignmentStatus.ASSIGNED) {
                continue;
            }

            Long instructorId = assignment.getInstructor().getId();

            // 해당 강사가 같은 날짜에 다른 기수에서 수업이 있는지 확인
            List<Schedule> instructorSchedules = scheduleRepository.findByInstructorIdAndScheduleDate(instructorId, date);

            for (Schedule existing : instructorSchedules) {
                // 같은 기수의 일정은 제외
                if (existing.getTerm().getId().equals(termId)) {
                    continue;
                }
                // 수정 중인 일정은 제외
                if (excludeScheduleId != null && existing.getId().equals(excludeScheduleId)) {
                    continue;
                }
                if (existing.isOverlapping(startTime, endTime)) {
                    throw new ScheduleConflictException(
                            String.format("강사 시간 충돌: %s 강사가 %s %s-%s에 다른 강의가 있습니다",
                                    assignment.getInstructor().getName(),
                                    existing.getScheduleDate(), existing.getStartTime(), existing.getEndTime())
                    );
                }
            }
        }
    }
}
