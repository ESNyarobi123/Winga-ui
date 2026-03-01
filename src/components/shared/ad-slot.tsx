"use client";

/**
 * Google AdSense slot placeholder.
 * Set NEXT_PUBLIC_ADSENSE_CLIENT_ID to enable. Otherwise renders an optional placeholder div.
 */
const ADSENSE_CLIENT_ID = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID : undefined;

type AdSlotProps = {
  slotId?: string;
  format?: "auto" | "rectangle" | "vertical" | "horizontal";
  className?: string;
  /** If true and no client ID, render a subtle placeholder for layout */
  showPlaceholder?: boolean;
};

export function AdSlot({ slotId, format = "auto", className = "", showPlaceholder = true }: AdSlotProps) {
  if (ADSENSE_CLIENT_ID && slotId) {
    return (
      <div className={className}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_CLIENT_ID}
          data-ad-slot={slotId}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
        {/* Load AdSense script once per page; typically added in layout or _document */}
      </div>
    );
  }

  if (showPlaceholder) {
    return (
      <div
        className={`min-h-[90px] rounded-lg border border-dashed border-default-200 bg-default-50/50 flex items-center justify-center ${className}`}
        aria-hidden
      >
        <span className="text-xs text-default-400">Ad slot</span>
      </div>
    );
  }

  return null;
}
