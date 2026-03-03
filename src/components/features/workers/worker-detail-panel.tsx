"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronLeft, MapPin, Globe, Clock, CreditCard, Laptop, Type, Wifi, Camera, BadgeCheck } from "lucide-react";
import { Button } from "@heroui/button";
import { useT } from "@/lib/i18n";
import type { WorkerListItem } from "@/types";

type WorkerDetailPanelProps = {
    worker: WorkerListItem | null;
    onClose: () => void;
};

export function WorkerDetailPanel({ worker, onClose }: WorkerDetailPanelProps) {
    const t = useT();

    if (!worker) return null;

    const avatar = worker.profileImageUrl || "https://i.pravatar.cc/150";
    const country = worker.location || "";
    const headline = worker.title || worker.headline || "Full-time";
    const bio = worker.description || "Dedicated and trustworthy online account manager experienced in handling chats, customer support, and social media engagement.";

    return (
        <div className="flex flex-col h-full bg-white w-full">
            {/* Header: custom close button */}
            <div className="flex items-center justify-between shrink-0 px-6 py-4">
                <span className="text-gray-500 font-medium text-sm">Joined today</span>
                <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center justify-center p-2 rounded-full border border-gray-200 hover:bg-gray-50 transition-colors"
                    aria-label="Close"
                >
                    <ChevronRight className="w-5 h-5 text-gray-700" strokeWidth={2.5} />
                </button>
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-y-auto overscroll-contain px-6 pb-24">
                {/* Profile Header Block */}
                <div className="flex items-center gap-4 mb-4">
                    <img
                        src={avatar}
                        alt={worker.name}
                        className="w-[80px] h-[80px] rounded-full object-cover border-[3px] border-white shadow-sm"
                    />
                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h2 className="text-[26px] font-extrabold text-[#006B3E] leading-tight">
                                {worker.name}
                            </h2>
                            {worker.profileVerified && (
                                <span className="text-green-700 font-semibold text-sm bg-green-100 px-2 py-0.5 rounded flex items-center gap-1">
                                    <BadgeCheck className="w-3.5 h-3.5" /> Verified
                                </span>
                            )}
                            {country && <span className="text-lg" title={country}>🌍</span>}
                        </div>
                        <div className="mt-1">
                            <span className="text-[#006B3E] font-bold text-sm bg-[#E8F3EE] px-2 py-1 rounded">
                                {headline}
                            </span>
                        </div>
                    </div>
                </div>

                <p className="text-[15px] font-medium text-gray-700 leading-relaxed mb-6">
                    {bio}
                </p>

                {/* Worker tags as small grey chips */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {worker.tags?.map((tag: string, index: number) => (
                        <span key={index} className="text-[13px] font-bold text-[#006B3E] bg-[#E8F3EE] px-3 py-1.5 rounded-full flex items-center gap-1">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Details list */}
                <div className="space-y-6 border-t border-gray-100 pt-6">
                    {/* Timezone */}
                    <div className="flex flex-col">
                        <span className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" /> Timezone
                        </span>
                        <span className="text-[15px] text-gray-900 font-semibold">Africa/Nairobi (UTC+03:00)</span>
                    </div>

                    {/* Languages */}
                    <div className="flex flex-col">
                        <span className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1">
                            <Globe className="w-3.5 h-3.5" /> Languages
                        </span>
                        <span className="text-[15px] text-gray-900 font-semibold">English - Fluent/Native</span>
                    </div>

                    {/* Preferred Payment */}
                    <div className="flex flex-col">
                        <span className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1">
                            <CreditCard className="w-3.5 h-3.5" /> Preferred Payment
                        </span>
                        <span className="text-[15px] text-gray-900 font-semibold">Any</span>
                    </div>

                    {/* Computer Specs */}
                    <div className="flex flex-col">
                        <span className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1">
                            <Laptop className="w-3.5 h-3.5" /> Computer Specs
                        </span>
                        <span className="text-[15px] text-gray-900 font-semibold">8GB RAM - Windows</span>
                    </div>

                    {/* Typing Speed */}
                    <div className="flex flex-col">
                        <span className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1">
                            <Type className="w-3.5 h-3.5" /> Type Speed (WPM)
                        </span>
                        <span className="text-[15px] text-gray-900 font-semibold">40 - 60 (Intermediate)</span>
                    </div>

                    {/* Internet Speed */}
                    <div className="flex flex-col">
                        <span className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1">
                            <Wifi className="w-3.5 h-3.5" /> Internet Speed (Mbps)
                        </span>
                        <span className="text-[15px] text-gray-900 font-semibold">30Mbps</span>
                    </div>

                    {/* Webcam */}
                    <div className="flex flex-col">
                        <span className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1">
                            <Camera className="w-3.5 h-3.5" /> Webcam
                        </span>
                        <span className="text-[15px] text-gray-900 font-semibold">No</span>
                    </div>
                </div>
            </div>

            {/* Sticky "View Profile" button at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <Button
                    as={Link}
                    href={`/find-workers/profile/${worker.id}`}
                    size="lg"
                    className="w-full font-bold text-[16px] h-14 bg-white hover:bg-gray-50 text-[#006B3E] border-2 border-[#006B3E] rounded-xl transition-colors"
                >
                    View Profile
                </Button>
            </div>
        </div>
    );
}
