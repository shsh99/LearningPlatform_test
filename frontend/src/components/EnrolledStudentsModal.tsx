import { useState, useEffect } from 'react';
import { getEnrolledStudentsByTerm } from '../api/enrollment';
import type { EnrollmentResponse } from '../types/enrollment';

interface EnrolledStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  termId: number | null;
  courseTitle: string;
  termNumber: number;
}

export const EnrolledStudentsModal = ({
  isOpen,
  onClose,
  termId,
  courseTitle,
  termNumber
}: EnrolledStudentsModalProps) => {
  const [students, setStudents] = useState<EnrollmentResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && termId) {
      loadStudents();
    }
  }, [isOpen, termId]);

  const loadStudents = async () => {
    if (!termId) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await getEnrolledStudentsByTerm(termId);
      setStudents(data);
    } catch (err) {
      console.error('Failed to load enrolled students:', err);
      setError('등록된 학생 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">등록된 학생 목록</h2>
            <p className="text-sm text-gray-600 mt-1">
              {courseTitle} (차수{termNumber})
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600">로딩 중...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <button
                onClick={loadStudents}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                다시 시도
              </button>
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">등록된 학생이 없습니다.</p>
            </div>
          ) : (
            <>
              {/* Summary */}
              <div className="mb-4 text-sm text-gray-600">
                총 {students.length}명의 학생이 등록되어 있습니다.
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        학생 정보
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        등록일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student, index) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="font-medium text-gray-900">
                            {student.studentName}
                          </div>
                          <div className="text-gray-400 text-xs">
                            (ID: {student.studentId})
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(student.enrolledAt).toLocaleDateString(
                            'ko-KR',
                            {
                              year: '2-digit',
                              month: '2-digit',
                              day: '2-digit'
                            }
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            수강중🟢
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};
