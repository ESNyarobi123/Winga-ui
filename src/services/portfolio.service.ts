import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api-response";

export interface PortfolioItem {
  id: number;
  type: string;
  url: string;
  title?: string;
  description?: string;
  sortOrder: number;
  moderationStatus: string;
  createdAt: string;
}

export const portfolioService = {
  async getMyPortfolio(): Promise<PortfolioItem[]> {
    const { data } = await api.get<ApiResponse<PortfolioItem[]>>("/portfolio/me");
    return data.data ?? [];
  },

  async getByUserId(userId: string | number): Promise<PortfolioItem[]> {
    const { data } = await api.get<ApiResponse<PortfolioItem[]>>(`/portfolio/user/${userId}`);
    return data.data ?? [];
  },
};
