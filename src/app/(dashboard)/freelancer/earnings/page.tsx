"use client";

import { useState, useEffect } from "react";
import { freelancerService } from "@/services/freelancer.service";
import { walletService } from "@/services/wallet.service";
import type { FreelancerDashboard } from "@/services/freelancer.service";
import type { TransactionItem } from "@/services/wallet.service";

export default function FreelancerEarningsPage() {
  const [dashboard, setDashboard] = useState<FreelancerDashboard | null>(null);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      freelancerService.getDashboard().then(setDashboard).catch(() => setDashboard(null)),
      walletService.getTransactions({ size: 20 }).then((p) => setTransactions(p?.content ?? [])).catch(() => setTransactions([])),
    ]).finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Earnings</h1>
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  const d = dashboard;
  const currency = d?.currency ?? "TZS";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Earnings</h1>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Available balance</p>
          <p className="text-2xl font-bold">
            {d != null ? `${currency} ${Number(d.balance).toLocaleString()}` : "—"}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Total earned</p>
          <p className="text-2xl font-bold">
            {d != null ? `${currency} ${Number(d.totalEarned).toLocaleString()}` : "—"}
          </p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Active contracts</p>
          <p className="text-2xl font-bold">{d != null ? d.activeContractsCount : "—"}</p>
        </div>
        <div className="rounded-xl border bg-card p-5">
          <p className="text-sm text-muted-foreground mb-1">Pending proposals</p>
          <p className="text-2xl font-bold">{d != null ? d.pendingProposalsCount : "—"}</p>
        </div>
      </div>

      {/* Recent transactions */}
      <div className="rounded-xl border bg-card overflow-hidden">
        <h2 className="text-lg font-semibold p-4 border-b">Recent transactions</h2>
        {transactions.length === 0 ? (
          <p className="p-6 text-muted-foreground text-sm">No transactions yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Amount</th>
                  <th className="text-left p-3 font-medium">Description</th>
                  <th className="text-left p-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx.id} className="border-b last:border-0">
                    <td className="p-3">{tx.transactionType}</td>
                    <td className="p-3 font-medium">
                      {currency} {Number(tx.amount).toLocaleString()}
                    </td>
                    <td className="p-3 text-muted-foreground">{tx.description ?? "—"}</td>
                    <td className="p-3 text-muted-foreground">
                      {tx.createdAt ? new Date(tx.createdAt).toLocaleString() : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
