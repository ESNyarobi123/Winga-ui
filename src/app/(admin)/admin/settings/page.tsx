"use client";

import { Card, CardBody, CardHeader } from "@heroui/card";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground text-sm">Platform and admin settings.</p>
      </div>
      <Card className="border border-border rounded-2xl">
        <CardHeader className="border-b border-border/50">
          <h3 className="font-semibold">Settings</h3>
        </CardHeader>
        <CardBody className="py-12 text-center text-muted-foreground">
          Configure platform settings here.
        </CardBody>
      </Card>
    </div>
  );
}
