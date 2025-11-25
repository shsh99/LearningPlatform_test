export type ClassRoomStatus = 'AVAILABLE' | 'MAINTENANCE' | 'UNAVAILABLE';

export interface ClassRoom {
    id: number;
    name: string;
    location: string | null;
    capacity: number;
    facilities: string | null;
    status: ClassRoomStatus;
}

export interface CreateClassRoomRequest {
    name: string;
    location?: string;
    capacity: number;
    facilities?: string;
}

export interface UpdateClassRoomRequest {
    name?: string;
    location?: string;
    capacity?: number;
    facilities?: string;
    status?: ClassRoomStatus;
}
