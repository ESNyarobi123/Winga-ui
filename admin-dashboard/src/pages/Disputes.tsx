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
        <h1 className="text-2xl font-bold text-foreground">Disputes</h1>
        <p className="text-winga-muted-foreground">Resolve disputed contracts — release to client or freelancer</p>
      </div>
      <Card className="border border-winga-border bg-white shadow-winga-card rounded-winga-lg">
        <CardHeader className="px-6 pt-6">
          <h3 className="font-semibold">Disputed contracts</h3>
        </CardHeader>
        <CardBody className="px-6 pb-6">
          {loading ? (
            <div className="py-12 text-center text-winga-muted-foreground">Loading…</div>
          ) : list.length === 0 ? (
            <p className="text-winga-muted-foreground py-12 text-center">No disputes.</p>
          ) : (
            <p className="text-winga-muted-foreground text-sm">Use dispute detail and resolve endpoints to build the resolve flow.</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
