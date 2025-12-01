import { apiClient } from './client';
import type {
  DashboardStats,
  SuperAdminDashboardStats,
  TenantAdminDashboardStats
} from '../types/dashboard';

// Operator Dashboard
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<DashboardStats>('/dashboard/stats');
  return response.data;
};

// SuperAdmin Dashboard
export const getSuperAdminDashboardStats = async (): Promise<SuperAdminDashboardStats> => {
  const response = await apiClient.get<SuperAdminDashboardStats>('/super-admin/dashboard/stats');
  return response.data;
};

// TenantAdmin Dashboard
export const getTenantAdminDashboardStats = async (): Promise<TenantAdminDashboardStats> => {
  const response = await apiClient.get<TenantAdminDashboardStats>('/tenant-admin/dashboard/stats');
  return response.data;
};
