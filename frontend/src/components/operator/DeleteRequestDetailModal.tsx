import { useState } from 'react';
import { useDeleteRequestDetail } from '../../hooks/useCourseTermRequests';

interface DeleteRequestDetailModalProps {
  id: number;
  onClose: () => void;
  onApprove: (id: number) => Promise<void>;
  onReject: (id: number, reason: string) => Promise<void>;
}

export const DeleteRequestDetailModal = ({
  id,
  onClose,
  onApprove,
  onReject,
}: DeleteRequestDetailModalProps) => {
  const { data: request, isLoading } = useDeleteRequestDetail(id);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [processing, setProcessing] = useState(false);

  const handleApprove = async () => {
    setProcessing(true);
    try {
      await onApprove(id);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      alert('반려 사유를 입력해주세요.');
      return;
    }
    setProcessing(true);
    try {
      await onReject(id, rejectionReason);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black bg-opacity-25" onClick={onClose} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">삭제 요청 상세</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
            </div>
          ) : request ? (
            <>
              {/* 기본 정보 */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {request.courseName} - {request.termNumber}차수
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  요청자: {request.requesterName} | 요청일: {new Date(request.createdAt).toLocaleDateString('ko-KR')}
                </p>
              </div>

              {/* 삭제 사유 */}
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="text-sm font-semibold text-red-700 mb-2">삭제 요청 사유</h4>
                <p className="text-sm text-red-800">{request.reason}</p>
              </div>

              {/* 경고 */}
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-yellow-700">
                    삭제 요청을 승인하면 해당 차수가 <strong>취소 상태</strong>로 변경됩니다. 이 작업은 되돌릴 수 없습니다.
                  </p>
                </div>
              </div>

              {/* 액션 버튼 */}
              {request.status === 'PENDING' && (
                <>
                  {!showRejectForm ? (
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => setShowRejectForm(true)}
                        disabled={processing}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                      >
                        반려
                      </button>
                      <button
                        onClick={handleApprove}
                        disabled={processing}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                      >
                        {processing ? '처리 중...' : '삭제 승인'}
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="반려 사유를 입력해주세요..."
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-red-500 focus:border-red-500"
                      />
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => {
                            setShowRejectForm(false);
                            setRejectionReason('');
                          }}
                          disabled={processing}
                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                          취소
                        </button>
                        <button
                          onClick={handleReject}
                          disabled={processing}
                          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
                        >
                          {processing ? '처리 중...' : '반려 확정'}
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* 이미 처리된 요청 */}
              {request.status !== 'PENDING' && (
                <div className={`p-4 rounded-lg ${
                  request.status === 'APPROVED' ? 'bg-green-50' :
                  request.status === 'REJECTED' ? 'bg-red-50' : 'bg-gray-50'
                }`}>
                  <p className="text-sm font-medium">
                    {request.status === 'APPROVED' && '이 요청은 승인되었습니다.'}
                    {request.status === 'REJECTED' && '이 요청은 반려되었습니다.'}
                    {request.status === 'CANCELLED' && '이 요청은 취소되었습니다.'}
                  </p>
                  {request.processedByName && (
                    <p className="text-sm text-gray-600 mt-1">
                      처리자: {request.processedByName} | 처리일: {request.processedAt && new Date(request.processedAt).toLocaleDateString('ko-KR')}
                    </p>
                  )}
                  {request.rejectionReason && (
                    <p className="text-sm text-red-700 mt-2">반려 사유: {request.rejectionReason}</p>
                  )}
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-center py-8">요청 정보를 불러올 수 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};
