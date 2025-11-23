import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getEnrollmentsByStudent,
  cancelEnrollment,
  completeEnrollment,
} from '../../api/enrollment';
import type { Enrollment, EnrollmentStatus } from '../../types/enrollment';
import { EnrollmentCard } from '../../components/enrollment/EnrollmentCard';
import { Button } from '../../components/Button';
import { useAuth } from '../../contexts/AuthContext';
import { Navbar } from '../../components/Navbar';
import { PageHeader } from '../../components/PageHeader';

export const MyEnrollmentsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | 'ALL'>(
    'ALL'
  );

  useEffect(() => {
    if (user) {
      fetchEnrollments();
    }
  }, [user]);

  const fetchEnrollments = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getEnrollmentsByStudent(user.id);
      setEnrollments(data);
    } catch (err) {
      setError('수강 신청 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching enrollments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (enrollmentId: number) => {
    if (!confirm('수강 신청을 취소하시겠습니까?')) return;

    try {
      setActionLoading(enrollmentId);
      setError(null);
      await cancelEnrollment(enrollmentId);
      alert('수강 신청이 취소되었습니다.');
      await fetchEnrollments();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || '수강 취소에 실패했습니다.';
      setError(errorMessage);
      console.error('Error canceling enrollment:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleComplete = async (enrollmentId: number) => {
    if (!confirm('수강을 완료 처리하시겠습니까?')) return;

    try {
      setActionLoading(enrollmentId);
      setError(null);
      await completeEnrollment(enrollmentId);
      alert('수강이 완료되었습니다.');
      await fetchEnrollments();
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || '수강 완료 처리에 실패했습니다.';
      setError(errorMessage);
      console.error('Error completing enrollment:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredEnrollments =
    statusFilter === 'ALL'
      ? enrollments
      : enrollments.filter((e) => e.status === statusFilter);

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-4">로그인이 필요합니다.</p>
            <Button onClick={() => navigate('/login')}>로그인</Button>
          </div>
        </div>
      </>
    );
  }

  if (loading) {
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
      <PageHeader
        title="내 수강 신청"
        description="수강 중인 강의를 관리하세요."
        backTo="/"
      />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">

        {/* 필터 */}
        <div className="mb-6 flex gap-2">
          <Button
            onClick={() => setStatusFilter('ALL')}
            variant={statusFilter === 'ALL' ? 'primary' : 'secondary'}
          >
            전체
          </Button>
          <Button
            onClick={() => setStatusFilter('ENROLLED')}
            variant={statusFilter === 'ENROLLED' ? 'primary' : 'secondary'}
          >
            수강중
          </Button>
          <Button
            onClick={() => setStatusFilter('COMPLETED')}
            variant={statusFilter === 'COMPLETED' ? 'primary' : 'secondary'}
          >
            완료
          </Button>
          <Button
            onClick={() => setStatusFilter('CANCELLED')}
            variant={statusFilter === 'CANCELLED' ? 'primary' : 'secondary'}
          >
            취소됨
          </Button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* 수강 신청 목록 */}
        {filteredEnrollments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              {statusFilter === 'ALL'
                ? '수강 신청한 강의가 없습니다.'
                : `${statusFilter} 상태의 강의가 없습니다.`}
            </p>
            <Button onClick={() => navigate('/courses')}>강의 둘러보기</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEnrollments.map((enrollment) => (
              <EnrollmentCard
                key={enrollment.id}
                enrollment={enrollment}
                onCancel={handleCancel}
                onComplete={handleComplete}
                loading={actionLoading === enrollment.id}
              />
            ))}
          </div>
        )}

        {/* 수강 신청 개수 */}
        {filteredEnrollments.length > 0 && (
          <div className="mt-6 text-center text-gray-600">
            총 {filteredEnrollments.length}개의 수강 신청
          </div>
        )}
      </div>
    </div>
    </>
  );
};
