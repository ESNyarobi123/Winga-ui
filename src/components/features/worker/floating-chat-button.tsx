"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

/**
 * Green floating chat bubble bottom-right (like reference image).
 * Links to chat page.
 */
export function FloatingChatButton() {
    return (
        <Link
            href="/chat"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#006e42] text-white shadow-lg hover:bg-[#005a35] active:scale-95 transition-all flex items-center justify-center"
            aria-label="Open chat"
        >
            <MessageCircle className="w-7 h-7" strokeWidth={2} />
        </Link>
    );
}
