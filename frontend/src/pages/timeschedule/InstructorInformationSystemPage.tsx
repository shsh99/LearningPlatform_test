import { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { getInstructorInformationSystemsDetailed, unassignInstructor } from '../../api/instructorInformationSystem';
import type { InstructorInformationSystemDetail } from '../../types/instructorInformationSystem';
import { EnrolledStudentsModal } from '../../components/EnrolledStudentsModal';

export const InstructorInformationSystemPage = () => {
  const [records, setRecords] = useState<InstructorInformationSystemDetail[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<InstructorInformationSystemDetail[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states - Level 1 (Always visible)
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filter states - Level 2 (Advanced filters)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Modal state for enrolled students
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [selectedTermId, setSelectedTermId] = useState<number | null>(null);
  const [selectedCourseTitle, setSelectedCourseTitle] = useState('');
  const [selectedTermNumber, setSelectedTermNumber] = useState(0);

  const loadRecords = async () => {
    try {
      setIsLoading(true);
      const data = await getInstructorInformationSystemsDetailed();
      setRecords(data);
      setFilteredRecords(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load IIS records:', err);
      setError('IIS 기록을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, []);

  // Apply filters whenever filter states change
  useEffect(() => {
    applyFilters();
  }, [records, searchQuery, dateRange, statusFilter]);

  const applyFilters = () => {
    let filtered = [...records];

    // Search filter (강사명, 이메일, 강의명)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (record) =>
          record.instructorName.toLowerCase().includes(query) ||
          record.instructorEmail.toLowerCase().includes(query) ||
          record.courseTitle.toLowerCase().includes(query)
      );
    }

    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(
        (record) => new Date(record.assignedAt) >= new Date(dateRange.start)
      );
    }
    if (dateRange.end) {
      filtered = filtered.filter(
        (record) => new Date(record.assignedAt) <= new Date(dateRange.end)
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((record) => record.assignmentStatus === statusFilter);
    }

    setFilteredRecords(filtered);
  };

  const handleUnassign = async (assignmentId: number, instructorName: string, courseTitle: string) => {
    const confirmed = window.confirm(
      `${instructorName} 강사의 "${courseTitle}" 배정을 해제하시겠습니까?`
    );
    if (!confirmed) return;

    try {
      await unassignInstructor(assignmentId);
      alert('배정이 해제되었습니다.');
      loadRecords();
    } catch (error) {
      console.error('Failed to unassign instructor:', error);
      alert('배정 해제에 실패했습니다.');
    }
  };

  const handleOpenStudentModal = (termId: number, courseTitle: string, termNumber: number) => {
    setSelectedTermId(termId);
    setSelectedCourseTitle(courseTitle);
    setSelectedTermNumber(termNumber);
    setIsStudentModalOpen(true);
  };

  const handleCloseStudentModal = () => {
    setIsStudentModalOpen(false);
    setSelectedTermId(null);
    setSelectedCourseTitle('');
    setSelectedTermNumber(0);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setDateRange({ start: '', end: '' });
    setStatusFilter('ALL');
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      ASSIGNED: { text: '[배정중]', icon: '🟢', className: 'bg-green-100 text-green-800' },
      CANCELLED: { text: '[해제]', icon: '🔴', className: 'bg-red-100 text-red-800' }
    };
    const badge = statusMap[status as keyof typeof statusMap] || {
      text: status,
      icon: '',
      className: 'bg-gray-100 text-gray-800'
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.className}`}
      >
        {badge.text}{badge.icon}
      </span>
    );
  };

  if (isLoading && records.length === 0) {
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">IIS 관리</h1>
            <p className="text-gray-600">강사 배정 정보를 조회하고 관리할 수 있습니다.</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* Level 1 Filters - Always Visible */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  통합 검색
                </label>
                <input
                  type="text"
                  placeholder="강사명, 이메일, 강의명 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  배정일 시작
                </label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  배정일 종료
                </label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  배정 상태
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ALL">전체</option>
                  <option value="ASSIGNED">배정중</option>
                  <option value="CANCELLED">해제</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="md:col-span-2 flex items-end gap-2">
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
                >
                  {showAdvancedFilters ? '▲ 상세 검색 닫기' : '▼ 상세 검색'}
                </button>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  초기화
                </button>
              </div>
            </div>

            {/* Level 2 Filters - Advanced */}
            {showAdvancedFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">상세 검색</h3>
                <div className="text-sm text-gray-600">
                  추가 필터 옵션을 여기에 추가할 수 있습니다.
                </div>
              </div>
            )}
          </div>

          {/* Results Summary */}
          <div className="mb-4 text-sm text-gray-600">
            전체 {records.length}건 중 {filteredRecords.length}건 표시
          </div>

          {/* Table */}
          {filteredRecords.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-500 text-lg">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        No
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        강사 정보
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        강의 정보
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        배정자
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        배정일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        관리
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRecords.map((record, index) => {
                      const isCancelled = record.assignmentStatus === 'CANCELLED';

                      return (
                        <tr
                          key={record.id}
                          className={`hover:bg-gray-50 ${isCancelled ? 'opacity-60 bg-gray-50' : ''}`}
                        >
                          <td
                            className={`px-6 py-4 whitespace-nowrap text-sm ${isCancelled ? 'text-gray-500' : 'text-gray-900'}`}
                          >
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div
                              className={`font-medium ${isCancelled ? 'text-gray-500' : 'text-gray-900'}`}
                            >
                              {record.instructorName}
                            </div>
                            <div className="text-gray-400 text-xs">{record.instructorEmail}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div
                              className={`font-medium ${isCancelled ? 'text-gray-500' : 'text-gray-900'}`}
                            >
                              {record.courseTitle}
                            </div>
                            <div className="text-gray-400 text-xs">(차수{record.termNumber})</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div
                              className={`font-medium ${isCancelled ? 'text-gray-500' : 'text-gray-900'}`}
                            >
                              {record.assignedByName}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {getStatusBadge(record.assignmentStatus)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(record.assignedAt).toLocaleDateString('ko-KR', {
                              year: '2-digit',
                              month: '2-digit',
                              day: '2-digit'
                            }).replace(/\. /g, '.').replace(/\.$/, '')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex gap-2">
                              <button
                                className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-medium"
                                onClick={() =>
                                  handleOpenStudentModal(
                                    record.termId,
                                    record.courseTitle,
                                    record.termNumber
                                  )
                                }
                              >
                                학생 목록
                              </button>
                              {record.assignmentStatus === 'ASSIGNED' && (
                                <button
                                  className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs font-medium"
                                  onClick={() =>
                                    handleUnassign(
                                      record.assignmentId,
                                      record.instructorName,
                                      record.courseTitle
                                    )
                                  }
                                >
                                  배정 해제
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Enrolled Students Modal */}
      <EnrolledStudentsModal
        isOpen={isStudentModalOpen}
        onClose={handleCloseStudentModal}
        termId={selectedTermId}
        courseTitle={selectedCourseTitle}
        termNumber={selectedTermNumber}
      />
    </>
  );
};
