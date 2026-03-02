"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";

export default function AdminDisputesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Disputes</h1>
        <p className="text-muted-foreground text-sm">Resolve disputed contracts.</p>
      </div>
      <Card className="border border-border rounded-2xl">
        <CardHeader className="border-b border-border/50">
          <h3 className="font-semibold">Disputed contracts</h3>
        </CardHeader>
        <CardBody className="py-12 text-center text-muted-foreground">
          Connect to <code className="text-foreground">GET /api/admin/disputes</code> to list disputes here.
        </CardBody>
      </Card>
    </div>
  );
}
