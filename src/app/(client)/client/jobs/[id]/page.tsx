"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { jobService } from "@/services/job.service";
import { proposalService } from "@/services/proposal.service";
import { HireModal } from "@/components/features/proposals/hire-modal";
import type { ProposalItem } from "@/services/proposal.service";

export default function ClientJobApplicantsPage({ params }: { params: { id: string } }) {
  const jobId = params.id;
  const [jobTitle, setJobTitle] = useState<string>("");
  const [applicants, setApplicants] = useState<ProposalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<ProposalItem | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      jobService.getJobById(jobId).then((j) => (j ? setJobTitle(j.title) : setJobTitle("Job"))),
      proposalService.getJobApplicants(jobId, { size: 50 }).then((p) => setApplicants(p?.content ?? [])),
    ]).catch(() => setApplicants([])).finally(() => setLoading(false));
  }, [jobId]);

  function openHireModal(p: ProposalItem) {
    setSelectedProposal(p);
    setHireModalOpen(true);
  }

  function handleHired() {
    if (selectedProposal) {
      setApplicants((prev) => prev.filter((a) => a.id !== selectedProposal.id));
      setSelectedProposal(null);
    }
    setHireModalOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-[900px] mx-auto px-6 py-10">
        <Link
          href="/client/jobs"
          className="inline-flex items-center gap-1 text-[#006e42] font-semibold mb-6 hover:underline"
        >
          <ChevronLeft className="w-4 h-4" /> Back to jobs
        </Link>
        <div className="bg-white border border-[#E8E8E8] rounded-[24px] p-6 shadow-sm">
          <h1 className="text-[22px] font-bold text-[#111827] mb-1">{jobTitle || "Job"}</h1>
          <p className="text-sm text-muted-foreground mb-6">Applicants for this job</p>

          {loading ? (
            <p className="text-muted-foreground">Loading applicants…</p>
          ) : applicants.length === 0 ? (
            <p className="text-muted-foreground">No applicants yet.</p>
          ) : (
            <div className="space-y-4">
              {applicants.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-[#E8E8E8] hover:border-[#006e42]/30"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-[#111827]">
                      {p.freelancer?.fullName ?? `Applicant #${p.id}`}
                    </p>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{p.coverLetter}</p>
                    <p className="text-sm text-[#006e42] font-medium mt-1">
                      TZS {Number(p.bidAmount).toLocaleString()} · {p.estimatedDuration}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Status: {p.status} · {p.createdAt?.slice(0, 10)}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openHireModal(p)}
                    className="shrink-0 px-4 py-2 rounded-lg bg-[#006e42] text-white font-semibold hover:bg-[#005c36]"
                  >
                    Hire
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <HireModal
        open={hireModalOpen}
        onOpenChange={setHireModalOpen}
        proposalId={selectedProposal?.id}
        freelancerName={selectedProposal?.freelancer?.fullName ?? undefined}
        onHired={handleHired}
      />
    </div>
  );
}
