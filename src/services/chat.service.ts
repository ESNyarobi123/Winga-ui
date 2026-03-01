import { api } from "@/lib/axios";
import type { ApiResponse, SpringPage } from "@/types/api-response";

export interface ChatMessageItem {
  id: number;
  jobId: number | null;
  contractId: number | null;
  sender: { id: number; fullName?: string };
  receiver: { id: number; fullName?: string };
  content: string;
  messageType: string;
  attachmentUrl: string | null;
  isRead: boolean;
  timestamp: string;
}

export interface SendMessageBody {
  content: string;
  messageType?: string;
  attachmentUrl?: string;
  receiverId?: number;
}

export const chatService = {
  async getContractMessages(contractId: string, params?: { page?: number; size?: number }) {
    const { data } = await api.get<ApiResponse<SpringPage<ChatMessageItem>>>(
      `/chat/contracts/${contractId}/messages`,
      { params: { page: params?.page ?? 0, size: params?.size ?? 50 } }
    );
    return data.data;
  },

  async sendContractMessage(contractId: string, receiverId: number, body: SendMessageBody) {
    const { data } = await api.post<ApiResponse<ChatMessageItem>>(
      `/chat/contracts/${contractId}/messages`,
      { content: body.content, messageType: body.messageType ?? "TEXT", attachmentUrl: body.attachmentUrl ?? null },
      { params: { receiverId } }
    );
    return data.data;
  },

  async markContractRead(contractId: string) {
    await api.post(`/chat/contracts/${contractId}/read`);
  },

  async unreadCount(): Promise<number> {
    const { data } = await api.get<ApiResponse<number>>("/chat/unread-count");
    return Number(data.data ?? 0);
  },

  async getJobMessages(jobId: string, otherUserId: number, params?: { page?: number; size?: number }) {
    const { data } = await api.get<ApiResponse<SpringPage<ChatMessageItem>>>(
      `/chat/jobs/${jobId}/messages`,
      { params: { otherUserId, page: params?.page ?? 0, size: params?.size ?? 50 } }
    );
    return data.data;
  },

  async sendJobMessage(jobId: string, receiverId: number, body: SendMessageBody) {
    const { data } = await api.post<ApiResponse<ChatMessageItem>>(
      `/chat/jobs/${jobId}/messages`,
      { content: body.content, messageType: body.messageType ?? "TEXT", attachmentUrl: body.attachmentUrl ?? null },
      { params: { receiverId } }
    );
    return data.data;
  },

  async markJobRead(jobId: string) {
    await api.post(`/chat/jobs/${jobId}/read`);
  },
};
