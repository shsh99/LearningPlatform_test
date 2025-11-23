import { useEffect, useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { PageHeader } from '../../components/PageHeader';
import { getAllCourseTerms, createCourseTerm, startCourseTerm, completeCourseTerm, cancelCourseTerm } from '../../api/courseTerm';
import { getAllCourses } from '../../api/course';
import type { CourseTerm, CreateCourseTermRequest } from '../../types/courseTerm';
import type { Course } from '../../types/course';

export function OperatorTermsPage() {
    const [terms, setTerms] = useState<CourseTerm[]>([]);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState<CreateCourseTermRequest>({
        courseId: 0,
        termNumber: 1,
        startDate: '',
        endDate: '',
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

    const getStatusBadge = (status: string) => {
        const styles = {
            PLANNED: 'bg-gray-100 text-gray-800',
            IN_PROGRESS: 'bg-blue-100 text-blue-800',
            COMPLETED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
        };
        const labels = {
            PLANNED: '계획됨',
            IN_PROGRESS: '진행중',
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
                                                {term.currentStudents} / {term.maxStudents}
                                            </td>
                                            <td className="px-6 py-4">{getStatusBadge(term.status)}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <div className="flex gap-2">
                                                    {term.status === 'PLANNED' && (
                                                        <button
                                                            onClick={() => handleStatusChange(term.id, 'start')}
                                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                                        >
                                                            시작
                                                        </button>
                                                    )}
                                                    {term.status === 'IN_PROGRESS' && (
                                                        <button
                                                            onClick={() => handleStatusChange(term.id, 'complete')}
                                                            className="text-green-600 hover:text-green-800 font-medium"
                                                        >
                                                            완료
                                                        </button>
                                                    )}
                                                    {(term.status === 'PLANNED' || term.status === 'IN_PROGRESS') && (
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
            </div>
        </>
    );
}
