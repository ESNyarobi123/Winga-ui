"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { Search, Briefcase, Sparkles, Monitor, Smartphone, CreditCard, Globe, Languages, Users, ChevronDown, BadgeCheck, CheckCircle } from "lucide-react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Drawer, DrawerContent } from "@heroui/drawer";
import { Modal, ModalContent, ModalBody, useDisclosure } from "@heroui/modal";
import { WorkerList } from "@/components/features/workers/worker-list";
import { WorkerDetailPanel } from "@/components/features/workers/worker-detail-panel";
import { workerService } from "@/services/worker.service";
import { useAuth } from "@/hooks/use-auth";
import { useT } from "@/lib/i18n";
import type { WorkerListItem } from "@/types";

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
    const { user } = useAuth();
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [sortBy, setSortBy] = useState("Newest");
    const [workers, setWorkers] = useState<WorkerListItem[]>([]);
    const [selectedWorker, setSelectedWorker] = useState<WorkerListItem | null>(null);
    const [verifiedOnly, setVerifiedOnly] = useState(false);
    const [completeProfileOnly, setCompleteProfileOnly] = useState(false);

    useEffect(() => {
        let cancelled = false;
        setIsLoading(true);
        workerService
            .getWorkers({
                size: 50,
                keyword: searchQuery.trim() || undefined,
                profileVerified: verifiedOnly || undefined,
                profileComplete: completeProfileOnly || undefined,
            })
            .then((res) => {
                if (!cancelled && res?.list !== undefined) setWorkers(res.list);
            })
            .catch(() => {
                if (!cancelled) setWorkers([]);
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });
        return () => { cancelled = true; };
    }, [searchQuery, verifiedOnly, completeProfileOnly]);

    const filteredWorkers = workers;

    const handleActionClick = (worker: any, e: React.MouseEvent) => {
        if (!user) {
            onOpen();
        } else {
            console.log("Logged in action for:", worker);
        }
    };

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
                {/* Quick filters: Verified, Complete profile */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <Button
                        size="sm"
                        variant={verifiedOnly ? "solid" : "bordered"}
                        color={verifiedOnly ? "success" : "default"}
                        className="rounded-full"
                        startContent={<BadgeCheck className="w-4 h-4" />}
                        onPress={() => setVerifiedOnly((v) => !v)}
                    >
                        Verified only
                    </Button>
                    <Button
                        size="sm"
                        variant={completeProfileOnly ? "solid" : "bordered"}
                        color={completeProfileOnly ? "success" : "default"}
                        className="rounded-full"
                        startContent={<CheckCircle className="w-4 h-4" />}
                        onPress={() => setCompleteProfileOnly((v) => !v)}
                    >
                        Complete profile only
                    </Button>
                </div>
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

                <div className="flex flex-col gap-6 min-h-[480px]">
                    <div className="flex-1 w-full max-w-[900px] mx-auto">
                        <WorkerList
                            workers={filteredWorkers}
                            isLoading={isLoading}
                            skeletonCount={4}
                            onWorkerSelect={setSelectedWorker}
                            onActionClick={handleActionClick}
                        />
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

                    {/* Authentication Required Modal */}
                    <Modal
                        isOpen={isOpen}
                        onOpenChange={(open) => !open && onClose()}
                        placement="center"
                        hideCloseButton={false}
                        classNames={{
                            base: "rounded-[24px] shadow-2xl max-w-[460px] p-2",
                            closeButton: "top-4 right-4 focus:outline-none hover:bg-gray-100 z-10",
                        }}
                    >
                        <ModalContent>
                            <>
                                <ModalBody className="pt-8 pb-6 px-8 gap-0">
                                    <h2 className="text-[28px] font-extrabold text-gray-900 mb-3 text-center leading-tight">Authentication Required</h2>
                                    <p className="text-[17px] text-gray-800 font-medium text-center mb-8">
                                        Looking to contact a worker? Sign up to get started!
                                    </p>
                                    <Button
                                        as={Link}
                                        href={`/login?returnUrl=${encodeURIComponent("/find-workers")}`}
                                        className="w-full bg-[#006B3E] hover:bg-[#005a35] text-white font-bold h-14 rounded-xl text-[16px] shadow-md mb-2"
                                    >
                                        Log In / Sign Up
                                    </Button>
                                </ModalBody>
                            </>
                        </ModalContent>
                    </Modal>
                </div>
            </div>
        </div>
    );
}
