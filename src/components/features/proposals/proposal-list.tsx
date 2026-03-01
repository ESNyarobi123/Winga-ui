import { Card, CardContent } from "@/components/ui/card";

export function ProposalList() {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Proposals for your jobs will appear here.</p>
      <Card>
        <CardContent className="pt-6">
          No proposals yet.
        </CardContent>
      </Card>
    </div>
  );
}
