import { apiClient } from './client';
import type { Schedule, CreateScheduleRequest, UpdateScheduleRequest } from '../types/schedule';

const BASE_URL = '/schedules';

export const scheduleApi = {
    create: async (request: CreateScheduleRequest): Promise<Schedule> => {
        const response = await apiClient.post<Schedule>(BASE_URL, request);
        return response.data;
    },

    getById: async (id: number): Promise<Schedule> => {
        const response = await apiClient.get<Schedule>(`${BASE_URL}/${id}`);
        return response.data;
    },

    getAll: async (): Promise<Schedule[]> => {
        const response = await apiClient.get<Schedule[]>(BASE_URL);
        return response.data;
    },

    getByTermId: async (termId: number): Promise<Schedule[]> => {
        const response = await apiClient.get<Schedule[]>(`${BASE_URL}/term/${termId}`);
        return response.data;
    },

    getByTermAndWeek: async (termId: number, weekNumber: number): Promise<Schedule[]> => {
        const response = await apiClient.get<Schedule[]>(`${BASE_URL}/term/${termId}/week/${weekNumber}`);
        return response.data;
    },

    getByDateRange: async (startDate: string, endDate: string): Promise<Schedule[]> => {
        const response = await apiClient.get<Schedule[]>(`${BASE_URL}/date-range`, {
            params: { startDate, endDate }
        });
        return response.data;
    },

    update: async (id: number, request: UpdateScheduleRequest): Promise<Schedule> => {
        const response = await apiClient.put<Schedule>(`${BASE_URL}/${id}`, request);
        return response.data;
    },

    assignClassRoom: async (scheduleId: number, classRoomId: number): Promise<void> => {
        await apiClient.post(`${BASE_URL}/${scheduleId}/classroom/${classRoomId}`);
    },

    removeClassRoom: async (scheduleId: number): Promise<void> => {
        await apiClient.delete(`${BASE_URL}/${scheduleId}/classroom`);
    },

    markAsCancelled: async (id: number, reason?: string): Promise<void> => {
        await apiClient.post(`${BASE_URL}/${id}/cancel`, null, {
            params: reason ? { reason } : undefined
        });
    },

    markAsMakeup: async (id: number, note?: string): Promise<void> => {
        await apiClient.post(`${BASE_URL}/${id}/makeup`, null, {
            params: note ? { note } : undefined
        });
    },

    delete: async (id: number): Promise<void> => {
        await apiClient.delete(`${BASE_URL}/${id}`);
    }
};
