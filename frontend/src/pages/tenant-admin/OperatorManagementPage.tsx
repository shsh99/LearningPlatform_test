import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTenant } from '../../contexts/TenantContext';
import { Navbar } from '../../components/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { createOperator, getOperators } from '../../api/user';
import type { UserResponse } from '../../types/user';

export function OperatorManagementPage() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const { branding } = useTenant();

    const [operators, setOperators] = useState<UserResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [creating, setCreating] = useState(false);

    // 권한 체크
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (user?.role !== 'TENANT_ADMIN') {
            alert('접근 권한이 없습니다.');
            navigate('/');
        }
    }, [isAuthenticated, user, navigate]);

    // 오퍼레이터 목록 조회
    useEffect(() => {
        const fetchOperators = async () => {
            try {
                const data = await getOperators();
                setOperators(data);
            } catch (err) {
                console.error('Failed to fetch operators:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user?.role === 'TENANT_ADMIN') {
            fetchOperators();
        }
    }, [user]);

    const handleCreateOperator = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setCreating(true);

        try {
            const newOperator = await createOperator(formData);
            setOperators([...operators, newOperator]);
            setSuccess('오퍼레이터가 성공적으로 생성되었습니다.');
            setFormData({ email: '', password: '', name: '' });
            setShowCreateForm(false);
        } catch (err: unknown) {
            const error = err as { response?: { data?: { message?: string } } };
            setError(error.response?.data?.message || '오퍼레이터 생성에 실패했습니다.');
        } finally {
            setCreating(false);
        }
    };

    if (!isAuthenticated || user?.role !== 'TENANT_ADMIN') {
        return null;
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="mb-6">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            뒤로 가기
                        </button>
                    </div>

                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-900">오퍼레이터 관리</h1>
                        <Button
                            onClick={() => setShowCreateForm(!showCreateForm)}
                            style={{ backgroundColor: branding.buttonPrimaryBgColor }}
                        >
                            {showCreateForm ? '취소' : '+ 오퍼레이터 추가'}
                        </Button>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-700">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-4 p-4 rounded-lg bg-green-100 text-green-700">
                            {success}
                        </div>
                    )}

                    {/* 오퍼레이터 생성 폼 */}
                    {showCreateForm && (
                        <Card variant="elevated" className="mb-6">
                            <CardHeader>
                                <CardTitle>새 오퍼레이터 생성</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleCreateOperator} className="space-y-4">
                                    <Input
                                        label="이메일"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        placeholder="operator@example.com"
                                    />
                                    <Input
                                        label="비밀번호"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        required
                                        placeholder="8-20자"
                                        helperText="8-20자 사이로 입력하세요"
                                    />
                                    <Input
                                        label="이름"
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="홍길동"
                                        helperText="2-20자 사이로 입력하세요"
                                    />
                                    <div className="flex gap-3">
                                        <Button type="submit" disabled={creating}>
                                            {creating ? '생성 중...' : '오퍼레이터 생성'}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => setShowCreateForm(false)}
                                        >
                                            취소
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    )}

                    {/* 오퍼레이터 목록 */}
                    <Card variant="elevated">
                        <CardHeader>
                            <CardTitle>오퍼레이터 목록</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="text-center py-8 text-gray-500">
                                    로딩 중...
                                </div>
                            ) : operators.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    등록된 오퍼레이터가 없습니다.
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left py-3 px-4 font-medium text-gray-600">이름</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-600">이메일</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-600">상태</th>
                                                <th className="text-left py-3 px-4 font-medium text-gray-600">생성일</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {operators.map((operator) => (
                                                <tr key={operator.id} className="border-b hover:bg-gray-50">
                                                    <td className="py-3 px-4">{operator.name}</td>
                                                    <td className="py-3 px-4 text-gray-600">{operator.email}</td>
                                                    <td className="py-3 px-4">
                                                        <span
                                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                                operator.status === 'ACTIVE'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : 'bg-gray-100 text-gray-700'
                                                            }`}
                                                        >
                                                            {operator.status === 'ACTIVE' ? '활성' : '비활성'}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 px-4 text-gray-600">
                                                        {new Date(operator.createdAt).toLocaleDateString('ko-KR')}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* 안내 메시지 */}
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                        <h3 className="font-medium text-blue-900 mb-2">오퍼레이터 역할 안내</h3>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• 강의 개설 및 차수 관리</li>
                            <li>• 수강생 등록 및 관리</li>
                            <li>• 강사 배정</li>
                            <li>• 대시보드 조회</li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    );
}

export default OperatorManagementPage;
