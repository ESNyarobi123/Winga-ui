import { useEffect, useState } from "react";
import { getDisputes } from "../api/client";
import PageHeader from "../components/PageHeader";
import AdminCard from "../components/AdminCard";

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
    <div className="space-y-6 max-w-6xl">
      <PageHeader
        title="Disputes"
        subtitle="Resolve disputed contracts — release to client or freelancer."
      />
      <AdminCard title="Disputed contracts">
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
          <p className="text-winga-muted-foreground text-sm py-8 text-center bg-gray-50 rounded-xl border border-gray-100">Use dispute detail and resolve endpoints to build the resolve flow.</p>
        )}
      </AdminCard>
    </div>
  );
}
