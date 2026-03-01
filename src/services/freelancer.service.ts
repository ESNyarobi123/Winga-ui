import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api-response";

export interface FreelancerDashboard {
  balance: number;
  totalEarned: number;
  currency: string;
  activeContractsCount: number;
  pendingProposalsCount: number;
}

export const freelancerService = {
  async getDashboard(): Promise<FreelancerDashboard> {
    const { data } = await api.get<ApiResponse<FreelancerDashboard>>("/freelancer/dashboard");
    return data.data;
  },
};
