import type { Course } from '../../types/course';
import { Card } from '../Card';

interface CourseCardProps {
  course: Course;
  onClick?: () => void;
}

export const CourseCard = ({ course, onClick }: CourseCardProps) => {
  const getStatusBadge = (status: string) => {
    const statusStyles = {
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
    };

    const statusText = {
      APPROVED: '승인됨',
      REJECTED: '거부됨',
      PENDING: '대기중',
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
    <Card
      onClick={onClick}
      className="hover:shadow-lg transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xl font-semibold text-gray-900">{course.title}</h3>
        {getStatusBadge(course.status)}
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">
        {course.description || '설명이 없습니다.'}
      </p>

      <div className="flex items-center justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <svg
            className="w-5 h-5 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <span>최대 {course.maxStudents}명</span>
        </div>

        <div className="text-xs">
          {new Date(course.createdAt).toLocaleDateString('ko-KR')}
        </div>
      </div>
    </Card>
  );
};
