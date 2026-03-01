import { api } from "@/lib/axios";
import type { ApiResponse, SpringPage } from "@/types/api-response";

export interface WalletBalance {
  id: number;
  balance: number;
  currency: string;
  totalEarned: number;
  totalSpent: number;
  lastUpdatedAt: string;
}

export interface TransactionItem {
  id: number;
  transactionType: string;
  amount: number;
  description?: string;
  createdAt: string;
}

export const walletService = {
  async getBalance() {
    const { data } = await api.get<ApiResponse<WalletBalance>>("/wallet/balance");
    return data.data;
  },

  async getTransactions(params?: { page?: number; size?: number }) {
    const { data } = await api.get<ApiResponse<SpringPage<TransactionItem>>>("/wallet/transactions", {
      params: { page: params?.page ?? 0, size: params?.size ?? 20 },
    });
    return data.data;
  },
};
