"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Users, FileStack, Megaphone, Shield, Headphones, Zap, Play } from "lucide-react";
import { useT } from "@/lib/i18n";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { Switch } from "@heroui/switch";
import { Accordion, AccordionItem } from "@heroui/accordion";

const WHY_ENTERPRISE = [
    { icon: Users, title: "Custom Thousands of Workers", description: "Access and filter a large pool of vetted workers to find the best fit for your roles." },
    { icon: FileStack, title: "Multiple Job Posts", description: "Publish and manage many job listings at once without limits." },
    { icon: Megaphone, title: "Job Postings on Telegram", description: "Reach more candidates by sharing your jobs on Telegram and other channels." },
    { icon: Zap, title: "Priority Matching", description: "Get your jobs in front of the right workers faster with priority placement." },
    { icon: Headphones, title: "Dedicated Support", description: "A dedicated account manager and priority support when you need it." },
    { icon: Shield, title: "Advanced Security", description: "Enterprise-grade security and SLA guarantees for your team and data." },
];

const FAQ_ITEMS = [
    { q: "What is Winga? How does it work?", a: "Winga is a platform that connects employers with remote talent. You post jobs, review applicants, and hire—all in one place. Workers create profiles, apply to jobs, and get hired for remote roles." },
    { q: "Why should I sign up?", a: "Whether you're hiring or looking for work, Winga gives you the tools to find the right match. Employers get access to vetted talent; workers get access to real remote jobs and a supportive community." },
    { q: "Can I cancel my subscription at any time?", a: "Yes. You can cancel from your account settings. You'll keep access until the end of your billing period." },
    { q: "Do you offer refunds?", a: "We offer a 14-day money-back guarantee on annual plans. Contact support if you're not satisfied." },
];

export default function PricingPage() {
    const t = useT();
    const [isAnnual, setIsAnnual] = useState(true);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero – "Hire Top Talent. See Every Detail. Post Without Limits." */}
            <section className="relative pt-16 pb-24 overflow-hidden">
                <div className="absolute inset-0 bg-primary/[0.03]" />
                <div className="container px-4 mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div>
                            <h1 className="text-4xl md:text-[48px] font-extrabold tracking-tight text-foreground mb-6 leading-tight">
                                Hire Top Talent. See Every Detail. Post Without Limits.
                            </h1>
                            <p className="text-lg text-gray-600 mb-8 max-w-xl leading-relaxed">
                                One platform for hiring remote workers. Browse profiles, post jobs, and manage your team—with the transparency and scale that growing businesses need.
                            </p>
                            <div className="flex flex-col sm:flex-row items-start gap-4">
                                <Button as={Link} href="/register" color="primary" size="lg" className="font-bold rounded-xl px-8">
                                    Upgrade to Enterprise
                                </Button>
                                <Link href="#pricing" className="text-primary font-semibold hover:underline text-sm">
                                    Learn more
                                </Link>
                            </div>
                        </div>
                        <div className="relative hidden lg:block">
                            <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200/80 aspect-[4/3] max-h-[420px]">
                                <img
                                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800"
                                    alt="Professional hiring"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* One Platform. Every Hiring Tool You Need. */}
            <section className="py-20 bg-gray-50/80">
                <div className="container px-4 mx-auto max-w-4xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
                        One Platform. Every Hiring Tool You Need.
                    </h2>
                    <p className="text-center text-gray-600 text-lg mb-10">
                        From posting jobs to managing your remote team, everything you need is in one place.
                    </p>
                    <div className="relative rounded-2xl overflow-hidden bg-black aspect-video max-w-4xl mx-auto border border-gray-200 shadow-xl">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Button isIconOnly size="lg" className="rounded-full bg-white/90 text-primary hover:bg-white" aria-label="Play">
                                <Play className="w-8 h-8 fill-current" />
                            </Button>
                        </div>
                        <img
                            src="https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200"
                            alt="Platform overview"
                            className="w-full h-full object-cover opacity-70"
                        />
                    </div>
                </div>
            </section>

            {/* Why Upgrade to Enterprise? */}
            <section className="py-20 bg-background">
                <div className="container px-4 mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
                        Why Upgrade to Enterprise?
                    </h2>
                    <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
                        Get the tools and support you need to hire at scale with confidence.
                    </p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {WHY_ENTERPRISE.map((item, i) => {
                            const Icon = item.icon;
                            const isHighlighted = i === 2;
                            return (
                                <Card
                                    key={item.title}
                                    className={`rounded-2xl border shadow-sm ${isHighlighted ? "border-2 border-primary" : "border-gray-200"}`}
                                >
                                    <CardBody className="p-6">
                                        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                                            <Icon className="w-6 h-6 text-primary" strokeWidth={2} />
                                        </div>
                                        <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                                        <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                                    </CardBody>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Simple, Transparent Pricing */}
            <section id="pricing" className="py-20 bg-white scroll-mt-20">
                <div className="container px-4 mx-auto max-w-6xl">
                    <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-3">
                        {t("pricing.simplePricing")}
                    </h2>
                    <p className="text-center text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
                        {t("pricing.choosePlan")}
                    </p>

                    {/* Toggle + Most Popular badge – green when Annual */}
                    <div className="flex flex-col items-center gap-3 mb-14">
                        <span className="inline-block bg-[#006e42] text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                            Most Popular
                        </span>
                        <div className="flex items-center justify-center gap-4">
                            <span className={`text-[15px] font-semibold ${!isAnnual ? "text-[#006e42]" : "text-gray-400"}`}>Monthly</span>
                            <Switch
                                isSelected={isAnnual}
                                onValueChange={setIsAnnual}
                                size="lg"
                                aria-label="Annual plan"
                                classNames={{
                                    wrapper: "group-data-[selected=true]:bg-[#006e42]",
                                    thumb: "bg-white",
                                }}
                            />
                            <span className={`text-[15px] font-semibold ${isAnnual ? "text-[#006e42]" : "text-gray-400"}`}>Annual</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                        {/* FREE */}
                        <Card className="rounded-2xl border-2 border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow flex flex-col overflow-visible">
                            <CardHeader className="pb-2 pt-8 px-8">
                                <h2 className="text-2xl font-bold text-foreground">FREE</h2>
                                <p className="text-sm text-gray-500 mt-1">Perfect for getting started</p>
                            </CardHeader>
                            <CardBody className="flex-1 flex flex-col pt-0 px-8 pb-8">
                                <div className="mb-6">
                                    <span className="text-4xl font-extrabold text-foreground">$0</span>
                                    <span className="text-gray-500 text-lg">/mo</span>
                                </div>
                                <ul className="space-y-4 mb-8 flex-1">
                                    {["User profiles", "Basic analytics", "Messaging features", "Basic team groups"].map((item) => (
                                        <li key={item} className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-[#006e42] shrink-0 mt-0.5" strokeWidth={2.5} />
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    as={Link}
                                    href="/register"
                                    className="w-full font-semibold rounded-xl h-12 bg-[#e6f3ee] text-[#006e42] border-2 border-[#006e42] hover:bg-[#006e42] hover:text-white"
                                    size="lg"
                                >
                                    Get Started
                                </Button>
                            </CardBody>
                        </Card>

                        {/* Plus – Most Popular */}
                        <Card className="rounded-2xl border-2 border-[#006e42] bg-white shadow-xl flex flex-col relative overflow-visible md:-translate-y-2">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#006e42] text-white text-xs font-bold px-4 py-2 rounded-full shadow-md">
                                Most Popular
                            </div>
                            <CardHeader className="pb-2 pt-10 px-8">
                                <h2 className="text-2xl font-bold text-foreground">Plus</h2>
                                <p className="text-sm text-gray-500 mt-1">For growing businesses</p>
                            </CardHeader>
                            <CardBody className="flex-1 flex flex-col pt-0 px-8 pb-8">
                                <div className="mb-6">
                                    <span className="text-4xl font-extrabold text-foreground">${isAnnual ? "25" : "69"}</span>
                                    <span className="text-gray-500 text-lg">/mo</span>
                                    {isAnnual && <p className="text-sm text-gray-500 mt-1">Billed $299 annually</p>}
                                </div>
                                <ul className="space-y-4 mb-8 flex-1">
                                    {["Advanced analytics", "Customizable workflows", "Priority support", "Task management"].map((item) => (
                                        <li key={item} className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-[#006e42] shrink-0 mt-0.5" strokeWidth={2.5} />
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    as={Link}
                                    href="/register"
                                    className="w-full font-semibold rounded-xl h-12 bg-[#006e42] text-white hover:bg-[#005c36]"
                                    size="lg"
                                >
                                    Get Plus
                                </Button>
                            </CardBody>
                        </Card>

                        {/* Enterprise */}
                        <Card className="rounded-2xl border-2 border-gray-200 bg-white shadow-md hover:shadow-lg transition-shadow flex flex-col overflow-visible">
                            <CardHeader className="pb-2 pt-8 px-8">
                                <h2 className="text-2xl font-bold text-foreground">Enterprise</h2>
                                <p className="text-sm text-gray-500 mt-1">For large scale hiring</p>
                            </CardHeader>
                            <CardBody className="flex-1 flex flex-col pt-0 px-8 pb-8">
                                <div className="mb-6">
                                    <span className="text-4xl font-extrabold text-foreground">${isAnnual ? "44" : "149"}</span>
                                    <span className="text-gray-500 text-lg">/mo</span>
                                    {isAnnual && <p className="text-sm text-gray-500 mt-1">Billed $525 annually</p>}
                                </div>
                                <ul className="space-y-4 mb-8 flex-1">
                                    {["Custom branding", "Dedicated account manager", "SLA guarantees", "Advanced security"].map((item) => (
                                        <li key={item} className="flex items-start gap-3">
                                            <Check className="h-5 w-5 text-[#006e42] shrink-0 mt-0.5" strokeWidth={2.5} />
                                            <span className="text-gray-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    as={Link}
                                    href="/register"
                                    className="w-full font-semibold rounded-xl h-12 py-6 bg-[#006e42] text-white hover:bg-[#005c36]"
                                    size="lg"
                                >
                                    Get Enterprise
                                </Button>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </section>

            {/* FAQ – Accordion */}
            <section className="py-20 bg-background">
                <div className="container px-4 mx-auto max-w-3xl">
                    <h2 className="text-3xl font-bold text-foreground text-center mb-10">
                        Frequently Asked Questions
                    </h2>
                    <Accordion variant="bordered" className="px-0 gap-0">
                        {FAQ_ITEMS.map((item) => (
                            <AccordionItem key={item.q} aria-label={item.q} title={item.q} className="rounded-xl border border-gray-200 shadow-sm mb-3 data-[open=true]:border-primary/50">
                                <p className="text-gray-600 pb-4 leading-relaxed">{item.a}</p>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* Final CTA – dark green */}
            <section className="py-20 bg-primary">
                <div className="container px-4 mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to find your next team member faster?
                    </h2>
                    <p className="text-white/90 max-w-xl mx-auto mb-8 text-lg">
                        Join thousands of employers who are already building their remote teams on Winga.
                    </p>
                    <Button as={Link} href="/register" className="bg-white text-primary font-bold rounded-xl px-8 hover:bg-white/95" size="lg">
                        Hire Now
                    </Button>
                </div>
            </section>
        </div>
    );
}
