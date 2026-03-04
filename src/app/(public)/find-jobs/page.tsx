"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Search, Briefcase, Smartphone, Laptop, Globe, ChevronDown } from "lucide-react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Drawer, DrawerContent } from "@heroui/drawer";
import { JobList } from "@/components/features/jobs/job-list";
import { JobDetailPanel } from "@/components/features/jobs/job-detail-panel";
import { jobService } from "@/services/job.service";
import { useAuth } from "@/hooks/use-auth";
import { useT } from "@/lib/i18n";
import type { JobListItem } from "@/types";

type FilterOptions = {
  employmentTypes: { id: number; name: string; slug: string }[];
  socialMedia: { id: number; name: string; slug: string }[];
  software: { id: number; name: string; slug: string }[];
  languages: { id: number; name: string; slug: string }[];
};

const SORT_KEYS = ["newest", "oldest", "bestMatch"] as const;

export default function FindJobsPage() {
  const t = useT();
  const router = useRouter();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [sortBy, setSortBy] = useState<typeof SORT_KEYS[number]>("newest");
  const [selectedJob, setSelectedJob] = useState<JobListItem | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<string[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    employmentTypes: [],
    socialMedia: [],
    software: [],
    languages: [],
  });
  const [selectedEmploymentType, setSelectedEmploymentType] = useState<string | null>(null);
  const [selectedSocialMedia, setSelectedSocialMedia] = useState<string | null>(null);
  const [selectedSoftware, setSelectedSoftware] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [showAllCategories, setShowAllCategories] = useState(false);

  useEffect(() => {
    if (user?.role === "FREELANCER") {
      router.replace("/worker/find-jobs");
      return;
    }
  }, [user?.role, router]);

  useEffect(() => {
    jobService.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    jobService.getFilterOptions().then(setFilterOptions).catch(() => { });
  }, []);

  useEffect(() => {
    if (!user) return;
    jobService.getSavedJobs({ size: 200 }).then((res) => {
      setSavedJobIds(new Set((res?.list ?? []).map((j) => String(j.id))));
    }).catch(() => { });
  }, [user]);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    jobService
      .getJobs({
        keyword: searchQuery.trim() || undefined,
        category: selectedCategory ?? undefined,
        employmentType: selectedEmploymentType ?? undefined,
        socialMedia: selectedSocialMedia ?? undefined,
        software: selectedSoftware ?? undefined,
        language: selectedLanguage ?? undefined,
        size: 50,
      })
      .then((res) => {
        if (!cancelled && res?.list !== undefined) setJobs(res.list);
      })
      .catch(() => {
        if (!cancelled) setJobs([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [searchQuery, selectedCategory, selectedEmploymentType, selectedSocialMedia, selectedSoftware, selectedLanguage]);

  const filteredJobs = useMemo(() => {
    const list = [...jobs];
    const getTime = (job: JobListItem) => (job.createdAt ? new Date(job.createdAt).getTime() : 0);
    if (sortBy === "newest" && list.length > 0) return [...list].sort((a, b) => getTime(b) - getTime(a));
    if (sortBy === "oldest" && list.length > 0) return [...list].sort((a, b) => getTime(a) - getTime(b));
    return list;
  }, [jobs, sortBy]);

  return (
    <div className="min-h-screen bg-background">
      <section className="relative z-0 overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 -z-10">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover" aria-hidden>
            <source src="/find-jobs-green.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[#0f3224]/50 mix-blend-multiply" />
        </div>

        <div className="container relative z-10 px-4">
          <h1 className="text-[44px] md:text-[52px] font-extrabold text-center mb-4 text-white drop-shadow-md tracking-tight">
            {t("home.findDreamJob")}
          </h1>
          <p className="text-[18px] text-white/90 text-center mb-10 max-w-2xl font-medium drop-shadow-sm mx-auto">
            {t("home.remoteWorkDone")}
          </p>
          <div className="max-w-[700px] mx-auto">
            <Input
              type="search"
              placeholder={t("job.searchPlaceholder")}
              value={searchQuery}
              onValueChange={setSearchQuery}
              size="lg"
              radius="full"
              classNames={{ input: "text-base font-medium", inputWrapper: "bg-white shadow-md h-14" }}
              startContent={<Search className="w-5 h-5 text-default-400" />}
              aria-label="Search jobs"
            />
          </div>
        </div>

        <div className="absolute bottom-0 w-full overflow-hidden leading-[0]">
          <svg className="relative block w-full h-[40px] md:h-[80px]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" aria-hidden>
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C63.26,38.2,148.9,46.07,222.18,48.24,256.32,49.27,290.46,55,321.39,56.44Z" className="fill-white" />
          </svg>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto px-4 py-10">
        {/* Top row: dropdown filters — fetched from API (GET /jobs/filter-options) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="w-full justify-between h-[52px] px-4 rounded-xl bg-white border border-gray-200 text-gray-800 font-semibold text-[14px] hover:bg-gray-50 hover:border-gray-300 shadow-sm min-w-0"
                endContent={<ChevronDown className="w-4 h-4 text-gray-400 shrink-0" strokeWidth={2} />}
              >
                <span className="flex items-center gap-2 min-w-0 truncate">
                  <Briefcase className="w-[18px] h-[18px] text-gray-600 shrink-0" strokeWidth={2} />
                  <span className="truncate">{selectedEmploymentType ? filterOptions.employmentTypes.find((o) => o.slug === selectedEmploymentType)?.name ?? selectedEmploymentType : "Employment Type"}</span>
                </span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Employment type" selectedKeys={selectedEmploymentType ? [selectedEmploymentType] : ["__any__"]} selectionMode="single" onSelectionChange={(keys) => { const k = Array.from(keys)[0] as string; setSelectedEmploymentType(k === "__any__" || !k ? null : k); }}>
              {[
                <DropdownItem key="__any__" textValue="Any">Any</DropdownItem>,
                ...filterOptions.employmentTypes.map((o) => (<DropdownItem key={o.slug} textValue={o.name}>{o.name}</DropdownItem>))
              ] as any}
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="w-full justify-between h-[52px] px-4 rounded-xl bg-white border border-gray-200 text-gray-800 font-semibold text-[14px] hover:bg-gray-50 hover:border-gray-300 shadow-sm min-w-0"
                endContent={<ChevronDown className="w-4 h-4 text-gray-400 shrink-0" strokeWidth={2} />}
              >
                <span className="flex items-center gap-2 min-w-0 truncate">
                  <Smartphone className="w-[18px] h-[18px] text-gray-600 shrink-0" strokeWidth={2} />
                  <span className="truncate">{selectedSocialMedia ? filterOptions.socialMedia.find((o) => o.slug === selectedSocialMedia)?.name ?? selectedSocialMedia : "Social Media"}</span>
                </span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Social media" selectedKeys={selectedSocialMedia ? [selectedSocialMedia] : ["__any__"]} selectionMode="single" onSelectionChange={(keys) => { const k = Array.from(keys)[0] as string; setSelectedSocialMedia(k === "__any__" || !k ? null : k); }}>
              {[
                <DropdownItem key="__any__" textValue="Any">Any</DropdownItem>,
                ...filterOptions.socialMedia.map((o) => (<DropdownItem key={o.slug} textValue={o.name}>{o.name}</DropdownItem>))
              ] as any}
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="w-full justify-between h-[52px] px-4 rounded-xl bg-white border border-gray-200 text-gray-800 font-semibold text-[14px] hover:bg-gray-50 hover:border-gray-300 shadow-sm min-w-0"
                endContent={<ChevronDown className="w-4 h-4 text-gray-400 shrink-0" strokeWidth={2} />}
              >
                <span className="flex items-center gap-2 min-w-0 truncate">
                  <Laptop className="w-[18px] h-[18px] text-gray-600 shrink-0" strokeWidth={2} />
                  <span className="truncate">{selectedSoftware ? filterOptions.software.find((o) => o.slug === selectedSoftware)?.name ?? selectedSoftware : "Software"}</span>
                </span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Software" selectedKeys={selectedSoftware ? [selectedSoftware] : ["__any__"]} selectionMode="single" onSelectionChange={(keys) => { const k = Array.from(keys)[0] as string; setSelectedSoftware(k === "__any__" || !k ? null : k); }}>
              {[
                <DropdownItem key="__any__" textValue="Any">Any</DropdownItem>,
                ...filterOptions.software.map((o) => (<DropdownItem key={o.slug} textValue={o.name}>{o.name}</DropdownItem>))
              ] as any}
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger>
              <Button
                variant="bordered"
                className="w-full justify-between h-[52px] px-4 rounded-xl bg-white border border-gray-200 text-gray-800 font-semibold text-[14px] hover:bg-gray-50 hover:border-gray-300 shadow-sm min-w-0"
                endContent={<ChevronDown className="w-4 h-4 text-gray-400 shrink-0" strokeWidth={2} />}
              >
                <span className="flex items-center gap-2 min-w-0 truncate">
                  <Globe className="w-[18px] h-[18px] text-gray-600 shrink-0" strokeWidth={2} />
                  <span className="truncate">{selectedLanguage ? filterOptions.languages.find((o) => o.slug === selectedLanguage)?.name ?? selectedLanguage : "Languages"}</span>
                </span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Languages" selectedKeys={selectedLanguage ? [selectedLanguage] : ["__any__"]} selectionMode="single" onSelectionChange={(keys) => { const k = Array.from(keys)[0] as string; setSelectedLanguage(k === "__any__" || !k ? null : k); }}>
              {[
                <DropdownItem key="__any__" textValue="Any">Any</DropdownItem>,
                ...filterOptions.languages.map((o) => (<DropdownItem key={o.slug} textValue={o.name}>{o.name}</DropdownItem>))
              ] as any}
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* Category tags – from API GET /jobs/categories (admin-managed) */}
        <div className="flex flex-wrap items-center gap-3 mb-10">
          {categories.slice(0, showAllCategories ? categories.length : 8).map((catName) => {
            const isSelected = selectedCategory === catName;
            return (
              <Chip
                key={catName}
                variant="bordered"
                size="md"
                className={`cursor-pointer font-semibold text-[14px] transition-all rounded-xl min-h-[44px] px-4 ${isSelected
                  ? "bg-primary-50 text-primary border-primary/50 shadow-sm border"
                  : "bg-white text-gray-800 border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm border"
                  }`}
                startContent={<span className="text-base">🛠</span>}
                onClose={isSelected ? () => setSelectedCategory(null) : undefined}
                onClick={() => setSelectedCategory(isSelected ? null : catName)}
              >
                {catName}
              </Chip>
            );
          })}
          {categories.length > 8 && (
            <Chip
              variant="bordered"
              size="md"
              className="cursor-pointer font-semibold text-[14px] transition-all rounded-xl min-h-[44px] px-4 bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100 hover:border-gray-300 shadow-sm border"
              onClick={() => setShowAllCategories(!showAllCategories)}
            >
              {showAllCategories ? "Show Less" : `+${categories.length - 8} Others`}
            </Chip>
          )}
          {categories.length === 0 && <span className="text-sm text-gray-500">Loading categories…</span>}
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
                {t("job.sortBy")} {t(`job.${sortBy}`)}
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              aria-label="Sort options"
              selectedKeys={[sortBy]}
              selectionMode="single"
              onSelectionChange={(keys) => {
                const k = Array.from(keys)[0] as typeof sortBy;
                if (k) setSortBy(k);
              }}
            >
              {SORT_KEYS.map((key) => (
                <DropdownItem key={key}>{t(`job.${key}`)}</DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
        </div>

        {/* List of jobs + Details Drawer */}
        <div className="flex flex-col gap-6 min-h-[480px]">
          <div className="flex-1 w-full max-w-[900px] mx-auto">
            <JobList
              jobs={filteredJobs}
              isLoading={isLoading}
              skeletonCount={4}
              onJobSelect={(job) => setSelectedJob(job)}
              selectedJobId={selectedJob?.id ?? null}
              savedJobIds={savedJobIds}
              onSaveToggle={(jobId) => {
                if (!user) return;
                const saved = savedJobIds.has(jobId);
                if (saved) {
                  jobService.unsaveJob(jobId).catch(() => { });
                  setSavedJobIds((prev) => { const n = new Set(prev); n.delete(jobId); return n; });
                } else {
                  jobService.saveJob(jobId).catch(() => { });
                  setSavedJobIds((prev) => new Set(prev).add(jobId));
                }
              }}
            />
          </div>

          <Drawer
            isOpen={!!selectedJob}
            onOpenChange={(isOpen) => {
              if (!isOpen) setSelectedJob(null);
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
                <JobDetailPanel
                  job={selectedJob}
                  onClose={() => setSelectedJob(null)}
                  onApply={() => { }}
                  isLoggedIn={!!user}
                  saved={savedJobIds.has(String(selectedJob?.id))}
                  onSaveToggle={(jobId) => {
                    if (!user) return;
                    const saved = savedJobIds.has(jobId);
                    if (saved) {
                      jobService.unsaveJob(jobId).catch(() => { });
                      setSavedJobIds((prev) => { const n = new Set(prev); n.delete(jobId); return n; });
                    } else {
                      jobService.saveJob(jobId).catch(() => { });
                      setSavedJobIds((prev) => new Set(prev).add(jobId));
                    }
                  }}
                />
              )}
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
}
