"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Globe, CreditCard, Laptop, Type, Wifi, Camera } from "lucide-react";
import { dummyWorkers } from "@/data/dummy-workers";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";

export default function WorkerProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    // In React 19 / Next.js 15, `params` is a Promise, so we must `use()` it.
    const resolvedParams = use(params);
    const [worker, setWorker] = useState<any>(null);

    useEffect(() => {
        const found = dummyWorkers.find(w => w.id === resolvedParams.id);
        if (found) {
            setWorker(found);
        } else {
            // fallback to first if not found
            setWorker(dummyWorkers[0]);
        }
    }, [resolvedParams.id]);

    if (!worker) return null;

    return (
        <div className="min-h-screen bg-[#F9FAFB] pt-24 pb-20">
            <div className="container max-w-6xl mx-auto px-4">

                {/* Back button */}
                <button
                    onClick={() => router.back()}
                    className="flex items-center text-sm font-semibold text-gray-500 hover:text-gray-800 transition-colors mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-1" /> Back to workers
                </button>

                {/* Top Header Card */}
                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <img
                            src={worker.avatar}
                            alt={worker.name}
                            className="w-24 h-24 rounded-full object-cover border-[4px] border-white shadow-md"
                        />
                        <div>
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-3xl font-extrabold text-[#006B3E]">{worker.name}</h1>
                                <span className="text-xl" title={worker.country}>🌍</span>
                                <span className="text-[#006B3E] font-bold text-sm bg-[#E8F3EE] px-2 py-1 rounded">
                                    {worker.type || "Full-time"}
                                </span>
                            </div>
                            <p className="text-gray-600 font-medium text-[15px] max-w-xl">
                                {worker.bio}
                            </p>
                        </div>
                    </div>

                    <div className="flex-shrink-0 w-full md:w-auto">
                        <Button
                            className="w-full md:w-auto font-bold text-[15px] px-8 h-12 bg-white text-[#006B3E] border-2 border-[#006B3E] hover:bg-gray-50 rounded-xl"
                        >
                            Message
                        </Button>
                    </div>
                </div>

                {/* Main Content Grid: Two columns */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    {/* Left Column (Details) */}
                    <div className="md:col-span-4 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-extrabold text-gray-900 text-lg mb-6">Personal details</h3>

                            <div className="space-y-5">
                                <div className="flex flex-col">
                                    <span className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1.5">
                                        <Clock className="w-[14px] h-[14px]" /> Timezone
                                    </span>
                                    <span className="text-[14px] text-gray-900 font-bold">Africa/Nairobi (UTC+03:00)</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1.5">
                                        <Globe className="w-[14px] h-[14px]" /> Languages
                                    </span>
                                    <span className="text-[14px] text-gray-900 font-bold">English - Fluent/Native</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1.5">
                                        <CreditCard className="w-[14px] h-[14px]" /> Preferred Payment
                                    </span>
                                    <span className="text-[14px] text-gray-900 font-bold">Any</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-extrabold text-gray-900 text-lg mb-6">Technical specs</h3>

                            <div className="space-y-5">
                                <div className="flex flex-col">
                                    <span className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1.5">
                                        <Laptop className="w-[14px] h-[14px]" /> Computer Specs
                                    </span>
                                    <span className="text-[14px] text-gray-900 font-bold">8GB - Windows</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1.5">
                                        <Type className="w-[14px] h-[14px]" /> Type Speed (WPM)
                                    </span>
                                    <span className="text-[14px] text-gray-900 font-bold">40 - 60 (Intermediate)</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1.5">
                                        <Wifi className="w-[14px] h-[14px]" /> Internet Speed (Mbps)
                                    </span>
                                    <span className="text-[14px] text-gray-900 font-bold">30Mbps</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1.5">
                                        <Camera className="w-[14px] h-[14px]" /> Webcam
                                    </span>
                                    <span className="text-[14px] text-gray-900 font-bold">No</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column (Experiences & Skills) */}
                    <div className="md:col-span-8 space-y-6">
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h3 className="font-extrabold text-gray-900 text-xl mb-6">Experiences</h3>

                            <div className="space-y-8">
                                {/* Experience item */}
                                <div className="bg-[#F9FAFB] border border-gray-100 rounded-xl p-5">
                                    <h4 className="text-xl font-bold text-[#006B3E] mb-1">Freelancing</h4>
                                    <div className="flex flex-col mb-4">
                                        <span className="text-sm font-semibold text-gray-800">Online Account and Chat Support</span>
                                        <span className="text-sm font-medium text-gray-500">March 1, 2026 - Present</span>
                                    </div>
                                    <p className="text-[15px] font-medium text-gray-700 leading-relaxed mb-4">
                                        Managing clients accounts, chats and responding to inquiries.
                                    </p>
                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Skills</span>
                                        <div className="flex flex-wrap gap-2">
                                            {worker.tags?.map((tag: string, idx: number) => (
                                                <Chip
                                                    key={idx}
                                                    variant="bordered"
                                                    className="border-[#006B3E]/30 text-[#006B3E] font-semibold text-[13px] bg-[#E8F3EE]/50 h-8"
                                                >
                                                    {tag}
                                                </Chip>
                                            ))}
                                            <Chip variant="bordered" className="border-[#006B3E]/30 text-[#006B3E] font-semibold text-[13px] bg-[#E8F3EE]/50 h-8">
                                                💬 Chatting
                                            </Chip>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h3 className="font-extrabold text-gray-900 text-xl mb-6">Skills Learned</h3>
                            <div className="flex flex-wrap gap-3">
                                <Chip variant="bordered" className="border-[#006B3E]/40 text-[#006B3E] font-bold text-[14px] bg-[#E8F3EE]/60 px-2 min-h-[40px]">
                                    💬 Chatting - Advanced
                                </Chip>
                                <Chip variant="bordered" className="border-[#006B3E]/40 text-[#006B3E] font-bold text-[14px] bg-[#E8F3EE]/60 px-2 min-h-[40px]">
                                    ✏️ Copywriting - Intermediate
                                </Chip>
                                <Chip variant="bordered" className="border-[#006B3E]/40 text-[#006B3E] font-bold text-[14px] bg-[#E8F3EE]/60 px-2 min-h-[40px]">
                                    🔧 General - Intermediate
                                </Chip>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h3 className="font-extrabold text-gray-900 text-xl mb-6">Social Platforms Used</h3>
                            <div className="flex flex-wrap gap-3">
                                <Chip className="bg-gray-100 text-gray-800 font-bold min-h-[40px]">
                                    Instagram
                                </Chip>
                                <Chip className="bg-gray-100 text-gray-800 font-bold min-h-[40px]">
                                    TikTok
                                </Chip>
                                <Chip className="bg-gray-100 text-gray-800 font-bold min-h-[40px]">
                                    OnlyFans
                                </Chip>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
