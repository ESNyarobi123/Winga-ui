"use client";

import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { contractService } from "@/services/contract.service";
import type { ContractSummary } from "@/services/contract.service";

type HireModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  proposalId?: number | string;
  freelancerName?: string;
  /** Called after successful hire (e.g. refresh applicants list) */
  onHired?: (contract: ContractSummary) => void;
};

export function HireModal({ open, onOpenChange, proposalId, freelancerName, onHired }: HireModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleConfirm() {
    if (proposalId == null) return;
    setLoading(true);
    setError(null);
    try {
      const contract = await contractService.hire(proposalId);
      onHired?.(contract);
      onOpenChange?.(false);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to hire. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <h3 className="font-semibold">Hire freelancer (Escrow)</h3>
        <p className="text-sm text-muted-foreground">
          {freelancerName ? `Hire ${freelancerName}? ` : ""}A contract will be created and funds secured in escrow.
        </p>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange?.(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
            {loading ? "Hiring…" : "Confirm Hire"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
