import { useState, useMemo } from 'react';
import type { TermCalendarItem } from '../../types/dashboard';

interface CourseCalendarProps {
  terms: TermCalendarItem[];
}

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];
const DAY_OF_WEEK_MAP: Record<string, number> = {
  SUNDAY: 0,
  MONDAY: 1,
  TUESDAY: 2,
  WEDNESDAY: 3,
  THURSDAY: 4,
  FRIDAY: 5,
  SATURDAY: 6,
};

export const CourseCalendar = ({ terms }: CourseCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedTerm, setSelectedTerm] = useState<TermCalendarItem | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const startDay = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // 각 날짜에 해당하는 차수 찾기
  const getTermsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const date = new Date(dateStr);
    const dayOfWeek = date.getDay();

    return terms.filter((term) => {
      const startDate = new Date(term.startDate);
      const endDate = new Date(term.endDate);
      const checkDate = new Date(dateStr);

      // 기간 내인지 확인
      if (checkDate < startDate || checkDate > endDate) return false;

      // 요일이 맞는지 확인
      const termDays = term.daysOfWeek.map((d) => DAY_OF_WEEK_MAP[d]);
      return termDays.includes(dayOfWeek);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-500';
      case 'ONGOING':
        return 'bg-green-500';
      case 'COMPLETED':
        return 'bg-gray-400';
      case 'CANCELLED':
        return 'bg-red-400';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return '예정';
      case 'ONGOING':
        return '진행중';
      case 'COMPLETED':
        return '완료';
      case 'CANCELLED':
        return '취소';
      default:
        return status;
    }
  };

  const formatDaysOfWeek = (days: string[]) => {
    return days
      .map((d) => DAY_LABELS[DAY_OF_WEEK_MAP[d]])
      .join(', ');
  };

  // 캘린더 그리드 생성
  const calendarDays = useMemo(() => {
    const days = [];

    // 이전 달의 빈 칸
    for (let i = 0; i < startDay; i++) {
      days.push({ day: null, terms: [] });
    }

    // 현재 달의 날짜
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ day, terms: getTermsForDate(day) });
    }

    return days;
  }, [year, month, terms]);

  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear();

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* 헤더 */}
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">강의 일정 캘린더</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            오늘
          </button>
          <button
            onClick={prevMonth}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <span className="text-lg font-medium text-gray-900 min-w-[140px] text-center">
            {year}년 {month + 1}월
          </span>
          <button
            onClick={nextMonth}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 border-b border-gray-200">
        {DAY_LABELS.map((day, i) => (
          <div
            key={day}
            className={`py-3 text-center text-sm font-medium ${
              i === 0 ? 'text-red-500' : i === 6 ? 'text-blue-500' : 'text-gray-600'
            }`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className="grid grid-cols-7">
        {calendarDays.map((item, index) => {
          const dayOfWeek = index % 7;
          return (
            <div
              key={index}
              className={`min-h-[100px] border-b border-r border-gray-100 p-1 ${
                item.day === null ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'
              }`}
            >
              {item.day && (
                <>
                  <div
                    className={`text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full ${
                      isToday(item.day)
                        ? 'bg-blue-600 text-white'
                        : dayOfWeek === 0
                        ? 'text-red-500'
                        : dayOfWeek === 6
                        ? 'text-blue-500'
                        : 'text-gray-700'
                    }`}
                  >
                    {item.day}
                  </div>
                  <div className="space-y-1">
                    {item.terms.slice(0, 3).map((term) => (
                      <button
                        key={term.id}
                        onClick={() => setSelectedTerm(term)}
                        className={`w-full text-left px-1.5 py-0.5 rounded text-xs text-white truncate ${getStatusColor(
                          term.status
                        )} hover:opacity-80 transition`}
                        title={term.courseTitle}
                      >
                        {term.courseTitle}
                      </button>
                    ))}
                    {item.terms.length > 3 && (
                      <div className="text-xs text-gray-500 px-1">
                        +{item.terms.length - 3}개 더
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* 범례 */}
      <div className="px-6 py-3 border-t border-gray-200 flex items-center gap-4 bg-gray-50">
        <span className="text-sm text-gray-600">상태:</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-blue-500"></div>
          <span className="text-xs text-gray-600">예정</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-green-500"></div>
          <span className="text-xs text-gray-600">진행중</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-gray-400"></div>
          <span className="text-xs text-gray-600">완료</span>
        </div>
      </div>

      {/* 차수 상세 모달 */}
      {selectedTerm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedTerm(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-bold text-gray-900">{selectedTerm.courseTitle}</h4>
                <p className="text-sm text-gray-500">{selectedTerm.termNumber}차</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(
                  selectedTerm.status
                )}`}
              >
                {getStatusLabel(selectedTerm.status)}
              </span>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span>
                  {selectedTerm.startDate} ~ {selectedTerm.endDate}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  {formatDaysOfWeek(selectedTerm.daysOfWeek)} {selectedTerm.startTime} ~{' '}
                  {selectedTerm.endTime}
                </span>
              </div>

              <div className="flex items-center gap-2 text-gray-600">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>
                  수강생: {selectedTerm.currentStudents} / {selectedTerm.maxStudents}명
                </span>
              </div>

              {selectedTerm.instructorName && (
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>강사: {selectedTerm.instructorName}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedTerm(null)}
              className="mt-6 w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
