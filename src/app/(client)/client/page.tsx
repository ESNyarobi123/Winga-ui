"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientDashboardPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/client/workers");
  }, [router]);
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <p className="text-muted-foreground">Redirecting…</p>
    </div>
  );
}
