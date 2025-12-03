import { useState } from 'react';
import { useCreateDeleteRequest } from '../../hooks/useCourseTermRequests';
import type { CourseTerm, DayOfWeek } from '../../types/courseTerm';
import type { CreateDeleteRequestDto } from '../../types/courseTermRequest';

interface DeleteRequestModalProps {
  term: CourseTerm;
  onClose: () => void;
}

const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
};

export const DeleteRequestModal = ({ term, onClose }: DeleteRequestModalProps) => {
  const [reason, setReason] = useState('');

  const createMutation = useCreateDeleteRequest();

  const hasEnrolledStudents = term.currentStudents > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reason.trim()) {
      alert('삭제 사유를 입력해주세요.');
      return;
    }

    const dto: CreateDeleteRequestDto = {
      courseTermId: term.id,
      reason: reason.trim(),
    };

    try {
      await createMutation.mutateAsync(dto);
      alert('삭제 요청이 접수되었습니다.');
      onClose();
    } catch (error) {
      console.error('삭제 요청 실패:', error);
      alert('삭제 요청에 실패했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* 배경 오버레이 */}
        <div
          className="fixed inset-0 bg-black bg-opacity-25"
          onClick={onClose}
        />

        {/* 모달 내용 */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">삭제 요청</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 수강생 있는 경우 경고 */}
          {hasEnrolledStudents && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start">
                <svg className="w-5 h-5 text-red-500 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-red-800">
                    수강생이 등록되어 있습니다
                  </h3>
                  <p className="mt-1 text-sm text-red-700">
                    현재 {term.currentStudents}명의 수강생이 등록되어 있어 삭제 요청을 할 수 없습니다.
                    수강생 등록이 해제된 후 다시 시도해주세요.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 차수 정보 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-2">삭제할 차수 정보</h3>
            <p className="text-gray-900 font-medium">{term.courseTitle} - {term.termNumber}차수</p>
            <p className="text-sm text-gray-600">
              {term.startDate} ~ {term.endDate}
            </p>
            <p className="text-sm text-gray-600">
              {term.daysOfWeek.map((d) => DAY_OF_WEEK_LABELS[d]).join(', ')} |
              {term.startTime} ~ {term.endTime}
            </p>
            <p className="text-sm text-gray-600">
              정원: {term.maxStudents}명 / 현재: {term.currentStudents}명
            </p>
          </div>

          {!hasEnrolledStudents && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 삭제 사유 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  삭제 사유 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  placeholder="삭제 사유를 상세히 입력해주세요..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                  required
                />
              </div>

              {/* 경고 메시지 */}
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <p className="text-sm text-yellow-800">
                  삭제 요청이 승인되면 해당 차수가 취소 상태로 변경됩니다.
                  이 작업은 되돌릴 수 없으니 신중하게 요청해주세요.
                </p>
              </div>

              {/* 버튼 */}
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {createMutation.isPending ? '요청 중...' : '삭제 요청'}
                </button>
              </div>
            </form>
          )}

          {hasEnrolledStudents && (
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                닫기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
