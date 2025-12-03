import { useState } from 'react';
import { useCreateChangeRequest } from '../../hooks/useCourseTermRequests';
import type { CourseTerm, DayOfWeek } from '../../types/courseTerm';
import type { CreateChangeRequestDto } from '../../types/courseTermRequest';

interface ChangeRequestModalProps {
  term: CourseTerm;
  onClose: () => void;
}

const DAYS_OF_WEEK: { value: DayOfWeek; label: string }[] = [
  { value: 'MONDAY', label: '월' },
  { value: 'TUESDAY', label: '화' },
  { value: 'WEDNESDAY', label: '수' },
  { value: 'THURSDAY', label: '목' },
  { value: 'FRIDAY', label: '금' },
  { value: 'SATURDAY', label: '토' },
  { value: 'SUNDAY', label: '일' },
];

export const ChangeRequestModal = ({ term, onClose }: ChangeRequestModalProps) => {
  const [formData, setFormData] = useState({
    startDate: term.startDate,
    endDate: term.endDate,
    daysOfWeek: [...term.daysOfWeek],
    startTime: term.startTime,
    endTime: term.endTime,
    maxStudents: term.maxStudents,
    reason: '',
  });

  const createMutation = useCreateChangeRequest();

  const handleDayToggle = (day: DayOfWeek) => {
    setFormData((prev) => ({
      ...prev,
      daysOfWeek: prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.daysOfWeek.length === 0) {
      alert('요일을 최소 하나 이상 선택해주세요.');
      return;
    }

    const dto: CreateChangeRequestDto = {
      courseTermId: term.id,
      startDate: formData.startDate,
      endDate: formData.endDate,
      daysOfWeek: formData.daysOfWeek,
      startTime: formData.startTime,
      endTime: formData.endTime,
      maxStudents: formData.maxStudents,
      reason: formData.reason || undefined,
    };

    try {
      await createMutation.mutateAsync(dto);
      alert('변경 요청이 접수되었습니다.');
      onClose();
    } catch (error) {
      console.error('변경 요청 실패:', error);
      alert('변경 요청에 실패했습니다.');
    }
  };

  const hasChanges =
    formData.startDate !== term.startDate ||
    formData.endDate !== term.endDate ||
    formData.startTime !== term.startTime ||
    formData.endTime !== term.endTime ||
    formData.maxStudents !== term.maxStudents ||
    JSON.stringify(formData.daysOfWeek.sort()) !== JSON.stringify([...term.daysOfWeek].sort());

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        {/* 배경 오버레이 */}
        <div
          className="fixed inset-0 bg-black bg-opacity-25"
          onClick={onClose}
        />

        {/* 모달 내용 */}
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">변경 요청</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 현재 정보 */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-2">현재 정보</h3>
            <p className="text-gray-900 font-medium">{term.courseTitle} - {term.termNumber}차수</p>
            <p className="text-sm text-gray-600">
              {term.startDate} ~ {term.endDate} |
              {term.daysOfWeek.map((d) => DAYS_OF_WEEK.find((day) => day.value === d)?.label).join(', ')} |
              {term.startTime} ~ {term.endTime} |
              정원 {term.maxStudents}명
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 기간 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시작일
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  종료일
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* 요일 선택 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                요일
              </label>
              <div className="flex flex-wrap gap-2">
                {DAYS_OF_WEEK.map((day) => (
                  <button
                    key={day.value}
                    type="button"
                    onClick={() => handleDayToggle(day.value)}
                    className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      formData.daysOfWeek.includes(day.value)
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {day.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 시간 */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  시작 시간
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData((prev) => ({ ...prev, startTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  종료 시간
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData((prev) => ({ ...prev, endTime: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            {/* 정원 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                정원
              </label>
              <input
                type="number"
                value={formData.maxStudents}
                onChange={(e) => setFormData((prev) => ({ ...prev, maxStudents: parseInt(e.target.value) || 0 }))}
                min={term.currentStudents}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
              {term.currentStudents > 0 && (
                <p className="mt-1 text-sm text-gray-500">
                  현재 수강생 {term.currentStudents}명 (정원은 현재 수강생 수 이상이어야 합니다)
                </p>
              )}
            </div>

            {/* 변경 사유 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                변경 사유 (선택)
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData((prev) => ({ ...prev, reason: e.target.value }))}
                rows={3}
                placeholder="변경 사유를 입력해주세요..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
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
                disabled={!hasChanges || createMutation.isPending}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {createMutation.isPending ? '요청 중...' : '변경 요청'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
