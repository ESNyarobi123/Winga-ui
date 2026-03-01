"use client";

import { useState, useMemo } from "react";
import { Search, Briefcase, Sparkles, Monitor, Smartphone, CreditCard, Globe, Languages, Users, ChevronDown } from "lucide-react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { WorkerList } from "@/components/features/workers/worker-list";
import { dummyWorkers } from "@/data/dummy-workers";
import { useT } from "@/lib/i18n";

const SORT_OPTIONS = ["Newest", "Recommended", "Experience"];

const FILTERS = [
  { label: "Employment Type", icon: Briefcase },
  { label: "Skills & Expertise", icon: Sparkles },
  { label: "Software", icon: Monitor },
  { label: "Social Media", icon: Smartphone },
  { label: "Preferred Payment", icon: CreditCard },
  { label: "Country", icon: Globe },
  { label: "Languages", icon: Languages },
  { label: "Gender", icon: Users },
] as const;

export default function FindWorkersPage() {
    const t = useT();
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [sortBy, setSortBy] = useState("Newest");

    const filteredWorkers = useMemo(() => {
        let list = [...dummyWorkers];
        const q = searchQuery.trim().toLowerCase();
        if (q) {
            list = list.filter(
                (w) =>
                    w.name.toLowerCase().includes(q) ||
                    w.bio.toLowerCase().includes(q) ||
                    w.tags.some((t) => t.toLowerCase().includes(q))
            );
        }
        return list;
    }, [searchQuery]);

    return (
        <div className="min-h-screen bg-background">
            <section className="relative z-0 overflow-hidden pt-24 pb-32">
                <div className="absolute inset-0 -z-10 bg-black">
                    <video autoPlay loop muted playsInline className="w-full h-full object-cover" aria-hidden>
                        <source src="/find-jobs-green.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-[#0f3224]/60 mix-blend-multiply" />
                </div>

                <div className="container relative z-10 px-4">
                    <h1 className="text-[44px] md:text-[52px] font-extrabold text-center mb-4 text-white drop-shadow-md tracking-tight">
                        {t("findWorkers.title")}
                    </h1>
                    <p className="text-[18px] text-white/90 text-center mb-10 max-w-2xl font-medium drop-shadow-sm mx-auto">
                        {t("findWorkers.subtitle")}
                    </p>
                    <div className="max-w-[700px] mx-auto">
                        <Input
                            type="search"
                            placeholder={t("findWorkers.searchPlaceholder")}
                            value={searchQuery}
                            onValueChange={setSearchQuery}
                            size="lg"
                            radius="full"
                            classNames={{ input: "text-base font-medium", inputWrapper: "bg-white shadow-lg h-14 border-0" }}
                            startContent={<Search className="w-5 h-5 text-gray-400" />}
                            aria-label="Search workers"
                        />
                    </div>
                </div>

                <div className="absolute bottom-0 w-full overflow-hidden leading-[0]">
                    <svg className="relative block w-full h-[40px] md:h-[80px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden>
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C63.26,38.2,148.9,46.07,222.18,48.24,256.32,49.27,290.46,55,321.39,56.44Z" className="fill-background" />
                    </svg>
                </div>
            </section>

            <div className="max-w-[1000px] mx-auto px-4 py-10">
                {/* Filter dropdowns – neutral, rounded, subtle border, icon + chevron (2 rows × 4) */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {FILTERS.map(({ label, icon: Icon }) => (
                        <Button
                            key={label}
                            variant="bordered"
                            className="justify-between h-[52px] px-4 rounded-xl bg-white border border-gray-200 text-gray-800 font-semibold text-[14px] hover:bg-gray-50 hover:border-gray-300 shadow-sm min-w-0"
                            startContent={<Icon className="w-[18px] h-[18px] text-gray-600 shrink-0" strokeWidth={2} />}
                            endContent={<ChevronDown className="w-4 h-4 text-gray-400 shrink-0" strokeWidth={2} />}
                        >
                            <span className="truncate">{label}</span>
                        </Button>
                    ))}
                </div>

                {/* Sort – same neutral style */}
                <div className="flex justify-end items-center mb-6">
                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                variant="bordered"
                                size="sm"
                                className="h-10 px-4 rounded-xl bg-white border border-gray-200 text-gray-800 font-semibold text-[14px] hover:bg-gray-50 hover:border-gray-300 shadow-sm"
                                endContent={<ChevronDown className="w-4 h-4 text-gray-400" />}
                            >
                                Sort by {sortBy}
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Sort options"
                            selectedKeys={[sortBy]}
                            selectionMode="single"
                            onSelectionChange={(keys) => {
                                const k = Array.from(keys)[0] as string;
                                if (k) setSortBy(k);
                            }}
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <DropdownItem key={opt}>{opt}</DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </div>

                <WorkerList workers={filteredWorkers} isLoading={isLoading} skeletonCount={4} />
            </div>
        </div>
    );
}
