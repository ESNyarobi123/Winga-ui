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

/** Active subscription plan (public list for freelancers). */
export interface SubscriptionPlan {
  id: number;
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  durationDays: number;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
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

  /** List active subscription plans (public, no auth). */
  async getPlans(): Promise<SubscriptionPlan[]> {
    try {
      const { data } = await api.get<ApiResponse<SubscriptionPlan[]>>("/subscription/plans");
      return data.data ?? [];
    } catch {
      return [];
    }
  },
};
