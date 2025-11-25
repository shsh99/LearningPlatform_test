import { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { getStudentInformationSystems } from '../../api/studentInformationSystem';
import type { StudentInformationSystem } from '../../types/studentInformationSystem';

export const StudentInformationSystemPage = () => {
  const [records, setRecords] = useState<StudentInformationSystem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userKey, setUserKey] = useState<string>('');
  const [timeKey, setTimeKey] = useState<string>('');

  // 정렬 상태
  type SortField = 'id' | 'userKey' | 'timeKey' | 'timestamp';
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 선택 상태 (일괄 처리용)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const loadRecords = async () => {
    try {
      setIsLoading(true);
      const query = {
        userKey: userKey ? Number(userKey) : undefined,
        timeKey: timeKey ? Number(timeKey) : undefined,
      };
      const data = await getStudentInformationSystems(query);
      setRecords(data);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadRecords();
  };

  const handleReset = () => {
    setUserKey('');
    setTimeKey('');
  };

  // 정렬 핸들러
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // 정렬된 레코드 가져오기
  const getSortedRecords = () => {
    const sorted = [...records].sort((a, b) => {
      let compareValue = 0;

      switch (sortField) {
        case 'id':
          compareValue = a.id - b.id;
          break;
        case 'userKey':
          compareValue = a.userKey - b.userKey;
          break;
        case 'timeKey':
          compareValue = a.timeKey - b.timeKey;
          break;
        case 'timestamp':
          compareValue = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
          break;
      }

      return sortOrder === 'asc' ? compareValue : -compareValue;
    });

    return sorted;
  };

  // 페이지네이션 함수
  const getTotalPages = () => {
    return Math.ceil(sortedRecords.length / itemsPerPage);
  };

  const getPaginatedRecords = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return sortedRecords.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  // 선택 핸들러
  const handleSelectAll = () => {
    if (selectedIds.size === paginatedRecords.length) {
      // 전체 선택 해제
      setSelectedIds(new Set());
    } else {
      // 현재 페이지 전체 선택
      const newSelected = new Set<number>();
      paginatedRecords.forEach(record => newSelected.add(record.id));
      setSelectedIds(newSelected);
    }
  };

  const handleSelectOne = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return;

    const confirmed = window.confirm(`선택된 ${selectedIds.size}개 항목을 삭제하시겠습니까?`);
    if (confirmed) {
      // 실제로는 API 호출이 필요하지만, 현재는 프론트엔드에서만 제거
      const newRecords = records.filter(record => !selectedIds.has(record.id));
      setRecords(newRecords);
      setSelectedIds(new Set());
      alert('선택된 항목이 삭제되었습니다.');
    }
  };

  // 시간 경과 경고 판단 (30일 이상 경과한 기록에 경고)
  const getRecordWarningLevel = (timestamp: string): 'none' | 'warning' | 'danger' => {
    const recordDate = new Date(timestamp);
    const now = new Date();
    const daysDiff = Math.floor((now.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff >= 60) return 'danger'; // 60일 이상: 위험
    if (daysDiff >= 30) return 'warning'; // 30일 이상: 경고
    return 'none'; // 30일 미만: 정상
  };

  // 통계 계산 함수들
  const getStatistics = () => {
    if (records.length === 0) {
      return {
        totalRecords: 0,
        uniqueUsers: 0,
        uniqueTimes: 0,
        normalCount: 0,
        warningCount: 0,
        dangerCount: 0,
        oldestRecord: null,
        newestRecord: null,
        dateRange: 0,
      };
    }

    const uniqueUsers = new Set(records.map(r => r.userKey)).size;
    const uniqueTimes = new Set(records.map(r => r.timeKey)).size;

    let normalCount = 0;
    let warningCount = 0;
    let dangerCount = 0;

    records.forEach(record => {
      const level = getRecordWarningLevel(record.timestamp);
      if (level === 'danger') dangerCount++;
      else if (level === 'warning') warningCount++;
      else normalCount++;
    });

    const timestamps = records.map(r => new Date(r.timestamp).getTime());
    const oldestTimestamp = Math.min(...timestamps);
    const newestTimestamp = Math.max(...timestamps);
    const oldestRecord = new Date(oldestTimestamp);
    const newestRecord = new Date(newestTimestamp);
    const dateRange = Math.floor((newestTimestamp - oldestTimestamp) / (1000 * 60 * 60 * 24));

    return {
      totalRecords: records.length,
      uniqueUsers,
      uniqueTimes,
      normalCount,
      warningCount,
      dangerCount,
      oldestRecord,
      newestRecord,
      dateRange,
    };
  };

  const sortedRecords = getSortedRecords();
  const paginatedRecords = getPaginatedRecords();
  const totalPages = getTotalPages();
  const statistics = getStatistics();

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">SIS 조회</h1>
            <p className="text-gray-600">수강 신청 이력을 조회할 수 있습니다.</p>
          </div>

          {/* 검색 필터 */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <form onSubmit={handleSearch} className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  학생 ID (userKey)
                </label>
                <Input
                  type="number"
                  value={userKey}
                  onChange={(e) => setUserKey(e.target.value)}
                  placeholder="학생 ID를 입력하세요"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  차수 ID (timeKey)
                </label>
                <Input
                  type="number"
                  value={timeKey}
                  onChange={(e) => setTimeKey(e.target.value)}
                  placeholder="차수 ID를 입력하세요"
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit">검색</Button>
                <Button
                  type="button"
                  onClick={handleReset}
                  className="!bg-gray-500 hover:!bg-gray-600"
                >
                  초기화
                </Button>
              </div>
            </form>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}

          {/* 통계 대시보드 */}
          {records.length > 0 && (
            <div className="mb-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-sm p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">📊 통계 대시보드</h3>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">페이지당:</label>
                    <select
                      value={itemsPerPage}
                      onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                      className="px-3 py-1.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                    >
                      <option value={10}>10개씩</option>
                      <option value={20}>20개씩</option>
                      <option value={50}>50개씩</option>
                    </select>
                  </div>
                </div>

                {/* 통계 카드 그리드 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 총 레코드 수 */}
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">총 레코드</span>
                      <span className="text-2xl">📝</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{statistics.totalRecords}</div>
                    <div className="text-xs text-gray-500 mt-1">전체 SIS 기록</div>
                  </div>

                  {/* 고유 학생 수 */}
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">고유 학생</span>
                      <span className="text-2xl">👤</span>
                    </div>
                    <div className="text-2xl font-bold text-purple-600">{statistics.uniqueUsers}</div>
                    <div className="text-xs text-gray-500 mt-1">서로 다른 학생 수</div>
                  </div>

                  {/* 고유 차수 수 */}
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">고유 차수</span>
                      <span className="text-2xl">🗓️</span>
                    </div>
                    <div className="text-2xl font-bold text-green-600">{statistics.uniqueTimes}</div>
                    <div className="text-xs text-gray-500 mt-1">서로 다른 차수 수</div>
                  </div>

                  {/* 기간 */}
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">기간</span>
                      <span className="text-2xl">📅</span>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">{statistics.dateRange}일</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {statistics.oldestRecord && statistics.newestRecord && (
                        <>
                          {statistics.oldestRecord.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })} ~ {' '}
                          {statistics.newestRecord.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* 상태 분포 */}
                <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-gray-700">상태 분포</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl">✅</span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">정상</div>
                        <div className="text-lg font-bold text-green-600">{statistics.normalCount}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl">⚠️</span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">경고</div>
                        <div className="text-lg font-bold text-yellow-600">{statistics.warningCount}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                        <span className="text-xl">🚨</span>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">위험</div>
                        <div className="text-lg font-bold text-red-600">{statistics.dangerCount}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 일괄 처리 액션 바 */}
          {selectedIds.size > 0 && (
            <div className="bg-indigo-600 text-white rounded-xl shadow-lg p-4 mb-6 border border-indigo-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-semibold">
                    {selectedIds.size}개 항목 선택됨
                  </span>
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="text-sm text-indigo-200 hover:text-white underline"
                  >
                    선택 해제
                  </button>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleBulkDelete}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors"
                  >
                    선택 삭제
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 경고 범례 */}
          {records.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-6">
                <span className="text-sm font-medium text-gray-700">상태 표시:</span>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-white border-2 border-gray-200 rounded"></div>
                  <span className="text-sm text-gray-600">정상 (30일 이내)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-400 rounded"></div>
                  <span className="text-sm text-gray-600">경고 (30일 이상)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-100 border-2 border-red-400 rounded"></div>
                  <span className="text-sm text-gray-600">위험 (60일 이상)</span>
                </div>
              </div>
            </div>
          )}

          {records.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center">
              <p className="text-gray-500 text-lg mb-4">조회된 SIS 기록이 없습니다.</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.size === paginatedRecords.length && paginatedRecords.length > 0}
                        onChange={handleSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                      />
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('id')}
                    >
                      <div className="flex items-center gap-1">
                        ID
                        {sortField === 'id' && (
                          <span className="text-blue-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('userKey')}
                    >
                      <div className="flex items-center gap-1">
                        학생 ID (userKey)
                        {sortField === 'userKey' && (
                          <span className="text-blue-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('timeKey')}
                    >
                      <div className="flex items-center gap-1">
                        차수 ID (timeKey)
                        {sortField === 'timeKey' && (
                          <span className="text-blue-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      수강 ID
                    </th>
                    <th
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none"
                      onClick={() => handleSort('timestamp')}
                    >
                      <div className="flex items-center gap-1">
                        생성 시각
                        {sortField === 'timestamp' && (
                          <span className="text-blue-500">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                        )}
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedRecords.map((record) => {
                    const warningLevel = getRecordWarningLevel(record.timestamp);
                    const rowClassName = `hover:opacity-90 transition-opacity ${
                      warningLevel === 'danger'
                        ? 'bg-red-50'
                        : warningLevel === 'warning'
                        ? 'bg-yellow-50'
                        : 'hover:bg-gray-50'
                    }`;

                    return (
                      <tr key={record.id} className={rowClassName}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(record.id)}
                            onChange={() => handleSelectOne(record.id)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {record.id}
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.userKey}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.timeKey}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {record.enrollmentId}
                      </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(record.timestamp).toLocaleString('ko-KR')}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    {/* 현재 범위 표시 */}
                    <div className="text-sm text-gray-600">
                      {(currentPage - 1) * itemsPerPage + 1}-
                      {Math.min(currentPage * itemsPerPage, sortedRecords.length)} / {sortedRecords.length}건
                    </div>

                    {/* 페이지 버튼 */}
                    <div className="flex items-center gap-2">
                      {/* 이전 버튼 */}
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        이전
                      </button>

                      {/* 페이지 번호 */}
                      {(() => {
                        const pages = [];
                        const showPages = 5; // 보여줄 페이지 수

                        if (totalPages <= showPages) {
                          // 전체 페이지가 5개 이하면 모두 표시
                          for (let i = 1; i <= totalPages; i++) {
                            pages.push(i);
                          }
                        } else {
                          // 5개 초과면 스마트하게 표시
                          if (currentPage <= 3) {
                            // 앞쪽에 있을 때
                            for (let i = 1; i <= 4; i++) pages.push(i);
                            pages.push('...');
                            pages.push(totalPages);
                          } else if (currentPage >= totalPages - 2) {
                            // 뒤쪽에 있을 때
                            pages.push(1);
                            pages.push('...');
                            for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
                          } else {
                            // 중간에 있을 때
                            pages.push(1);
                            pages.push('...');
                            for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
                            pages.push('...');
                            pages.push(totalPages);
                          }
                        }

                        return pages.map((page, index) =>
                          page === '...' ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-gray-400">
                              ...
                            </span>
                          ) : (
                            <button
                              key={page}
                              onClick={() => handlePageChange(page as number)}
                              className={`px-3 py-1.5 text-sm border rounded-lg ${
                                currentPage === page
                                  ? 'bg-blue-500 text-white border-blue-500'
                                  : 'border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {page}
                            </button>
                          )
                        );
                      })()}

                      {/* 다음 버튼 */}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        다음
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
