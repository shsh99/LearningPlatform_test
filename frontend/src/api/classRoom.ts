import { apiClient } from './client';
import type { ClassRoom, CreateClassRoomRequest, UpdateClassRoomRequest } from '../types/classRoom';

const BASE_URL = '/classrooms';

export const classRoomApi = {
    create: async (request: CreateClassRoomRequest): Promise<ClassRoom> => {
        const response = await apiClient.post<ClassRoom>(BASE_URL, request);
        return response.data;
    },

    getById: async (id: number): Promise<ClassRoom> => {
        const response = await apiClient.get<ClassRoom>(`${BASE_URL}/${id}`);
        return response.data;
    },

    getAll: async (): Promise<ClassRoom[]> => {
        const response = await apiClient.get<ClassRoom[]>(BASE_URL);
        return response.data;
    },

    getAvailable: async (): Promise<ClassRoom[]> => {
        const response = await apiClient.get<ClassRoom[]>(`${BASE_URL}/available`);
        return response.data;
    },

    getAvailableForTimeSlot: async (
        date: string,
        startTime: string,
        endTime: string
    ): Promise<ClassRoom[]> => {
        const response = await apiClient.get<ClassRoom[]>(`${BASE_URL}/available/timeslot`, {
            params: { date, startTime, endTime }
        });
        return response.data;
    },

    update: async (id: number, request: UpdateClassRoomRequest): Promise<ClassRoom> => {
        const response = await apiClient.put<ClassRoom>(`${BASE_URL}/${id}`, request);
        return response.data;
    },

    markAsAvailable: async (id: number): Promise<void> => {
        await apiClient.post(`${BASE_URL}/${id}/available`);
    },

    markAsMaintenance: async (id: number): Promise<void> => {
        await apiClient.post(`${BASE_URL}/${id}/maintenance`);
    },

    markAsUnavailable: async (id: number): Promise<void> => {
        await apiClient.post(`${BASE_URL}/${id}/unavailable`);
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`${BASE_URL}/${id}`);
    }
};
