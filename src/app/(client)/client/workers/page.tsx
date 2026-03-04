"use client";

import { useState, useEffect } from "react";
import { Search, ChevronDown, ChevronLeft, ChevronRight, RotateCcw, BadgeCheck, CheckCircle } from "lucide-react";
import { Drawer, DrawerContent } from "@heroui/drawer";
import { workerService } from "@/services/worker.service";
import { WorkerDetailPanel } from "@/components/features/workers/worker-detail-panel";
import type { WorkerListItem } from "@/types";

const FILTER_LABELS = [
    "Employment Type",
    "Skills",
    "Software",
    "Social Media",
    "Payment",
    "Country",
    "Language",
    "Gender",
];

export default function ClientFindWorkersPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [workers, setWorkers] = useState<WorkerListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [completeProfileOnly, setCompleteProfileOnly] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState<WorkerListItem | null>(null);

    useEffect(() => {
        setLoading(true);
        workerService
            .getWorkers({
                page,
                size: 10,
                keyword: searchQuery || undefined,
                profileVerified: verifiedOnly || undefined,
                profileComplete: completeProfileOnly || undefined,
            })
            .then((res) => {
                setWorkers(res?.list ?? []);
                setTotalPages(Math.max(1, res?.totalPages ?? 1));
            })
            .catch(() => {
                setWorkers([]);
                setTotalPages(1);
            })
            .finally(() => setLoading(false));
    }, [page, searchQuery, verifiedOnly, completeProfileOnly]);

    const displayList = workers;
    const currentPage = page + 1;

    return (
        <div className="min-h-screen bg-[#fafafa]">
            {/* Hero: video background nyuma ya "Hire the right person" + search (kama /find-jobs) */}
            <section className="relative z-0 overflow-hidden pt-24 pb-32">
                {/* Background video — same as find-jobs page */}
                <div className="absolute inset-0 -z-10">
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                        aria-hidden
                    >
                        <source src="/find-jobs-green.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-[#0f3224]/50 mix-blend-multiply" />
                </div>

                <div className="container relative z-10 px-4">
                    <h1 className="text-[44px] md:text-[52px] font-extrabold text-center mb-4 text-white drop-shadow-md tracking-tight">
                        Hire the right person
                    </h1>
                    <div className="max-w-[700px] mx-auto relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-[20px] h-[20px] text-[#9ca3af]" />
                        <input
                            type="search"
                            placeholder="Search worker by name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && setPage(0)}
                            className="w-full pl-12 pr-6 h-[60px] rounded-[12px] md:rounded-[50px] bg-white border-0 shadow-[0_8px_30px_rgba(0,0,0,0.06)] text-[17px] font-medium placeholder:text-[#9ca3af] outline-none focus:ring-2 focus:ring-[#006e42] focus:ring-offset-0"
                        />
                    </div>
                </div>

                {/* Wavy SVG (transition to content below - kama find-jobs) */}
                <div className="absolute bottom-0 w-full overflow-hidden leading-[0] z-10">
                    <svg
                        className="relative block w-full h-[40px] md:h-[80px]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                    >
                        <path
                            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C63.26,38.2,148.9,46.07,222.18,48.24,256.32,49.27,290.46,55,321.39,56.44Z"
                            className="fill-[#fafafa]"
                        />
                    </svg>
                </div>
            </section>

            {/* Main Content - image 1 */}
            <div className="max-w-[1000px] mx-auto px-6 py-6">
                {/* Quick filters + filter dropdowns */}
                <div className="flex flex-wrap items-center gap-3 mb-6">
                    <button
                        type="button"
                        onClick={() => setVerifiedOnly((v) => !v)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[14px] font-semibold border shadow-sm transition-all ${verifiedOnly ? "bg-[#006e42] text-white border-[#006e42]" : "bg-white text-[#111827] border-[#E0E0E0] hover:border-[#006e42]/50"}`}
                    >
                        <BadgeCheck className="w-4 h-4" /> Verified only
                    </button>
                    <button
                        type="button"
                        onClick={() => setCompleteProfileOnly((v) => !v)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[14px] font-semibold border shadow-sm transition-all ${completeProfileOnly ? "bg-[#006e42] text-white border-[#006e42]" : "bg-white text-[#111827] border-[#E0E0E0] hover:border-[#006e42]/50"}`}
                    >
                        <CheckCircle className="w-4 h-4" /> Complete profile only
                    </button>
                    {FILTER_LABELS.map((label) => (
                        <button
                            key={label}
                            className="flex items-center justify-between px-4 py-3 bg-white border border-[#E0E0E0] rounded-xl text-[14px] font-semibold text-[#111827] hover:border-[#006e42]/50 hover:shadow-sm transition-all min-w-[120px] shadow-sm"
                        >
                            <span className="truncate mr-2">{label}</span>
                            <ChevronDown className="w-4 h-4 text-[#999] shrink-0" />
                        </button>
                    ))}
                    <button className="flex items-center gap-1.5 text-[13px] font-semibold text-[#666] hover:text-[#006e42] transition-colors ml-auto">
                        <RotateCcw className="w-3.5 h-3.5" /> Clear filters
                    </button>
                </div>

                {/* Worker Cards — from API */}
                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-white border border-[#E8E8E8] rounded-2xl p-6 animate-pulse h-40" />
                        ))}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {displayList.map((worker) => (
                            <div
                                key={worker.id}
                                onClick={() => setSelectedWorker(worker)}
                                className={`cursor-pointer bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row items-stretch justify-between gap-5 ${selectedWorker?.id === worker.id ? "border-[#006e42] ring-2 ring-[#006e42]/20" : "border-[#E8E8E8] hover:border-[#006e42]/25"
                                    }`}
                            >
                                <div className="flex flex-1 gap-4 min-w-0">
                                    <div className="w-14 h-14 rounded-full overflow-hidden flex-shrink-0 bg-gray-200">
                                        <img
                                            src={worker.profileImageUrl || `https://i.pravatar.cc/150?u=${worker.id}`}
                                            alt={worker.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                            <h3 className="text-[17px] font-bold text-[#111827]">
                                                {worker.name}
                                            </h3>
                                            {worker.profileVerified && (
                                                <span className="text-[11px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded flex items-center gap-1">
                                                    <BadgeCheck className="w-3 h-3" /> Verified
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-[13px] text-[#666] mb-1">{worker.location}</p>
                                        <p className="text-[14px] font-semibold text-[#006e42] mb-2">{worker.title}</p>
                                        <p className="text-[13px] text-[#555] leading-relaxed mb-3 max-w-[600px]">
                                            {worker.description}
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {worker.tags.map((tag) => (
                                                <span
                                                    key={tag}
                                                    className="px-3 py-1.5 rounded-full bg-[#eaf5ef] text-[#006e42] text-[12px] font-bold"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center gap-2 md:w-[130px] shrink-0">
                                    <button className="w-full py-2.5 bg-[#006e42] text-white text-[13px] font-bold rounded-lg hover:bg-[#005c36] transition-colors" onClick={(e) => { e.stopPropagation(); console.log("Message"); }}>
                                        Message
                                    </button>
                                    <button className="w-full py-2.5 bg-white border-2 border-[#006e42] text-[#006e42] text-[13px] font-bold rounded-lg hover:bg-[#eaf5ef] transition-colors" onClick={(e) => { e.stopPropagation(); setSelectedWorker(worker); }}>
                                        View profile
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-center gap-1 mt-10">
                    <button
                        onClick={() => setPage((p) => Math.max(0, p - 1))}
                        className="p-2 rounded-full hover:bg-[#eaf5ef] text-[#006e42] disabled:opacity-40"
                        disabled={page <= 0}
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((n) => (
                        <button
                            key={n}
                            onClick={() => setPage(n - 1)}
                            className={`w-9 h-9 rounded-full text-[13px] font-bold transition-colors ${currentPage === n ? "bg-[#006e42] text-white" : "bg-white border-2 border-[#006e42] text-[#006e42] hover:bg-[#eaf5ef]"
                                }`}
                        >
                            {n}
                        </button>
                    ))}
                    {totalPages > 5 && <span className="px-2 text-[#666] text-sm">...</span>}
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                        className="p-2 rounded-full hover:bg-[#eaf5ef] text-[#006e42] disabled:opacity-40"
                        disabled={page >= totalPages - 1}
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <Drawer
                isOpen={!!selectedWorker}
                onOpenChange={(isOpen) => {
                    if (!isOpen) setSelectedWorker(null);
                }}
                placement="right"
                hideCloseButton
                classNames={{
                    base: "w-full sm:max-w-[480px] bg-white rounded-l-2xl shadow-2xl overflow-hidden",
                    body: "p-0",
                    header: "hidden",
                }}
            >
                <DrawerContent>
                    {() => (
                        <WorkerDetailPanel
                            worker={selectedWorker}
                            onClose={() => setSelectedWorker(null)}
                        />
                    )}
                </DrawerContent>
            </Drawer>
        </div>
    );
}
