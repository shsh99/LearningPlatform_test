import { useState, useEffect } from 'react';
import { Navbar } from '../../components/Navbar';
import { PageHeader } from '../../components/PageHeader';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { classRoomApi } from '../../api/classRoom';
import type { ClassRoom, CreateClassRoomRequest, ClassRoomStatus } from '../../types/classRoom';

const STATUS_LABELS: Record<ClassRoomStatus, string> = {
    AVAILABLE: '사용 가능',
    MAINTENANCE: '점검 중',
    UNAVAILABLE: '사용 불가'
};

const STATUS_COLORS: Record<ClassRoomStatus, string> = {
    AVAILABLE: 'bg-green-100 text-green-800',
    MAINTENANCE: 'bg-yellow-100 text-yellow-800',
    UNAVAILABLE: 'bg-red-100 text-red-800'
};

export const ClassRoomManagementPage = () => {
    const [classRooms, setClassRooms] = useState<ClassRoom[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingRoom, setEditingRoom] = useState<ClassRoom | null>(null);

    const [formData, setFormData] = useState<CreateClassRoomRequest>({
        name: '',
        location: '',
        capacity: 30,
        facilities: ''
    });

    useEffect(() => {
        loadClassRooms();
    }, []);

    const loadClassRooms = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await classRoomApi.getAll();
            setClassRooms(data);
        } catch (err) {
            setError('강의실 목록을 불러오는데 실패했습니다.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await classRoomApi.create(formData);
            setShowCreateModal(false);
            setFormData({ name: '', location: '', capacity: 30, facilities: '' });
            loadClassRooms();
        } catch (err) {
            alert('강의실 생성에 실패했습니다.');
            console.error(err);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingRoom) return;

        try {
            await classRoomApi.update(editingRoom.id, formData);
            setEditingRoom(null);
            setFormData({ name: '', location: '', capacity: 30, facilities: '' });
            loadClassRooms();
        } catch (err) {
            alert('강의실 수정에 실패했습니다.');
            console.error(err);
        }
    };

    const handleStatusChange = async (id: number, status: ClassRoomStatus) => {
        try {
            switch (status) {
                case 'AVAILABLE':
                    await classRoomApi.markAsAvailable(id);
                    break;
                case 'MAINTENANCE':
                    await classRoomApi.markAsMaintenance(id);
                    break;
                case 'UNAVAILABLE':
                    await classRoomApi.markAsUnavailable(id);
                    break;
            }
            loadClassRooms();
        } catch (err) {
            alert('상태 변경에 실패했습니다.');
            console.error(err);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('정말 삭제하시겠습니까?')) return;

        try {
            await classRoomApi.delete(id);
            loadClassRooms();
        } catch (err) {
            alert('삭제에 실패했습니다.');
            console.error(err);
        }
    };

    const openEditModal = (room: ClassRoom) => {
        setEditingRoom(room);
        setFormData({
            name: room.name,
            location: room.location || '',
            capacity: room.capacity,
            facilities: room.facilities || ''
        });
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
                    title="강의실 관리"
                    description="강의실을 등록하고 관리합니다."
                />

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <Button onClick={() => setShowCreateModal(true)}>
                        새 강의실 등록
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classRooms.map((room) => (
                        <div key={room.id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-semibold">{room.name}</h3>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[room.status]}`}>
                                    {STATUS_LABELS[room.status]}
                                </span>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                {room.location && (
                                    <div>위치: {room.location}</div>
                                )}
                                <div>수용 인원: {room.capacity}명</div>
                                {room.facilities && (
                                    <div>시설: {room.facilities}</div>
                                )}
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex gap-2 mb-3">
                                    <select
                                        value={room.status}
                                        onChange={(e) => handleStatusChange(room.id, e.target.value as ClassRoomStatus)}
                                        className="flex-1 text-sm border rounded-md px-2 py-1"
                                    >
                                        <option value="AVAILABLE">사용 가능</option>
                                        <option value="MAINTENANCE">점검 중</option>
                                        <option value="UNAVAILABLE">사용 불가</option>
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => openEditModal(room)}
                                        className="text-sm text-blue-600 hover:text-blue-800"
                                    >
                                        수정
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(room.id)}
                                        className="text-sm text-red-600 hover:text-red-800"
                                    >
                                        삭제
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {classRooms.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        등록된 강의실이 없습니다.
                    </div>
                )}

                {(showCreateModal || editingRoom) && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                            <h3 className="text-lg font-semibold mb-4">
                                {editingRoom ? '강의실 수정' : '새 강의실 등록'}
                            </h3>
                            <form onSubmit={editingRoom ? handleUpdate : handleCreate}>
                                <div className="space-y-4">
                                    <div>
                                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                            강의실 이름 *
                                        </label>
                                        <Input
                                            id="name"
                                            type="text"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                                            위치
                                        </label>
                                        <Input
                                            id="location"
                                            type="text"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="capacity" className="block text-sm font-medium text-gray-700">
                                            수용 인원 *
                                        </label>
                                        <Input
                                            id="capacity"
                                            type="number"
                                            min={1}
                                            value={formData.capacity}
                                            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 1 })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label htmlFor="facilities" className="block text-sm font-medium text-gray-700">
                                            시설 정보
                                        </label>
                                        <textarea
                                            id="facilities"
                                            value={formData.facilities}
                                            onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
                                            rows={3}
                                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            placeholder="빔프로젝터, 화이트보드 등"
                                        />
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => {
                                            setShowCreateModal(false);
                                            setEditingRoom(null);
                                            setFormData({ name: '', location: '', capacity: 30, facilities: '' });
                                        }}
                                    >
                                        취소
                                    </Button>
                                    <Button type="submit">
                                        {editingRoom ? '수정' : '등록'}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
