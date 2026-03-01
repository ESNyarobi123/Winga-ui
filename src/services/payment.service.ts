import { api } from "@/lib/axios";

export const paymentService = {
  async createEscrow(jobId: string, amount: number) {
    const { data } = await api.post<{ escrowId: string }>("/payments/escrow", {
      jobId,
      amount,
    });
    return data;
  },

  async releaseEscrow(escrowId: string) {
    await api.post(`/payments/escrow/${escrowId}/release`);
  },

  async getPayoutHistory(params?: { page?: number; limit?: number }) {
    const { data } = await api.get("/payments/payouts", { params });
    return data;
  },
};
