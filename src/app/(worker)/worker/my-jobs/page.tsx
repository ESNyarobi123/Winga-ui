"use client";

import { useState, useEffect } from "react";
import { BookmarkCheck } from "lucide-react";
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

/** Sample for Applied tab – like image (OF Chatter PH, Verified Employer OF Chatter, etc.) */
const appliedJobsSample: AppliedCard[] = [
    {
        id: "1",
        title: "OF Chatter PH",
        type: "Full-time",
        postedAt: "February 27, 2026",
        salary: "$2 hourly & 3",
        tags: [{ icon: "🐦", label: "OnlyFans" }, { icon: "💬", label: "Chatting" }, { icon: "🇬🇧", label: "English" }],
        status: "applied",
        isVerified: false,
    },
    {
        id: "2",
        title: "OF Chatter (PH)",
        type: "Full-time",
        postedAt: "February 27, 2026",
        salary: "$2 monthly & 3",
        tags: [{ icon: "🐦", label: "OnlyFans" }, { icon: "💬", label: "Chatting" }, { icon: "🇬🇧", label: "English" }],
        status: "applied",
        isVerified: true,
    },
];

/** Sample for Hired tab */
const hiredJobsSample: ContractSummary[] = [
    { id: 1, jobId: 1, jobTitle: "OF Chatter PH", status: "ACTIVE", totalAmount: 500, escrowAmount: 250, createdAt: "2026-02-27" },
    { id: 2, jobId: 2, jobTitle: "Social Media Video Editor", status: "ACTIVE", totalAmount: 700, escrowAmount: 350, createdAt: "2026-02-26" },
];

type Tab = "applied" | "hired";

type AppliedCard = {
    id: string;
    title: string;
    type: string;
    postedAt: string;
    salary: string;
    tags: { icon: string; label: string }[];
    status: string;
    isVerified?: boolean;
};

function contractStatusLabel(status: string, t: (key: string) => string) {
    const key = `status.contract.${status}`;
    const label = t(key);
    return key === label ? status : label;
}

export default function WorkerMyJobsPage() {
    const t = useT();
    const [activeTab, setActiveTab] = useState<Tab>("applied");
    const [currentPage, setCurrentPage] = useState(1);
    const [proposals, setProposals] = useState<ProposalItem[]>([]);
    const [contracts, setContracts] = useState<ContractSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [useSample, setUseSample] = useState(false);

    useEffect(() => {
        setLoading(true);
        if (activeTab === "applied") {
            proposalService.getMyProposals({ size: 50 })
                .then((res) => {
                    const list = res?.content ?? [];
                    if (list.length > 0) {
                        setProposals(list);
                        setUseSample(false);
                    } else {
                        setProposals([]);
                        setUseSample(true);
                    }
                })
                .catch(() => { setProposals([]); setUseSample(true); })
                .finally(() => setLoading(false));
        } else {
            contractService.getMyContracts({ size: 50 })
                .then((res) => {
                    const list = res?.content ?? [];
                    if (list.length > 0) {
                        setContracts(list);
                        setUseSample(false);
                    } else {
                        setContracts([]);
                        setUseSample(true);
                    }
                })
                .catch(() => { setContracts([]); setUseSample(true); })
                .finally(() => setLoading(false));
        }
    }, [activeTab]);

    const displayedProposals: (ProposalItem | AppliedCard)[] = useSample && activeTab === "applied" ? appliedJobsSample : proposals;
    const displayedContracts: ContractSummary[] = useSample && activeTab === "hired" ? hiredJobsSample : contracts;
    const showProposals = activeTab === "applied";
    const listLength = showProposals ? (Array.isArray(displayedProposals) ? displayedProposals.length : 0) : displayedContracts.length;
    const totalPages = Math.max(1, Math.ceil(listLength / 5));

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-[900px] mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-foreground mb-5">{t("dashboard.myJobs")}</h1>

                <Tabs
                    selectedKey={activeTab}
                    onSelectionChange={(k) => { setActiveTab(k as Tab); setCurrentPage(1); }}
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
                            ) : (Array.isArray(displayedProposals) ? displayedProposals : []).length === 0 ? (
                                <div className="text-center py-20 text-default-500">
                                    <p className="text-base">{t("dashboard.noApplications")}</p>
                                </div>
                            ) : (
                                (Array.isArray(displayedProposals) ? displayedProposals : []).map((p) => {
                                    const isSample = "title" in p && "tags" in p;
                                    const title = "jobTitle" in p ? String(p.jobTitle) : "title" in p ? String(p.title) : "";
                                    const typeStr = "type" in p ? String(p.type) : null;
                                    const postedStr = "postedAt" in p ? String(p.postedAt) : "createdAt" in p ? String((p as ProposalItem).createdAt).slice(0, 10) : "";
                                    const salaryStr = "salary" in p ? String(p.salary) : "bidAmount" in p ? `TZS ${Number((p as ProposalItem).bidAmount).toLocaleString()}` : "";
                                    const tagsList = "tags" in p ? (p as AppliedCard).tags : [];
                                    const isVerified = "isVerified" in p && (p as AppliedCard).isVerified;
                                    return (
                                        <Card key={"id" in p ? String(p.id) : ""} className="border border-default-200 hover:border-primary/30 transition-all" shadow="sm">
                                            <CardBody className="p-5">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1 min-w-0">
                                                        {isVerified && (
                                                            <div className="flex items-center gap-1.5 mb-1.5">
                                                                <span className="text-[13px] text-default-500 font-medium">Verified Employer</span>
                                                                <span className="text-primary text-sm">✔</span>
                                                            </div>
                                                        )}
                                                        <div className="flex flex-wrap items-center gap-3 mb-1">
                                                            <h2 className="text-lg font-bold text-foreground">{title}</h2>
                                                            {typeStr && <Chip size="sm" color="primary" variant="flat">{typeStr}</Chip>}
                                                            {postedStr && <span className="text-[13px] text-default-400">Posted {postedStr}</span>}
                                                        </div>
                                                        {salaryStr && <p className="text-[13.5px] text-default-500 font-medium mb-2">{salaryStr}</p>}
                                                        {tagsList.length > 0 && (
                                                            <div className="flex flex-wrap gap-2">
                                                                {tagsList.map((tag) => (
                                                                    <Chip key={tag.label} size="sm" color="primary" variant="flat" startContent={tag.icon}>{tag.label}</Chip>
                                                                ))}
                                                            </div>
                                                        )}
                                                        {!isSample && "status" in p && <p className="text-[13px] text-default-400 mt-1">{t("dashboard.statusLabel")}: {String(p.status)}</p>}
                                                    </div>
                                                    <Button isIconOnly color="primary" size="lg" aria-label="Saved">
                                                        <BookmarkCheck className="w-4 h-4 text-primary-foreground" strokeWidth={2.5} />
                                                    </Button>
                                                </div>
                                            </CardBody>
                                        </Card>
                                    );
                                })
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
                            ) : displayedContracts.length === 0 ? (
                                <div className="text-center py-20 text-default-500">
                                    <p className="text-base">{t("dashboard.noActiveContracts")}</p>
                                </div>
                            ) : (
                                displayedContracts.map((c) => (
                                    <Card key={c.id} className="border border-default-200 hover:border-primary/30 transition-all" shadow="sm">
                                        <CardBody className="p-5">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <h2 className="text-lg font-bold text-foreground">{c.jobTitle}</h2>
                                                    <p className="text-[13.5px] text-default-500 font-medium mt-1">TZS {Number(c.totalAmount).toLocaleString()}</p>
                                                    <p className="text-[13px] text-default-400 mt-1">{t("dashboard.statusLabel")}: {contractStatusLabel(c.status, t)}{c.status === "COMPLETED" ? ` · ${t("status.paymentReleased")}` : ""} · {String(c.createdAt).slice(0, 10)}</p>
                                                </div>
                                                <Button isIconOnly color="primary" size="lg" aria-label="Saved">
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

                {!loading && listLength > 0 && totalPages > 1 && (
                    <div className="flex justify-center mt-8">
                        <Pagination total={totalPages} page={currentPage} onChange={setCurrentPage} color="primary" showControls size="sm" />
                    </div>
                )}
            </div>
        </div>
    );
}
