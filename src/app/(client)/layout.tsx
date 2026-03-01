"use client";

import { ClientSidebar } from "@/components/features/client/client-sidebar";
import { ClientTopbar } from "@/components/features/client/client-topbar";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-[#fafafa]">
            <ClientSidebar />
            <div className="flex-1 flex flex-col min-w-0 ml-[72px]">
                <ClientTopbar />
                <main className="flex-1">{children}</main>
            </div>
        </div>
    );
}
