import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getStudentSchedules, getStudentSchedulesByDateRange } from '../../api/studentSchedule';
import type { StudentScheduleResponse, ScheduleItem } from '../../types/studentSchedule';

const DAY_OF_WEEK_KR: Record<string, string> = {
  MONDAY: '월',
  TUESDAY: '화',
  WEDNESDAY: '수',
  THURSDAY: '목',
  FRIDAY: '금',
  SATURDAY: '토',
  SUNDAY: '일',
};

const SCHEDULE_TYPE_KR: Record<string, { label: string; color: string }> = {
  REGULAR: { label: '정규', color: 'bg-blue-100 text-blue-800' },
  CANCELLED: { label: '휴강', color: 'bg-red-100 text-red-800' },
  MAKEUP: { label: '보강', color: 'bg-green-100 text-green-800' },
};

export default function StudentSchedulePage() {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<StudentScheduleResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'weekly'>('list');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchSchedules();
    }
  }, [user?.id]);

  const fetchSchedules = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getStudentSchedules(user.id);
      setSchedules(data);
      if (data.length > 0 && !selectedTerm) {
        setSelectedTerm(data[0].termId);
      }
    } catch (err) {
      setError('시간표를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedulesByDateRange = async () => {
    if (!user?.id || !startDate || !endDate) return;

    try {
      setLoading(true);
      setError(null);
      const data = await getStudentSchedulesByDateRange(user.id, { startDate, endDate });
      setSchedules(data);
    } catch (err) {
      setError('시간표를 불러오는데 실패했습니다.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const currentTermSchedule = schedules.find((s) => s.termId === selectedTerm);

  const getWeeklySchedules = (scheduleItems: ScheduleItem[]) => {
    const weeklyMap: Record<string, ScheduleItem[]> = {
      MONDAY: [],
      TUESDAY: [],
      WEDNESDAY: [],
      THURSDAY: [],
      FRIDAY: [],
      SATURDAY: [],
      SUNDAY: [],
    };

    scheduleItems.forEach((item) => {
      if (weeklyMap[item.dayOfWeek]) {
        weeklyMap[item.dayOfWeek].push(item);
      }
    });

    return weeklyMap;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">내 시간표</h1>
        <p className="text-gray-600 mt-1">수강 중인 강의 시간표를 확인하세요</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* 필터 영역 */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          {/* 차수 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">강의 선택</label>
            <select
              value={selectedTerm || ''}
              onChange={(e) => setSelectedTerm(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {schedules.map((schedule) => (
                <option key={schedule.termId} value={schedule.termId}>
                  {schedule.courseName} ({schedule.termNumber}기)
                </option>
              ))}
            </select>
          </div>

          {/* 날짜 범위 필터 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">시작일</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">종료일</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={fetchSchedulesByDateRange}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            검색
          </button>
          <button
            onClick={fetchSchedules}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            초기화
          </button>

          {/* 뷰 모드 전환 */}
          <div className="ml-auto">
            <div className="flex rounded-md shadow-sm">
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 text-sm font-medium rounded-l-md border ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                목록
              </button>
              <button
                onClick={() => setViewMode('weekly')}
                className={`px-4 py-2 text-sm font-medium rounded-r-md border-t border-r border-b ${
                  viewMode === 'weekly'
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                주간
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 차수 정보 */}
      {currentTermSchedule && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center gap-4">
            <div>
              <h2 className="text-lg font-semibold">{currentTermSchedule.courseName}</h2>
              <p className="text-gray-500">{currentTermSchedule.termNumber}기</p>
            </div>
            <div className="ml-auto text-right text-sm text-gray-600">
              <p>수업 기간</p>
              <p className="font-medium">
                {currentTermSchedule.termStartDate} ~ {currentTermSchedule.termEndDate}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 스케줄 표시 */}
      {schedules.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          등록된 수강 시간표가 없습니다.
        </div>
      ) : viewMode === 'list' ? (
        /* 목록 뷰 */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">주차</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">요일</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">날짜</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">시간</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">강의실</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">상태</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">비고</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTermSchedule?.schedules.map((schedule) => (
                <tr key={schedule.scheduleId} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{schedule.weekNumber}주차</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {DAY_OF_WEEK_KR[schedule.dayOfWeek] || schedule.dayOfWeek}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{schedule.scheduleDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {schedule.startTime} - {schedule.endTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {schedule.classRoomName || '-'}
                    {schedule.classRoomLocation && (
                      <span className="text-gray-400 ml-1">({schedule.classRoomLocation})</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        SCHEDULE_TYPE_KR[schedule.scheduleType]?.color || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {SCHEDULE_TYPE_KR[schedule.scheduleType]?.label || schedule.scheduleType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {schedule.note || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* 주간 뷰 */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {Object.entries(DAY_OF_WEEK_KR).map(([key, label]) => (
              <div key={key} className="bg-gray-50 p-3 text-center font-medium text-gray-700">
                {label}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-px bg-gray-200 min-h-[400px]">
            {currentTermSchedule &&
              Object.keys(DAY_OF_WEEK_KR).map((day) => {
                const daySchedules = getWeeklySchedules(currentTermSchedule.schedules)[day] || [];
                return (
                  <div key={day} className="bg-white p-2 space-y-2">
                    {daySchedules.map((schedule) => (
                      <div
                        key={schedule.scheduleId}
                        className={`p-2 rounded text-xs ${
                          SCHEDULE_TYPE_KR[schedule.scheduleType]?.color || 'bg-gray-100'
                        }`}
                      >
                        <p className="font-medium">
                          {schedule.startTime.slice(0, 5)} - {schedule.endTime.slice(0, 5)}
                        </p>
                        <p>{schedule.weekNumber}주차</p>
                        {schedule.classRoomName && <p className="text-gray-600">{schedule.classRoomName}</p>}
                      </div>
                    ))}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
