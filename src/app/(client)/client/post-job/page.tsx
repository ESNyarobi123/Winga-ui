"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jobService } from "@/services/job.service";
import { JOB_CATEGORIES } from "@/lib/constants";
import { LocationFields } from "@/components/features/location/location-fields";
import { useT } from "@/lib/i18n";

const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Freelance"];
const PAYMENT_OPTIONS = ["Bank Transfer", "PayPal", "Paxum", "Skrill", "Wise", "Venmo", "Crypto"];
const SKILL_CHIPS = ["General", "Chatting", "Copywriting", "Graphic Design", "Development", "Editing", "Marketing", "Proofreading", "QA", "Finance", "Sales"];
const SOFTWARE_CHIPS = ["After Effects", "Canva", "ChatGPT", "Discord", "Notion", "OnlyFans CRM", "Office", "Photoshop", "Premiere Pro", "Telegram", "Trello", "Zoom"];
const SOCIAL_PLATFORMS = ["OnlyFans", "Instagram", "Telegram", "TikTok", "Discord", "Twitter", "YouTube", "Facebook", "Snapchat", "Twitch", "Reddit", "Pinterest", "LinkedIn", "WhatsApp"];
const PAYOUT_FREQUENCIES = ["Weekly", "Bi-weekly", "Monthly", "Once-off"];
const QUALIFICATION_TESTS = [
    { id: "en-b1", label: "Conversational English (B1)" },
    { id: "en-b2", label: "Intermediate English (B2)" },
    { id: "en-c1", label: "Advanced English (C1)" },
    { id: "internet", label: "Internet Speed" },
    { id: "typing", label: "Typing" },
    { id: "verbal", label: "2-Minute Verbal" },
];

const STEPS = 4;

export default function ClientPostJobPage() {
    const router = useRouter();
    const t = useT();
    const [mode, setMode] = useState<"ai" | "manual">("ai");
    const [description, setDescription] = useState("");
    const [manualStep, setManualStep] = useState(1);
    const [location, setLocation] = useState<{ city?: string; region?: string; latitude?: number; longitude?: number }>({});
    const [attachmentUrlsStr, setAttachmentUrlsStr] = useState("");
    const [manual, setManual] = useState({
        title: "",
        employmentType: "",
        description: "",
        gender: "Any" as "Any" | "Male" | "Female",
        wageType: "Hourly" as string,
        payMin: "",
        payMax: "",
        includeCommission: true,
        commissionStructure: "",
        payoutFrequency: "Weekly" as string,
        paymentTypes: [] as string[],
        skills: [] as string[],
        platforms: [] as string[],
        software: [] as string[],
        language: "",
        blockedCountries: [] as string[],
        qualificationTests: {} as Record<string, boolean>,
        deadline: "",
        category: "",
        experienceLevel: "",
        tags: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    return (
        <div className="min-h-screen bg-[#fafafa]">
            <div className="max-w-[800px] mx-auto px-6 py-10">
                <h1 className="text-[32px] font-extrabold text-[#111827] text-center mb-10">
                    {t("job.postJob")}
                </h1>

                {/* Big Toggle Mode Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                    {/* AI Mode */}
                    <button
                        onClick={() => setMode("ai")}
                        className={`relative p-6 rounded-[16px] border-[2px] text-left transition-all overflow-visible ${mode === "ai"
                            ? "border-[#006e42] bg-white shadow-sm"
                            : "border-[#E0E0E0] bg-white hover:border-[#aaa]"
                            }`}
                    >
                        {mode === "ai" && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#006e42] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md z-10 whitespace-nowrap">
                                RECOMMENDED
                            </div>
                        )}
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className={`w-5 h-5 rounded-full border-[2px] flex items-center justify-center ${mode === "ai"
                                    ? "border-[#006e42] bg-white"
                                    : "border-[#ccc]"
                                    }`}
                            >
                                {mode === "ai" && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#006e42]" />
                                )}
                            </div>
                            <h3 className="text-[17px] font-extrabold text-[#111827]">
                                Generate with AI
                            </h3>
                        </div>
                        <p className="text-[13px] text-[#666] font-medium leading-relaxed pl-8">
                            Describe the role and AI fills everything: title, skills, salary,
                            platforms, and more
                        </p>
                    </button>

                    {/* Manual Mode */}
                    <button
                        onClick={() => setMode("manual")}
                        className={`relative p-6 rounded-[16px] border-[2px] text-left transition-all ${mode === "manual"
                            ? "border-[#006e42] bg-white shadow-sm"
                            : "border-[#E0E0E0] bg-white hover:border-[#aaa]"
                            }`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className={`w-5 h-5 rounded-full border-[2px] flex items-center justify-center ${mode === "manual"
                                    ? "border-[#006e42] bg-white"
                                    : "border-[#ccc]"
                                    }`}
                            >
                                {mode === "manual" && (
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#006e42]" />
                                )}
                            </div>
                            <h3 className="text-[17px] font-extrabold text-[#111827]">
                                Create manually
                            </h3>
                        </div>
                        <p className="text-[13px] text-[#666] font-medium leading-relaxed pl-8">
                            Fill in each field yourself with full control over every detail.
                        </p>
                    </button>
                </div>

                {/* Write Prompt area (only if AI is active) */}
                {mode === "ai" && (
                    <div className="bg-white rounded-[16px] border border-[#e8e8e8] shadow-sm mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="p-6">
                            <h2 className="text-[16px] font-extrabold text-[#111827] mb-1">
                                Describe the job
                            </h2>
                            <p className="text-[13px] font-semibold text-[#555] mb-4">
                                Describe the role, responsibilities, and requirements. This is the
                                only required field ; AI will generate everything else.
                            </p>

                            <div className="relative">
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="eg: We are on the hunt for a dynamic and engaging chat manager to oversee our OnlyFans account! This role requires someone who can dedicate at least 6 hours a day to interact with our community, respond to messages, and keep the conversation lively."
                                    className="w-full h-[180px] p-4 text-[14px] text-[#111827] bg-white border border-[#E0E0E0] rounded-[12px] resize-none outline-none focus:border-[#006e42] focus:ring-1 focus:ring-[#006e42]"
                                />
                            </div>

                            <div className="flex items-center justify-between mt-4">
                                <div className="text-[12px] font-bold text-[#999]">
                                    {description.length} / 1000 characters
                                </div>
                                <button
                                    disabled={description.length < 10}
                                    className="px-5 py-2.5 font-bold text-[13.5px] rounded-[8px] flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed bg-[#006e42] text-white hover:bg-[#005c36] disabled:bg-[#e0e0e0] disabled:text-[#999]"
                                >
                                    <span className="text-[16px]">✨</span> Generate with AI
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Manual form - multi-step */}
                {mode === "manual" && (
                    <div className="bg-white rounded-[16px] border border-[#e8e8e8] shadow-sm p-6 space-y-8">
                        {/* Step indicator */}
                        <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-4">
                            {[1, 2, 3, 4].map((s) => (
                                <button
                                    key={s}
                                    type="button"
                                    onClick={() => setManualStep(s)}
                                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${manualStep === s ? "bg-primary text-primary-foreground" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                                >
                                    {s === 1 ? t("job.step1") : s === 2 ? t("job.step2") : s === 3 ? t("job.step3") : t("job.step4")}
                                </button>
                            ))}
                        </div>

                        {/* Step 1: Category & experience */}
                        {manualStep === 1 && (
                            <section className="space-y-4">
                                <h2 className="text-[17px] font-extrabold text-[#111827]">{t("job.step1")}</h2>
                                <div>
                                    <label className="block text-[13px] font-semibold text-[#555] mb-1">{t("job.category")}</label>
                                    <select
                                        value={manual.category}
                                        onChange={(e) => setManual((m) => ({ ...m, category: e.target.value }))}
                                        className="w-full h-11 px-3 border border-[#E0E0E0] rounded-[10px] text-[14px] focus:outline-none focus:ring-1 focus:ring-[#006e42]"
                                    >
                                        <option value="">Select category</option>
                                        {JOB_CATEGORIES.map((cat) => (
                                            <option key={cat.name} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-[#555] mb-1">Experience level</label>
                                    <select
                                        value={manual.experienceLevel}
                                        onChange={(e) => setManual((m) => ({ ...m, experienceLevel: e.target.value }))}
                                        className="w-full h-11 px-3 border border-[#E0E0E0] rounded-[10px] text-[14px] focus:outline-none focus:ring-1 focus:ring-[#006e42]"
                                    >
                                        <option value="">Any</option>
                                        <option value="JUNIOR">Junior</option>
                                        <option value="MID">Mid</option>
                                        <option value="SENIOR">Senior</option>
                                    </select>
                                </div>
                                <div className="flex justify-end">
                                    <Button type="button" onClick={() => setManualStep(2)} className="bg-[#006e42] hover:bg-[#005c36]">{t("common.next")}</Button>
                                </div>
                            </section>
                        )}

                        {/* Step 2: Title, description, location */}
                        {manualStep === 2 && (
                            <section className="space-y-4">
                                <h2 className="text-[17px] font-extrabold text-[#111827]">{t("job.step2")}</h2>
                                <div>
                                    <label className="block text-[13px] font-semibold text-[#555] mb-1">{t("job.title")}</label>
                                    <Input value={manual.title} onChange={(e) => setManual((m) => ({ ...m, title: e.target.value }))} placeholder="Enter job title" className="h-11" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-[#555] mb-1">{t("job.description")}</label>
                                    <textarea value={manual.description} onChange={(e) => setManual((m) => ({ ...m, description: e.target.value }))} placeholder="Describe the role" className="w-full h-32 p-3 text-[14px] border border-[#E0E0E0] rounded-[10px] resize-none focus:ring-1 focus:ring-[#006e42]" />
                                </div>
                                <div>
                                    <p className="text-[13px] font-semibold text-[#555] mb-2">{t("job.location")}</p>
                                    <LocationFields value={location} onChange={setLocation} />
                                </div>
                                <div className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={() => setManualStep(1)}>{t("common.back")}</Button>
                                    <Button type="button" onClick={() => setManualStep(3)} className="bg-[#006e42] hover:bg-[#005c36]">{t("common.next")}</Button>
                                </div>
                            </section>
                        )}

                        {/* Step 3: Budget & deadline */}
                        {manualStep === 3 && (
                            <section className="space-y-4">
                                <h2 className="text-[17px] font-extrabold text-[#111827]">{t("job.step3")}</h2>
                                <div>
                                    <label className="block text-[13px] font-semibold text-[#555] mb-1">{t("job.budget")} (TZS)</label>
                                    <Input type="number" min={1000} value={manual.payMin || manual.payMax} onChange={(e) => { const v = e.target.value; setManual((m) => ({ ...m, payMin: v, payMax: v })); }} placeholder="e.g. 50000" className="h-11" />
                                </div>
                                <div>
                                    <label className="block text-[13px] font-semibold text-[#555] mb-1">{t("job.deadline")}</label>
                                    <Input type="date" value={manual.deadline} onChange={(e) => setManual((m) => ({ ...m, deadline: e.target.value }))} className="h-11" />
                                </div>
                                <div className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={() => setManualStep(2)}>{t("common.back")}</Button>
                                    <Button type="button" onClick={() => setManualStep(4)} className="bg-[#006e42] hover:bg-[#005c36]">{t("common.next")}</Button>
                                </div>
                            </section>
                        )}

                        {/* Step 4: Attachments */}
                        {manualStep === 4 && (
                            <section className="space-y-4">
                                <h2 className="text-[17px] font-extrabold text-[#111827]">{t("job.step4")}</h2>
                                <p className="text-[13px] text-[#555]">Add attachment URLs (e.g. after uploading files). One URL per line.</p>
                                <textarea
                                    value={attachmentUrlsStr}
                                    onChange={(e) => setAttachmentUrlsStr(e.target.value)}
                                    placeholder="/uploads/photo1.jpg&#10;/uploads/doc.pdf"
                                    className="w-full h-24 p-3 text-[14px] border border-[#E0E0E0] rounded-[10px] resize-none focus:ring-1 focus:ring-[#006e42]"
                                />
                                <div className="flex justify-between">
                                    <Button type="button" variant="outline" onClick={() => setManualStep(3)}>{t("common.back")}</Button>
                                    <Button
                                        disabled={loading || !manual.title || manual.description.length < 30}
                                        className="bg-[#006e42] hover:bg-[#005c36]"
                                        onClick={async () => {
                                            setError("");
                                            setLoading(true);
                                            try {
                                                const budgetNum = Math.max(1000, Number(manual.payMin || manual.payMax) || 1000);
                                                const deadlineStr = manual.deadline || (() => { const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().slice(0, 10); })();
                                                await jobService.createJob({
                                                    title: manual.title,
                                                    description: manual.description,
                                                    budget: budgetNum,
                                                    deadline: deadlineStr,
                                                    category: manual.category || undefined,
                                                    experienceLevel: (manual.experienceLevel as "JUNIOR" | "MID" | "SENIOR") || undefined,
                                                    tags: manual.skills.length ? manual.skills : (manual.tags ? manual.tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined),
                                                    city: location.city,
                                                    region: location.region,
                                                    latitude: location.latitude,
                                                    longitude: location.longitude,
                                                    attachmentUrls: attachmentUrlsStr.trim() ? attachmentUrlsStr.split("\n").map((s) => s.trim()).filter(Boolean) : undefined,
                                                });
                                                router.push("/client/jobs");
                                            } catch (err: unknown) {
                                                setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to post job.");
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                    >
                                        {loading ? "Submitting…" : "Submit for review"}
                                    </Button>
                                </div>
                                {error && <p className="text-sm text-red-600">{error}</p>}
                            </section>
                        )}

                        {/* Legacy long form - hidden when using steps; show only if we want to keep it as alternative. We keep step 1-4 as main flow. */}
                        {manualStep === 0 && (
                            <>
                                <section>
                                    <h2 className="text-[17px] font-extrabold text-[#111827] mb-4">Job Information</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[13px] font-semibold text-[#555] mb-1">Job title</label>
                                            <Input
                                                value={manual.title}
                                                onChange={(e) => setManual((m) => ({ ...m, title: e.target.value }))}
                                                placeholder="Enter job title."
                                                className="h-11"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-semibold text-[#555] mb-1">Type of employment</label>
                                            <select
                                                value={manual.employmentType}
                                                onChange={(e) => setManual((m) => ({ ...m, employmentType: e.target.value }))}
                                                className="w-full h-11 px-3 border border-[#E0E0E0] rounded-[10px] text-[14px] focus:outline-none focus:ring-1 focus:ring-[#006e42]"
                                            >
                                                <option value="">Select option</option>
                                                {EMPLOYMENT_TYPES.map((t) => (
                                                    <option key={t} value={t}>{t}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-[13px] font-semibold text-[#555] mb-1">Description</label>
                                            <textarea
                                                value={manual.description}
                                                onChange={(e) => setManual((m) => ({ ...m, description: e.target.value }))}
                                                placeholder="Describe the role you want to hire."
                                                className="w-full h-32 p-3 text-[14px] border border-[#E0E0E0] rounded-[10px] resize-none focus:outline-none focus:ring-1 focus:ring-[#006e42]"
                                            />
                                            <button type="button" className="mt-1 text-[12px] font-semibold text-[#006e42] hover:underline">
                                                Generate description with AI
                                            </button>
                                        </div>
                                    </div>
                                </section>

                                { /* Gender */}
                                <section>
                                    <p className="text-[13px] font-semibold text-[#555] mb-2">Preferred gender for job applicants.</p>
                                    <div className="flex gap-4">
                                        {(["Any", "Male", "Female"] as const).map((g) => (
                                            <label key={g} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="radio"
                                                    name="gender"
                                                    checked={manual.gender === g}
                                                    onChange={() => setManual((m) => ({ ...m, gender: g }))}
                                                    className="w-4 h-4 text-[#006e42]"
                                                />
                                                <span className="text-[14px] font-medium">{g}</span>
                                            </label>
                                        ))}
                                    </div>
                                </section>

                                {/* Wage/Salary */}
                                <section>
                                    <h2 className="text-[17px] font-extrabold text-[#111827] mb-2">Wage/Salary</h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-[13px] font-semibold text-[#555] mb-1">Wage Type</label>
                                            <select
                                                value={manual.wageType}
                                                onChange={(e) => setManual((m) => ({ ...m, wageType: e.target.value }))}
                                                className="w-full h-11 px-3 border border-[#E0E0E0] rounded-[10px] text-[14px]"
                                            >
                                                <option value="Hourly">Hourly</option>
                                                <option value="Monthly">Monthly</option>
                                                <option value="Fixed">Fixed</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-[13px] font-semibold text-[#555] mb-1">Minimum</label>
                                                <Input type="number" placeholder="Min" value={manual.payMin} onChange={(e) => setManual((m) => ({ ...m, payMin: e.target.value }))} className="h-11" />
                                            </div>
                                            <div>
                                                <label className="block text-[13px] font-semibold text-[#555] mb-1">Maximum (optional)</label>
                                                <Input type="number" placeholder="Max" value={manual.payMax} onChange={(e) => setManual((m) => ({ ...m, payMax: e.target.value }))} className="h-11" />
                                            </div>
                                        </div>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input type="checkbox" checked={manual.includeCommission} onChange={(e) => setManual((m) => ({ ...m, includeCommission: e.target.checked }))} className="rounded text-[#006e42]" />
                                            <span className="text-[13px] font-semibold text-[#555]">Include commission on top of base pay</span>
                                        </label>
                                        <p className="text-[12px] text-[#888]">Example: sales, social, and service roles.</p>
                                        {manual.includeCommission && (
                                            <div>
                                                <label className="block text-[13px] font-semibold text-[#555] mb-1">Commission Structure</label>
                                                <Input value={manual.commissionStructure} onChange={(e) => setManual((m) => ({ ...m, commissionStructure: e.target.value }))} placeholder="e.g. 50% of revenue, 20$ per signup." className="h-11" />
                                            </div>
                                        )}
                                        <div>
                                            <label className="block text-[13px] font-semibold text-[#555] mb-1">Payout Frequency</label>
                                            <div className="flex flex-wrap gap-3">
                                                {PAYOUT_FREQUENCIES.map((f) => (
                                                    <label key={f} className="flex items-center gap-2 cursor-pointer">
                                                        <input type="radio" name="payout" checked={manual.payoutFrequency === f} onChange={() => setManual((m) => ({ ...m, payoutFrequency: f }))} className="w-4 h-4 text-[#006e42]" />
                                                        <span className="text-[14px]">{f}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Payment Type */}
                                <section>
                                    <p className="text-[13px] font-semibold text-[#555] mb-2">How will you pay your workers?</p>
                                    <div className="flex flex-wrap gap-3">
                                        {PAYMENT_OPTIONS.map((opt) => (
                                            <label key={opt} className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={manual.paymentTypes.includes(opt)}
                                                    onChange={() => setManual((m) => ({
                                                        ...m,
                                                        paymentTypes: m.paymentTypes.includes(opt) ? m.paymentTypes.filter((x) => x !== opt) : [...m.paymentTypes, opt],
                                                    }))}
                                                    className="rounded text-[#006e42]"
                                                />
                                                <span className="text-[14px]">{opt}</span>
                                            </label>
                                        ))}
                                    </div>
                                </section>

                                {/* Skills */}
                                <section>
                                    <p className="text-[13px] font-semibold text-[#555] mb-2">Select skills required to do this job.</p>
                                    <div className="flex flex-wrap gap-2">
                                        {SKILL_CHIPS.map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setManual((m) => ({
                                                    ...m,
                                                    skills: m.skills.includes(s) ? m.skills.filter((x) => x !== s) : [...m.skills, s],
                                                }))}
                                                className={`px-4 py-2 rounded-full text-[13px] font-semibold border transition-colors ${manual.skills.includes(s) ? "bg-[#006e42] text-white border-[#006e42]" : "bg-white border-[#E0E0E0] text-[#555] hover:border-[#006e42]/50"}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                        <button type="button" className="px-4 py-2 rounded-full text-[13px] font-semibold text-[#006e42] border border-[#006e42] hover:bg-[#eaf5ef]">
                                            + Add suggestion
                                        </button>
                                    </div>
                                </section>

                                {/* Social media platforms */}
                                <section>
                                    <p className="text-[13px] font-semibold text-[#555] mb-2">Select social media platforms the job applicant will be working with.</p>
                                    <div className="flex flex-wrap gap-3">
                                        {SOCIAL_PLATFORMS.map((p) => (
                                            <button
                                                key={p}
                                                type="button"
                                                onClick={() => setManual((m) => ({
                                                    ...m,
                                                    platforms: m.platforms.includes(p) ? m.platforms.filter((x) => x !== p) : [...m.platforms, p],
                                                }))}
                                                className={`w-12 h-12 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${manual.platforms.includes(p) ? "bg-[#006e42] text-white border-[#006e42]" : "bg-white border-[#E0E0E0] hover:border-[#006e42]/50"}`}
                                                title={p}
                                            >
                                                {p.slice(0, 2)}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                {/* Software */}
                                <section>
                                    <p className="text-[13px] font-semibold text-[#555] mb-2">Choose software that the job applicant must be familiar with.</p>
                                    <div className="flex flex-wrap gap-2">
                                        {SOFTWARE_CHIPS.map((s) => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setManual((m) => ({
                                                    ...m,
                                                    software: m.software.includes(s) ? m.software.filter((x) => x !== s) : [...m.software, s],
                                                }))}
                                                className={`px-4 py-2 rounded-full text-[13px] font-semibold border transition-colors ${manual.software.includes(s) ? "bg-[#006e42] text-white border-[#006e42]" : "bg-white border-[#E0E0E0] text-[#555] hover:border-[#006e42]/50"}`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                        <button type="button" className="px-4 py-2 rounded-full text-[13px] font-semibold text-[#006e42] border border-[#006e42] hover:bg-[#eaf5ef]">
                                            + Add suggestion
                                        </button>
                                    </div>
                                </section>

                                {/* Language */}
                                <section>
                                    <p className="text-[13px] font-semibold text-[#555] mb-2">What languages do you expect your worker to speak?</p>
                                    <div className="flex gap-2 items-center">
                                        <select
                                            value={manual.language}
                                            onChange={(e) => setManual((m) => ({ ...m, language: e.target.value }))}
                                            className="h-11 px-3 border border-[#E0E0E0] rounded-[10px] text-[14px] min-w-[180px] focus:ring-1 focus:ring-[#006e42]"
                                        >
                                            <option value="">Select languages</option>
                                            <option value="English">English</option>
                                            <option value="Spanish">Spanish</option>
                                            <option value="French">French</option>
                                            <option value="Swahili">Swahili</option>
                                        </select>
                                        <button type="button" className="px-4 py-2 rounded-full text-[13px] font-semibold text-[#006e42] border border-[#006e42] hover:bg-[#eaf5ef]">+ Add suggestion</button>
                                    </div>
                                </section>

                                {/* Blocked Countries */}
                                <section>
                                    <p className="text-[13px] font-semibold text-[#555] mb-2">Select countries where this job should not be available.</p>
                                    <select
                                        multiple
                                        value={manual.blockedCountries}
                                        onChange={(e) => setManual((m) => ({
                                            ...m,
                                            blockedCountries: Array.from(e.target.selectedOptions, (o) => o.value),
                                        }))}
                                        className="w-full min-h-[80px] px-3 py-2 border border-[#E0E0E0] rounded-[10px] text-[14px]"
                                    >
                                        <option value="US">United States</option>
                                        <option value="GB">United Kingdom</option>
                                        <option value="KE">Kenya</option>
                                        <option value="TZ">Tanzania</option>
                                    </select>
                                </section>

                                {/* Qualification Tests */}
                                <section>
                                    <p className="text-[13px] font-semibold text-[#555] mb-2">Add tests the applicants must pass in order to apply for your job post.</p>
                                    <div className="bg-[#eaf5ef] border border-[#006e42]/30 rounded-xl p-4 mb-4">
                                        <p className="text-[13px] font-semibold text-[#111827] mb-1">Watch how it works!</p>
                                        <p className="text-[12px] text-[#555] mb-2">See a preview of the tests from a user&apos;s perspective to understand their experience.</p>
                                        <button type="button" className="text-[13px] font-bold text-[#006e42] hover:underline">Review Preview</button>
                                    </div>
                                    <div className="space-y-3">
                                        {QUALIFICATION_TESTS.map((t) => (
                                            <label key={t.id} className="flex items-center justify-between cursor-pointer py-2 border-b border-[#f0f0f0]">
                                                <span className="text-[14px] font-medium">{t.label}</span>
                                                <input
                                                    type="checkbox"
                                                    checked={manual.qualificationTests[t.id] ?? false}
                                                    onChange={(e) => setManual((m) => ({ ...m, qualificationTests: { ...m.qualificationTests, [t.id]: e.target.checked } }))}
                                                    className="rounded text-[#006e42] w-5 h-5"
                                                />
                                            </label>
                                        ))}
                                    </div>
                                </section>

                                {error && <p className="text-sm text-red-600">{error}</p>}

                                <div className="flex flex-wrap items-center gap-4 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="border-2 border-[#006e42] text-[#006e42] hover:bg-[#eaf5ef]"
                                        onClick={() => router.push("/client/jobs")}
                                    >
                                        Save as draft
                                    </Button>
                                    <Button
                                        disabled={loading || !manual.title || manual.description.length < 30}
                                        className="bg-[#006e42] hover:bg-[#005c36]"
                                        onClick={async () => {
                                            setError("");
                                            setLoading(true);
                                            try {
                                                const budgetNum = Math.max(1000, Number(manual.payMin) || 1000);
                                                const deadlineStr = manual.deadline || (() => { const d = new Date(); d.setDate(d.getDate() + 7); return d.toISOString().slice(0, 10); })();
                                                await jobService.createJob({
                                                    title: manual.title,
                                                    description: manual.description,
                                                    budget: budgetNum,
                                                    deadline: deadlineStr,
                                                    category: manual.category || undefined,
                                                    experienceLevel: (manual.experienceLevel as "JUNIOR" | "MID" | "SENIOR") || undefined,
                                                    tags: manual.skills.length ? manual.skills : (manual.tags ? manual.tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined),
                                                });
                                                router.push("/client/jobs");
                                            } catch (err: unknown) {
                                                setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to post job.");
                                            } finally {
                                                setLoading(false);
                                            }
                                        }}
                                    >
                                        {loading ? "Submitting…" : "Submit for review"}
                                    </Button>
                                    <Link href="/client/jobs" className="text-[14px] font-semibold text-[#666] hover:text-[#006e42]">
                                        Back
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                )}

                {/* Lower Info Area for AI preview */}
                {mode === "ai" && (
                    <div className="bg-transparent border border-dashed border-[#d0d0d0] rounded-[16px] p-6 text-center animate-in fade-in duration-500 relative mt-8">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#fafafa] px-2 text-[#999]">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6" /></svg>
                        </div>
                        <p className="text-[13.5px] text-[#555] font-semibold mb-6 mt-4">
                            Form fields will appear here after AI generation or switch to manual mode to fill them yourself.
                        </p>
                        <div className="flex items-center justify-center gap-3 mb-6 flex-wrap">
                            <span className="text-[12px] font-bold text-[#888]">AI will fill:</span>
                            {["Job Title", "Employment Type", "Skills", "Platforms", "Salary"].map((tag) => (
                                <div key={tag} className="px-3 py-1 bg-white border border-[#e8e8e8] text-[#006e42] text-[12px] font-bold rounded-full shadow-sm">
                                    {tag}
                                </div>
                            ))}
                        </div>
                        <div className="text-[12px] font-semibold text-[#f59e0b] bg-[#fffbeb] px-4 py-2 rounded-lg inline-flex items-center gap-1.5 border border-[#fef3c7]">
                            ⚠️ Please review all job details generated by AI to ensure accuracy before publishing.
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
