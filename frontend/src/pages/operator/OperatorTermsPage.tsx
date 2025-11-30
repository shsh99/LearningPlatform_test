import { useEffect, useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { PageHeader } from '../../components/PageHeader';
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

export function OperatorTermsPage() {
    const [terms, setTerms] = useState<CourseTerm[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);
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
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [termsData, coursesData] = await Promise.all([
                getAllCourseTerms(),
                getAllCourses(),
            ]);
            setTerms(termsData);
            // 승인된 강의만 필터링 (APPROVED 상태만)
            setCourses(coursesData.filter(course => course.status === 'APPROVED'));
            setError(null);
        } catch (err) {
            console.error('Failed to load data:', err);
            setError('데이터를 불러오는데 실패했습니다.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.courseId === 0) {
            alert('강의를 선택해주세요.');
            return;
        }

        try {
            await createCourseTerm(formData);
            alert('차수가 생성되었습니다.');
            setShowCreateForm(false);
            setFormData({
                courseId: 0,
                termNumber: 1,
                startDate: '',
                endDate: '',
                daysOfWeek: ['MONDAY'],
                startTime: '09:00',
                endTime: '18:00',
                maxStudents: 30,
            });
            loadData();
        } catch (err) {
            console.error('Failed to create term:', err);
            alert('차수 생성에 실패했습니다.');
        }
    };

    const handleStatusChange = async (id: number, action: 'start' | 'complete' | 'cancel') => {
        if (!confirm(`정말 ${action === 'start' ? '시작' : action === 'complete' ? '완료' : '취소'}하시겠습니까?`)) {
            return;
        }

        try {
            if (action === 'start') await startCourseTerm(id);
            else if (action === 'complete') await completeCourseTerm(id);
            else await cancelCourseTerm(id);

            alert('상태가 변경되었습니다.');
            loadData();
        } catch (err) {
            console.error('Failed to change status:', err);
            alert('상태 변경에 실패했습니다.');
        }
    };

    const handleOpenEditForm = (term: CourseTerm) => {
        setEditingTerm(term);
        setEditFormData({
            startDate: term.startDate,
            endDate: term.endDate,
            daysOfWeek: term.daysOfWeek,
            startTime: term.startTime,
            endTime: term.endTime,
            maxStudents: term.maxStudents,
        });
        setShowEditForm(true);
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

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!editingTerm) return;

        try {
            await updateCourseTerm(editingTerm.id, editFormData);
            alert('차수가 수정되었습니다.');
            setShowEditForm(false);
            setEditingTerm(null);
            loadData();
        } catch (err) {
            console.error('Failed to update term:', err);
            alert('차수 수정에 실패했습니다.');
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            SCHEDULED: 'bg-gray-100 text-gray-800',
            ONGOING: 'bg-blue-100 text-blue-800',
            COMPLETED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
        };
        const labels = {
            SCHEDULED: '예정',
            ONGOING: '진행중',
            COMPLETED: '완료',
            CANCELLED: '취소됨',
        };
        return (
            <span className={`px-2 py-1 text-xs font-semibold rounded ${styles[status as keyof typeof styles]}`}>
                {labels[status as keyof typeof labels]}
            </span>
        );
    };

    if (isLoading) {
        return (
            <>
                <Navbar />
                <PageHeader title="차수 관리" description="강의 차수를 생성하고 관리합니다." />
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-gray-600">로딩중...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <PageHeader title="차수 관리" description="강의 차수를 생성하고 관리합니다." />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">차수 목록</h2>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        {showCreateForm ? '취소' : '새 차수 생성'}
                    </button>
                </div>

                {showCreateForm && (
                    <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">차수 생성</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    강의 선택 *
                                </label>
                                <select
                                    value={formData.courseId}
                                    onChange={(e) => setFormData({ ...formData, courseId: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value={0}>강의를 선택하세요</option>
                                    {courses.filter(c => c.status === 'APPROVED').map(course => (
                                        <option key={course.id} value={course.id}>
                                            {course.title}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    차수 번호 *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={formData.termNumber}
                                    onChange={(e) => setFormData({ ...formData, termNumber: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        시작일 *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        종료일 *
                                    </label>
                                    <input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    수업 요일 * (복수 선택 가능)
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        시작 시간 *
                                    </label>
                                    <input
                                        type="time"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        종료 시간 *
                                    </label>
                                    <input
                                        type="time"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    최대 학생 수 *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="1000"
                                    value={formData.maxStudents}
                                    onChange={(e) => setFormData({ ...formData, maxStudents: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateForm(false)}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    생성
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    {terms.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            등록된 차수가 없습니다.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">강의명</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">차수</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">기간</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">요일</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">인원</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {terms.map((term) => (
                                        <tr key={term.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">{term.id}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{term.courseTitle}</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">{term.termNumber}차</td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {term.startDate} ~ {term.endDate}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {formatDaysOfWeek(term.daysOfWeek)}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {term.currentStudents} / {term.maxStudents}
                                            </td>
                                            <td className="px-6 py-4">{getStatusBadge(term.status)}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex gap-2">
                                                    {term.status === 'SCHEDULED' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleOpenEditForm(term)}
                                                                className="text-purple-600 hover:text-purple-800 font-medium"
                                                            >
                                                                수정
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusChange(term.id, 'start')}
                                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                                            >
                                                                시작
                                                            </button>
                                                        </>
                                                    )}
                                                    {term.status === 'ONGOING' && (
                                                        <button
                                                            onClick={() => handleStatusChange(term.id, 'complete')}
                                                            className="text-green-600 hover:text-green-800 font-medium"
                                                        >
                                                            완료
                                                        </button>
                                                    )}
                                                    {(term.status === 'SCHEDULED' || term.status === 'ONGOING') && (
                                                        <button
                                                            onClick={() => handleStatusChange(term.id, 'cancel')}
                                                            className="text-red-600 hover:text-red-800 font-medium"
                                                        >
                                                            취소
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* 차수 수정 폼 */}
                {showEditForm && editingTerm && (
                    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-6 mb-6">
                        <h3 className="text-lg font-semibold mb-4">차수 수정</h3>
                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                            <p className="text-sm text-gray-600">강의: <span className="font-medium text-gray-900">{editingTerm.courseTitle}</span></p>
                            <p className="text-sm text-gray-600">차수: <span className="font-medium text-gray-900">{editingTerm.termNumber}차</span></p>
                        </div>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        시작일 *
                                    </label>
                                    <input
                                        type="date"
                                        value={editFormData.startDate}
                                        onChange={(e) => setEditFormData({ ...editFormData, startDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        종료일 *
                                    </label>
                                    <input
                                        type="date"
                                        value={editFormData.endDate}
                                        onChange={(e) => setEditFormData({ ...editFormData, endDate: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    수업 요일 * (복수 선택 가능)
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
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        시작 시간 *
                                    </label>
                                    <input
                                        type="time"
                                        value={editFormData.startTime}
                                        onChange={(e) => setEditFormData({ ...editFormData, startTime: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        종료 시간 *
                                    </label>
                                    <input
                                        type="time"
                                        value={editFormData.endTime}
                                        onChange={(e) => setEditFormData({ ...editFormData, endTime: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    최대 학생 수 *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    max="1000"
                                    value={editFormData.maxStudents}
                                    onChange={(e) => setEditFormData({ ...editFormData, maxStudents: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowEditForm(false);
                                        setEditingTerm(null);
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                                >
                                    수정
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </>
    );
}
