"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Briefcase, Smartphone, Laptop, Globe, ChevronDown } from "lucide-react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Skeleton } from "@heroui/skeleton";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/dropdown";
import { Pagination } from "@heroui/pagination";
import { JobCardAdvanced } from "@/components/features/jobs/job-card-advanced";
import { jobService } from "@/services/job.service";
import type { JobListItem } from "@/types";

const SORT_OPTIONS = ["Newest", "Oldest", "Best Match"] as const;

type FilterOptions = {
  employmentTypes: { id: number; name: string; slug: string }[];
  socialMedia: { id: number; name: string; slug: string }[];
  software: { id: number; name: string; slug: string }[];
  languages: { id: number; name: string; slug: string }[];
};

export default function WorkerFindJobsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState("Newest");
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
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
  const PAGE_SIZE = 10;

  useEffect(() => {
    jobService.getCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    jobService.getFilterOptions().then(setFilterOptions).catch(() => {});
  }, []);

  useEffect(() => {
    jobService.getSavedJobs({ size: 200 }).then((res) => {
      setSavedJobIds(new Set(res.list.map((j) => String(j.id))));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    jobService
      .getJobs({
        keyword: searchQuery || undefined,
        category: selectedCategory ?? undefined,
        employmentType: selectedEmploymentType ?? undefined,
        socialMedia: selectedSocialMedia ?? undefined,
        software: selectedSoftware ?? undefined,
        language: selectedLanguage ?? undefined,
        size: 50,
      })
      .then((res) => {
        if (!cancelled) setJobs(res?.list ?? []);
      })
      .catch(() => {
        if (!cancelled) setJobs([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [searchQuery, selectedCategory, selectedEmploymentType, selectedSocialMedia, selectedSoftware, selectedLanguage]);

  function handleSaveToggle(jobId: string) {
    const saved = savedJobIds.has(jobId);
    if (saved) {
      jobService.unsaveJob(jobId).then(() => {
        setSavedJobIds((prev) => {
          const next = new Set(prev);
          next.delete(jobId);
          return next;
        });
      }).catch(() => {});
    } else {
      jobService.saveJob(jobId).then(() => {
        setSavedJobIds((prev) => new Set(prev).add(jobId));
      }).catch(() => {});
    }
  }

  const filteredJobs = useMemo(() => {
    const list = [...jobs];
    const getTime = (job: JobListItem) => (job.createdAt ? new Date(job.createdAt).getTime() : 0);
    if (sortBy === "Newest" && list.length > 0) {
      return [...list].sort((a, b) => getTime(b) - getTime(a));
    }
    if (sortBy === "Oldest" && list.length > 0) {
      return [...list].sort((a, b) => getTime(a) - getTime(b));
    }
    return list;
  }, [jobs, sortBy]);

  const paginatedJobs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredJobs.slice(start, start + PAGE_SIZE);
  }, [filteredJobs, currentPage]);
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));

    return (
        <div className="min-h-screen bg-background">
            {/* Hero: video background + "Find your dream job" + search (same as /find-jobs) */}
            <section className="relative z-0 overflow-hidden pt-24 pb-32">
                {/* Background video — plays behind text and search */}
                <div className="absolute inset-0 z-0">
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
                    {/* Overlay for text readability */}
                    <div className="absolute inset-0 bg-[#0f3224]/50 mix-blend-multiply" />
                </div>

                <div className="container relative z-10 px-4">
                    <h1 className="text-[44px] md:text-[52px] font-extrabold text-center mb-4 text-white drop-shadow-md tracking-tight">
                        Find your dream job
                    </h1>
                    <p className="text-[18px] text-white/90 text-center mb-10 max-w-2xl font-medium drop-shadow-sm mx-auto">
                        Remote work done properly.
                    </p>
                    <div className="max-w-[700px] mx-auto">
                        <Input
                            type="search"
                            placeholder="e.g. Chatters Manager"
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

                {/* Wavy bottom (transition to white content) */}
                <div className="absolute bottom-0 w-full overflow-hidden leading-[0] z-10">
                    <svg
                        className="relative block w-full h-[40px] md:h-[80px]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 1200 120"
                        preserveAspectRatio="none"
                        aria-hidden
                    >
                        <path
                            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C63.26,38.2,148.9,46.07,222.18,48.24,256.32,49.27,290.46,55,321.39,56.44Z"
                            className="fill-white"
                        />
                    </svg>
                </div>
            </section>

            {/* Filters + Jobs */}
            <div className="max-w-[980px] mx-auto px-6 py-6">
                {/* Dropdown Filters — each trigger: icon + label in one flex cell to avoid misalignment */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                variant="bordered"
                                color="primary"
                                className="w-full justify-start font-semibold text-[13.5px] min-w-0"
                                endContent={<ChevronDown className="w-4 h-4 shrink-0 text-default-400" />}
                            >
                                <span className="flex items-center gap-2 min-w-0 truncate">
                                    <Briefcase className="w-4 h-4 shrink-0" strokeWidth={2} />
                                    <span className="truncate">{selectedEmploymentType ? filterOptions.employmentTypes.find((o) => o.slug === selectedEmploymentType)?.name ?? selectedEmploymentType : "Employment Type"}</span>
                                </span>
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Employment type"
                            selectedKeys={selectedEmploymentType ? [selectedEmploymentType] : ["__any__"]}
                            selectionMode="single"
                            onSelectionChange={(keys) => {
                                const k = Array.from(keys)[0] as string;
                                setSelectedEmploymentType(k === "__any__" || !k ? null : k);
                            }}
                        >
                            <DropdownItem key="__any__" textValue="Any">Any</DropdownItem>
                            {filterOptions.employmentTypes.map((o) => (
                                <DropdownItem key={o.slug} textValue={o.name}>{o.name}</DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                variant="bordered"
                                color="primary"
                                className="w-full justify-start font-semibold text-[13.5px] min-w-0"
                                endContent={<ChevronDown className="w-4 h-4 shrink-0 text-default-400" />}
                            >
                                <span className="flex items-center gap-2 min-w-0 truncate">
                                    <Smartphone className="w-4 h-4 shrink-0" strokeWidth={2} />
                                    <span className="truncate">{selectedSocialMedia ? filterOptions.socialMedia.find((o) => o.slug === selectedSocialMedia)?.name ?? selectedSocialMedia : "Social Media"}</span>
                                </span>
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Social media"
                            selectedKeys={selectedSocialMedia ? [selectedSocialMedia] : ["__any__"]}
                            selectionMode="single"
                            onSelectionChange={(keys) => {
                                const k = Array.from(keys)[0] as string;
                                setSelectedSocialMedia(k === "__any__" || !k ? null : k);
                            }}
                        >
                            <DropdownItem key="__any__" textValue="Any">Any</DropdownItem>
                            {filterOptions.socialMedia.map((o) => (
                                <DropdownItem key={o.slug} textValue={o.name}>{o.name}</DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                variant="bordered"
                                color="primary"
                                className="w-full justify-start font-semibold text-[13.5px] min-w-0"
                                endContent={<ChevronDown className="w-4 h-4 shrink-0 text-default-400" />}
                            >
                                <span className="flex items-center gap-2 min-w-0 truncate">
                                    <Laptop className="w-4 h-4 shrink-0" strokeWidth={2} />
                                    <span className="truncate">{selectedSoftware ? filterOptions.software.find((o) => o.slug === selectedSoftware)?.name ?? selectedSoftware : "Software"}</span>
                                </span>
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Software"
                            selectedKeys={selectedSoftware ? [selectedSoftware] : ["__any__"]}
                            selectionMode="single"
                            onSelectionChange={(keys) => {
                                const k = Array.from(keys)[0] as string;
                                setSelectedSoftware(k === "__any__" || !k ? null : k);
                            }}
                        >
                            <DropdownItem key="__any__" textValue="Any">Any</DropdownItem>
                            {filterOptions.software.map((o) => (
                                <DropdownItem key={o.slug} textValue={o.name}>{o.name}</DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button
                                variant="bordered"
                                color="primary"
                                className="w-full justify-start font-semibold text-[13.5px] min-w-0"
                                endContent={<ChevronDown className="w-4 h-4 shrink-0 text-default-400" />}
                            >
                                <span className="flex items-center gap-2 min-w-0 truncate">
                                    <Globe className="w-4 h-4 shrink-0" strokeWidth={2} />
                                    <span className="truncate">{selectedLanguage ? filterOptions.languages.find((o) => o.slug === selectedLanguage)?.name ?? selectedLanguage : "Languages"}</span>
                                </span>
                            </Button>
                        </DropdownTrigger>
                        <DropdownMenu
                            aria-label="Languages"
                            selectedKeys={selectedLanguage ? [selectedLanguage] : ["__any__"]}
                            selectionMode="single"
                            onSelectionChange={(keys) => {
                                const k = Array.from(keys)[0] as string;
                                setSelectedLanguage(k === "__any__" || !k ? null : k);
                            }}
                        >
                            <DropdownItem key="__any__" textValue="Any">Any</DropdownItem>
                            {filterOptions.languages.map((o) => (
                                <DropdownItem key={o.slug} textValue={o.name}>{o.name}</DropdownItem>
                            ))}
                        </DropdownMenu>
                    </Dropdown>
                </div>

                {/* Category Pills – from API */}
                <div className="flex flex-wrap gap-2.5 mb-6">
                    {categories.map((catName) => {
                        const isSelected = selectedCategory === catName;
                        return (
                            <Chip
                                key={catName}
                                variant={isSelected ? "solid" : "bordered"}
                                color="primary"
                                size="md"
                                className="cursor-pointer font-semibold"
                                startContent="🛠"
                                onClose={isSelected ? () => setSelectedCategory(null) : undefined}
                                onClick={() => setSelectedCategory(isSelected ? null : catName)}
                            >
                                {catName}
                            </Chip>
                        );
                    })}
                </div>

                {/* New Jobs bar (green bar, Sort by Newest dropdown on right like image) */}
                <div className="flex items-center justify-between bg-primary text-primary-foreground px-4 py-3 rounded-t-xl mb-0">
                    <span className="text-[15px] font-bold">New Jobs</span>
                    <Dropdown>
                        <DropdownTrigger>
                            <Button variant="light" className="text-primary-foreground font-semibold text-[13px] min-w-0" endContent={<span>▼</span>}>
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

                {/* Job list (white area under green "New Jobs" bar) */}
                <div className="border border-t-0 border-default-200 rounded-b-xl bg-background overflow-hidden">
                    <div className="p-4 space-y-3">
                        {loading ? (
                            <div className="space-y-3">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} className="rounded-2xl h-32 w-full" />
                                ))}
                            </div>
                        ) : filteredJobs.length > 0 ? (
                            paginatedJobs.map((job) => (
                                <JobCardAdvanced
                                    key={job.id}
                                    {...job}
                                    href={`/worker/find-jobs/${job.id}`}
                                    saved={savedJobIds.has(String(job.id))}
                                    onSaveToggle={handleSaveToggle}
                                />
                            ))
                        ) : (
                            <div className="text-center py-16 text-default-500">
                                <p className="text-base">No jobs found matching your search.</p>
                            </div>
                        )}
                    </div>
                    {filteredJobs.length > 0 && totalPages > 1 && (
                        <div className="flex justify-center py-4 border-t border-default-200">
                            <Pagination
                                total={totalPages}
                                page={currentPage}
                                onChange={setCurrentPage}
                                color="primary"
                                showControls
                                size="sm"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
