import { useEffect } from "react";

/**
 * Admin modal: consistent layout, optional description, form-friendly body and footer.
 */
export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
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
      <div className="absolute inset-0 bg-black/50" onClick={onClose} onKeyDown={(e) => e.key === "Escape" && onClose()} />
      <div
        className={`relative w-full ${maxW} rounded-2xl shadow-2xl border border-winga-border overflow-hidden bg-white modal-content-solid`}
        onClick={(e) => e.stopPropagation()}
      >
        <header className="px-6 pt-6 pb-4 border-b border-winga-border/50 bg-white">
          <h2 id="modal-title" className="text-xl font-semibold text-foreground">
            {title}
          </h2>
          {description && <p className="text-sm text-winga-muted-foreground mt-1">{description}</p>}
        </header>
        <div className="px-6 py-5 max-h-[65vh] overflow-y-auto modal-form-body bg-white">
          {children}
        </div>
        <footer className="px-6 py-4 border-t border-winga-border flex justify-end gap-3 bg-white">
          {footer}
        </footer>
      </div>
    </div>
  );
}
