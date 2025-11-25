import { useEffect, useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { PageHeader } from '../../components/PageHeader';
import {
    getAllInstructorAssignments,
    assignInstructor,
    cancelInstructorAssignment
} from '../../api/instructorAssignment';
import { getAllCourseTerms } from '../../api/courseTerm';
import { getAllUsers } from '../../api/user';
import { getAllCourseApplications } from '../../api/courseApplication';
import type { InstructorAssignment, AssignInstructorRequest } from '../../types/instructorAssignment';
import type { CourseTerm } from '../../types/courseTerm';
import type { User } from '../../api/user';
import type { CourseApplication } from '../../types/courseApplication';

export function OperatorAssignmentsPage() {
    const [assignments, setAssignments] = useState<InstructorAssignment[]>([]);
    const [terms, setTerms] = useState<CourseTerm[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [courseApplications, setCourseApplications] = useState<CourseApplication[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const [formData, setFormData] = useState<AssignInstructorRequest>({
        termId: 0,
        instructorId: 0,
        assignedById: currentUser.id || 0,
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setIsLoading(true);
            const [assignmentsData, termsData, usersData, applicationsData] = await Promise.all([
                getAllInstructorAssignments(),
                getAllCourseTerms(),
                getAllUsers(),
                getAllCourseApplications(),
            ]);
            setAssignments(assignmentsData);
            setTerms(termsData.filter(t => t.status !== 'CANCELLED' && t.status !== 'COMPLETED'));
            setUsers(usersData);
            setCourseApplications(applicationsData.filter(app => app.status === 'APPROVED'));
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

        if (formData.termId === 0) {
            alert('차수를 선택해주세요.');
            return;
        }

        if (formData.instructorId === 0) {
            alert('강사를 선택해주세요.');
            return;
        }

        try {
            await assignInstructor(formData);
            alert('강사가 배정되었습니다.');
            setShowCreateForm(false);
            setFormData({
                termId: 0,
                instructorId: 0,
                assignedById: currentUser.id || 0,
            });
            loadData();
        } catch (err) {
            console.error('Failed to assign instructor:', err);
            alert('강사 배정에 실패했습니다.');
        }
    };

    const handleCancel = async (id: number) => {
        if (!confirm('정말 배정을 취소하시겠습니까?')) {
            return;
        }

        try {
            await cancelInstructorAssignment(id);
            alert('배정이 취소되었습니다.');
            loadData();
        } catch (err) {
            console.error('Failed to cancel assignment:', err);
            alert('배정 취소에 실패했습니다.');
        }
    };

    const getStatusBadge = (status: string) => {
        const styles = {
            ASSIGNED: 'bg-green-100 text-green-800',
            CANCELLED: 'bg-red-100 text-red-800',
        };
        const labels = {
            ASSIGNED: '배정됨',
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
                <PageHeader title="강사 배정 관리" description="차수에 강사를 배정하고 관리합니다." />
                <div className="flex justify-center items-center min-h-[400px]">
                    <div className="text-gray-600">로딩중...</div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navbar />
            <PageHeader title="강사 배정 관리" description="차수에 강사를 배정하고 관리합니다." />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {error && (
                    <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        {error}
                    </div>
                )}

                <div className="mb-6 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">강사 배정 목록</h2>
                    <button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        {showCreateForm ? '취소' : '새 강사 배정'}
                    </button>
                </div>

                {showCreateForm && (
                    <div className="mb-6 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">강사 배정</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    차수 선택 *
                                </label>
                                <select
                                    value={formData.termId}
                                    onChange={(e) => setFormData({ ...formData, termId: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value={0}>차수를 선택하세요</option>
                                    {terms.map(term => (
                                        <option key={term.id} value={term.id}>
                                            {term.courseTitle} - {term.termNumber}차 ({term.startDate} ~ {term.endDate})
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    강사 선택 *
                                </label>
                                <select
                                    value={formData.instructorId}
                                    onChange={(e) => setFormData({ ...formData, instructorId: Number(e.target.value) })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value={0}>강사를 선택하세요</option>
                                    {users.map(user => {
                                        // 선택된 차수의 강의 제목 찾기
                                        const selectedTerm = terms.find(t => t.id === formData.termId);
                                        // 해당 강의의 신청자(개설자) 찾기
                                        const courseApplication = courseApplications.find(
                                            app => app.title === selectedTerm?.courseTitle
                                        );
                                        const isInstructor = courseApplication && user.id === courseApplication.applicantId;

                                        return (
                                            <option key={user.id} value={user.id}>
                                                {isInstructor ? '⭐ ' : ''}{user.name} ({user.email}) - {user.role}
                                            </option>
                                        );
                                    })}
                                </select>
                                {formData.termId !== 0 && (
                                    <p className="mt-1 text-xs text-gray-500">
                                        ⭐ 표시는 해당 강의를 개설 신청한 사용자입니다.
                                    </p>
                                )}
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
                                    배정
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
                    {assignments.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            등록된 강사 배정이 없습니다.
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-200">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">강의명</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">차수</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">강사</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">배정자</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">배정일</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">작업</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {assignments.map((assignment) => (
                                        <tr key={assignment.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">{assignment.id}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                                {assignment.courseTitle}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {assignment.termNumber}차
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {assignment.instructorName}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {assignment.assignedByName}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-900">
                                                {new Date(assignment.createdAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4">{getStatusBadge(assignment.status)}</td>
                                            <td className="px-6 py-4 text-sm">
                                                {assignment.status === 'ASSIGNED' && (
                                                    <button
                                                        onClick={() => handleCancel(assignment.id)}
                                                        className="text-red-600 hover:text-red-800 font-medium"
                                                    >
                                                        취소
                                                    </button>
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
        </>
    );
}
