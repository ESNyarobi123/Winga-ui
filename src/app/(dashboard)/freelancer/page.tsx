"use client";

import Link from "next/link";
import { freelancerService } from "@/services/freelancer.service";
import { useState, useEffect } from "react";

export default function FreelancerHomePage() {
  const [stats, setStats] = useState<{ balance: number; totalEarned: number; activeContractsCount: number; pendingProposalsCount: number } | null>(null);

  useEffect(() => {
    freelancerService.getDashboard().then(setStats).catch(() => setStats(null));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-2">Freelancer dashboard</h1>
      <p className="text-muted-foreground mb-6">Manage your work and earnings.</p>
      {stats != null && (
        <div className="flex flex-wrap gap-4 mb-6">
          <span className="text-sm">
            Balance: <strong>{stats.balance.toLocaleString()} TZS</strong>
          </span>
          <span className="text-sm">
            Total earned: <strong>{stats.totalEarned.toLocaleString()} TZS</strong>
          </span>
          <span className="text-sm">Active contracts: <strong>{stats.activeContractsCount}</strong></span>
          <span className="text-sm">Pending proposals: <strong>{stats.pendingProposalsCount}</strong></span>
        </div>
      )}
      <div className="flex flex-wrap gap-3">
        <Link href="/freelancer/earnings" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          View earnings
        </Link>
        <Link href="/worker/my-jobs" className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">
          My jobs
        </Link>
        <Link href="/chat" className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-muted">
          Messages
        </Link>
      </div>
    </div>
  );
}
