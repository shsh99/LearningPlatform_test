import { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { getAllCourseTerms, createCourseTerm, updateCourseTerm, startCourseTerm, completeCourseTerm, cancelCourseTerm, getCourseTermDetail } from '../../api/courseTerm';
import { getAllCourses } from '../../api/course';
import type { CourseTerm, CreateCourseTermRequest, UpdateCourseTermRequest, DayOfWeek, EnrollmentType } from '../../types/courseTerm';
import type { Course } from '../../types/course';
import type { CourseTermDetail } from '../../types/courseTermDetail';

const DAY_OF_WEEK_OPTIONS: { value: DayOfWeek; label: string }[] = [
  { value: 'MONDAY', label: '월' },
  { value: 'TUESDAY', label: '화' },
  { value: 'WEDNESDAY', label: '수' },
  { value: 'THURSDAY', label: '목' },
  { value: 'FRIDAY', label: '금' },
  { value: 'SATURDAY', label: '토' },
  { value: 'SUNDAY', label: '일' },
];

const ENROLLMENT_TYPE_OPTIONS: { value: EnrollmentType; label: string }[] = [
  { value: 'FIRST_COME', label: '선착순' },
  { value: 'SELECTION', label: '선발' },
];

export const CourseTermManagementPage = () => {
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
    enrollmentStartDate: '',
    enrollmentEndDate: '',
    enrollmentStartTime: '',
    enrollmentEndTime: '',
    enrollmentType: 'FIRST_COME',
    minStudents: 0,
  });
  const [editFormData, setEditFormData] = useState<UpdateCourseTermRequest>({
    startDate: '',
    endDate: '',
    daysOfWeek: ['MONDAY'],
    startTime: '09:00',
    endTime: '18:00',
    maxStudents: 30,
    enrollmentStartDate: '',
    enrollmentEndDate: '',
    enrollmentStartTime: '',
    enrollmentEndTime: '',
    enrollmentType: 'FIRST_COME',
    minStudents: 0,
  });

  // 상세보기 모달 관련 state
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [termDetail, setTermDetail] = useState<CourseTermDetail | null>(null);

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
      enrollmentStartDate: '',
      enrollmentEndDate: '',
      enrollmentStartTime: '',
      enrollmentEndTime: '',
      enrollmentType: 'FIRST_COME',
      minStudents: 0,
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
      enrollmentStartDate: term.enrollmentStartDate || '',
      enrollmentEndDate: term.enrollmentEndDate || '',
      enrollmentStartTime: term.enrollmentStartTime || '',
      enrollmentEndTime: term.enrollmentEndTime || '',
      enrollmentType: term.enrollmentType || 'FIRST_COME',
      minStudents: term.minStudents || 0,
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

  const formatDaysOfWeek = (days: DayOfWeek[] | string[]) => {
    const dayLabels: Record<string, string> = {
      MONDAY: '월',
      TUESDAY: '화',
      WEDNESDAY: '수',
      THURSDAY: '목',
      FRIDAY: '금',
      SATURDAY: '토',
      SUNDAY: '일',
    };
    const sortOrder = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
    const sorted = [...days].sort((a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b));
    return sorted.map((d) => dayLabels[d]).join(', ');
  };

  const formatDateTime = (dateTimeStr: string) => {
    return new Date(dateTimeStr).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getEnrollmentStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; bgColor: string; textColor: string }> = {
      ENROLLED: { label: '수강중', bgColor: 'bg-blue-100', textColor: 'text-blue-800' },
      COMPLETED: { label: '수료', bgColor: 'bg-emerald-100', textColor: 'text-emerald-800' },
      CANCELLED: { label: '취소', bgColor: 'bg-red-100', textColor: 'text-red-800' },
    };
    const config = statusConfig[status] || statusConfig.ENROLLED;
    return (
      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.bgColor} ${config.textColor}`}>
        {config.label}
      </span>
    );
  };

  const getEnrollmentTypeLabel = (type: string | null) => {
    if (!type) return '-';
    return type === 'FIRST_COME' ? '선착순' : '선발';
  };

  // 상세보기 모달 열기
  const handleOpenDetailModal = async (termId: number) => {
    try {
      setDetailLoading(true);
      setShowDetailModal(true);
      const data = await getCourseTermDetail(termId);
      setTermDetail(data);
    } catch (err) {
      console.error('Failed to fetch term detail:', err);
      alert('상세 정보를 불러오는데 실패했습니다.');
      setShowDetailModal(false);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setTermDetail(null);
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
                          onClick={() => handleOpenDetailModal(term.id)}
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
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">차수 생성</h2>

            <form onSubmit={handleCreateTerm}>
              <div className="space-y-6">
                {/* 기본 정보 섹션 */}
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
                </div>

                {/* 모집 설정 섹션 */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span>모집 설정</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          모집 시작일
                        </label>
                        <Input
                          type="date"
                          value={formData.enrollmentStartDate || ''}
                          onChange={(e) => setFormData({ ...formData, enrollmentStartDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          모집 시작 시간
                        </label>
                        <Input
                          type="time"
                          value={formData.enrollmentStartTime || ''}
                          onChange={(e) => setFormData({ ...formData, enrollmentStartTime: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          모집 종료일
                        </label>
                        <Input
                          type="date"
                          value={formData.enrollmentEndDate || ''}
                          onChange={(e) => setFormData({ ...formData, enrollmentEndDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          모집 마감 시간
                        </label>
                        <Input
                          type="time"
                          value={formData.enrollmentEndTime || ''}
                          onChange={(e) => setFormData({ ...formData, enrollmentEndTime: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        모집 방식
                      </label>
                      <div className="flex gap-4">
                        {ENROLLMENT_TYPE_OPTIONS.map((option) => (
                          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="enrollmentType"
                              value={option.value}
                              checked={formData.enrollmentType === option.value}
                              onChange={(e) => setFormData({ ...formData, enrollmentType: e.target.value as EnrollmentType })}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 운영 설정 섹션 */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span>운영 설정</span>
                  </h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          운영 시작일
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
                          운영 종료일
                        </label>
                        <Input
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                          required
                        />
                      </div>
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
                  </div>
                </div>

                {/* 정원 설정 섹션 */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <span>정원 설정</span>
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        최소 인원
                      </label>
                      <Input
                        type="number"
                        value={formData.minStudents || 0}
                        onChange={(e) => setFormData({ ...formData, minStudents: Number(e.target.value) })}
                        min={0}
                      />
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
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">차수 수정</h2>

            <form onSubmit={handleUpdateTerm}>
              <div className="space-y-6">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">강의: <span className="font-medium text-gray-900">{editingTerm.courseTitle}</span></p>
                  <p className="text-sm text-gray-600">차수: <span className="font-medium text-gray-900">{editingTerm.termNumber}차</span></p>
                </div>

                {/* 모집 설정 섹션 */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">모집 설정</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          모집 시작일
                        </label>
                        <Input
                          type="date"
                          value={editFormData.enrollmentStartDate || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, enrollmentStartDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          모집 시작 시간
                        </label>
                        <Input
                          type="time"
                          value={editFormData.enrollmentStartTime || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, enrollmentStartTime: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          모집 종료일
                        </label>
                        <Input
                          type="date"
                          value={editFormData.enrollmentEndDate || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, enrollmentEndDate: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          모집 마감 시간
                        </label>
                        <Input
                          type="time"
                          value={editFormData.enrollmentEndTime || ''}
                          onChange={(e) => setEditFormData({ ...editFormData, enrollmentEndTime: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        모집 방식
                      </label>
                      <div className="flex gap-4">
                        {ENROLLMENT_TYPE_OPTIONS.map((option) => (
                          <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="editEnrollmentType"
                              value={option.value}
                              checked={editFormData.enrollmentType === option.value}
                              onChange={(e) => setEditFormData({ ...editFormData, enrollmentType: e.target.value as EnrollmentType })}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="text-sm text-gray-700">{option.label}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 운영 설정 섹션 */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">운영 설정</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          운영 시작일
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
                          운영 종료일
                        </label>
                        <Input
                          type="date"
                          value={editFormData.endDate}
                          onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
                          required
                        />
                      </div>
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
                  </div>
                </div>

                {/* 정원 설정 섹션 */}
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3">정원 설정</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        최소 인원
                      </label>
                      <Input
                        type="number"
                        value={editFormData.minStudents || 0}
                        onChange={(e) => setEditFormData({ ...editFormData, minStudents: Number(e.target.value) })}
                        min={0}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        최대 정원
                      </label>
                      <Input
                        type="number"
                        value={editFormData.maxStudents}
                        onChange={(e) => setEditFormData({ ...editFormData, maxStudents: Number(e.target.value) })}
                        min={editingTerm.currentStudents}
                        required
                      />
                    </div>
                  </div>
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

      {/* 차수 상세보기 모달 */}
      {showDetailModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {detailLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : termDetail ? (
              <>
                {/* 헤더 */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {termDetail.courseTitle}
                      </h2>
                      <p className="text-blue-100 mt-1">{termDetail.termNumber}차</p>
                    </div>
                    {getStatusBadge(termDetail.status)}
                  </div>
                </div>

                {/* 본문 - 스크롤 가능 영역 */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* 기수 정보 카드 */}
                  <div className="bg-gray-50 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      운영 정보
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">운영 기간</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {termDetail.startDate} ~ {termDetail.endDate}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">수업 요일</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {formatDaysOfWeek(termDetail.daysOfWeek)}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">수업 시간</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {termDetail.startTime} ~ {termDetail.endTime}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">정원</p>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-gray-900">
                            {termDetail.currentStudents} / {termDetail.maxStudents}명
                          </p>
                          <span className="text-xs text-gray-500">
                            ({Math.round((termDetail.currentStudents / termDetail.maxStudents) * 100)}%)
                          </span>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full transition-all"
                            style={{ width: `${Math.min((termDetail.currentStudents / termDetail.maxStudents) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 모집 정보 카드 */}
                  <div className="bg-amber-50 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-amber-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      모집 정보
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">모집 시작</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {termDetail.enrollmentStartDate && termDetail.enrollmentStartTime
                            ? `${termDetail.enrollmentStartDate} ${termDetail.enrollmentStartTime}`
                            : termDetail.enrollmentStartDate || '-'}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">모집 종료</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {termDetail.enrollmentEndDate && termDetail.enrollmentEndTime
                            ? `${termDetail.enrollmentEndDate} ${termDetail.enrollmentEndTime}`
                            : termDetail.enrollmentEndDate || '-'}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">모집 방식</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {getEnrollmentTypeLabel(termDetail.enrollmentType)}
                        </p>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <p className="text-xs text-gray-500 mb-1">최소 인원</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {termDetail.minStudents != null ? `${termDetail.minStudents}명` : '-'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 담당 강사 카드 */}
                  <div className="bg-emerald-50 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      담당 강사
                    </h3>
                    {termDetail.instructor ? (
                      <div className="bg-white rounded-lg p-4 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-emerald-600 font-bold text-lg">
                            {termDetail.instructor.instructorName.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{termDetail.instructor.instructorName}</p>
                          <p className="text-sm text-gray-500">{termDetail.instructor.instructorEmail}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">배정일</p>
                          <p className="text-sm text-gray-700">{formatDateTime(termDetail.instructor.assignedAt)}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg p-4 shadow-sm text-center">
                        <p className="text-gray-400 italic">배정된 강사가 없습니다</p>
                      </div>
                    )}
                  </div>

                  {/* 수강생 목록 */}
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="bg-gray-50 px-5 py-4 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        수강생 목록
                        <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs font-medium">
                          {termDetail.enrolledStudents.length}명
                        </span>
                      </h3>
                    </div>
                    {termDetail.enrolledStudents.length > 0 ? (
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                                No
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                학생명
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                이메일
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                상태
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                등록일
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-100">
                            {termDetail.enrolledStudents.map((student, index) => (
                              <tr key={student.enrollmentId} className="hover:bg-gray-50 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                  {index + 1}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                                      <span className="text-white text-xs font-medium">
                                        {student.studentName.charAt(0)}
                                      </span>
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">{student.studentName}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                  {student.studentEmail}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  {getEnrollmentStatusBadge(student.status)}
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                  {formatDateTime(student.enrolledAt)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="py-12 text-center">
                        <svg className="mx-auto h-12 w-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <p className="mt-2 text-gray-400">등록된 수강생이 없습니다</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 푸터 */}
                <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
                  <Button
                    onClick={handleCloseDetailModal}
                    className="w-full !bg-gray-600 hover:!bg-gray-700"
                  >
                    닫기
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-20 text-center">
                <p className="text-red-500">데이터를 불러올 수 없습니다.</p>
                <Button onClick={handleCloseDetailModal} className="mt-4">
                  닫기
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
