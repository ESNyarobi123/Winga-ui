import { api } from "@/lib/axios";
import type { ApiResponse, SpringPage } from "@/types/api-response";

export interface NotificationItem {
  id: number;
  type: string;
  title: string;
  message: string;
  actionUrl: string | null;
  isRead: boolean;
  referenceId: string | null;
  referenceType: string | null;
  createdAt: string;
}

export const notificationService = {
  async list(params?: { page?: number; size?: number }) {
    const { data } = await api.get<ApiResponse<SpringPage<NotificationItem>>>("/notifications", {
      params: { page: params?.page ?? 0, size: params?.size ?? 20 },
    });
    return data.data;
  },

  async unreadCount(): Promise<number> {
    const { data } = await api.get<ApiResponse<number>>("/notifications/unread-count");
    return data.data ?? 0;
  },

  async markAsRead(id: number) {
    await api.patch(`/notifications/${id}/read`);
  },

  async markAllAsRead(): Promise<number> {
    const { data } = await api.patch<ApiResponse<number>>("/notifications/read-all");
    return data.data ?? 0;
  },
};
