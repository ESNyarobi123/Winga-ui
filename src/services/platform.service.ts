import { api } from "@/lib/axios";

export type PlatformConfig = {
  commissionRatePercent: number;
  currency: string;
  subscriptionRequiredForBid: boolean;
};

export const platformService = {
  async getConfig(): Promise<PlatformConfig | null> {
    try {
      const res = await api.get<{ success: boolean; data?: PlatformConfig }>("/platform/config");
      return res.data?.data ?? null;
    } catch {
      return { commissionRatePercent: 15, currency: "TZS", subscriptionRequiredForBid: true };
    }
  },
};
