"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { JobList } from "@/components/features/jobs/job-list";
import { jobService } from "@/services/job.service";
import type { JobListItem } from "@/types";

type Tab = "Live" | "Draft" | "Pending" | "Expired";

export default function ClientMyJobsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Live");
  const [jobs, setJobs] = useState<JobListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    setLoading(true);
    jobService
      .getMyJobs({ page, size: 10 })
      .then((res) => {
        setJobs(res.list);
        setTotalPages(res.totalPages);
      })
      .catch(() => {
        setJobs([]);
        setTotalPages(0);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-[1000px] mx-auto px-6 py-10">
        <div className="bg-white border border-[#E8E8E8] rounded-[24px] p-6 shadow-sm min-h-[400px]">
          <h1 className="text-[22px] font-bold text-[#111827] mb-5">Job posts</h1>

          <div className="flex items-center gap-2 mb-8">
            {(["Live", "Draft", "Pending", "Expired"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-full text-[13.5px] font-bold transition-all ${
                  activeTab === tab
                    ? "bg-[#006e42] text-white shadow-sm"
                    : "bg-transparent border-2 border-[#eaf5ef] text-[#006e42] hover:border-[#006e42]/40"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {!loading && jobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <p className="text-[16px] font-semibold text-[#555]">Looks like there are no jobs</p>
              <div className="flex items-center gap-2 mt-6 text-[#999]">
                <button disabled className="p-2 rounded-full hover:bg-[#f0f0f0] disabled:opacity-40">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button disabled className="p-2 rounded-full hover:bg-[#f0f0f0] disabled:opacity-40">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <JobList
                jobs={jobs}
                isLoading={loading}
                skeletonCount={3}
                getJobHref={(job) => `/client/jobs/${job.id}`}
              />
              {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                disabled={page <= 0}
                onClick={() => setPage((p) => p - 1)}
                className="text-[#006e42] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-sm text-[#666]">
                Page {page + 1} of {totalPages}
              </span>
              <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="text-[#006e42] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
