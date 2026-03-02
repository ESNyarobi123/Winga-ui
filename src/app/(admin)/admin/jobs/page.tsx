"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";

export default function AdminJobsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Jobs</h1>
        <p className="text-muted-foreground text-sm">Manage all jobs (list, filter, edit).</p>
      </div>
      <Card className="border border-border rounded-2xl">
        <CardHeader className="border-b border-border/50">
          <h3 className="font-semibold">All jobs</h3>
        </CardHeader>
        <CardBody className="py-12 text-center text-muted-foreground">
          Connect to <code className="text-foreground">GET /api/admin/jobs</code> to list jobs here.
        </CardBody>
      </Card>
    </div>
  );
}
