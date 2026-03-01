import { api } from "@/lib/axios";
import type { ApiResponse, SpringPage } from "@/types/api-response";

/** Matches backend ContractResponse for list/dashboard */
export interface ContractSummary {
  id: number;
  jobId: number;
  jobTitle: string;
  status: string;
  totalAmount: number;
  escrowAmount: number;
  createdAt: string;
  client?: { id: number; fullName?: string };
  freelancer?: { id: number; fullName?: string };
}

export const contractService = {
  async getMyContracts(params?: { page?: number; size?: number }) {
    const { data } = await api.get<ApiResponse<SpringPage<ContractSummary>>>("/freelancer/my-contracts", {
      params: { page: params?.page ?? 0, size: params?.size ?? 20 },
    });
    return data.data;
  },

  async getContract(id: string) {
    const { data } = await api.get<ApiResponse<ContractSummary>>(`/contracts/${id}`);
    return data.data;
  },

  /** Client: contracts I created (CLIENT role) */
  async getClientContracts(params?: { page?: number; size?: number }) {
    const { data } = await api.get<ApiResponse<SpringPage<ContractSummary>>>("/contracts/client/my-contracts", {
      params: { page: params?.page ?? 0, size: params?.size ?? 20 },
    });
    return data.data;
  },

  /** Client: hire freelancer from proposal (creates contract, locks escrow) */
  async hire(proposalId: number | string): Promise<ContractSummary> {
    const { data } = await api.post<ApiResponse<ContractSummary>>(`/contracts/hire/${proposalId}`);
    return data.data;
  },
};
