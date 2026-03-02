import { useEffect, useState } from "react";
import { getModerationJobs, moderateJob } from "../api/client";
import { ShieldCheck } from "lucide-react";
import PageHeader from "../components/PageHeader";
import AdminCard from "../components/AdminCard";
import AdminButton from "../components/AdminButton";

type JobRow = {
  id: number;
  title: string;
  status: string;
  category?: string;
  proposalCount?: number;
  createdAt?: string;
  moderationStatus?: string;
};

export default function Moderation() {
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acting, setActing] = useState<number | null>(null);

  const load = () => {
    setLoading(true);
    getModerationJobs(0, 50)
      .then((res) => {
        const data = res.data as { content?: JobRow[] };
        setJobs(data?.content ?? []);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => load(), []);

  const handleModerate = (id: number, status: "APPROVED" | "REJECTED") => {
    setActing(id);
    moderateJob(id, status)
      .then(() => load())
      .catch((e) => setError(e.message))
      .finally(() => setActing(null));
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Job Moderation"
        subtitle="Review and approve or reject job postings before they go live."
      />
      {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">{error}</div>}
      <AdminCard title="Pending approval">
          {loading ? (
            <div className="py-12 text-center text-winga-muted-foreground">Loading…</div>
          ) : jobs.length === 0 ? (
            <div className="py-16 text-center">
              <div className="w-16 h-16 rounded-2xl bg-winga-primary/10 flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-winga-primary" />
              </div>
              <p className="text-winga-muted-foreground font-medium">No jobs pending moderation</p>
              <p className="text-sm text-winga-muted-foreground mt-1">New job posts will appear here for review.</p>
            </div>
          ) : (
            <ul className="divide-y divide-winga-border">
              {jobs.map((job) => (
                <li key={job.id} className="py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:bg-gray-50 px-6 -mx-6">
                  <div className="flex flex-col gap-1">
                    <p className="font-bold text-[16px] text-foreground">{job.title}</p>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded-md text-winga-muted-foreground">{job.category}</span>
                      <span className="text-sm text-winga-muted-foreground">{job.proposalCount ?? 0} applications</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <AdminButton size="sm" className="bg-winga-primary text-white hover:bg-winga-primary-dark font-medium shadow-sm transition-transform hover:-translate-y-0.5 rounded-lg px-4" isLoading={acting === job.id} onPress={() => handleModerate(job.id, "APPROVED")}>Approve</AdminButton>
                    <AdminButton size="sm" variant="flat" className="text-red-600 hover:bg-red-50 font-medium rounded-lg" isLoading={acting === job.id} onPress={() => handleModerate(job.id, "REJECTED")}>Reject</AdminButton>
                  </div>
                </li>
              ))}
            </ul>
          )}
      </AdminCard>
    </div>
  );
}
