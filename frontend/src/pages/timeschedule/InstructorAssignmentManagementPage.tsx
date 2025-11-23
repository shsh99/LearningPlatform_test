import { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { Button } from '../../components/Button';
import { getAllInstructorAssignments, assignInstructor, cancelInstructorAssignment } from '../../api/instructorAssignment';
import { getAllCourseTerms } from '../../api/courseTerm';
import { useAuth } from '../../contexts/AuthContext';
import type { InstructorAssignment, AssignInstructorRequest } from '../../types/instructorAssignment';
import type { CourseTerm } from '../../types/courseTerm';

export const InstructorAssignmentManagementPage = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<InstructorAssignment[]>([]);
  const [terms, setTerms] = useState<CourseTerm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [formData, setFormData] = useState<AssignInstructorRequest>({
    termId: 0,
    instructorId: 0,
    assignedById: user?.id || 0,
  });

  useEffect(() => {
    loadAssignments();
    loadTerms();
  }, []);

  const loadAssignments = async () => {
    try {
      setIsLoading(true);
      const data = await getAllInstructorAssignments();
      setAssignments(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load instructor assignments:', err);
      setError('강사 배정 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadTerms = async () => {
    try {
      const data = await getAllCourseTerms();
      setTerms(data.filter(term => term.status === 'PLANNED' || term.status === 'ONGOING'));
    } catch (err) {
      console.error('Failed to load terms:', err);
    }
  };

  const handleOpenAssignModal = () => {
    setFormData({
      termId: terms.length > 0 ? terms[0].id : 0,
      instructorId: 0,
      assignedById: user?.id || 0,
    });
    setShowAssignModal(true);
  };

  const handleAssignInstructor = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.termId || !formData.instructorId) {
      alert('차수와 강사를 선택해주세요.');
      return;
    }

    try {
      await assignInstructor(formData);
      alert('강사가 배정되었습니다.');
      setShowAssignModal(false);
      loadAssignments();
    } catch (err) {
      console.error('Failed to assign instructor:', err);
      alert('강사 배정에 실패했습니다.');
    }
  };

  const handleCancelAssignment = async (id: number) => {
    if (!confirm('강사 배정을 취소하시겠습니까?')) return;
    
    try {
      await cancelInstructorAssignment(id);
      alert('강사 배정이 취소되었습니다.');
      loadAssignments();
    } catch (err) {
      console.error('Failed to cancel assignment:', err);
      alert('강사 배정 취소에 실패했습니다.');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      ASSIGNED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    
    const statusLabels: Record<string, string> = {
      ASSIGNED: '배정됨',
      CANCELLED: '취소됨',
    };

    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[status]}`}>
        {statusLabels[status]}
      </span>
    );
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg text-gray-600">로딩 중...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">강사 배정 관리</h1>
              <p className="text-gray-600">차수별 강사 배정 현황을 확인하고 관리할 수 있습니다.</p>
            </div>
            <Button onClick={handleOpenAssignModal}>
              강사 배정
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {assignments.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">등록된 강사 배정이 없습니다.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      강의명
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      차수
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      강사
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      배정자
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      관리
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {assignments.map((assignment) => (
                    <tr key={assignment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assignment.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {assignment.courseTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assignment.termNumber}차
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assignment.instructorName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {assignment.assignedByName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(assignment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {assignment.status === 'ASSIGNED' && (
                          <Button
                            onClick={() => handleCancelAssignment(assignment.id)}
                            className="!py-1 !px-3 !text-sm !bg-red-600 hover:!bg-red-700"
                          >
                            배정 취소
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 강사 배정 모달 */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">강사 배정</h2>

            <form onSubmit={handleAssignInstructor}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    차수 선택
                  </label>
                  <select
                    value={formData.termId}
                    onChange={(e) => setFormData({ ...formData, termId: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value={0}>차수를 선택하세요</option>
                    {terms.map((term) => (
                      <option key={term.id} value={term.id}>
                        {term.courseTitle} - {term.termNumber}차 ({term.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    강사 ID
                  </label>
                  <input
                    type="number"
                    value={formData.instructorId || ''}
                    onChange={(e) => setFormData({ ...formData, instructorId: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="강사 ID를 입력하세요"
                    required
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    * 강사 목록 조회 기능이 구현되면 선택 방식으로 변경됩니다
                  </p>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button type="submit" className="flex-1">
                  배정
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="flex-1 bg-gray-500! hover:bg-gray-600!"
                >
                  취소
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
