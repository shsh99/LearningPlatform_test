import type { Enrollment } from '../../types/enrollment';
import { Card } from '../Card';
import { Button } from '../Button';

interface EnrollmentCardProps {
  enrollment: Enrollment;
  onCancel?: (id: number) => void;
  onComplete?: (id: number) => void;
  loading?: boolean;
}

export const EnrollmentCard = ({
  enrollment,
  onCancel,
  onComplete,
  loading = false,
}: EnrollmentCardProps) => {
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      ENROLLED: 'bg-blue-100 text-blue-800',
      CANCELLED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-green-100 text-green-800',
    };

    const statusText = {
      ENROLLED: '수강중',
      CANCELLED: '취소됨',
      COMPLETED: '완료',
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-semibold rounded ${
          statusStyles[status as keyof typeof statusStyles]
        }`}
      >
        {statusText[status as keyof typeof statusText]}
      </span>
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-900">
          {enrollment.courseName}
        </h3>
        {getStatusBadge(enrollment.status)}
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center text-sm text-gray-600">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <span>학기: {enrollment.termNumber}학기</span>
        </div>

        <div className="flex items-center text-sm text-gray-600">
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
          <span>학생: {enrollment.studentName}</span>
        </div>

        <div className="text-xs text-gray-500">
          신청일: {new Date(enrollment.createdAt).toLocaleDateString('ko-KR')}
        </div>
      </div>

      {/* 액션 버튼 */}
      {enrollment.status === 'ENROLLED' && (
        <div className="flex gap-2">
          {onComplete && (
            <Button
              onClick={() => onComplete(enrollment.id)}
              disabled={loading}
              variant="primary"
              className="flex-1"
            >
              완료하기
            </Button>
          )}
          {onCancel && (
            <Button
              onClick={() => onCancel(enrollment.id)}
              disabled={loading}
              variant="secondary"
              className="flex-1"
            >
              취소하기
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
