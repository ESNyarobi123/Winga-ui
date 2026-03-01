import { api } from "@/lib/axios";
import type { ApiResponse, SpringPage } from "@/types/api-response";

export interface ProposalItem {
  id: number;
  jobId: number;
  jobTitle: string;
  freelancer?: { id: number; fullName?: string };
  coverLetter: string;
  bidAmount: number;
  estimatedDuration: string;
  status: string;
  createdAt: string;
}

export const proposalService = {
  async getMyProposals(params?: { page?: number; size?: number }) {
    const { data } = await api.get<ApiResponse<SpringPage<ProposalItem>>>("/freelancer/my-proposals", {
      params: { page: params?.page ?? 0, size: params?.size ?? 20 },
    });
    return data.data;
  },

  async getJobApplicants(jobId: string, params?: { page?: number; size?: number }) {
    const { data } = await api.get<ApiResponse<SpringPage<ProposalItem>>>(
      `/proposals/jobs/${jobId}/applicants`,
      { params: { page: params?.page ?? 0, size: params?.size ?? 20 } }
    );
    return data.data;
  },

  async submitProposal(jobId: string, body: { coverLetter: string; bidAmount: number; estimatedDuration: string }) {
    const { data } = await api.post<ApiResponse<ProposalItem>>(`/proposals/jobs/${jobId}`, body);
    return data.data;
  },
};
