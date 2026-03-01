import { useEffect } from "react";

/**
 * Simple overlay modal that always shows on top (z-index 9999).
 * Use this when Hero UI Modal doesn't appear so Create/Edit/Delete flows work.
 */
export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  useEffect(() => {
    if (open) {
      const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
      document.addEventListener("keydown", handler);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handler);
        document.body.style.overflow = "";
      };
    }
  }, [open, onClose]);

  if (!open) return null;

  const maxW = size === "sm" ? "max-w-sm" : size === "lg" ? "max-w-2xl" : size === "xl" ? "max-w-4xl" : "max-w-md";

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      />
      {/* Content – solid white (inline style so it never goes transparent) */}
      <div
        className={`relative w-full ${maxW} rounded-2xl shadow-2xl border border-winga-border overflow-hidden modal-content-solid`}
        style={{ backgroundColor: "#ffffff" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-6 pb-2" style={{ backgroundColor: "#ffffff" }}>
          <h2 id="modal-title" className="text-lg font-semibold text-foreground">
            {title}
          </h2>
        </div>
        <div className="px-6 py-4 max-h-[70vh] overflow-y-auto modal-form-body" style={{ backgroundColor: "#ffffff" }}>
          {children}
        </div>
        <div className="px-6 py-4 border-t border-winga-border flex justify-end gap-2" style={{ backgroundColor: "#ffffff" }}>
          {footer}
        </div>
      </div>
    </div>
  );
}
