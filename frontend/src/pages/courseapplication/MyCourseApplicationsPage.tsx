import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyCourseApplications, cancelCourseApplication } from '../../api/courseApplication';
import type { CourseApplication, ApplicationStatus } from '../../types/courseApplication';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { Navbar } from '../../components/Navbar';
import { PageHeader } from '../../components/PageHeader';

export const MyCourseApplicationsPage = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<CourseApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMyCourseApplications();
      setApplications(data);
    } catch (err) {
      setError('신청 목록을 불러오는데 실패했습니다.');
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: number) => {
    if (!confirm('정말 신청을 취소하시겠습니까?')) {
      return;
    }

    try {
      await cancelCourseApplication(id);
      alert('신청이 취소되었습니다.');
      fetchApplications();
    } catch (err) {
      alert('취소에 실패했습니다.');
      console.error('Error canceling application:', err);
    }
  };

  const getStatusBadge = (status: ApplicationStatus) => {
    const badges = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    const labels = {
      PENDING: '대기 중',
      APPROVED: '승인됨',
      REJECTED: '거부됨',
    };
    return (
      <span className={`px-2 py-1 rounded text-sm font-medium ${badges[status]}`}>
        {labels[status]}
      </span>
    );
  };

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
        title="내 강의 개설 신청"
        description="신청한 강의 목록과 상태를 확인하세요."
        backTo="/"
      />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* 새 강의 신청 버튼 */}
          <div className="mb-6 flex justify-end">
            <Button onClick={() => navigate('/apply-course')}>
              새 강의 신청
            </Button>
          </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* 신청 목록 */}
        {applications.length === 0 ? (
          <Card className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              아직 신청한 강의가 없습니다.
            </p>
            <Button onClick={() => navigate('/apply-course')}>
              강의 개설 신청하기
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {applications.map((application) => (
              <Card key={application.id} className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {application.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      신청일: {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {getStatusBadge(application.status)}
                </div>

                <p className="text-gray-700 mb-4 whitespace-pre-wrap">
                  {application.description}
                </p>

                {application.status === 'REJECTED' && application.rejectionReason && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                    <p className="text-sm font-medium text-red-800">거부 사유:</p>
                    <p className="text-sm text-red-700">{application.rejectionReason}</p>
                  </div>
                )}

                {application.status === 'APPROVED' && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm font-medium text-green-800">
                      축하합니다! 강의 개설이 승인되었습니다.
                    </p>
                  </div>
                )}

                {application.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleCancel(application.id)}
                      variant="secondary"
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      신청 취소
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* 통계 */}
        {applications.length > 0 && (
          <div className="mt-6 text-center text-gray-600">
            총 {applications.length}개의 신청
          </div>
        )}
      </div>
    </div>
    </>
  );
};
