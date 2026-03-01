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
        <h1 className="text-2xl font-bold text-foreground">Job moderation</h1>
        <p className="text-winga-muted-foreground">Approve or reject jobs before they go live</p>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <Card className="border border-winga-border bg-white shadow-winga-card rounded-winga-lg">
        <CardHeader className="px-6 pt-6">
          <h3 className="font-semibold">Pending approval</h3>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          {loading ? (
            <div className="py-12 text-center text-winga-muted-foreground">Loading…</div>
          ) : jobs.length === 0 ? (
            <p className="text-winga-muted-foreground py-12 text-center">No jobs pending moderation.</p>
          ) : (
            <ul className="divide-y divide-winga-border">
              {jobs.map((job) => (
                <li key={job.id} className="py-4 flex flex-wrap items-center justify-between gap-4 first:pt-0">
                  <div>
                    <p className="font-medium">{job.title}</p>
                    <p className="text-sm text-winga-muted-foreground">{job.category} · {job.proposalCount ?? 0} applications</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="btn-primary-winga" isLoading={acting === job.id} onPress={() => handleModerate(job.id, "APPROVED")}>Approve</Button>
                    <Button size="sm" color="danger" variant="flat" isLoading={acting === job.id} onPress={() => handleModerate(job.id, "REJECTED")}>Reject</Button>
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
