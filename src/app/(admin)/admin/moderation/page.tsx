"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";

export default function AdminModerationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Moderation</h1>
        <p className="text-muted-foreground text-sm">Approve or reject job postings.</p>
      </div>
      <Card className="border border-border rounded-2xl">
        <CardHeader className="border-b border-border/50">
          <h3 className="font-semibold">Pending approval</h3>
        </CardHeader>
        <CardBody className="py-12 text-center text-muted-foreground">
          Connect to <code className="text-foreground">GET /api/admin/jobs/moderation</code> to list jobs here.
        </CardBody>
      </Card>
    </div>
  );
}
