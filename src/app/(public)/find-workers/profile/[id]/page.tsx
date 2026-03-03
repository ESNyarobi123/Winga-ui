"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Globe, CreditCard, Laptop, Type, Wifi, Camera, ClipboardCheck } from "lucide-react";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import { Skeleton } from "@heroui/skeleton";
import { profileService } from "@/services/profile.service";
import type { User } from "@/types";
import type { WorkExperienceItem, CompletedTestItem } from "@/services/profile.service";

export default function WorkerProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const id = resolvedParams.id;
    const [user, setUser] = useState<User | null>(null);
    const [experiences, setExperiences] = useState<WorkExperienceItem[]>([]);
    const [completedTests, setCompletedTests] = useState<CompletedTestItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setNotFound(false);
        profileService
            .getPublicProfile(id)
            .then((u) => {
                setUser(u);
                return Promise.all([
                    profileService.getExperiencesForUser(id).then(setExperiences).catch(() => setExperiences([])),
                    profileService.getCompletedTests(id).then(setCompletedTests).catch(() => setCompletedTests([])),
                ]);
            })
            .catch(() => {
                setUser(null);
                setNotFound(true);
            })
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] pt-24 pb-20">
                <div className="container max-w-6xl mx-auto px-4">
                    <Skeleton className="h-8 w-32 rounded-lg mb-6" />
                    <Skeleton className="h-48 w-full rounded-2xl mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                        <Skeleton className="md:col-span-4 h-64 rounded-2xl" />
                        <Skeleton className="md:col-span-8 h-96 rounded-2xl" />
                    </div>
                </div>
            </div>
        );
    }

    if (notFound || !user) {
        return (
            <div className="min-h-screen bg-[#F9FAFB] pt-24 pb-20 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 font-medium mb-4">Worker profile not found.</p>
                    <Button as={Link} href="/find-workers" variant="flat" color="primary">Back to workers</Button>
                </div>
            </div>
        );
    }

    const skillsArr = user.skills
        ? (user.skills.includes(",") ? user.skills.split(",").map((s) => s.trim()) : [user.skills]).filter(Boolean)
        : [];
    const worker = {
        id: String(user.id),
        name: user.fullName ?? (user as { name?: string }).name ?? user.email ?? "—",
        avatar: user.profileImageUrl ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName ?? user.email ?? "U")}&background=006e42&color=fff`,
        country: user.country ?? "—",
        type: user.workType ?? "—",
        bio: user.bio ?? "No bio yet.",
        tags: skillsArr.length ? skillsArr : ["Available"],
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] pt-24 pb-20">
            <div className="container max-w-6xl mx-auto px-4">

                <Button as={Link} href="/find-workers" variant="light" size="sm" className="mb-6 -ml-2" startContent={<ArrowLeft className="w-4 h-4" />}>
                    Back to workers
                </Button>

                <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <img
                            src={worker.avatar || undefined}
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

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

                    <div className="md:col-span-4 space-y-6">
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h3 className="font-extrabold text-gray-900 text-lg mb-6">Personal details</h3>
                            <div className="space-y-5">
                                <div className="flex flex-col">
                                    <span className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1.5">
                                        <Clock className="w-[14px] h-[14px]" /> Timezone
                                    </span>
                                    <span className="text-[14px] text-gray-900 font-bold">{user.timezone ?? "—"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1.5">
                                        <Globe className="w-[14px] h-[14px]" /> Languages
                                    </span>
                                    <span className="text-[14px] text-gray-900 font-bold">{user.languages ?? "—"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1.5">
                                        <CreditCard className="w-[14px] h-[14px]" /> Preferred Payment
                                    </span>
                                    <span className="text-[14px] text-gray-900 font-bold">{user.paymentPreferences ?? "—"}</span>
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
                                    <span className="text-[14px] text-gray-900 font-bold">{user.computerSpecs ?? "—"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1.5">
                                        <Type className="w-[14px] h-[14px]" /> Type Speed (WPM)
                                    </span>
                                    <span className="text-[14px] text-gray-900 font-bold">{user.typeSpeed ?? "—"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1.5">
                                        <Wifi className="w-[14px] h-[14px]" /> Internet Speed (Mbps)
                                    </span>
                                    <span className="text-[14px] text-gray-900 font-bold">{user.internetSpeed ?? "—"}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[13px] text-gray-500 font-semibold mb-1 flex items-center gap-1.5">
                                        <Camera className="w-[14px] h-[14px]" /> Webcam
                                    </span>
                                    <span className="text-[14px] text-gray-900 font-bold">{user.hasWebcam != null ? (user.hasWebcam ? "Yes" : "No") : "—"}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-8 space-y-6">
                        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                            <h3 className="font-extrabold text-gray-900 text-xl mb-6">Experiences</h3>
                            {experiences.length === 0 ? (
                                <p className="text-gray-500 text-sm">No work experience listed yet.</p>
                            ) : (
                                <div className="space-y-6">
                                    {experiences.map((exp) => (
                                        <div key={exp.id} className="bg-[#F9FAFB] border border-gray-100 rounded-xl p-5">
                                            <h4 className="text-lg font-bold text-[#006B3E] mb-1">{exp.title}</h4>
                                            <div className="flex flex-col mb-2">
                                                <span className="text-sm font-semibold text-gray-800">{exp.company || "—"}</span>
                                                <span className="text-sm font-medium text-gray-500">
                                                    {exp.startDate ?? "—"} — {exp.endDate ?? "Present"}
                                                </span>
                                            </div>
                                            {exp.description && (
                                                <p className="text-[15px] font-medium text-gray-700 leading-relaxed mb-3">{exp.description}</p>
                                            )}
                                            {(exp.skillsLearned?.length ?? 0) > 0 && (
                                                <div className="flex flex-wrap gap-2">
                                                    {exp.skillsLearned!.map((skill, idx) => (
                                                        <Chip key={idx} variant="bordered" className="border-[#006B3E]/30 text-[#006B3E] font-semibold text-[13px] bg-[#E8F3EE]/50 h-8">
                                                            {skill}
                                                        </Chip>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {completedTests.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                                <h3 className="font-extrabold text-gray-900 text-xl mb-4 flex items-center gap-2">
                                    <ClipboardCheck className="w-5 h-5 text-[#006B3E]" /> Completed qualification tests
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {completedTests.map((t) => (
                                        <Chip
                                            key={t.testId}
                                            variant="bordered"
                                            className="border-[#006B3E]/40 text-[#006B3E] font-bold text-[14px] bg-[#E8F3EE]/60 px-3 min-h-[40px]"
                                        >
                                            {t.testName}
                                            {t.bestScore != null ? ` · ${t.bestScore}` : ""}
                                        </Chip>
                                    ))}
                                </div>
                            </div>
                        )}

                        {worker.tags.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                                <h3 className="font-extrabold text-gray-900 text-xl mb-4">Skills</h3>
                                <div className="flex flex-wrap gap-3">
                                    {worker.tags.map((tag, idx) => (
                                        <Chip
                                            key={idx}
                                            variant="bordered"
                                            className="border-[#006B3E]/40 text-[#006B3E] font-bold text-[14px] bg-[#E8F3EE]/60 px-2 min-h-[40px]"
                                        >
                                            {tag}
                                        </Chip>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
