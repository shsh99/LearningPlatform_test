import { useState, useEffect } from 'react';
import { getAllCourseApplications, getCourseApplicationsByStatus, approveCourseApplication, rejectCourseApplication } from '../../api/courseApplication';
import { useTermRequests, useApproveChangeRequest, useRejectChangeRequest, useApproveDeleteRequest, useRejectDeleteRequest } from '../../hooks/useCourseTermRequests';
import type { CourseApplication, ApplicationStatus } from '../../types/courseApplication';
import type { TermRequestListResponse, TermRequestStatus, TermRequestType } from '../../types/courseTermRequest';
import { ChangeRequestDetailModal } from './ChangeRequestDetailModal';
import { DeleteRequestDetailModal } from './DeleteRequestDetailModal';

type RequestTypeFilter = 'ALL' | 'CREATE' | 'CHANGE' | 'DELETE';
type StatusFilter = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

interface UnifiedRequest {
  id: number;
  type: 'CREATE' | 'CHANGE' | 'DELETE';
  title: string;
  termNumber?: number;
  requesterName: string;
  requesterEmail?: string;
  status: string;
  reason?: string;
  createdAt: string;
  originalData: CourseApplication | TermRequestListResponse;
}

export const RequestManagementTab = () => {
  const [typeFilter, setTypeFilter] = useState<RequestTypeFilter>('ALL');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  // 개설 요청 state
  const [createApplications, setCreateApplications] = useState<CourseApplication[]>([]);
  const [loadingCreate, setLoadingCreate] = useState(false);
  const [rejectingCreateId, setRejectingCreateId] = useState<number | null>(null);
  const [createRejectionReason, setCreateRejectionReason] = useState('');

  // 변경/삭제 요청 (React Query)
  const termRequestStatus: TermRequestStatus | undefined = statusFilter === 'ALL' ? undefined : statusFilter as TermRequestStatus;
  const termRequestType: TermRequestType | undefined =
    typeFilter === 'CHANGE' ? 'CHANGE' :
    typeFilter === 'DELETE' ? 'DELETE' :
    undefined;

  const { data: termRequests, isLoading: loadingTermRequests, refetch: refetchTermRequests } = useTermRequests(
    termRequestStatus || 'PENDING',
    termRequestType
  );

  // 상세 모달 state
  const [selectedChangeRequestId, setSelectedChangeRequestId] = useState<number | null>(null);
  const [selectedDeleteRequestId, setSelectedDeleteRequestId] = useState<number | null>(null);

  // Mutations
  const approveChangeMutation = useApproveChangeRequest();
  const rejectChangeMutation = useRejectChangeRequest();
  const approveDeleteMutation = useApproveDeleteRequest();
  const rejectDeleteMutation = useRejectDeleteRequest();

  // 개설 요청 로드
  useEffect(() => {
    const fetchCreateApplications = async () => {
      try {
        setLoadingCreate(true);
        const applicationStatus = statusFilter === 'ALL' ? undefined : statusFilter as ApplicationStatus;
        const data = applicationStatus
          ? await getCourseApplicationsByStatus(applicationStatus)
          : await getAllCourseApplications();
        setCreateApplications(data);
      } catch (err) {
        console.error('Error fetching applications:', err);
      } finally {
        setLoadingCreate(false);
      }
    };

    if (typeFilter === 'ALL' || typeFilter === 'CREATE') {
      fetchCreateApplications();
    }
  }, [statusFilter, typeFilter]);

  // 통합 요청 목록 생성
  const unifiedRequests: UnifiedRequest[] = [];

  // 개설 요청 추가
  if (typeFilter === 'ALL' || typeFilter === 'CREATE') {
    createApplications.forEach(app => {
      if (statusFilter === 'ALL' || app.status === statusFilter) {
        unifiedRequests.push({
          id: app.id,
          type: 'CREATE',
          title: app.title,
          requesterName: app.applicantName,
          requesterEmail: app.applicantEmail,
          status: app.status,
          reason: app.description,
          createdAt: app.createdAt,
          originalData: app,
        });
      }
    });
  }

  // 변경/삭제 요청 추가
  if (termRequests && (typeFilter === 'ALL' || typeFilter === 'CHANGE' || typeFilter === 'DELETE')) {
    termRequests.forEach(req => {
      if (typeFilter === 'ALL' ||
          (typeFilter === 'CHANGE' && req.type === 'CHANGE') ||
          (typeFilter === 'DELETE' && req.type === 'DELETE')) {
        unifiedRequests.push({
          id: req.id,
          type: req.type,
          title: req.courseName,
          termNumber: req.termNumber,
          requesterName: req.requesterName,
          status: req.status,
          reason: req.reason,
          createdAt: req.createdAt,
          originalData: req,
        });
      }
    });
  }

  // 날짜순 정렬
  unifiedRequests.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const isLoading = loadingCreate || loadingTermRequests;

  // 개설 요청 승인
  const handleApproveCreate = async (id: number) => {
    try {
      await approveCourseApplication(id);
      alert('강의 개설 신청이 승인되었습니다.');
      fetchCreateApplications();
    } catch (err) {
      alert('승인에 실패했습니다.');
      console.error(err);
    }
  };

  // 개설 요청 반려
  const handleRejectCreate = async (id: number) => {
    if (!createRejectionReason.trim()) {
      alert('반려 사유를 입력해주세요.');
      return;
    }
    try {
      await rejectCourseApplication(id, { reason: createRejectionReason });
      alert('강의 개설 신청이 반려되었습니다.');
      setRejectingCreateId(null);
      setCreateRejectionReason('');
      fetchCreateApplications();
    } catch (err) {
      alert('반려에 실패했습니다.');
      console.error(err);
    }
  };

  // 변경 요청 행 클릭
  const handleChangeRequestClick = (id: number) => {
    setSelectedChangeRequestId(id);
  };

  // 삭제 요청 행 클릭
  const handleDeleteRequestClick = (id: number) => {
    setSelectedDeleteRequestId(id);
  };

  // 변경 요청 승인
  const handleApproveChange = async (id: number) => {
    try {
      await approveChangeMutation.mutateAsync(id);
      alert('변경 요청이 승인되었습니다.');
      setSelectedChangeRequestId(null);
      refetchTermRequests();
    } catch (err) {
      alert('승인에 실패했습니다.');
      console.error(err);
    }
  };

  // 변경 요청 반려
  const handleRejectChange = async (id: number, reason: string) => {
    try {
      await rejectChangeMutation.mutateAsync({ id, data: { rejectionReason: reason } });
      alert('변경 요청이 반려되었습니다.');
      setSelectedChangeRequestId(null);
      refetchTermRequests();
    } catch (err) {
      alert('반려에 실패했습니다.');
      console.error(err);
    }
  };

  // 삭제 요청 승인
  const handleApproveDelete = async (id: number) => {
    try {
      await approveDeleteMutation.mutateAsync(id);
      alert('삭제 요청이 승인되었습니다.');
      setSelectedDeleteRequestId(null);
      refetchTermRequests();
    } catch (err) {
      alert('승인에 실패했습니다.');
      console.error(err);
    }
  };

  // 삭제 요청 반려
  const handleRejectDelete = async (id: number, reason: string) => {
    try {
      await rejectDeleteMutation.mutateAsync({ id, data: { rejectionReason: reason } });
      alert('삭제 요청이 반려되었습니다.');
      setSelectedDeleteRequestId(null);
      refetchTermRequests();
    } catch (err) {
      alert('반려에 실패했습니다.');
      console.error(err);
    }
  };

  const getTypeBadge = (type: 'CREATE' | 'CHANGE' | 'DELETE') => {
    const config = {
      CREATE: { label: '개설', className: 'bg-blue-100 text-blue-800' },
      CHANGE: { label: '변경', className: 'bg-amber-100 text-amber-800' },
      DELETE: { label: '삭제', className: 'bg-red-100 text-red-800' },
    };
    const { label, className } = config[type];
    return <span className={`px-2 py-1 text-xs font-medium rounded ${className}`}>{label}</span>;
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      PENDING: { label: '대기중', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      APPROVED: { label: '승인됨', className: 'bg-green-100 text-green-800 border-green-200' },
      REJECTED: { label: '반려됨', className: 'bg-red-100 text-red-800 border-red-200' },
      CANCELLED: { label: '취소됨', className: 'bg-gray-100 text-gray-800 border-gray-200' },
    };
    const { label, className } = config[status] || config.PENDING;
    return <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${className}`}>{label}</span>;
  };

  // 통계 계산
  const stats = {
    total: unifiedRequests.length,
    pending: unifiedRequests.filter(r => r.status === 'PENDING').length,
    approved: unifiedRequests.filter(r => r.status === 'APPROVED').length,
    rejected: unifiedRequests.filter(r => r.status === 'REJECTED').length,
  };

  return (
    <>
      {/* 통계 카드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">전체 요청</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">대기중</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{stats.pending}</p>
            </div>
            <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">승인됨</p>
              <p className="text-2xl font-bold text-green-600 mt-1">{stats.approved}</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">반려됨</p>
              <p className="text-2xl font-bold text-red-600 mt-1">{stats.rejected}</p>
            </div>
            <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 필터 */}
      <div className="flex flex-wrap gap-4 mb-6">
        {/* 유형 필터 */}
        <div className="flex gap-2">
          <span className="text-sm font-medium text-gray-500 self-center mr-2">유형:</span>
          {[
            { value: 'ALL', label: '전체' },
            { value: 'CREATE', label: '개설' },
            { value: 'CHANGE', label: '변경' },
            { value: 'DELETE', label: '삭제' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setTypeFilter(option.value as RequestTypeFilter)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                typeFilter === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* 상태 필터 */}
        <div className="flex gap-2">
          <span className="text-sm font-medium text-gray-500 self-center mr-2">상태:</span>
          {[
            { value: 'ALL', label: '전체' },
            { value: 'PENDING', label: '대기중' },
            { value: 'APPROVED', label: '승인됨' },
            { value: 'REJECTED', label: '반려됨' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value as StatusFilter)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                statusFilter === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* 요청 목록 */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
          <p className="mt-4 text-gray-600">로딩 중...</p>
        </div>
      ) : unifiedRequests.length === 0 ? (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-4 text-gray-500 font-medium">표시할 요청이 없습니다</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">유형</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">강의명</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">차수</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">요청자</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">요청일</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">상태</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">액션</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {unifiedRequests.map((request) => (
                <tr
                  key={`${request.type}-${request.id}`}
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    if (request.type === 'CHANGE') handleChangeRequestClick(request.id);
                    else if (request.type === 'DELETE') handleDeleteRequestClick(request.id);
                  }}
                >
                  <td className="px-6 py-4 whitespace-nowrap">{getTypeBadge(request.type)}</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{request.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {request.termNumber ? `${request.termNumber}차` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{request.requesterName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                    {new Date(request.createdAt).toLocaleDateString('ko-KR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(request.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {request.status === 'PENDING' && request.type === 'CREATE' && (
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleApproveCreate(request.id)}
                          className="px-3 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700"
                        >
                          승인
                        </button>
                        <button
                          onClick={() => setRejectingCreateId(request.id)}
                          className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-700"
                        >
                          반려
                        </button>
                      </div>
                    )}
                    {request.status === 'PENDING' && (request.type === 'CHANGE' || request.type === 'DELETE') && (
                      <span className="text-xs text-gray-500">클릭하여 상세보기</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 개설 요청 반려 모달 */}
      {rejectingCreateId && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="fixed inset-0 bg-black bg-opacity-25" onClick={() => setRejectingCreateId(null)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">개설 요청 반려</h3>
              <textarea
                value={createRejectionReason}
                onChange={(e) => setCreateRejectionReason(e.target.value)}
                placeholder="반려 사유를 입력해주세요..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
              />
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => {
                    setRejectingCreateId(null);
                    setCreateRejectionReason('');
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={() => handleRejectCreate(rejectingCreateId)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  반려
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 변경 요청 상세 모달 */}
      {selectedChangeRequestId && (
        <ChangeRequestDetailModal
          id={selectedChangeRequestId}
          onClose={() => setSelectedChangeRequestId(null)}
          onApprove={handleApproveChange}
          onReject={handleRejectChange}
        />
      )}

      {/* 삭제 요청 상세 모달 */}
      {selectedDeleteRequestId && (
        <DeleteRequestDetailModal
          id={selectedDeleteRequestId}
          onClose={() => setSelectedDeleteRequestId(null)}
          onApprove={handleApproveDelete}
          onReject={handleRejectDelete}
        />
      )}
    </>
  );
};
