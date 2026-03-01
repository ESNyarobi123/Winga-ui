"use client";

import { WorkerSidebar } from "@/components/features/worker/worker-sidebar";
import { WorkerTopbar } from "@/components/features/worker/worker-topbar";
import { FloatingChatButton } from "@/components/features/worker/floating-chat-button";
import { SubscriptionBanner } from "@/components/features/worker/subscription-banner";
import { Logo } from "@/components/shared/logo";

const SIDEBAR_WIDTH = 104;

export default function WorkerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-background flex">
            {/* FIXED: logo + sidebar */}
            <div
                className="fixed left-0 top-0 bottom-0 z-20 flex flex-col bg-background border-r border-default-200 overflow-visible"
                style={{ width: SIDEBAR_WIDTH }}
            >
                <div className="h-14 shrink-0 flex items-center justify-center border-b border-default-200 bg-background">
                    <div className="[&_img]:h-9 [&_img]:w-auto [&_img]:max-w-[52px]">
                        <Logo />
                    </div>
                </div>
                <div className="flex-1 min-h-0 overflow-visible">
                    <WorkerSidebar />
                </div>
            </div>

            {/* SCROLL: header (icons) + main – inaenda na scroll */}
            <div className="flex-1 flex flex-col min-h-screen overflow-y-auto ml-[104px] bg-background">
                <WorkerTopbar />
                <SubscriptionBanner />
                <main className="flex-1 min-w-0">{children}</main>
            </div>

            <FloatingChatButton />
        </div>
    );
}
