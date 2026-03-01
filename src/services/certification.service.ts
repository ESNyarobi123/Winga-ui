import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api-response";

export interface CertificationItem {
  id: number;
  name: string;
  issuer?: string;
  fileUrl: string;
  issuedAt?: string;
  moderationStatus: string;
  createdAt: string;
}

export const certificationService = {
  async getMyCertifications(): Promise<CertificationItem[]> {
    const { data } = await api.get<ApiResponse<CertificationItem[]>>("/certifications/me");
    return data.data ?? [];
  },

  async getByUserId(userId: string | number): Promise<CertificationItem[]> {
    const { data } = await api.get<ApiResponse<CertificationItem[]>>(`/certifications/user/${userId}`);
    return data.data ?? [];
  },
};
