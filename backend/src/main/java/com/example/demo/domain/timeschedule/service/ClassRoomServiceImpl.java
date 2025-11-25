package com.example.demo.domain.timeschedule.service;

import com.example.demo.domain.timeschedule.dto.ClassRoomResponse;
import com.example.demo.domain.timeschedule.dto.CreateClassRoomRequest;
import com.example.demo.domain.timeschedule.dto.UpdateClassRoomRequest;
import com.example.demo.domain.timeschedule.entity.ClassRoom;
import com.example.demo.domain.timeschedule.entity.ClassRoomStatus;
import com.example.demo.domain.timeschedule.exception.ClassRoomNotFoundException;
import com.example.demo.domain.timeschedule.exception.DuplicateClassRoomNameException;
import com.example.demo.domain.timeschedule.repository.ClassRoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class ClassRoomServiceImpl implements ClassRoomService {

    private final ClassRoomRepository classRoomRepository;

    @Override
    @Transactional
    public ClassRoomResponse createClassRoom(CreateClassRoomRequest request) {
        if (classRoomRepository.existsByName(request.name())) {
            throw new DuplicateClassRoomNameException(request.name());
        }

        ClassRoom classRoom = ClassRoom.create(
                request.name(),
                request.location(),
                request.capacity()
        );

        if (request.facilities() != null) {
            classRoom.updateFacilities(request.facilities());
        }

        ClassRoom saved = classRoomRepository.save(classRoom);
        log.info("강의실 생성 완료: name={}", request.name());

        return ClassRoomResponse.from(saved);
    }

    @Override
    public ClassRoomResponse findById(Long id) {
        ClassRoom classRoom = classRoomRepository.findById(id)
                .orElseThrow(() -> new ClassRoomNotFoundException(id));
        return ClassRoomResponse.from(classRoom);
    }

    @Override
    public List<ClassRoomResponse> findAll() {
        return classRoomRepository.findAll().stream()
                .map(ClassRoomResponse::from)
                .toList();
    }

    @Override
    public List<ClassRoomResponse> findAvailable() {
        return classRoomRepository.findByStatus(ClassRoomStatus.AVAILABLE).stream()
                .map(ClassRoomResponse::from)
                .toList();
    }

    @Override
    public List<ClassRoomResponse> findAvailableForTimeSlot(LocalDate date, LocalTime startTime, LocalTime endTime) {
        return classRoomRepository.findAvailableClassRoomsForTimeSlot(date, startTime, endTime).stream()
                .map(ClassRoomResponse::from)
                .toList();
    }

    @Override
    @Transactional
    public ClassRoomResponse updateClassRoom(Long id, UpdateClassRoomRequest request) {
        ClassRoom classRoom = classRoomRepository.findById(id)
                .orElseThrow(() -> new ClassRoomNotFoundException(id));

        if (request.name() != null && !request.name().equals(classRoom.getName())) {
            if (classRoomRepository.existsByName(request.name())) {
                throw new DuplicateClassRoomNameException(request.name());
            }
        }

        if (request.name() != null || request.location() != null || request.capacity() != null) {
            classRoom.updateInfo(
                    request.name() != null ? request.name() : classRoom.getName(),
                    request.location() != null ? request.location() : classRoom.getLocation(),
                    request.capacity() != null ? request.capacity() : classRoom.getCapacity()
            );
        }

        if (request.facilities() != null) {
            classRoom.updateFacilities(request.facilities());
        }

        if (request.status() != null) {
            ClassRoomStatus status = ClassRoomStatus.valueOf(request.status());
            switch (status) {
                case AVAILABLE -> classRoom.markAsAvailable();
                case MAINTENANCE -> classRoom.markAsMaintenance();
                case UNAVAILABLE -> classRoom.markAsUnavailable();
            }
        }

        log.info("강의실 수정 완료: id={}", id);
        return ClassRoomResponse.from(classRoom);
    }

    @Override
    @Transactional
    public void markAsAvailable(Long id) {
        ClassRoom classRoom = classRoomRepository.findById(id)
                .orElseThrow(() -> new ClassRoomNotFoundException(id));
        classRoom.markAsAvailable();
        log.info("강의실 사용 가능 설정: id={}", id);
    }

    @Override
    @Transactional
    public void markAsMaintenance(Long id) {
        ClassRoom classRoom = classRoomRepository.findById(id)
                .orElseThrow(() -> new ClassRoomNotFoundException(id));
        classRoom.markAsMaintenance();
        log.info("강의실 점검 중 설정: id={}", id);
    }

    @Override
    @Transactional
    public void markAsUnavailable(Long id) {
        ClassRoom classRoom = classRoomRepository.findById(id)
                .orElseThrow(() -> new ClassRoomNotFoundException(id));
        classRoom.markAsUnavailable();
        log.info("강의실 사용 불가 설정: id={}", id);
    }

    @Override
    @Transactional
    public void deleteClassRoom(Long id) {
        ClassRoom classRoom = classRoomRepository.findById(id)
                .orElseThrow(() -> new ClassRoomNotFoundException(id));
        classRoomRepository.delete(classRoom);
        log.info("강의실 삭제 완료: id={}", id);
    }
}
