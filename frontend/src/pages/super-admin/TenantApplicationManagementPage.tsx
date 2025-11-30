import { useState, useEffect } from 'react';
import {
  getAllTenantApplications,
  approveTenantApplication,
  rejectTenantApplication,
} from '../../api/tenantApplication';
import { useTenant } from '../../contexts/TenantContext';
import { Navbar } from '../../components/Navbar';
import type { TenantApplicationResponse } from '../../types/tenantApplication';

export function TenantApplicationManagementPage() {
  const { branding } = useTenant();
  const [applications, setApplications] = useState<TenantApplicationResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');

  // 승인 모달 상태
  const [approveModal, setApproveModal] = useState<{
    open: boolean;
    application: TenantApplicationResponse | null;
    password: string;
  }>({
    open: false,
    application: null,
    password: '',
  });

  // 거절 모달 상태
  const [rejectModal, setRejectModal] = useState<{
    open: boolean;
    application: TenantApplicationResponse | null;
    reason: string;
  }>({
    open: false,
    application: null,
    reason: '',
  });

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const data = await getAllTenantApplications();
      setApplications(data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
      alert('신청 목록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleApprove = async () => {
    if (!approveModal.application) return;

    if (approveModal.password.length < 8 || approveModal.password.length > 20) {
      alert('비밀번호는 8~20자여야 합니다.');
      return;
    }

    try {
      await approveTenantApplication(approveModal.application.id, {
        initialPassword: approveModal.password,
      });
      alert(`${approveModal.application.companyName}의 신청이 승인되었습니다.`);
      setApproveModal({ open: false, application: null, password: '' });
      fetchApplications();
    } catch (error: any) {
      const message = error.response?.data?.message || '승인에 실패했습니다.';
      alert(message);
    }
  };

  const handleReject = async () => {
    if (!rejectModal.application) return;

    if (rejectModal.reason.length < 10) {
      alert('거절 사유는 10자 이상이어야 합니다.');
      return;
    }

    try {
      await rejectTenantApplication(rejectModal.application.id, {
        rejectionReason: rejectModal.reason,
      });
      alert(`${rejectModal.application.companyName}의 신청이 거절되었습니다.`);
      setRejectModal({ open: false, application: null, reason: '' });
      fetchApplications();
    } catch (error: any) {
      const message = error.response?.data?.message || '거절에 실패했습니다.';
      alert(message);
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filter === 'ALL') return true;
    return app.status === filter;
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      APPROVED: 'bg-green-100 text-green-800',
      REJECTED: 'bg-red-100 text-red-800',
    };
    const labels = {
      PENDING: '대기 중',
      APPROVED: '승인됨',
      REJECTED: '거절됨',
    };
    return (
      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: branding.primaryColor }}></div>
            <p className="text-gray-600">로딩 중...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold" style={{ color: branding.primaryColor }}>
              테넌트 신청 관리
            </h1>
            <p className="text-gray-600 mt-2">
              회사의 플랫폼 사용 신청을 검토하고 승인/거절합니다.
            </p>
          </div>

          {/* 필터 버튼 */}
          <div className="flex gap-2 mb-6">
            {(['ALL', 'PENDING', 'APPROVED', 'REJECTED'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === status
                    ? 'text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
                style={{
                  backgroundColor: filter === status ? branding.primaryColor : undefined,
                }}
              >
                {status === 'ALL' ? '전체' : status === 'PENDING' ? '대기 중' : status === 'APPROVED' ? '승인됨' : '거절됨'}
                <span className="ml-2 text-sm">
                  ({applications.filter(app => status === 'ALL' || app.status === status).length})
                </span>
              </button>
            ))}
          </div>

          {/* 신청 목록 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    회사명
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    회사 코드
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    담당자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    신청일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.map(app => (
                  <tr key={app.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{app.companyName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-800">
                        {app.companyCode}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{app.adminName}</div>
                      <div className="text-xs text-gray-500">{app.adminEmail}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(app.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(app.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {app.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => setApproveModal({ open: true, application: app, password: '' })}
                            className="text-green-600 hover:text-green-900"
                          >
                            승인
                          </button>
                          <button
                            onClick={() => setRejectModal({ open: true, application: app, reason: '' })}
                            className="text-red-600 hover:text-red-900"
                          >
                            거절
                          </button>
                        </>
                      )}
                      {app.status === 'REJECTED' && app.rejectionReason && (
                        <button
                          onClick={() => alert(`거절 사유:\n${app.rejectionReason}`)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          사유 보기
                        </button>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredApplications.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      신청 내역이 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 승인 모달 */}
      {approveModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">신청 승인</h3>
            <p className="text-gray-600 mb-4">
              <strong>{approveModal.application?.companyName}</strong>의 신청을 승인하시겠습니까?
            </p>
            <p className="text-sm text-gray-500 mb-4">
              승인 시 테넌트와 테넌트 어드민 계정이 자동으로 생성됩니다.
            </p>
            <div className="mb-4">
              <label htmlFor="initialPassword" className="block text-sm font-medium text-gray-700 mb-2">
                테넌트 어드민 초기 비밀번호 <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                id="initialPassword"
                value={approveModal.password}
                onChange={(e) => setApproveModal({ ...approveModal, password: e.target.value })}
                minLength={8}
                maxLength={20}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="8~20자"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleApprove}
                className="flex-1 bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700"
              >
                승인
              </button>
              <button
                onClick={() => setApproveModal({ open: false, application: null, password: '' })}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 거절 모달 */}
      {rejectModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">신청 거절</h3>
            <p className="text-gray-600 mb-4">
              <strong>{rejectModal.application?.companyName}</strong>의 신청을 거절하시겠습니까?
            </p>
            <div className="mb-4">
              <label htmlFor="rejectionReason" className="block text-sm font-medium text-gray-700 mb-2">
                거절 사유 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="rejectionReason"
                value={rejectModal.reason}
                onChange={(e) => setRejectModal({ ...rejectModal, reason: e.target.value })}
                minLength={10}
                maxLength={500}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 resize-none"
                placeholder="거절 사유를 입력해주세요 (10자 이상)"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleReject}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700"
              >
                거절
              </button>
              <button
                onClick={() => setRejectModal({ open: false, application: null, reason: '' })}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
