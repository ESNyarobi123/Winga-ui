"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type ApplyModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  jobId?: string;
};

export function ApplyModal({ open, onOpenChange, jobId }: ApplyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <h3 className="font-semibold">Apply for job {jobId ?? ""}</h3>
        <p className="text-sm text-muted-foreground">Cover letter and bid form — to be implemented.</p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange?.(false)}>Cancel</Button>
          <Button>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
