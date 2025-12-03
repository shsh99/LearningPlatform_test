import { useState } from 'react';
import { Navbar } from '../../components/Navbar';
import { useTenant } from '../../contexts/TenantContext';
import {
  useSystemNotices,
  useCreateNotice,
  useUpdateNotice,
  useDeleteNotice,
  useEnableNotice,
  useDisableNotice,
} from '../../hooks/useNotice';
import type { Notice, CreateNoticeRequest, UpdateNoticeRequest } from '../../types/notice';

export function NoticeManagementPage() {
  const { branding } = useTenant();
  const [page, setPage] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState<Notice | null>(null);

  const { data: noticePage, isLoading, refetch } = useSystemNotices(page, 20);
  const createMutation = useCreateNotice();
  const updateMutation = useUpdateNotice();
  const deleteMutation = useDeleteNotice();
  const enableMutation = useEnableNotice();
  const disableMutation = useDisableNotice();

  const [formData, setFormData] = useState<{
    title: string;
    content: string;
    startDate: string;
    endDate: string;
  }>({
    title: '',
    content: '',
    startDate: '',
    endDate: '',
  });

  const resetForm = () => {
    setFormData({ title: '', content: '', startDate: '', endDate: '' });
    setEditingNotice(null);
  };

  const handleCreate = async () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    const request: CreateNoticeRequest = {
      type: 'SYSTEM',
      title: formData.title,
      content: formData.content,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
    };

    try {
      await createMutation.mutateAsync(request);
      alert('공지가 생성되었습니다.');
      setShowCreateModal(false);
      resetForm();
      refetch();
    } catch (error: any) {
      alert(error.response?.data?.message || '공지 생성에 실패했습니다.');
    }
  };

  const handleUpdate = async () => {
    if (!editingNotice) return;
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    const request: UpdateNoticeRequest = {
      title: formData.title,
      content: formData.content,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
    };

    try {
      await updateMutation.mutateAsync({ id: editingNotice.id, data: request });
      alert('공지가 수정되었습니다.');
      setEditingNotice(null);
      resetForm();
      refetch();
    } catch (error: any) {
      alert(error.response?.data?.message || '공지 수정에 실패했습니다.');
    }
  };

  const handleDelete = async (notice: Notice) => {
    if (!confirm(`"${notice.title}" 공지를 삭제하시겠습니까?`)) return;

    try {
      await deleteMutation.mutateAsync(notice.id);
      alert('공지가 삭제되었습니다.');
      refetch();
    } catch (error: any) {
      alert(error.response?.data?.message || '공지 삭제에 실패했습니다.');
    }
  };

  const handleToggleEnabled = async (notice: Notice) => {
    try {
      if (notice.enabled) {
        await disableMutation.mutateAsync(notice.id);
      } else {
        await enableMutation.mutateAsync(notice.id);
      }
      refetch();
    } catch (error: any) {
      alert(error.response?.data?.message || '상태 변경에 실패했습니다.');
    }
  };

  const openEditModal = (notice: Notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title,
      content: notice.content,
      startDate: notice.startDate ? notice.startDate.slice(0, 16) : '',
      endDate: notice.endDate ? notice.endDate.slice(0, 16) : '',
    });
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
          {/* 헤더 */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold" style={{ color: branding.primaryColor }}>
                시스템 공지 관리
              </h1>
              <p className="text-gray-600 mt-2">
                테넌트 관리자들에게 표시될 시스템 공지를 관리합니다.
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 rounded-lg font-medium text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: branding.primaryColor }}
            >
              + 새 공지 작성
            </button>
          </div>

          {/* 공지 목록 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    게시 기간
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성일
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {noticePage?.content.map((notice) => (
                  <tr key={notice.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{notice.title}</div>
                      <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                        {notice.content.slice(0, 50)}...
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleEnabled(notice)}
                        className={`px-3 py-1 text-xs font-semibold rounded-full transition-colors ${
                          notice.enabled
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {notice.enabled ? '활성' : '비활성'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {notice.startDate && notice.endDate ? (
                        <>
                          {new Date(notice.startDate).toLocaleDateString('ko-KR')} ~{' '}
                          {new Date(notice.endDate).toLocaleDateString('ko-KR')}
                        </>
                      ) : notice.startDate ? (
                        <>{new Date(notice.startDate).toLocaleDateString('ko-KR')} ~</>
                      ) : notice.endDate ? (
                        <>~ {new Date(notice.endDate).toLocaleDateString('ko-KR')}</>
                      ) : (
                        '상시'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(notice.createdAt).toLocaleDateString('ko-KR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                      <button
                        onClick={() => openEditModal(notice)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        수정
                      </button>
                      <button
                        onClick={() => handleDelete(notice)}
                        className="text-red-600 hover:text-red-900"
                      >
                        삭제
                      </button>
                    </td>
                  </tr>
                ))}

                {(!noticePage?.content || noticePage.content.length === 0) && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      등록된 공지가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          {noticePage && noticePage.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setPage(Math.max(0, page - 1))}
                disabled={page === 0}
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50"
              >
                이전
              </button>
              <span className="px-4 py-2 text-gray-600">
                {page + 1} / {noticePage.totalPages}
              </span>
              <button
                onClick={() => setPage(Math.min(noticePage.totalPages - 1, page + 1))}
                disabled={page >= noticePage.totalPages - 1}
                className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50"
              >
                다음
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 생성 모달 */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">새 시스템 공지 작성</h3>
            <p className="text-sm text-gray-500 mb-6">
              이 공지는 모든 테넌트 관리자에게 표시됩니다.
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="공지 제목을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="공지 내용을 입력하세요"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    시작일시 (선택)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    종료일시 (선택)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleCreate}
                disabled={createMutation.isPending}
                className="flex-1 py-2 rounded-lg font-medium text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: branding.primaryColor }}
              >
                {createMutation.isPending ? '생성 중...' : '공지 생성'}
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 수정 모달 */}
      {editingNotice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">공지 수정</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  내용 <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    시작일시 (선택)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    종료일시 (선택)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleUpdate}
                disabled={updateMutation.isPending}
                className="flex-1 py-2 rounded-lg font-medium text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: branding.primaryColor }}
              >
                {updateMutation.isPending ? '수정 중...' : '수정 완료'}
              </button>
              <button
                onClick={() => {
                  setEditingNotice(null);
                  resetForm();
                }}
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
