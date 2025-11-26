import { useState, useEffect } from 'react';
import type { StudentInformationSystem } from '../types/studentInformationSystem';
import { getStudentInformationSystemDetail } from '../api/studentInformationSystem';

interface StudentDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: number;
}

export const StudentDetailModal = ({ isOpen, onClose, studentId }: StudentDetailModalProps) => {
  const [student, setStudent] = useState<StudentInformationSystem | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && studentId) {
      loadStudentDetail();
    }
  }, [isOpen, studentId]);

  const loadStudentDetail = async () => {
    try {
      setIsLoading(true);
      const data = await getStudentInformationSystemDetail(studentId);
      setStudent(data);
    } catch (error) {
      console.error('Failed to load student detail:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">학생 상세 정보</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="text-lg text-gray-600">로딩 중...</div>
            </div>
          ) : student ? (
            <div className="space-y-6">
              {/* 학생 기본 정보 */}
              <section className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">학생명</label>
                    <div className="text-gray-900 font-medium">{student.studentName}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">이메일</label>
                    <div className="text-gray-900">{student.studentEmail}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">사용자 ID</label>
                    <div className="text-gray-900">user{student.userKey}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">수강 상태</label>
                    <div>
                      {student.enrollmentStatus === 'ENROLLED' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                          [수강중]🟢
                        </span>
                      )}
                      {student.enrollmentStatus === 'COMPLETED' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                          [수료]🔵
                        </span>
                      )}
                      {student.enrollmentStatus === 'CANCELLED' && (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                          [취소]🔴
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* 수강 정보 */}
              <section className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">수강 정보</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">강의명</label>
                    <div className="text-gray-900 font-medium">{student.courseTitle}</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">차수</label>
                    <div className="text-gray-900">{student.termNumber}차수</div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">진도율</label>
                    <div className="text-gray-900">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${student.progressPercentage}%` }}
                          />
                        </div>
                        <span className="font-medium">{student.progressPercentage}%</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">신청일</label>
                    <div className="text-gray-900">
                      {new Date(student.enrollmentCreatedAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </section>

              {/* 학습 이력 */}
              <section className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">학습 이력</h3>
                <div className="text-gray-600 text-sm">
                  학습 이력 데이터는 추후 구현 예정입니다.
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">강의 시청</div>
                      <div className="text-sm text-gray-500">2025-11-26 14:30</div>
                    </div>
                    <div className="text-sm text-gray-600">1강 완료</div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">강의 시청</div>
                      <div className="text-sm text-gray-500">2025-11-25 10:15</div>
                    </div>
                    <div className="text-sm text-gray-600">오리엔테이션 완료</div>
                  </div>
                </div>
              </section>

              {/* 결제 내역 */}
              <section className="bg-purple-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">결제 내역</h3>
                <div className="text-gray-600 text-sm">
                  결제 내역 데이터는 추후 구현 예정입니다.
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between p-3 bg-white rounded-lg">
                    <div>
                      <div className="font-medium text-gray-900">강의 결제</div>
                      <div className="text-sm text-gray-500">2025-11-20 09:00</div>
                    </div>
                    <div className="text-lg font-bold text-green-600">₩150,000</div>
                  </div>
                </div>
              </section>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-lg text-gray-600">학생 정보를 불러올 수 없습니다.</div>
            </div>
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
