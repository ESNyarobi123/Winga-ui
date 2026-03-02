"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";

export default function AdminApplicationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Applications</h1>
        <p className="text-muted-foreground text-sm">Manage proposals and bids.</p>
      </div>
      <Card className="border border-border rounded-2xl">
        <CardHeader className="border-b border-border/50">
          <h3 className="font-semibold">Proposals</h3>
        </CardHeader>
        <CardBody className="py-12 text-center text-muted-foreground">
          Connect to <code className="text-foreground">GET /api/admin/proposals</code> to list applications here.
        </CardBody>
      </Card>
    </div>
  );
}
