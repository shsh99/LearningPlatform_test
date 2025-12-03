import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  useMyChangeRequests,
  useMyDeleteRequests,
  useCancelChangeRequest,
  useCancelDeleteRequest,
} from '../../hooks/useCourseTermRequests';
import { getMyCourseApplications, cancelCourseApplication } from '../../api/courseApplication';
import type { ChangeRequestResponse, DeleteRequestResponse } from '../../types/courseTermRequest';
import type { CourseApplication } from '../../types/courseApplication';

type RequestFilter = 'all' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
type RequestTypeFilter = 'all' | 'CREATE' | 'CHANGE' | 'DELETE';

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
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
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<RequestFilter>('all');
  const [typeFilter, setTypeFilter] = useState<RequestTypeFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 강의 개설 요청 조회
  const { data: createRequests, isLoading: createLoading } = useQuery({
    queryKey: ['myCourseApplications'],
    queryFn: getMyCourseApplications,
  });

  // 변경/삭제 요청 조회
  const { data: changeRequests, isLoading: changeLoading } = useMyChangeRequests();
  const { data: deleteRequests, isLoading: deleteLoading } = useMyDeleteRequests();

  // 취소 mutations
  const cancelCreateMutation = useMutation({
    mutationFn: cancelCourseApplication,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myCourseApplications'] });
    },
  });
  const cancelChangeMutation = useCancelChangeRequest();
  const cancelDeleteMutation = useCancelDeleteRequest();

  const isLoading = createLoading || changeLoading || deleteLoading;

  // 모든 요청을 통합
  type UnifiedRequest =
    | { type: 'CREATE'; data: CourseApplication }
    | { type: 'CHANGE'; data: ChangeRequestResponse }
    | { type: 'DELETE'; data: DeleteRequestResponse };

  const allRequests: UnifiedRequest[] = [
    ...(createRequests?.map((r) => ({ type: 'CREATE' as const, data: r })) || []),
    ...(changeRequests?.map((r) => ({ type: 'CHANGE' as const, data: r })) || []),
    ...(deleteRequests?.map((r) => ({ type: 'DELETE' as const, data: r })) || []),
  ].sort((a, b) => new Date(b.data.createdAt).getTime() - new Date(a.data.createdAt).getTime());

  // 필터링
  const filteredRequests = allRequests.filter((r) => {
    // 유형 필터
    if (typeFilter !== 'all' && r.type !== typeFilter) return false;
    // 상태 필터
    if (statusFilter !== 'all' && r.data.status !== statusFilter) return false;
    return true;
  });

  const handleCancelRequest = async (type: 'CREATE' | 'CHANGE' | 'DELETE', id: number) => {
    if (!confirm('요청을 취소하시겠습니까?')) return;

    if (type === 'CREATE') {
      await cancelCreateMutation.mutateAsync(id);
    } else if (type === 'CHANGE') {
      await cancelChangeMutation.mutateAsync(id);
    } else {
      await cancelDeleteMutation.mutateAsync(id);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
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
      <div className="flex flex-wrap gap-4">
        {/* 유형 필터 */}
        <div className="flex gap-2">
          <span className="text-sm font-medium text-gray-500 self-center mr-1">유형:</span>
          {[
            { value: 'all', label: '전체' },
            { value: 'CREATE', label: '개설' },
            { value: 'CHANGE', label: '변경' },
            { value: 'DELETE', label: '삭제' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setTypeFilter(option.value as RequestTypeFilter)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                typeFilter === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* 상태 필터 */}
        <div className="flex gap-2">
          <span className="text-sm font-medium text-gray-500 self-center mr-1">상태:</span>
          {[
            { value: 'all', label: '전체' },
            { value: 'PENDING', label: '대기중' },
            { value: 'APPROVED', label: '승인됨' },
            { value: 'REJECTED', label: '반려됨' },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value as RequestFilter)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                statusFilter === option.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
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
            const statusInfo = STATUS_LABELS[request.data.status] || STATUS_LABELS.PENDING;

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
                    {getTypeBadge(request.type)}
                    <div>
                      <div className="font-medium text-gray-900">
                        {request.type === 'CREATE'
                          ? (request.data as CourseApplication).title
                          : `${(request.data as ChangeRequestResponse | DeleteRequestResponse).courseName} - ${(request.data as ChangeRequestResponse | DeleteRequestResponse).termNumber}차수`
                        }
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
                    {/* 개설 요청 상세 */}
                    {request.type === 'CREATE' && (
                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium text-gray-500 mb-1">설명</div>
                          <p className="text-sm text-gray-700">
                            {(request.data as CourseApplication).description || '설명 없음'}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 변경 요청 상세 */}
                    {request.type === 'CHANGE' && (
                      <div className="space-y-3">
                        {/* 변경 전후 비교 */}
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium text-gray-500 mb-2">변경 전</div>
                            <div className="text-sm space-y-1">
                              <p>기간: {(request.data as ChangeRequestResponse).beforeStartDate} ~ {(request.data as ChangeRequestResponse).beforeEndDate}</p>
                              <p>
                                요일: {(request.data as ChangeRequestResponse).beforeDaysOfWeek.map(d => DAY_OF_WEEK_LABELS[d]).join(', ')}
                              </p>
                              <p>시간: {(request.data as ChangeRequestResponse).beforeStartTime} ~ {(request.data as ChangeRequestResponse).beforeEndTime}</p>
                              <p>정원: {(request.data as ChangeRequestResponse).beforeMaxStudents}명</p>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500 mb-2">변경 후</div>
                            <div className="text-sm space-y-1">
                              <p>기간: {(request.data as ChangeRequestResponse).afterStartDate} ~ {(request.data as ChangeRequestResponse).afterEndDate}</p>
                              <p>
                                요일: {(request.data as ChangeRequestResponse).afterDaysOfWeek.map(d => DAY_OF_WEEK_LABELS[d]).join(', ')}
                              </p>
                              <p>시간: {(request.data as ChangeRequestResponse).afterStartTime} ~ {(request.data as ChangeRequestResponse).afterEndTime}</p>
                              <p>정원: {(request.data as ChangeRequestResponse).afterMaxStudents}명</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 삭제 요청 상세 */}
                    {request.type === 'DELETE' && (
                      <div className="space-y-3">
                        <div className="p-3 bg-red-50 rounded-md">
                          <div className="text-sm font-medium text-red-700 mb-1">삭제 요청</div>
                          <p className="text-sm text-red-600">
                            이 차수의 삭제를 요청했습니다.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* 사유 (변경/삭제 요청) */}
                    {(request.type === 'CHANGE' || request.type === 'DELETE') && (request.data as ChangeRequestResponse | DeleteRequestResponse).reason && (
                      <div className="mt-3">
                        <div className="text-sm font-medium text-gray-500 mb-1">요청 사유</div>
                        <p className="text-sm text-gray-700">{(request.data as ChangeRequestResponse | DeleteRequestResponse).reason}</p>
                      </div>
                    )}

                    {/* 반려 사유 */}
                    {request.data.status === 'REJECTED' && (
                      <div className="mt-3 p-3 bg-red-50 rounded-md">
                        <div className="text-sm font-medium text-red-700 mb-1">반려 사유</div>
                        <p className="text-sm text-red-600">
                          {request.type === 'CREATE'
                            ? (request.data as CourseApplication).rejectionReason
                            : (request.data as ChangeRequestResponse | DeleteRequestResponse).rejectionReason
                          }
                        </p>
                      </div>
                    )}

                    {/* 처리자 정보 (변경/삭제 요청) */}
                    {(request.type === 'CHANGE' || request.type === 'DELETE') &&
                      (request.data as ChangeRequestResponse | DeleteRequestResponse).processedByName && (
                      <div className="mt-3 text-sm text-gray-500">
                        처리자: {(request.data as ChangeRequestResponse | DeleteRequestResponse).processedByName} (
                        {(request.data as ChangeRequestResponse | DeleteRequestResponse).processedAt &&
                          new Date((request.data as ChangeRequestResponse | DeleteRequestResponse).processedAt!).toLocaleDateString('ko-KR')}
                        )
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
                          disabled={
                            cancelCreateMutation.isPending ||
                            cancelChangeMutation.isPending ||
                            cancelDeleteMutation.isPending
                          }
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
