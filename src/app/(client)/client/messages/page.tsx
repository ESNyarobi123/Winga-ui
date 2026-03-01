"use client";

import Link from "next/link";

export default function ClientMessagesPage() {
  return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-[800px] mx-auto px-6 py-10">
        <h1 className="text-[24px] font-bold text-[#111827] mb-2">Messages</h1>
        <p className="text-[14px] text-[#666] mb-6">
          Your conversations with workers will appear here.
        </p>
        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-8 text-center">
          <p className="text-[15px] text-[#555]">No messages yet.</p>
          <Link href="/client/workers" className="inline-block mt-4 text-[#006e42] font-semibold hover:underline">
            Find workers to message
          </Link>
        </div>
      </div>
    </div>
  );
}
