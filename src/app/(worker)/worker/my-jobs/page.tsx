"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { BookmarkCheck, Briefcase, FileCheck } from "lucide-react";
import { Tabs, Tab } from "@heroui/tabs";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Skeleton } from "@heroui/skeleton";
import { Pagination } from "@heroui/pagination";
import { contractService } from "@/services/contract.service";
import { proposalService } from "@/services/proposal.service";
import type { ContractSummary } from "@/services/contract.service";
import type { ProposalItem } from "@/services/proposal.service";
import { useT } from "@/lib/i18n";

type TabKey = "applied" | "hired";

function contractStatusLabel(status: string, t: (key: string) => string) {
    const key = `status.contract.${status}`;
    const label = t(key);
    return key === label ? status : label;
}

const PAGE_SIZE = 10;

export default function WorkerMyJobsPage() {
    const t = useT();
    const [activeTab, setActiveTab] = useState<TabKey>("applied");
    const [currentPage, setCurrentPage] = useState(1);
    const [proposals, setProposals] = useState<ProposalItem[]>([]);
    const [contracts, setContracts] = useState<ContractSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        if (activeTab === "applied") {
            proposalService.getMyProposals({ size: 100 })
                .then((res) => setProposals(res?.content ?? []))
                .catch(() => {
                    setProposals([]);
                    setError("Could not load applications.");
                })
                .finally(() => setLoading(false));
        } else {
            contractService.getMyContracts({ size: 100 })
                .then((res) => setContracts(res?.content ?? []))
                .catch(() => {
                    setContracts([]);
                    setError("Could not load contracts.");
                })
                .finally(() => setLoading(false));
        }
    }, [activeTab]);

    const paginatedProposals = proposals.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    const paginatedContracts = contracts.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    const totalPagesApplied = Math.max(1, Math.ceil(proposals.length / PAGE_SIZE));
    const totalPagesHired = Math.max(1, Math.ceil(contracts.length / PAGE_SIZE));

    return (
        <div className="min-h-screen bg-gradient-to-b from-default-50 to-background">
            <div className="max-w-[900px] mx-auto px-4 sm:px-6 py-8">
                <div className="flex items-center gap-2 text-primary mb-1">
                    <Briefcase className="w-6 h-6" />
                    <span className="text-sm font-semibold uppercase tracking-wide">Dashboard</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-1">{t("dashboard.myJobs")}</h1>
                <p className="text-default-500 text-[15px] mb-6">Applications you’ve submitted and contracts you’re hired for.</p>

                {error && (
                    <div className="mb-6 p-4 rounded-xl bg-danger-50 dark:bg-danger-500/10 border border-danger-200 dark:border-danger-500/30 text-danger-700 dark:text-danger-400 text-sm">
                        {error}
                    </div>
                )}

                <Tabs
                    selectedKey={activeTab}
                    onSelectionChange={(k) => { setActiveTab(k as TabKey); setCurrentPage(1); }}
                    color="primary"
                    variant="solid"
                    classNames={{ tabList: "gap-2 mb-6" }}
                >
                    <Tab key="applied" title={t("dashboard.applied")}>
                        <div className="space-y-4 pt-2">
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton key={i} className="rounded-2xl h-32 w-full" />
                                    ))}
                                </div>
                            ) : proposals.length === 0 ? (
                                <div className="rounded-2xl border-2 border-dashed border-default-200 dark:border-default-100 p-12 text-center">
                                    <FileCheck className="w-12 h-12 text-default-300 mx-auto mb-3" />
                                    <p className="text-base font-medium text-foreground mb-1">{t("dashboard.noApplications")}</p>
                                    <p className="text-sm text-default-500">Apply to jobs from Find jobs to see them here.</p>
                                </div>
                            ) : (
                                paginatedProposals.map((p) => (
                                    <Link key={p.id} href={`/worker/find-jobs/${p.jobId}`} className="block">
                                        <Card className="border border-default-200 hover:border-primary/30 transition-all cursor-pointer" shadow="sm">
                                            <CardBody className="p-5">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex flex-wrap items-center gap-3 mb-1">
                                                            <h2 className="text-lg font-bold text-foreground">{p.jobTitle}</h2>
                                                            <Chip size="sm" color="primary" variant="flat">{p.status}</Chip>
                                                            <span className="text-[13px] text-default-400">{String(p.createdAt).slice(0, 10)}</span>
                                                        </div>
                                                        <p className="text-[13.5px] text-default-500 font-medium mb-2">TZS {Number(p.bidAmount).toLocaleString()}</p>
                                                        <p className="text-[13px] text-default-400">{t("dashboard.statusLabel")}: {p.status}</p>
                                                    </div>
                                                    <Button isIconOnly color="primary" size="lg" aria-label="View job" className="shrink-0">
                                                        <BookmarkCheck className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
                                                    </Button>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    </Link>
                                ))
                            )}
                        </div>
                    </Tab>
                    <Tab key="hired" title={t("dashboard.hired")}>
                        <div className="space-y-4 pt-2">
                            {loading ? (
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <Skeleton key={i} className="rounded-2xl h-32 w-full" />
                                    ))}
                                </div>
                            ) : contracts.length === 0 ? (
                                <div className="rounded-2xl border-2 border-dashed border-default-200 dark:border-default-100 p-12 text-center">
                                    <Briefcase className="w-12 h-12 text-default-300 mx-auto mb-3" />
                                    <p className="text-base font-medium text-foreground mb-1">{t("dashboard.noActiveContracts")}</p>
                                    <p className="text-sm text-default-500">When a client hires you, the contract will appear here.</p>
                                </div>
                            ) : (
                                paginatedContracts.map((c) => (
                                    <Card key={c.id} className="border border-default-200 hover:border-primary/30 transition-all" shadow="sm">
                                        <CardBody className="p-5">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <h2 className="text-lg font-bold text-foreground">{c.jobTitle}</h2>
                                                    <p className="text-[13.5px] text-default-500 font-medium mt-1">TZS {Number(c.totalAmount).toLocaleString()}</p>
                                                    <p className="text-[13px] text-default-400 mt-1">{t("dashboard.statusLabel")}: {contractStatusLabel(c.status, t)}{c.status === "COMPLETED" ? ` · ${t("status.paymentReleased")}` : ""} · {String(c.createdAt).slice(0, 10)}</p>
                                                </div>
                                                <Button isIconOnly color="primary" size="lg" aria-label="Contract" className="shrink-0">
                                                    <BookmarkCheck className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
                                                </Button>
                                            </div>
                                        </CardBody>
                                    </Card>
                                ))
                            )}
                        </div>
                    </Tab>
                </Tabs>

                {!loading && activeTab === "applied" && totalPagesApplied > 1 && (
                    <div className="flex justify-center mt-8">
                        <Pagination total={totalPagesApplied} page={currentPage} onChange={setCurrentPage} color="primary" showControls size="sm" />
                    </div>
                )}
                {!loading && activeTab === "hired" && totalPagesHired > 1 && (
                    <div className="flex justify-center mt-8">
                        <Pagination total={totalPagesHired} page={currentPage} onChange={setCurrentPage} color="primary" showControls size="sm" />
                    </div>
                )}
            </div>
        </div>
    );
}
