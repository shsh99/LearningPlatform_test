import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getInstructorAssignmentsByInstructorId } from '../../api/instructorAssignment';
import { getCourseTermById } from '../../api/courseTerm';
import type { InstructorAssignment } from '../../types/instructorAssignment';
import type { CourseTerm } from '../../types/courseTerm';
import { ChangeRequestModal } from './ChangeRequestModal';
import { DeleteRequestModal } from './DeleteRequestModal';

interface AssignedCoursesTabProps {
  userId: number;
}

const DAY_OF_WEEK_LABELS: Record<string, string> = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
};

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  SCHEDULED: { label: '예정', className: 'bg-blue-100 text-blue-800' },
  ONGOING: { label: '진행중', className: 'bg-green-100 text-green-800' },
  COMPLETED: { label: '완료', className: 'bg-gray-100 text-gray-800' },
  CANCELLED: { label: '취소', className: 'bg-red-100 text-red-800' },
};

interface AssignedCourseWithTerm extends InstructorAssignment {
  term?: CourseTerm;
}

export const AssignedCoursesTab = ({ userId }: AssignedCoursesTabProps) => {
  const [selectedTerm, setSelectedTerm] = useState<CourseTerm | null>(null);
  const [modalType, setModalType] = useState<'change' | 'delete' | null>(null);

  // 배정된 강의 목록 조회
  const { data: assignments, isLoading: assignmentsLoading } = useQuery({
    queryKey: ['instructorAssignments', 'instructor', userId],
    queryFn: () => getInstructorAssignmentsByInstructorId(userId),
    enabled: !!userId,
  });

  // 활성 상태 배정만 필터링
  const activeAssignments = assignments?.filter(a => a.status === 'ASSIGNED') || [];

  // 각 배정에 대한 차수 정보 조회
  const { data: assignmentsWithTerms, isLoading: termsLoading } = useQuery({
    queryKey: ['assignedCoursesWithTerms', activeAssignments.map(a => a.termId)],
    queryFn: async (): Promise<AssignedCourseWithTerm[]> => {
      const results = await Promise.all(
        activeAssignments.map(async (assignment) => {
          try {
            const term = await getCourseTermById(assignment.termId);
            return { ...assignment, term };
          } catch {
            return { ...assignment, term: undefined };
          }
        })
      );
      return results;
    },
    enabled: activeAssignments.length > 0,
  });

  const isLoading = assignmentsLoading || termsLoading;

  const handleChangeRequest = (term: CourseTerm) => {
    setSelectedTerm(term);
    setModalType('change');
  };

  const handleDeleteRequest = (term: CourseTerm) => {
    setSelectedTerm(term);
    setModalType('delete');
  };

  const closeModal = () => {
    setSelectedTerm(null);
    setModalType(null);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!assignmentsWithTerms || assignmentsWithTerms.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-5xl mb-4">📚</div>
        <p className="text-gray-600">배정받은 강의가 없습니다.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {assignmentsWithTerms.map((assignment) => {
          const term = assignment.term;
          if (!term) return null;

          const statusInfo = STATUS_LABELS[term.status] || STATUS_LABELS.SCHEDULED;
          const daysString = term.daysOfWeek
            .map((day) => DAY_OF_WEEK_LABELS[day])
            .join(', ');

          return (
            <div
              key={assignment.id}
              className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* 카드 헤더 */}
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
                <h3 className="text-white font-semibold text-lg truncate">
                  {assignment.courseTitle}
                </h3>
                <p className="text-blue-100 text-sm">
                  {assignment.termNumber}차수
                </p>
              </div>

              {/* 카드 본문 */}
              <div className="p-4 space-y-3">
                {/* 상태 뱃지 */}
                <div className="flex items-center justify-between">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}
                  >
                    {statusInfo.label}
                  </span>
                  <span className="text-sm text-gray-500">
                    {term.currentStudents}/{term.maxStudents}명
                  </span>
                </div>

                {/* 기간 */}
                <div className="text-sm">
                  <div className="text-gray-500 mb-1">기간</div>
                  <div className="text-gray-900">
                    {term.startDate} ~ {term.endDate}
                  </div>
                </div>

                {/* 요일 및 시간 */}
                <div className="text-sm">
                  <div className="text-gray-500 mb-1">일정</div>
                  <div className="text-gray-900">
                    {daysString} {term.startTime} ~ {term.endTime}
                  </div>
                </div>
              </div>

              {/* 카드 푸터 - 액션 버튼 */}
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex gap-2">
                <button
                  onClick={() => handleChangeRequest(term)}
                  disabled={term.status === 'COMPLETED' || term.status === 'CANCELLED'}
                  className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-300 rounded-md hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  변경 요청
                </button>
                <button
                  onClick={() => handleDeleteRequest(term)}
                  disabled={term.status === 'COMPLETED' || term.status === 'CANCELLED'}
                  className="flex-1 px-3 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  삭제 요청
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 변경 요청 모달 */}
      {modalType === 'change' && selectedTerm && (
        <ChangeRequestModal term={selectedTerm} onClose={closeModal} />
      )}

      {/* 삭제 요청 모달 */}
      {modalType === 'delete' && selectedTerm && (
        <DeleteRequestModal term={selectedTerm} onClose={closeModal} />
      )}
    </>
  );
};
