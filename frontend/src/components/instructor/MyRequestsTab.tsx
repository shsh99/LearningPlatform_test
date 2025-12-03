import { useState } from 'react';
import {
  useMyChangeRequests,
  useMyDeleteRequests,
  useCancelChangeRequest,
  useCancelDeleteRequest,
} from '../../hooks/useCourseTermRequests';
import type { ChangeRequestResponse, DeleteRequestResponse, TermRequestStatus } from '../../types/courseTermRequest';

type RequestFilter = 'all' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

const STATUS_LABELS: Record<TermRequestStatus, { label: string; className: string }> = {
  PENDING: { label: '대기중', className: 'bg-yellow-100 text-yellow-800' },
  APPROVED: { label: '승인됨', className: 'bg-green-100 text-green-800' },
  REJECTED: { label: '반려됨', className: 'bg-red-100 text-red-800' },
  CANCELLED: { label: '취소됨', className: 'bg-gray-100 text-gray-800' },
};

const DAY_OF_WEEK_LABELS: Record<string, string> = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
};

export const MyRequestsTab = () => {
  const [filter, setFilter] = useState<RequestFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: changeRequests, isLoading: changeLoading } = useMyChangeRequests();
  const { data: deleteRequests, isLoading: deleteLoading } = useMyDeleteRequests();

  const cancelChangeMutation = useCancelChangeRequest();
  const cancelDeleteMutation = useCancelDeleteRequest();

  const isLoading = changeLoading || deleteLoading;

  // 모든 요청을 통합하고 정렬
  const allRequests: Array<
    | { type: 'change'; data: ChangeRequestResponse }
    | { type: 'delete'; data: DeleteRequestResponse }
  > = [
    ...(changeRequests?.map((r) => ({ type: 'change' as const, data: r })) || []),
    ...(deleteRequests?.map((r) => ({ type: 'delete' as const, data: r })) || []),
  ].sort((a, b) => new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime());

  // 필터링
  const filteredRequests = filter === 'all'
    ? allRequests
    : allRequests.filter((r) => r.data.status === filter);

  const handleCancelRequest = async (type: 'change' | 'delete', id: number) => {
    if (!confirm('요청을 취소하시겠습니까?')) return;

    if (type === 'change') {
      await cancelChangeMutation.mutateAsync(id);
    } else {
      await cancelDeleteMutation.mutateAsync(id);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* 필터 버튼 */}
      <div className="flex gap-2 flex-wrap">
        {[
          { value: 'all', label: '전체' },
          { value: 'PENDING', label: '대기중' },
          { value: 'APPROVED', label: '승인됨' },
          { value: 'REJECTED', label: '반려됨' },
          { value: 'CANCELLED', label: '취소됨' },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => setFilter(option.value as RequestFilter)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {/* 요청 목록 */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-5xl mb-4">📋</div>
          <p className="text-gray-600">요청 내역이 없습니다.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((request) => {
            const uniqueId = `${request.type}-${request.data.id}`;
            const isExpanded = expandedId === uniqueId;
            const statusInfo = STATUS_LABELS[request.data.status];
            const isChangeRequest = request.type === 'change';
            const changeData = isChangeRequest ? (request.data as ChangeRequestResponse) : null;

            return (
              <div
                key={uniqueId}
                className="bg-white border border-gray-200 rounded-lg overflow-hidden"
              >
                {/* 요청 헤더 */}
                <div
                  onClick={() => toggleExpand(uniqueId)}
                  className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded ${
                        isChangeRequest
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {isChangeRequest ? '변경' : '삭제'}
                    </span>
                    <div>
                      <div className="font-medium text-gray-900">
                        {request.data.courseName} - {request.data.termNumber}차수
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(request.data.createdAt).toLocaleDateString('ko-KR')}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusInfo.className}`}
                    >
                      {statusInfo.label}
                    </span>
                    <svg
                      className={`w-5 h-5 text-gray-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* 확장된 상세 정보 */}
                {isExpanded && (
                  <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
                    {isChangeRequest && changeData && (
                      <div className="space-y-3">
                        {/* 변경 전후 비교 */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium text-gray-500 mb-2">변경 전</div>
                            <div className="text-sm space-y-1">
                              <p>기간: {changeData.beforeStartDate} ~ {changeData.beforeEndDate}</p>
                              <p>
                                요일: {changeData.beforeDaysOfWeek.map(d => DAY_OF_WEEK_LABELS[d]).join(', ')}
                              </p>
                              <p>시간: {changeData.beforeStartTime} ~ {changeData.beforeEndTime}</p>
                              <p>정원: {changeData.beforeMaxStudents}명</p>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500 mb-2">변경 후</div>
                            <div className="text-sm space-y-1">
                              <p>기간: {changeData.afterStartDate} ~ {changeData.afterEndDate}</p>
                              <p>
                                요일: {changeData.afterDaysOfWeek.map(d => DAY_OF_WEEK_LABELS[d]).join(', ')}
                              </p>
                              <p>시간: {changeData.afterStartTime} ~ {changeData.afterEndTime}</p>
                              <p>정원: {changeData.afterMaxStudents}명</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 사유 */}
                    {request.data.reason && (
                      <div className="mt-3">
                        <div className="text-sm font-medium text-gray-500 mb-1">요청 사유</div>
                        <p className="text-sm text-gray-700">{request.data.reason}</p>
                      </div>
                    )}

                    {/* 반려 사유 */}
                    {request.data.status === 'REJECTED' && request.data.rejectionReason && (
                      <div className="mt-3 p-3 bg-red-50 rounded-md">
                        <div className="text-sm font-medium text-red-700 mb-1">반려 사유</div>
                        <p className="text-sm text-red-600">{request.data.rejectionReason}</p>
                      </div>
                    )}

                    {/* 처리자 정보 */}
                    {request.data.processedByName && (
                      <div className="mt-3 text-sm text-gray-500">
                        처리자: {request.data.processedByName} ({request.data.processedAt && new Date(request.data.processedAt).toLocaleDateString('ko-KR')})
                      </div>
                    )}

                    {/* 취소 버튼 (대기중일 때만) */}
                    {request.data.status === 'PENDING' && (
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCancelRequest(request.type, request.data.id);
                          }}
                          disabled={cancelChangeMutation.isPending || cancelDeleteMutation.isPending}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                        >
                          요청 취소
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
