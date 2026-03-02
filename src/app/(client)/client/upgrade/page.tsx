"use client";

import { useState } from "react";
import { Check, Play, ChevronDown, Rocket, Users, Briefcase } from "lucide-react";

export default function ClientUpgradePage() {
    const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("annually");
    return (
        <div className="min-h-screen bg-[#f7fdfa] pb-24">
            {/* Top Banner / Hero */}
            <section className="max-w-[1100px] mx-auto px-6 pt-16 pb-12">
                <div className="bg-[#e4efe9] rounded-[24px] overflow-hidden flex flex-col md:flex-row items-center gap-8 relative isolate">
                    <div className="flex-1 p-10 md:pr-0 pl-12 z-10">
                        <h1 className="text-[36px] md:text-[42px] font-extrabold text-[#111827] leading-tight mb-4">
                            Hire Top Talent. See Every<br /> Detail. Post Without Limits.
                        </h1>
                        <p className="text-[15px] text-[#555] mb-8 max-w-[480px] leading-relaxed font-semibold">
                            Our platform connects you with the world&apos;s most talented and vetted professionals to grow your business. Find talent that meets your needs and post jobs without any limits. Upgrade to Enterprise.
                        </p>
                        <button className="px-6 py-3 bg-[#006e42] hover:bg-[#005c36] text-white text-[15px] font-bold rounded-full transition-colors shadow-md">
                            Upgrade to Enterprise
                        </button>
                    </div>
                    <div className="flex-1 relative self-stretch min-h-[300px] md:min-h-auto">
                        <div className="absolute inset-0 right-0 top-0 bottom-0 bg-cover bg-center rounded-l-[100px]" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=2664&auto=format&fit=crop')" }}>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#e4efe9] via-transparent to-transparent pointer-events-none" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Video Section */}
            <section className="max-w-[900px] mx-auto px-6 text-center mb-20">
                <h2 className="text-[32px] font-extrabold text-[#111827] mb-4">
                    One Platform. Every Hiring Tool You Need.
                </h2>
                <p className="text-[15px] text-[#555] max-w-[700px] mx-auto mb-10 font-medium">
                    Take a quick tour of the Winga platform features natively built for agencies,
                    talent scouts, and top talent — all on one powerful platform minus the hiring constraints.
                </p>

                {/* Video Player Mockup */}
                <div className="relative aspect-video bg-[#333] rounded-[24px] overflow-hidden shadow-2xl group cursor-pointer border border-[#e8e8e8]">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#00000080]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-[80px] h-[80px] rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all">
                            <Play className="w-[30px] h-[30px] text-white ml-2" fill="white" />
                        </div>
                    </div>
                    {/* Mockup UI items */}
                    <div className="absolute top-1/2 left-10 -translate-y-1/2 w-8 h-12 bg-[#006e42] rounded-r-lg opacity-80" />
                    <div className="absolute top-1/2 right-10 -translate-y-1/2 w-8 h-12 bg-[#006e42] rounded-l-lg opacity-80" />
                </div>
            </section>

            {/* Why Upgrade Grid */}
            <section className="max-w-[1000px] mx-auto px-6 mb-24">
                <div className="text-center mb-10">
                    <h2 className="text-[28px] font-extrabold text-[#111827] mb-2">
                        Why Upgrade to Enterprise?
                    </h2>
                    <p className="text-[14px] text-[#555] font-medium">
                        Transform your hiring process with enterprise features designed for scale and quality.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white border border-[#E8E8E8] rounded-[16px] p-8 text-center shadow-sm">
                        <div className="w-12 h-12 mx-auto bg-[#eaf5ef] rounded-[12px] flex items-center justify-center mb-4">
                            <Users className="w-5 h-5 text-[#006e42]" />
                        </div>
                        <h3 className="text-[15px] font-bold text-[#111827] mb-2">Access Thousands of Workers</h3>
                        <p className="text-[13px] text-[#666] leading-relaxed">Tap into a vast network of vetted professionals ready to join your team today.</p>
                    </div>
                    <div className="bg-white border border-[#E8E8E8] rounded-[16px] p-8 text-center shadow-sm">
                        <div className="w-12 h-12 mx-auto bg-[#eaf5ef] rounded-[12px] flex items-center justify-center mb-4">
                            <Briefcase className="w-5 h-5 text-[#006e42]" />
                        </div>
                        <h3 className="text-[15px] font-bold text-[#111827] mb-2">Multiple Job Posts</h3>
                        <p className="text-[13px] text-[#666] leading-relaxed">No limits. Post as many jobs as you need to find the perfect candidate.</p>
                    </div>
                    <div className="bg-white border border-[#006e42]/20 rounded-[16px] p-8 text-center shadow-md relative overflow-hidden">
                        <div className="absolute top-0 inset-x-0 h-1 bg-[#006e42]" />
                        <div className="w-12 h-12 mx-auto bg-[#eaf5ef] rounded-[12px] flex items-center justify-center mb-4">
                            <Rocket className="w-5 h-5 text-[#006e42]" />
                        </div>
                        <h3 className="text-[15px] font-bold text-[#111827] mb-2">Job Promotion on Telegram</h3>
                        <p className="text-[13px] text-[#666] leading-relaxed">We automatically promote your jobs to our massive Telegram community.</p>
                    </div>
                </div>
            </section>

            {/* Pricing Cards */}
            <section className="max-w-[1100px] mx-auto px-6 mb-24">
                <div className="text-center mb-10">
                    <h2 className="text-[32px] font-extrabold text-[#111827] mb-4">
                        Simple, Transparent Pricing
                    </h2>
                    <div className="inline-flex items-center gap-1.5 p-1.5 bg-white border border-[#E0E0E0] rounded-full mx-auto shadow-sm">
                        <button
                            onClick={() => setBillingPeriod("monthly")}
                            className={`px-6 py-2.5 rounded-full text-[13px] font-bold transition-all ${billingPeriod === "monthly" ? "bg-[#006e42] text-white" : "text-[#666] hover:bg-[#f9fafb]"}`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingPeriod("annually")}
                            className={`px-6 py-2.5 rounded-full text-[13px] font-bold transition-all ${billingPeriod === "annually" ? "bg-[#006e42] text-white" : "text-[#666] hover:bg-[#f9fafb]"}`}
                        >
                            Annually
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    {/* Free - image 4 */}
                    <div className="bg-white border border-[#E8E8E8] rounded-3xl p-8 pb-10 shadow-sm relative overflow-hidden h-full flex flex-col">
                        <h3 className="text-[20px] font-extrabold text-[#111827] mb-2">FREE</h3>
                        <p className="text-[13px] text-[#666] font-medium mb-6 min-h-[40px]">
                            Free to join. Free to post 1 job.
                        </p>
                        <div className="mb-6 flex-1">
                            <div className="text-[40px] font-extrabold text-[#111827] leading-none mb-1">FREE</div>
                        </div>
                        <button className="w-full py-3.5 bg-white border-2 border-[#006e42] text-[#006e42] font-bold rounded-full mb-8 hover:bg-[#eaf5ef] transition-colors">
                            Get Started Free
                        </button>
                        <div className="space-y-3 text-[13px] font-medium text-[#555]">
                            <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-[#006e42] shrink-0 mt-0.5" />
                                <span>1 Active Job Post</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-[#006e42] shrink-0 mt-0.5" />
                                <span>2 Contacts per Month</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-[#006e42] shrink-0 mt-0.5" />
                                <span>Chat with Workers</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-[#006e42] shrink-0 mt-0.5" />
                                <span>Telegram Community</span>
                            </div>
                        </div>
                    </div>

                    {/* Plus - image 4 */}
                    <div className="bg-white border border-[#E8E8E8] rounded-3xl p-8 pb-10 shadow-md relative overflow-hidden h-full flex flex-col">
                        <h3 className="text-[20px] font-extrabold text-[#111827] mb-2">Plus</h3>
                        <p className="text-[13px] text-[#666] font-medium mb-6 min-h-[40px]">
                            More job posts. More contacts. More features.
                        </p>
                        <div className="mb-6 flex-1">
                            <div className="flex items-baseline gap-1">
                                <span className="text-[40px] font-extrabold text-[#111827] leading-none">${billingPeriod === "annually" ? "25" : "29"}</span>
                                <span className="text-[14px] text-[#888] font-medium">/ month</span>
                            </div>
                            {billingPeriod === "annually" && (
                                <p className="text-[12px] text-[#888]">billed annually</p>
                            )}
                        </div>
                        <button className="w-full py-3.5 bg-[#006e42] text-white font-bold rounded-full mb-8 hover:bg-[#005c36] shadow-sm transition-colors">
                            Upgrade to Plus
                        </button>
                        <div className="space-y-3 text-[13px] font-medium text-[#555]">
                            <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-[#006e42] shrink-0 mt-0.5" />
                                <span>5 Active Job Posts</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-[#006e42] shrink-0 mt-0.5" />
                                <span>Unlimited Contacts</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-[#006e42] shrink-0 mt-0.5" />
                                <span>Chat with Workers</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-[#006e42] shrink-0 mt-0.5" />
                                <span>Telegram Community</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-[#006e42] shrink-0 mt-0.5" />
                                <span>Advanced Search Filters</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-[#006e42] shrink-0 mt-0.5" />
                                <span>Job Promotion on Telegram</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-[#006e42] shrink-0 mt-0.5" />
                                <span>Verified Employer Badge</span>
                            </div>
                        </div>
                    </div>

                    {/* Enterprise - image 4 highlighted */}
                    <div className="bg-white border-2 border-[#006e42] rounded-3xl p-8 pb-10 shadow-lg relative overflow-hidden h-full flex flex-col md:scale-[1.02] z-10">
                        <div className="absolute top-0 right-0 bg-[#006e42] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-bl-lg">
                            Best value
                        </div>
                        <h3 className="text-[20px] font-extrabold text-[#006e42] mb-2">Enterprise</h3>
                        <p className="text-[13px] text-[#666] font-medium mb-6 min-h-[40px]">
                            Projects based. Tailored for agencies & power users.
                        </p>
                        <div className="mb-6 flex-1">
                            <div className="flex items-baseline gap-1">
                                <span className="text-[40px] font-extrabold text-[#111827] leading-none">${billingPeriod === "annually" ? "44" : "49"}</span>
                                <span className="text-[14px] text-[#888] font-medium">/ month</span>
                            </div>
                            {billingPeriod === "annually" && (
                                <p className="text-[12px] text-[#888]">billed annually</p>
                            )}
                        </div>
                        <button className="w-full py-3.5 bg-[#006e42] text-white font-bold rounded-full mb-8 hover:bg-[#005c36] shadow-md transition-colors">
                            Upgrade to Enterprise
                        </button>
                        <div className="space-y-3 text-[13px] font-medium text-[#555]">
                            <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-[#006e42] shrink-0 mt-0.5" />
                                <span className="font-semibold text-[#111827]">Everything in Plus, plus:</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-[#006e42] shrink-0 mt-0.5" />
                                <span>Unlimited Job Posts</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-[#006e42] shrink-0 mt-0.5" />
                                <span>Share Hiring Badge</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-[#006e42] shrink-0 mt-0.5" />
                                <span>Dedicated Account Manager</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-[#006e42] shrink-0 mt-0.5" />
                                <span>Custom Onboarding</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-[#006e42] shrink-0 mt-0.5" />
                                <span>Custom Integrations</span>
                            </div>
                            <div className="flex items-start gap-2.5">
                                <Check className="w-4 h-4 text-[#006e42] shrink-0 mt-0.5" />
                                <span>Team Access</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="max-w-[700px] mx-auto px-6 mb-20">
                <div className="text-center mb-10">
                    <h2 className="text-[28px] font-extrabold text-[#111827] mb-2">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-[14px] text-[#555] font-medium">
                        Have questions? We're here to help. Or join our Telegram community.
                    </p>
                </div>

                <div className="space-y-3">
                    {[
                        "What is Winga?",
                        "Is Winga a recruitment agency?",
                        "How do I hire talent on Winga?",
                        "What is an Winga Team member?",
                        "How much does Winga cost?",
                        "Can I use Winga for free?"
                    ].map((q, idx) => (
                        <div key={idx} className="bg-white border border-[#E8E8E8] rounded-2xl px-6 py-4 flex items-center justify-between cursor-pointer hover:border-[#006e42]/30 transition-colors shadow-sm">
                            <h4 className="text-[14px] font-bold text-[#111827]">{q}</h4>
                            <ChevronDown className="w-5 h-5 text-[#006e42] shrink-0" />
                        </div>
                    ))}
                </div>
            </section>

            {/* Footer Banner CTA - image 4 */}
            <section className="bg-[#006e42] text-white max-w-[1100px] mx-auto rounded-[32px] px-10 py-16 text-center shadow-xl">
                <h2 className="text-[32px] font-extrabold mb-4">Ready to find your next team member faster?</h2>
                <p className="text-[16px] text-white/90 font-medium mb-8">
                    We make it easy to find and hire the best talent for your business.
                </p>
                <button className="px-8 py-3.5 bg-white text-[#006e42] text-[15px] font-bold rounded-full shadow-lg hover:bg-gray-50 transition-colors border-2 border-white">
                    Start Hiring Now
                </button>
            </section>
        </div>
    );
}
