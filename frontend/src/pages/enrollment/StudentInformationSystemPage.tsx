import { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { StudentDetailModal } from '../../components/StudentDetailModal';
import { getStudentInformationSystems, cancelEnrollment, completeEnrollment } from '../../api/studentInformationSystem';
import type { StudentInformationSystem } from '../../types/studentInformationSystem';

export const StudentInformationSystemPage = () => {
  const [records, setRecords] = useState<StudentInformationSystem[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<StudentInformationSystem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal state
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Filter states - Level 1 (Always visible)
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Filter states - Level 2 (Advanced filters)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [progressRange, setProgressRange] = useState({ min: 0, max: 100 });

  const loadRecords = async () => {
    try {
      setIsLoading(true);
      const data = await getStudentInformationSystems();
      setRecords(data);
      setFilteredRecords(data);
      setError(null);
    } catch (err) {
      console.error('Failed to load SIS records:', err);
      setError('SIS 기록을 불러오는데 실패했습니다.');
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
  }, [records, searchQuery, dateRange, statusFilter, progressRange]);

  const applyFilters = () => {
    let filtered = [...records];

    // Search filter (이름, 이메일, 강의명)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (record) =>
          record.studentName.toLowerCase().includes(query) ||
          record.studentEmail.toLowerCase().includes(query) ||
          record.courseTitle.toLowerCase().includes(query)
      );
    }

    // Date range filter
    if (dateRange.start) {
      filtered = filtered.filter(
        (record) => new Date(record.enrollmentCreatedAt) >= new Date(dateRange.start)
      );
    }
    if (dateRange.end) {
      filtered = filtered.filter(
        (record) => new Date(record.enrollmentCreatedAt) <= new Date(dateRange.end)
      );
    }

    // Status filter
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter((record) => record.enrollmentStatus === statusFilter);
    }

    // Progress range filter
    filtered = filtered.filter(
      (record) =>
        record.progressPercentage >= progressRange.min &&
        record.progressPercentage <= progressRange.max
    );

    setFilteredRecords(filtered);
  };

  const handleCancelEnrollment = async (id: number, studentName: string) => {
    const confirmed = window.confirm(`${studentName} 학생의 수강을 취소하시겠습니까?`);
    if (!confirmed) return;

    try {
      await cancelEnrollment(id);
      alert('수강이 취소되었습니다.');
      loadRecords();
    } catch (error) {
      console.error('Failed to cancel enrollment:', error);
      alert('수강 취소에 실패했습니다.');
    }
  };

  const handleCompleteEnrollment = async (id: number, studentName: string) => {
    const confirmed = window.confirm(`${studentName} 학생을 수료 처리하시겠습니까?`);
    if (!confirmed) return;

    try {
      await completeEnrollment(id);
      alert('수료 처리되었습니다.');
      loadRecords();
    } catch (error) {
      console.error('Failed to complete enrollment:', error);
      alert('수료 처리에 실패했습니다.');
    }
  };

  const openDetailModal = (studentId: number) => {
    setSelectedStudentId(studentId);
    setIsModalOpen(true);
  };

  const closeDetailModal = () => {
    setIsModalOpen(false);
    setSelectedStudentId(null);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setDateRange({ start: '', end: '' });
    setStatusFilter('ALL');
    setProgressRange({ min: 0, max: 100 });
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      ENROLLED: { text: '[수강중]', icon: '🟢', className: 'bg-blue-100 text-blue-800' },
      COMPLETED: { text: '[수료]', icon: '🔵', className: 'bg-green-100 text-green-800' },
      CANCELLED: { text: '[취소]', icon: '🔴', className: 'bg-red-100 text-red-800' }
    };
    const badge = statusMap[status as keyof typeof statusMap] || { text: status, icon: '', className: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${badge.className}`}>
        {badge.text}{badge.icon}
      </span>
    );
  };

  const getProgressPercentage = (record: StudentInformationSystem) => {
    // 수료 상태는 무조건 100%로 표시
    if (record.enrollmentStatus === 'COMPLETED') {
      return 100;
    }
    return record.progressPercentage;
  };

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-600'; // 수료: 초록색
      case 'ENROLLED':
        return 'bg-blue-600'; // 수강중: 파란색
      case 'CANCELLED':
        return 'bg-gray-400'; // 취소: 회색
      default:
        return 'bg-gray-400';
    }
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">SIS 관리</h1>
            <p className="text-gray-600">학생 수강 정보를 조회하고 관리할 수 있습니다.</p>
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
                  placeholder="이름, 이메일, 강의명 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  신청일 시작
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
                  신청일 종료
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
                  수강 상태
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="ALL">전체</option>
                  <option value="ENROLLED">수강중</option>
                  <option value="COMPLETED">수료</option>
                  <option value="CANCELLED">취소</option>
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Progress Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      진도율 범위: {progressRange.min}% ~ {progressRange.max}%
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={progressRange.min}
                        onChange={(e) => setProgressRange({ ...progressRange, min: Number(e.target.value) })}
                        className="flex-1"
                      />
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={progressRange.max}
                        onChange={(e) => setProgressRange({ ...progressRange, max: Number(e.target.value) })}
                        className="flex-1"
                      />
                    </div>
                  </div>
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
                        학생 정보
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        강의 정보
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        진도율
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        신청일
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        관리
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRecords.map((record, index) => {
                      const isCancelled = record.enrollmentStatus === 'CANCELLED';
                      const progressPercentage = getProgressPercentage(record);
                      const progressBarColor = getProgressBarColor(record.enrollmentStatus);

                      return (
                        <tr
                          key={record.id}
                          className={`hover:bg-gray-50 ${isCancelled ? 'opacity-60 bg-gray-50' : ''}`}
                        >
                          <td className={`px-6 py-4 whitespace-nowrap text-sm ${isCancelled ? 'text-gray-500' : 'text-gray-900'}`}>
                            {index + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className={`font-medium ${isCancelled ? 'text-gray-500' : 'text-gray-900'}`}>
                              {record.studentName}
                            </div>
                            <div className="text-gray-400 text-xs">(user{record.userKey})</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className={`font-medium ${isCancelled ? 'text-gray-500' : 'text-gray-900'}`}>
                              {record.courseTitle}
                            </div>
                            <div className="text-gray-400 text-xs">(차수{record.termNumber})</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <div className="flex items-center gap-3">
                              <div className="flex-1 max-w-[120px]">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`${progressBarColor} h-2 rounded-full transition-all duration-300`}
                                      style={{ width: `${progressPercentage}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                              <span className={`font-medium min-w-[45px] text-right ${isCancelled ? 'text-red-600' : 'text-gray-900'}`}>
                                {progressPercentage}%
                              </span>
                            </div>
                          </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getStatusBadge(record.enrollmentStatus)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(record.enrollmentCreatedAt).toLocaleDateString('ko-KR', {
                            year: '2-digit',
                            month: '2-digit',
                            day: '2-digit'
                          }).replace(/\. /g, '.').replace(/\.$/, '')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex gap-2">
                            <button
                              className="px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs font-medium"
                              onClick={() => openDetailModal(record.id)}
                            >
                              상세
                            </button>
                            {record.enrollmentStatus === 'ENROLLED' && (
                              <>
                                <button
                                  className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition-colors text-xs font-medium"
                                  onClick={() => handleCancelEnrollment(record.id, record.studentName)}
                                >
                                  취소
                                </button>
                                <button
                                  className="px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs font-medium"
                                  onClick={() => handleCompleteEnrollment(record.id, record.studentName)}
                                >
                                  수료
                                </button>
                              </>
                            )}
                            {record.enrollmentStatus === 'COMPLETED' && (
                              <button
                                className="px-3 py-1.5 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors text-xs font-medium"
                                onClick={() => alert(`${record.studentName}의 수료증\n\n이 기능은 추후 구현 예정입니다.`)}
                              >
                                증명서
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

      {/* Detail Modal */}
      {selectedStudentId && (
        <StudentDetailModal
          isOpen={isModalOpen}
          onClose={closeDetailModal}
          studentId={selectedStudentId}
        />
      )}
    </>
  );
};
