import { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/Button';
import { scheduleApi } from '../../api/schedule';
import { classRoomApi } from '../../api/classRoom';
import type { Schedule, CreateScheduleRequest, DayOfWeek } from '../../types/schedule';
import type { ClassRoom } from '../../types/classRoom';

const DAY_OF_WEEK_LABELS: Record<DayOfWeek, string> = {
    MONDAY: '월',
    TUESDAY: '화',
    WEDNESDAY: '수',
    THURSDAY: '목',
    FRIDAY: '금',
    SATURDAY: '토',
    SUNDAY: '일'
};

const SCHEDULE_TYPE_LABELS: Record<string, string> = {
    REGULAR: '정규',
    MAKEUP: '보강',
    CANCELLED: '휴강'
};

const SCHEDULE_TYPE_COLORS: Record<string, string> = {
    REGULAR: 'bg-blue-100 text-blue-800',
    MAKEUP: 'bg-green-100 text-green-800',
    CANCELLED: 'bg-red-100 text-red-800'
};

export const ScheduleManagementPage = () => {
    const [schedules, setSchedules] = useState<Schedule[]>([]);
    const [classRooms, setClassRooms] = useState<ClassRoom[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);

    const [startDate, setStartDate] = useState(() => {
        const today = new Date();
        const monday = new Date(today);
        monday.setDate(today.getDate() - today.getDay() + 1);
        return monday.toISOString().split('T')[0];
    });

    const [endDate, setEndDate] = useState(() => {
        const today = new Date();
        const sunday = new Date(today);
        sunday.setDate(today.getDate() - today.getDay() + 7);
        return sunday.toISOString().split('T')[0];
    });

    useEffect(() => {
        loadData();
    }, [startDate, endDate]);

    const loadData = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const [schedulesData, classRoomsData] = await Promise.all([
                scheduleApi.getByDateRange(startDate, endDate),
                classRoomApi.getAvailable()
            ]);
            setSchedules(schedulesData);
            setClassRooms(classRoomsData);
        } catch (err) {
            setError('데이터를 불러오는데 실패했습니다.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleMarkAsCancelled = async (id: number) => {
        const reason = prompt('휴강 사유를 입력하세요:');
        if (reason === null) return;

        try {
            await scheduleApi.markAsCancelled(id, reason);
            loadData();
        } catch (err) {
            alert('휴강 처리에 실패했습니다.');
            console.error(err);
        }
    };

    const handleMarkAsMakeup = async (id: number) => {
        const note = prompt('보강 메모를 입력하세요:');
        if (note === null) return;

        try {
            await scheduleApi.markAsMakeup(id, note);
            loadData();
        } catch (err) {
            alert('보강 처리에 실패했습니다.');
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            await scheduleApi.delete(id);
            loadData();
        } catch (err) {
            alert('삭제에 실패했습니다.');
            console.error(err);
        }
    };

    const handleAssignClassRoom = async (scheduleId: number, classRoomId: number) => {
        try {
            await scheduleApi.assignClassRoom(scheduleId, classRoomId);
            loadData();
            setSelectedSchedule(null);
        } catch (err) {
            alert('강의실 배정에 실패했습니다. 시간이 충돌할 수 있습니다.');
            console.error(err);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="text-center">로딩 중...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 py-8">
                <PageHeader
                    title="일정 관리"
                    description="기수별 수업 일정을 관리합니다."
                />

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="mb-6 flex gap-4 items-center">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">시작일</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">종료일</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                    <div className="self-end">
                        <Button onClick={loadData}>조회</Button>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    날짜/요일
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    강의
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    시간
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    강의실
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    상태
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    액션
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {schedules.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                        해당 기간에 일정이 없습니다.
                                    </td>
                                </tr>
                            ) : (
                                schedules.map((schedule) => (
                                    <tr key={schedule.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {schedule.scheduleDate}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                ({DAY_OF_WEEK_LABELS[schedule.dayOfWeek]}) {schedule.weekNumber}주차
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {schedule.courseName}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {schedule.termNumber}기
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {schedule.startTime} - {schedule.endTime}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {schedule.classRoomName ? (
                                                <span className="text-sm text-gray-900">{schedule.classRoomName}</span>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedSchedule(schedule)}
                                                    className="text-sm text-blue-600 hover:text-blue-800"
                                                >
                                                    강의실 배정
                                                </button>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${SCHEDULE_TYPE_COLORS[schedule.scheduleType]}`}>
                                                {SCHEDULE_TYPE_LABELS[schedule.scheduleType]}
                                            </span>
                                            {schedule.note && (
                                                <div className="text-xs text-gray-500 mt-1">{schedule.note}</div>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <div className="flex gap-2">
                                                {schedule.scheduleType === 'REGULAR' && (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleMarkAsCancelled(schedule.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                        >
                                                            휴강
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleMarkAsMakeup(schedule.id)}
                                                            className="text-green-600 hover:text-green-800"
                                                        >
                                                            보강
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(schedule.id)}
                                                    className="text-gray-600 hover:text-gray-800"
                                                >
                                                    삭제
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {selectedSchedule && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                            <h3 className="text-lg font-semibold mb-4">강의실 배정</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                {selectedSchedule.courseName} ({selectedSchedule.scheduleDate} {selectedSchedule.startTime}-{selectedSchedule.endTime})
                            </p>
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {classRooms.map((room) => (
                                    <button
                                        key={room.id}
                                        type="button"
                                        onClick={() => handleAssignClassRoom(selectedSchedule.id, room.id)}
                                        className="w-full text-left p-3 border rounded-lg hover:bg-gray-50"
                                    >
                                        <div className="font-medium">{room.name}</div>
                                        <div className="text-sm text-gray-500">
                                            {room.location} | 수용: {room.capacity}명
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <div className="mt-4 flex justify-end">
                                <Button variant="secondary" onClick={() => setSelectedSchedule(null)}>
                                    취소
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
