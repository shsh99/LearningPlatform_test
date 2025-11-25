import { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { getAllCourseTerms, createCourseTerm, startCourseTerm, completeCourseTerm, cancelCourseTerm } from '../../api/courseTerm';
import { getAllCourses } from '../../api/course';
import type { CourseTerm, CreateCourseTermRequest, WeeklyScheduleInfo } from '../../types/courseTerm';
import type { Course } from '../../types/course';

const DAY_OPTIONS = [
  { value: 'MONDAY', label: '월요일' },
  { value: 'TUESDAY', label: '화요일' },
  { value: 'WEDNESDAY', label: '수요일' },
  { value: 'THURSDAY', label: '목요일' },
  { value: 'FRIDAY', label: '금요일' },
  { value: 'SATURDAY', label: '토요일' },
  { value: 'SUNDAY', label: '일요일' },
];

export const CourseTermManagementPage = () => {
  const [terms, setTerms] = useState<CourseTerm[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<CreateCourseTermRequest>({
    courseId: 0,
    termNumber: 1,
    startDate: '',
    endDate: '',
    maxStudents: 30,
    weeklySchedules: [],
  });
  const [weeklySchedules, setWeeklySchedules] = useState<WeeklyScheduleInfo[]>([]);

  useEffect(() => {
    loadTerms();
    loadCourses();
  }, []);

  const loadTerms = async () => {
    try {
      setIsLoading(true);
      const data = await getAllCourseTerms();
      setTerms(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load course terms:', err);
      setError('차수 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCourses = async () => {
    try {
      const data = await getAllCourses();
      setCourses(data);
    } catch (err) {
      console.error('Failed to load courses:', err);
    }
  };

  const handleOpenCreateModal = () => {
    setFormData({
      courseId: courses.length > 0 ? courses[0].id : 0,
      termNumber: 1,
      startDate: '',
      endDate: '',
      maxStudents: 30,
      weeklySchedules: [],
    });
    setWeeklySchedules([]);
    setShowCreateModal(true);
  };

  const addWeeklySchedule = () => {
    setWeeklySchedules([
      ...weeklySchedules,
      { dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '12:00' },
    ]);
  };

  const removeWeeklySchedule = (index: number) => {
    setWeeklySchedules(weeklySchedules.filter((_, i) => i !== index));
  };

  const updateWeeklySchedule = (index: number, field: keyof WeeklyScheduleInfo, value: string) => {
    const updated = [...weeklySchedules];
    updated[index] = { ...updated[index], [field]: value };
    setWeeklySchedules(updated);
  };

  const handleCreateTerm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.courseId || !formData.startDate || !formData.endDate) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (weeklySchedules.length === 0) {
      alert('수업 시간을 최소 1개 이상 추가해주세요.');
      return;
    }

    try {
      const requestData = {
        ...formData,
        weeklySchedules: weeklySchedules,
      };
      await createCourseTerm(requestData);
      alert('차수가 생성되었습니다. 일정이 자동으로 생성됩니다.');
      setShowCreateModal(false);
      loadTerms();
    } catch (err) {
      console.error('Failed to create term:', err);
      alert('차수 생성에 실패했습니다.');
    }
  };

  const handleStartTerm = async (id: number) => {
    if (!confirm('차수를 시작하시겠습니까?')) return;
    
    try {
      await startCourseTerm(id);
      alert('차수가 시작되었습니다.');
      loadTerms();
    } catch (err) {
      console.error('Failed to start term:', err);
      alert('차수 시작에 실패했습니다.');
    }
  };

  const handleCompleteTerm = async (id: number) => {
    if (!confirm('차수를 완료하시겠습니까?')) return;
    
    try {
      await completeCourseTerm(id);
      alert('차수가 완료되었습니다.');
      loadTerms();
    } catch (err) {
      console.error('Failed to complete term:', err);
      alert('차수 완료에 실패했습니다.');
    }
  };

  const handleCancelTerm = async (id: number) => {
    if (!confirm('차수를 취소하시겠습니까?')) return;
    
    try {
      await cancelCourseTerm(id);
      alert('차수가 취소되었습니다.');
      loadTerms();
    } catch (err) {
      console.error('Failed to cancel term:', err);
      alert('차수 취소에 실패했습니다.');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      SCHEDULED: 'bg-blue-100 text-blue-800',
      PLANNED: 'bg-blue-100 text-blue-800',
      ONGOING: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    
    const statusLabels: Record<string, string> = {
      SCHEDULED: '예정',
      PLANNED: '예정',
      ONGOING: '진행중',
      COMPLETED: '완료',
      CANCELLED: '취소',
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">차수 관리</h1>
              <p className="text-gray-600">강의 차수를 관리하고 상태를 변경할 수 있습니다.</p>
            </div>
            <Button onClick={handleOpenCreateModal}>
              차수 생성
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {terms.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">등록된 차수가 없습니다.</p>
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
                      기간
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      정원
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
                  {terms.map((term) => (
                    <tr key={term.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {term.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {term.courseTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {term.termNumber}차
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {term.startDate} ~ {term.endDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {term.currentStudents} / {term.maxStudents}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(term.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        {(term.status === 'SCHEDULED' || term.status === 'PLANNED') && (
                          <Button
                            onClick={() => handleStartTerm(term.id)}
                            className="!py-1 !px-3 !text-sm"
                          >
                            시작
                          </Button>
                        )}
                        {term.status === 'ONGOING' && (
                          <Button
                            onClick={() => handleCompleteTerm(term.id)}
                            className="!py-1 !px-3 !text-sm"
                          >
                            완료
                          </Button>
                        )}
                        {(term.status === 'SCHEDULED' || term.status === 'PLANNED' || term.status === 'ONGOING') && (
                          <Button
                            onClick={() => handleCancelTerm(term.id)}
                            className="!py-1 !px-3 !text-sm !bg-red-600 hover:!bg-red-700"
                          >
                            취소
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

      {/* 차수 생성 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-auto">
          <div className="min-h-screen px-4 py-8 flex items-start justify-center">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">차수 생성</h2>

              <form onSubmit={handleCreateTerm}>
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">강의 선택 *</label>
                      <select
                        value={formData.courseId}
                        onChange={(e) => setFormData({ ...formData, courseId: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        required
                      >
                        <option value={0}>강의를 선택하세요</option>
                        {courses.map((course) => (
                          <option key={course.id} value={course.id}>{course.title}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">차수 번호 *</label>
                      <Input
                        type="number"
                        value={formData.termNumber}
                        onChange={(e) => setFormData({ ...formData, termNumber: Number(e.target.value) })}
                        min={1}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">시작일 *</label>
                      <Input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">종료일 *</label>
                      <Input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">최대 정원 *</label>
                      <Input
                        type="number"
                        value={formData.maxStudents}
                        onChange={(e) => setFormData({ ...formData, maxStudents: Number(e.target.value) })}
                        min={1}
                        required
                      />
                    </div>
                  </div>

                  {/* 주간 스케줄 설정 - 파란색 강조 박스 */}
                  <div className="border-2 border-blue-400 bg-blue-50 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <span className="text-base font-bold text-blue-800">수업 시간 설정 (필수)</span>
                        <p className="text-xs text-blue-600 mt-1">요일과 시간을 추가하면 차수 기간 동안 매주 일정이 자동 생성됩니다</p>
                      </div>
                      <button
                        type="button"
                        onClick={addWeeklySchedule}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm"
                      >
                        + 수업 시간 추가
                      </button>
                    </div>

                    {weeklySchedules.length === 0 ? (
                      <div className="text-center py-4 bg-white rounded-lg border-2 border-dashed border-blue-300">
                        <p className="text-blue-700 font-medium">수업 시간이 설정되지 않았습니다</p>
                        <p className="text-sm text-blue-500">위의 "수업 시간 추가" 버튼을 클릭하세요</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {weeklySchedules.map((schedule, index) => (
                          <div key={index} className="flex items-center gap-2 p-2 bg-white rounded-lg border">
                            <select
                              value={schedule.dayOfWeek}
                              onChange={(e) => updateWeeklySchedule(index, 'dayOfWeek', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            >
                              {DAY_OPTIONS.map((day) => (
                                <option key={day.value} value={day.value}>{day.label}</option>
                              ))}
                            </select>
                            <input
                              type="time"
                              value={schedule.startTime}
                              onChange={(e) => updateWeeklySchedule(index, 'startTime', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <span className="text-gray-500">~</span>
                            <input
                              type="time"
                              value={schedule.endTime}
                              onChange={(e) => updateWeeklySchedule(index, 'endTime', e.target.value)}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => removeWeeklySchedule(index)}
                              className="p-1 text-red-600 hover:bg-red-100 rounded"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex space-x-3 mt-4">
                  <Button type="submit" className="flex-1">생성</Button>
                  <Button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 !bg-gray-500 hover:!bg-gray-600"
                  >
                    취소
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
