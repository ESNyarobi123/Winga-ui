import { api } from "@/lib/axios";
import type { ApiResponse } from "@/types/api-response";

export interface SubscriptionStatus {
  id: number;
  planId: string;
  status: string;
  startsAt: string;
  endsAt: string;
  active: boolean;
}

export const subscriptionService = {
  async getMySubscription(): Promise<SubscriptionStatus | null> {
    try {
      const { data } = await api.get<ApiResponse<SubscriptionStatus | null>>("/subscription/me");
      return data.data ?? null;
    } catch {
      return null;
    }
  },
};
