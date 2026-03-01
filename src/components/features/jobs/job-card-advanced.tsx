"use client";

import Link from "next/link";
import { Bookmark, BookmarkCheck, CheckCircle } from "lucide-react";
import type { JobListItem } from "@/types";

type JobCardAdvancedProps = JobListItem & {
  /** Optional: show as link wrapper */
  href?: string;
  /** Whether this job is saved by the current user */
  saved?: boolean;
  /** Called when user clicks bookmark (save/unsave). If not set, bookmark click does nothing. */
  onSaveToggle?: (jobId: string) => void;
};

export function JobCardAdvanced({
  id,
  title,
  category,
  tags,
  budget,
  budgetType,
  clientName,
  postedAt,
  isVerified,
  href,
  saved = false,
  onSaveToggle,
}: JobCardAdvancedProps) {
  const to = href ?? `/find-jobs/${id}`;
  const jobId = String(id);
  const showBudgetOnly = /monthly|weekly|hourly/i.test(budget);

  return (
    <Link href={to} className="block group mb-4">
      <div className="relative bg-white p-6 rounded-[20px] border border-[#E0E0E0] shadow-sm hover:border-primary/50 transition-colors cursor-pointer flex justify-between items-start gap-4">

        {/* Left Side: Information Stack */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          {/* Company name + verified */}
          <div className="flex items-center gap-1.5 text-[13px] text-muted-foreground font-medium tracking-wide">
            <span>{clientName}</span>
            {isVerified && (
              <CheckCircle className="w-4 h-4 text-primary shrink-0" aria-label="Verified" />
            )}
          </div>

          {/* Title & Metadata Row */}
          <div className="flex flex-wrap items-center gap-3 mt-0.5">
            <h3 className="text-[20px] font-bold text-[#111827] group-hover:text-primary transition-colors line-clamp-1">
              {title}
            </h3>
            <span className="text-[14px] font-bold text-primary">Full-time</span>
            <span className="text-[13px] text-muted-foreground">{postedAt}</span>
          </div>

          {/* Compensation */}
          <div className="text-[14.5px] text-muted-foreground font-medium mt-1 mb-2">
            {showBudgetOnly ? budget : `${budget} ${budgetType}`}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2.5 items-center">
            <span className="px-3.5 py-1.5 rounded-[50px] text-[13px] font-bold bg-[var(--color-primary-light)] text-primary">
              <span className="mr-1.5 opacity-80">🔥</span> {category}
            </span>
            {tags.slice(0, 6).map((tag, i) => (
              <span
                key={tag}
                className="px-3.5 py-1.5 rounded-[50px] text-[13px] font-bold bg-[var(--color-primary-light)] text-primary"
              >
                <span className="mr-1.5 opacity-80">{i === 0 ? "💬" : i === 1 ? "🛠" : "🌐"}</span> {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right Side: Bookmark Button */}
        <div className="shrink-0 mt-4 md:mt-0">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSaveToggle?.(jobId);
            }}
            className={`w-[42px] h-[42px] rounded-full flex items-center justify-center transition-colors ${
              saved
                ? "bg-primary text-primary-foreground hover:opacity-90"
                : "border-[1.5px] border-primary bg-transparent hover:bg-[var(--color-primary-light)]"
            }`}
            aria-label={saved ? "Remove from saved" : "Save job"}
          >
            {saved ? (
              <BookmarkCheck className="w-[18px] h-[18px]" />
            ) : (
              <Bookmark className="w-[18px] h-[18px] text-primary" />
            )}
          </button>
        </div>
      </div>
    </Link>
  );
}
