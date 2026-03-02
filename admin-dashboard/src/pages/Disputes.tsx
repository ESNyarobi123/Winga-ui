import { useEffect, useState } from "react";
import { Card, CardBody, CardHeader } from "@heroui/react";
import { getDisputes } from "../api/client";

export default function Disputes() {
  const [list, setList] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDisputes(0, 20)
      .then((res) => {
        const d = res.data as { content?: unknown[] };
        setList(d?.content ?? []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Disputes</h1>
        <p className="text-winga-muted-foreground mt-1 text-[15px]">Resolve disputed contracts — release to client or freelancer.</p>
      </div>
      <Card className="border border-winga-border bg-white shadow-sm rounded-2xl overflow-hidden mt-6">
        <CardHeader className="px-6 pt-6 pb-3 border-b border-winga-border/50 bg-gray-50/50">
          <h3 className="font-bold text-lg text-foreground">Disputed Contracts</h3>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          {loading ? (
            <div className="py-12 text-center text-winga-muted-foreground animate-pulse">Loading…</div>
          ) : list.length === 0 ? (
            <div className="py-16 text-center text-winga-muted-foreground flex flex-col items-center">
              <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p className="text-lg font-medium text-gray-400">No active disputes.</p>
              <p className="text-sm mt-1">All clear for now.</p>
            </div>
          ) : (
            <p className="text-winga-muted-foreground text-sm py-8 text-center bg-gray-50 rounded-xl border border-gray-100 mt-4">Use dispute detail and resolve endpoints to build the resolve flow.</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
