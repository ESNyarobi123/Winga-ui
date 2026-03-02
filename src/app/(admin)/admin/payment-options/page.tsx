"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";

export default function AdminPaymentOptionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Payment options</h1>
        <p className="text-muted-foreground text-sm">Manage payment methods.</p>
      </div>
      <Card className="border border-border rounded-2xl">
        <CardHeader className="border-b border-border/50">
          <h3 className="font-semibold">Payment options</h3>
        </CardHeader>
        <CardBody className="py-12 text-center text-muted-foreground">
          Connect to <code className="text-foreground">GET /api/admin/payment-options</code> to list payment options here.
        </CardBody>
      </Card>
    </div>
  );
}
