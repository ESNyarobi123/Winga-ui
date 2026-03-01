"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}) {
  const [isOpen, setOpen] = useState(open ?? false);
  const controlled = open !== undefined;
  const show = controlled ? open : isOpen;
  const setShow = controlled && onOpenChange ? onOpenChange : setOpen;

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setShow(false)}
        aria-hidden
      />
      <div className="relative z-50 rounded-lg border bg-background p-6 shadow-lg">
        {children}
      </div>
    </div>
  );
}

export function DialogContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn(className)} {...props} />;
}
