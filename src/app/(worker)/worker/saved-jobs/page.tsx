"use client";

import { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Skeleton } from "@heroui/skeleton";
import { jobService } from "@/services/job.service";
import type { JobListItem } from "@/types";

/** Local shape for the saved job card (from API JobListItem) */
type SavedJobCard = {
  id: string;
  title: string;
  type: string;
  postedAt: string;
  salary: string;
  tags: { icon: string; label: string }[];
  isVerified?: boolean;
  clientName: string | null;
  saved: boolean;
};

function toSavedCard(j: JobListItem): SavedJobCard {
  return {
    id: j.id,
    title: j.title,
    type: j.budgetType ?? "Fixed Price",
    postedAt: j.postedAt,
    salary: j.budget,
    tags: (j.tags ?? []).map((t) => ({ icon: "📌", label: t })),
    isVerified: j.isVerified,
    clientName: j.clientName ?? null,
    saved: true,
  };
}

export default function WorkerSavedJobsPage() {
  const [jobs, setJobs] = useState<SavedJobCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    jobService
      .getSavedJobs({ size: 50 })
      .then((res) => {
        const list = res?.list ?? [];
        setJobs(list.map(toSavedCard));
      })
      .catch(() => setJobs([]))
      .finally(() => setLoading(false));
  }, []);

  const toggleSave = (id: string) => {
    jobService.unsaveJob(id).then(() => {
      setJobs((prev) => prev.filter((j) => j.id !== id));
    }).catch(() => {});
  };

  const activeJobs = jobs;

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-[900px] mx-auto px-6 py-8">
                <h1 className="text-2xl font-bold text-foreground mb-6">
                    Saved jobs
                </h1>

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="rounded-2xl h-36 w-full" />
                        ))}
                    </div>
                ) : activeJobs.length === 0 ? (
                    <div className="text-center py-20 text-default-500">
                        <Bookmark className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="text-base">No saved jobs yet.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {activeJobs.map((job) => (
                            <Card key={job.id} className="border border-default-200 hover:border-primary/30 transition-all" shadow="sm">
                                <CardBody className="p-5">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            {(job.clientName || job.isVerified) && (
                                                <div className="flex items-center gap-1.5 mb-1.5">
                                                    <span className="text-[13px] text-default-500 font-medium">
                                                        {job.clientName || "Verified Employer"}
                                                    </span>
                                                    {job.isVerified && <span className="text-primary text-sm">✔</span>}
                                                </div>
                                            )}
                                            <div className="flex flex-wrap items-center gap-3 mb-1">
                                                <h2 className="text-lg font-bold text-foreground">{job.title}</h2>
                                                <Chip size="sm" color="primary" variant="flat">{job.type}</Chip>
                                                <span className="text-[13px] text-default-400">Posted {job.postedAt}</span>
                                            </div>
                                            <p className="text-[13.5px] text-default-500 font-medium mb-3">{job.salary}</p>
                                            <div className="flex flex-wrap gap-2">
                                                {job.tags.map((tag) => (
                                                    <Chip key={tag.label} size="sm" variant="bordered" startContent={tag.icon}>
                                                        {tag.label}
                                                    </Chip>
                                                ))}
                                            </div>
                                        </div>
                                        <Button
                                            isIconOnly
                                            color="primary"
                                            size="lg"
                                            aria-label={job.saved ? "Remove from saved" : "Save job"}
                                            onPress={() => toggleSave(job.id)}
                                        >
                                            <BookmarkCheck className="w-5 h-5 text-primary-foreground" strokeWidth={2.5} />
                                        </Button>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
