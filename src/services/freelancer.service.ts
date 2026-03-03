import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api-response";

export interface FreelancerDashboard {
  balance: number;
  totalEarned: number;
  currency: string;
  activeContractsCount: number;
  pendingProposalsCount: number;
}

/** One test with worker's result (from GET /freelancer/my-test-results) */
export interface WorkerTestResultItem {
  testId: number;
  testName: string;
  testSlug: string;
  testType: string;
  minScore: number;
  maxScore: number;
  maxAttempts: number;
  attemptsCount: number;
  bestScore: number | null;
  status: string;
  completedAt: string | null;
  addedToProfile: boolean;
}

export const freelancerService = {
  async getDashboard(): Promise<FreelancerDashboard> {
    const { data } = await api.get<ApiResponse<FreelancerDashboard>>("/freelancer/dashboard");
    return data.data;
  },

  async getMyTestResults(): Promise<WorkerTestResultItem[]> {
    const { data } = await api.get<ApiResponse<WorkerTestResultItem[]>>("/freelancer/my-test-results");
    return data.data ?? [];
  },

  async submitTestScore(testId: number, score: number): Promise<WorkerTestResultItem> {
    const { data } = await api.post<ApiResponse<WorkerTestResultItem>>(
      `/freelancer/tests/${testId}/submit`,
      { score }
    );
    return data.data;
  },
};
