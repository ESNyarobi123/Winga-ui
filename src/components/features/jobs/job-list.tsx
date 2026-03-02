"use client";

import { JobCardAdvanced } from "./job-card-advanced";
import { JobCardSkeleton } from "./job-card-skeleton";
import type { JobListItem } from "@/types";

type JobListProps = {
  jobs: JobListItem[];
  isLoading?: boolean;
  /** Number of skeleton cards when loading */
  skeletonCount?: number;
  /** Override link per job (e.g. client: /client/jobs/:id for applicants) */
  getJobHref?: (job: JobListItem) => string;
  /** When set, clicking a job calls this instead of navigating (e.g. open right-side detail panel) */
  onJobSelect?: (job: JobListItem) => void;
  /** Optional: which job id is selected (for highlight) */
  selectedJobId?: string | null;
  /** Optional: which job ids are saved (for bookmark state) */
  savedJobIds?: Set<string>;
  /** Optional: callback when user toggles save on a job */
  onSaveToggle?: (jobId: string) => void;
};

export function JobList({
  jobs,
  isLoading = false,
  skeletonCount = 4,
  getJobHref,
  onJobSelect,
  selectedJobId = null,
  savedJobIds,
  onSaveToggle,
}: JobListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <JobCardSkeleton key={`skeleton-${i}`} />
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No jobs match your filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCardAdvanced
          key={job.id}
          {...job}
          href={onJobSelect ? undefined : (getJobHref ? getJobHref(job) : `/find-jobs/${job.id}`)}
          onSelect={onJobSelect}
          selected={selectedJobId != null && String(job.id) === String(selectedJobId)}
          saved={savedJobIds?.has(String(job.id))}
          onSaveToggle={onSaveToggle}
        />
      ))}
    </div>
  );
}
