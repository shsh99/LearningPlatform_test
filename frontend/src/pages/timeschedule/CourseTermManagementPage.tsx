import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/Navbar';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { getAllCourseTerms, createCourseTerm, updateCourseTerm, startCourseTerm, completeCourseTerm, cancelCourseTerm } from '../../api/courseTerm';
import { getAllCourses } from '../../api/course';
import type { CourseTerm, CreateCourseTermRequest, UpdateCourseTermRequest, DayOfWeek } from '../../types/courseTerm';
import type { Course } from '../../types/course';

const DAY_OF_WEEK_OPTIONS: { value: DayOfWeek; label: string }[] = [
  { value: 'MONDAY', label: '월' },
  { value: 'TUESDAY', label: '화' },
  { value: 'WEDNESDAY', label: '수' },
  { value: 'THURSDAY', label: '목' },
  { value: 'FRIDAY', label: '금' },
  { value: 'SATURDAY', label: '토' },
  { value: 'SUNDAY', label: '일' },
];

export const CourseTermManagementPage = () => {
  const navigate = useNavigate();
  const [terms, setTerms] = useState<CourseTerm[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTerm, setEditingTerm] = useState<CourseTerm | null>(null);
  const [formData, setFormData] = useState<CreateCourseTermRequest>({
    courseId: 0,
    termNumber: 1,
    startDate: '',
    endDate: '',
    daysOfWeek: ['MONDAY'],
    startTime: '09:00',
    endTime: '18:00',
    maxStudents: 30,
  });
  const [editFormData, setEditFormData] = useState<UpdateCourseTermRequest>({
    startDate: '',
    endDate: '',
    daysOfWeek: ['MONDAY'],
    startTime: '09:00',
    endTime: '18:00',
    maxStudents: 30,
  });

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
      daysOfWeek: ['MONDAY'],
      startTime: '09:00',
      endTime: '18:00',
      maxStudents: 30,
    });
    setShowCreateModal(true);
  };

  const handleDayToggle = (day: DayOfWeek) => {
    setFormData((prev) => {
      const newDays = prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day];
      return { ...prev, daysOfWeek: newDays.length > 0 ? newDays : [day] };
    });
  };

  const handleEditDayToggle = (day: DayOfWeek) => {
    setEditFormData((prev) => {
      const newDays = prev.daysOfWeek.includes(day)
        ? prev.daysOfWeek.filter((d) => d !== day)
        : [...prev.daysOfWeek, day];
      return { ...prev, daysOfWeek: newDays.length > 0 ? newDays : [day] };
    });
  };

  const handleCreateTerm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.courseId || !formData.startDate || !formData.endDate) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    try {
      await createCourseTerm(formData);
      alert('차수가 생성되었습니다.');
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

  const handleOpenEditModal = (term: CourseTerm) => {
    setEditingTerm(term);
    setEditFormData({
      startDate: term.startDate,
      endDate: term.endDate,
      daysOfWeek: term.daysOfWeek,
      startTime: term.startTime,
      endTime: term.endTime,
      maxStudents: term.maxStudents,
    });
    setShowEditModal(true);
  };

  const handleUpdateTerm = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingTerm) return;

    try {
      await updateCourseTerm(editingTerm.id, editFormData);
      alert('차수가 수정되었습니다.');
      setShowEditModal(false);
      setEditingTerm(null);
      loadTerms();
    } catch (err) {
      console.error('Failed to update term:', err);
      alert('차수 수정에 실패했습니다.');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, string> = {
      SCHEDULED: 'bg-blue-100 text-blue-800',
      ONGOING: 'bg-green-100 text-green-800',
      COMPLETED: 'bg-gray-100 text-gray-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };

    const statusLabels: Record<string, string> = {
      SCHEDULED: '예정',
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

  const formatDaysOfWeek = (days: DayOfWeek[]) => {
    const dayLabels: Record<DayOfWeek, string> = {
      MONDAY: '월',
      TUESDAY: '화',
      WEDNESDAY: '수',
      THURSDAY: '목',
      FRIDAY: '금',
      SATURDAY: '토',
      SUNDAY: '일',
    };
    const sortOrder: DayOfWeek[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const sorted = [...days].sort((a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b));
    return sorted.map((d) => dayLabels[d]).join(', ');
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
                      요일
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
                        {formatDaysOfWeek(term.daysOfWeek)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {term.currentStudents} / {term.maxStudents}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(term.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                        <Button
                          onClick={() => navigate(`/ts/terms/${term.id}`)}
                          className="!py-1 !px-3 !text-sm !bg-green-600 hover:!bg-green-700"
                        >
                          상세보기
                        </Button>
                        {term.status === 'SCHEDULED' && (
                          <>
                            <Button
                              onClick={() => handleOpenEditModal(term)}
                              className="!py-1 !px-3 !text-sm !bg-blue-600 hover:!bg-blue-700"
                            >
                              수정
                            </Button>
                            <Button
                              onClick={() => handleStartTerm(term.id)}
                              className="!py-1 !px-3 !text-sm"
                            >
                              시작
                            </Button>
                          </>
                        )}
                        {term.status === 'ONGOING' && (
                          <Button
                            onClick={() => handleCompleteTerm(term.id)}
                            className="!py-1 !px-3 !text-sm"
                          >
                            완료
                          </Button>
                        )}
                        {(term.status === 'SCHEDULED' || term.status === 'ONGOING') && (
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">차수 생성</h2>

            <form onSubmit={handleCreateTerm}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    강의 선택
                  </label>
                  <select
                    value={formData.courseId}
                    onChange={(e) => setFormData({ ...formData, courseId: Number(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value={0}>강의를 선택하세요</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    차수 번호
                  </label>
                  <Input
                    type="number"
                    value={formData.termNumber}
                    onChange={(e) => setFormData({ ...formData, termNumber: Number(e.target.value) })}
                    min={1}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    시작일
                  </label>
                  <Input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    종료일
                  </label>
                  <Input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    수업 요일 (복수 선택 가능)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DAY_OF_WEEK_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleDayToggle(option.value)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          formData.daysOfWeek.includes(option.value)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      시작 시간
                    </label>
                    <Input
                      type="time"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      종료 시간
                    </label>
                    <Input
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    최대 정원
                  </label>
                  <Input
                    type="number"
                    value={formData.maxStudents}
                    onChange={(e) => setFormData({ ...formData, maxStudents: Number(e.target.value) })}
                    min={1}
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button type="submit" className="flex-1">
                  생성
                </Button>
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
      )}

      {/* 차수 수정 모달 */}
      {showEditModal && editingTerm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">차수 수정</h2>

            <form onSubmit={handleUpdateTerm}>
              <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">강의: <span className="font-medium text-gray-900">{editingTerm.courseTitle}</span></p>
                  <p className="text-sm text-gray-600">차수: <span className="font-medium text-gray-900">{editingTerm.termNumber}차</span></p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    시작일
                  </label>
                  <Input
                    type="date"
                    value={editFormData.startDate}
                    onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    종료일
                  </label>
                  <Input
                    type="date"
                    value={editFormData.endDate}
                    onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    수업 요일 (복수 선택 가능)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DAY_OF_WEEK_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => handleEditDayToggle(option.value)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          editFormData.daysOfWeek.includes(option.value)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      시작 시간
                    </label>
                    <Input
                      type="time"
                      value={editFormData.startTime}
                      onChange={(e) => setEditFormData({ ...editFormData, startTime: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      종료 시간
                    </label>
                    <Input
                      type="time"
                      value={editFormData.endTime}
                      onChange={(e) => setEditFormData({ ...editFormData, endTime: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    최대 정원
                  </label>
                  <Input
                    type="number"
                    value={editFormData.maxStudents}
                    onChange={(e) => setEditFormData({ ...editFormData, maxStudents: Number(e.target.value) })}
                    min={1}
                    required
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <Button type="submit" className="flex-1">
                  수정
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingTerm(null);
                  }}
                  className="flex-1 !bg-gray-500 hover:!bg-gray-600"
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
