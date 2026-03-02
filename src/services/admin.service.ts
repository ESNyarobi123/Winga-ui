import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api-response";
import type { SpringPage } from "@/types/api-response";

export interface AdminDashboardOverview {
  activeJobs: number;
  applicationsToday: number;
  applicationsThisMonth: number;
  hiresMade: number;
  responseRatePercent: number;
  revenue: number;
  pendingModerationCount: number;
  applicationsOverTime: { date: string; count: number }[];
  topCategories: { categoryName: string; count: number }[];
}

export interface AdminStats {
  totalUsers: number;
  totalClients: number;
  totalFreelancers: number;
  openJobs: number;
  totalJobs: number;
  activeContracts: number;
  completedContracts: number;
  disputedContracts: number;
  totalPlatformRevenue: number;
}

export interface AdminUserRow {
  id: number;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  isVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
}

export const adminService = {
  async getDashboardOverview(): Promise<AdminDashboardOverview> {
    const { data } = await api.get<ApiResponse<AdminDashboardOverview>>("/admin/dashboard/overview");
    return data.data;
  },

  async getStats(): Promise<AdminStats> {
    const { data } = await api.get<ApiResponse<AdminStats>>("/admin/stats");
    return data.data;
  },

  async getUsers(page = 0, size = 20): Promise<SpringPage<AdminUserRow>> {
    const { data } = await api.get<ApiResponse<SpringPage<AdminUserRow>>>(
      `/admin/users?page=${page}&size=${size}`
    );
    return data.data;
  },
};
