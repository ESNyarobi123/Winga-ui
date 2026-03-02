import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { getModerationJobs, moderateJob } from "../api/client";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Job Moderation</h1>
        <p className="text-winga-muted-foreground mt-1 text-[15px]">Review and approve or reject job postings before they go live.</p>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <Card className="border border-winga-border bg-white shadow-sm rounded-2xl overflow-hidden">
        <CardHeader className="px-6 pt-6 pb-3 border-b border-winga-border/50 bg-gray-50/50">
          <h3 className="font-bold text-lg text-foreground">Pending Approval</h3>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          {loading ? (
            <div className="py-12 text-center text-winga-muted-foreground">Loading…</div>
          ) : jobs.length === 0 ? (
            <p className="text-winga-muted-foreground py-12 text-center">No jobs pending moderation.</p>
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
                    <Button size="sm" className="bg-winga-primary text-white hover:bg-winga-primary-dark font-medium shadow-sm transition-transform hover:-translate-y-0.5 rounded-lg px-4" isLoading={acting === job.id} onPress={() => handleModerate(job.id, "APPROVED")}>Approve</Button>
                    <Button size="sm" color="danger" variant="flat" className="font-medium rounded-lg" isLoading={acting === job.id} onPress={() => handleModerate(job.id, "REJECTED")}>Reject</Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
