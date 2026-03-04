"use client";

import { useState } from "react";
import { Info, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

// Sample data so the page looks complete (like reference image)
const SAMPLE_STATS = { totalCommissions: 0, activeCodes: 0, pendingPayments: 0, paid: 0 };
const SAMPLE_CODES: any[] = [];
const SAMPLE_PAYMENTS: any[] = [];

export default function ClientAffiliatesPage() {
    const [useSampleData] = useState(true); // Toggle to false when API is wired
    const totalCommissions = useSampleData ? SAMPLE_STATS.totalCommissions : 0;
    const activeCodes = useSampleData ? SAMPLE_STATS.activeCodes : 0;
    const pendingPayments = useSampleData ? SAMPLE_STATS.pendingPayments : 0;
    const paid = useSampleData ? SAMPLE_STATS.paid : 0;
    const payments = useSampleData ? SAMPLE_PAYMENTS : [];
    const codes = useSampleData ? SAMPLE_CODES : [];

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <div className="max-w-[1000px] mx-auto px-6 py-8 space-y-8">
                <div>
                    <h1 className="text-[20px] font-bold text-[#111827] mb-1">
                        Referral Analytics
                    </h1>
                    <p className="text-[13px] text-[#888] font-medium">
                        Comprehensive insights into your affiliate performance
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-sm">
                        <h3 className="text-[13px] font-bold text-[#333] mb-1">Total Commissions</h3>
                        <div className="text-[28px] font-extrabold text-[#111827] mb-1">
                            Tsh {totalCommissions.toFixed(2)}
                        </div>
                        <p className="text-[11px] text-[#888] font-medium">
                            {totalCommissions ? "12% — Commission earned" : "0% — Commission earned"}
                        </p>
                    </div>
                    <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-sm">
                        <h3 className="text-[13px] font-bold text-[#333] mb-1">Active Codes</h3>
                        <div className="text-[28px] font-extrabold text-[#111827] mb-1">{activeCodes}</div>
                        <p className="text-[11px] text-[#888] font-medium">Referral codes created</p>
                    </div>
                    <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-sm">
                        <h3 className="text-[13px] font-bold text-[#333] mb-1">Pending Payments</h3>
                        <div className="text-[28px] font-extrabold text-[#111827] mb-1">Tsh {pendingPayments.toFixed(2)}</div>
                        <p className="text-[11px] text-[#888] font-medium">Paid: Tsh {paid.toFixed(2)}</p>
                    </div>
                </div>

                <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-sm min-h-[220px] flex flex-col">
                    <h3 className="text-[15px] font-bold text-[#111827] mb-1">Monthly Referral Performance</h3>
                    <p className="text-[12px] text-[#888] mb-6">Revenue and commission trends over time</p>
                    <div className="flex-1 flex items-center justify-center text-[#999] text-[13px] font-medium">
                        No data available
                    </div>
                </div>

                <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6 shadow-sm min-h-[160px] flex flex-col">
                    <h3 className="text-[15px] font-bold text-[#111827] mb-1">Top Performing Codes</h3>
                    <p className="text-[12px] text-[#888] mb-4">Your best referral codes by revenue</p>
                    {codes.length > 0 ? (
                        <div className="flex flex-wrap gap-4">
                            {codes.map((c, i) => (
                                <div key={i} className="px-4 py-3 bg-[#fafafa] border border-[#E8E8E8] rounded-xl">
                                    <span className="font-mono font-bold text-[#006e42]">{c.code}</span>
                                    <span className="text-[12px] text-[#666] ml-2">· {c.uses} uses · {c.revenue}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-[#999] text-[13px] font-medium">No data available</div>
                    )}
                </div>

                <div className="flex items-start justify-between">
                    <div>
                        <h2 className="text-[16px] font-bold text-[#111827] mb-1">Referral Codes</h2>
                        <p className="text-[13px] text-[#888] font-medium">Create and manage your referral codes</p>
                    </div>
                    <button className="px-5 py-2.5 bg-[#006e42] hover:bg-[#005c36] text-white text-[13.5px] font-bold rounded-xl transition-colors shadow-sm">
                        Add Code
                    </button>
                </div>

                <div className="mt-12 space-y-4">
                    <div>
                        <h2 className="text-[16px] font-bold text-[#111827] mb-1">Referral Payments</h2>
                        <p className="text-[13px] text-[#888] font-medium">Track payments from your referral codes</p>
                    </div>

                    <div className="bg-white border border-[#E8E8E8] rounded-2xl shadow-sm overflow-hidden">
                        <table className="w-full text-left text-[13px]">
                            <thead className="bg-[#fafafa] border-b border-[#E8E8E8] text-[#555] font-semibold">
                                <tr>
                                    <th className="px-5 py-3.5">Created</th>
                                    <th className="px-5 py-3.5">Referral Code</th>
                                    <th className="px-5 py-3.5">
                                        Commission <Info className="w-3.5 h-3.5 inline-block text-[#999] -mt-0.5 ml-0.5" />
                                    </th>
                                    <th className="px-5 py-3.5">Payment Status</th>
                                    <th className="px-5 py-3.5">Withdrawn</th>
                                </tr>
                            </thead>
                            <tbody>
                                {payments.length > 0 ? (
                                    payments.map((row, i) => (
                                        <tr key={i} className="border-b border-[#f0f0f0] hover:bg-[#fafafa]">
                                            <td className="px-5 py-3.5 text-[#555]">{row.created}</td>
                                            <td className="px-5 py-3.5 font-mono font-semibold text-[#006e42]">{row.referralCode}</td>
                                            <td className="px-5 py-3.5">{row.commission}</td>
                                            <td className="px-5 py-3.5">
                                                <span className={row.status === "Paid" ? "text-[#006e42] font-semibold" : "text-[#f59e0b]"}>{row.status}</span>
                                            </td>
                                            <td className="px-5 py-3.5 text-[#666]">{row.withdrawn}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="text-center py-16 text-[#888] font-medium">No payments yet</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <div className="flex items-center justify-between px-5 py-3 border-t border-[#E8E8E8] bg-[#fafafa] text-[12px] text-[#666]">
                            <span>Showing {payments.length} payments</span>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span>Payment referrals per page:</span>
                                    <button className="flex items-center justify-between w-[60px] px-2 py-1.5 border border-[#E0E0E0] rounded-lg bg-white">
                                        <span>50</span>
                                        <ChevronDown className="w-3.5 h-3.5 text-[#999]" />
                                    </button>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button className="p-1.5 rounded-full hover:bg-white text-[#006e42] disabled:opacity-40" disabled={payments.length <= 0}>
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <span className="w-6 h-6 flex items-center justify-center text-[12px] font-bold">1</span>
                                    <button className="p-1.5 rounded-full hover:bg-white text-[#006e42] disabled:opacity-40" disabled={payments.length <= 0}>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
