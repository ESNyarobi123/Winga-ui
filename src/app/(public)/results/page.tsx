"use client";

import { useState } from "react";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Avatar } from "@heroui/avatar";
import { Star } from "lucide-react";

const VIDEOS = [
    {
        id: 1,
        url: "https://www.w3schools.com/html/mov_bbb.mp4", // placeholder
        type: "worker",
    },
    {
        id: 2,
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        type: "worker",
    },
    {
        id: 3,
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        type: "worker",
    },
    {
        id: 4,
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        type: "employer",
    },
    {
        id: 5,
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        type: "employer",
    },
    {
        id: 6,
        url: "https://www.w3schools.com/html/mov_bbb.mp4",
        type: "employer",
    },
];

const TESTIMONIALS = [
    { name: "Danielle R.", role: "General Creator", quote: "Winga gave me the flexibility I needed. I can now work with clients worldwide from home and manage my own schedule.", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face" },
    { name: "Marco L.", role: "Virtual Assistant", quote: "From application to my first paycheck, the process was clear and supportive. I finally feel like I'm building a real career.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
    { name: "Bea N.", role: "Social Media Manager", quote: "I landed my dream remote role through Winga. The team really cares about matching the right people with the right opportunities.", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
    { name: "RJ F.", role: "Graphic Designer", quote: "Working remotely for international clients has changed my life. The platform is professional and the support is always there when you need it.", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face" },
    { name: "Lenie A.", role: "Customer Support VA", quote: "I was nervous at first, but the community and resources here made everything easier. Now I have stable income and more time for my family.", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face" },
];

export default function RealResultsPage() {
    const [activeTab, setActiveTab] = useState<"employer" | "worker">("worker");

    const filteredVideos = VIDEOS.filter((v) => v.type === activeTab);

    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative pt-20 pb-24 overflow-hidden">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="container px-4 mx-auto relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <h1 className="text-[40px] md:text-[52px] font-extrabold text-primary mb-4 tracking-tight">
                            Genuine Success Stories
                        </h1>
                        <p className="text-[18px] md:text-[20px] text-primary font-medium">
                            Empowering Employers and Workers Alike
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div className="space-y-6">
                            <h2 className="text-[28px] md:text-[32px] font-bold text-foreground leading-tight">
                                We Don&apos;t Just Fill Roles—We Transform Lives
                            </h2>
                            <div className="space-y-4 text-[17px] text-gray-600 leading-relaxed">
                                <p>
                                    Outsourcing isn&apos;t just a smart business move—it&apos;s a game-changer for both
                                    entrepreneurs and global talent. At Winga, we&apos;ve helped countless
                                    visionaries unlock a new level of freedom, flexibility, and growth by building
                                    world-class remote teams.
                                </p>
                                <p>
                                    For founders, that means stepping out of the daily grind and into a more
                                    strategic, fulfilled version of life. For workers, it means new income, better
                                    opportunities, and the chance to thrive.
                                </p>
                                <p className="font-bold text-foreground">
                                    The impact is real—and so are the results.
                                </p>
                                <p>
                                    Below, you&apos;ll find stories from entrepreneurs who radically changed their
                                    businesses and lifestyles with the power of outsourcing. We&apos;re proud to have
                                    played a role in their journey.
                                </p>
                            </div>
                        </div>

                        {/* Right: two layered photos – person on laptop, person on phone */}
                        <div className="relative h-[520px] w-full hidden md:block">
                            <div className="absolute top-0 right-0 w-[58%] h-[70%] rounded-3xl overflow-hidden shadow-2xl z-10 border border-gray-200/80">
                                <img
                                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800"
                                    alt="Remote worker on laptop"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute bottom-0 left-0 w-[55%] h-[48%] rounded-3xl overflow-hidden shadow-xl z-20 border border-gray-200/80">
                                <img
                                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32b7?auto=format&fit=crop&q=80&w=800"
                                    alt="Professional on phone"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Video testimonials – "Lives Transformed Through Winga" */}
            <section className="py-20 bg-gray-50/80">
                <div className="container px-4 mx-auto">
                    <h2 className="text-[32px] md:text-[40px] font-bold text-primary text-center mb-6">
                        Lives Transformed Through Winga
                    </h2>
                    <p className="text-center text-gray-600 max-w-4xl mx-auto mb-12 text-[16px] leading-relaxed">
                        Meet the People Behind the Stories. These aren&apos;t actors or influencers—they&apos;re real members of the Winga community. From virtual
                        assistants and chatters, to social media managers and operators, these are the faces of people who took a chance and landed real, remote
                        work. In their own words, they share what it was like to apply, get hired, and finally work on their own terms.
                    </p>

                    {/* Video grid first */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-10">
                        {filteredVideos.map((video) => (
                            <Card
                                key={video.id}
                                className="overflow-hidden rounded-2xl border border-gray-200 shadow-lg bg-black"
                                shadow="none"
                            >
                                <div className="relative aspect-[9/16] w-full">
                                    <video
                                        controls
                                        className="absolute inset-0 w-full h-full object-cover"
                                        poster="https://images.unsplash.com/photo-1542596594-649edbc13630?auto=format&fit=crop&q=80&w=400&h=700"
                                    >
                                        <source src={video.url} type="video/mp4" />
                                    </video>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Filter buttons below videos – Employers (gray when inactive), Workers (green when active) */}
                    <div className="flex justify-center gap-4">
                        <Button
                            size="lg"
                            radius="full"
                            className={`min-w-[140px] font-bold text-[15px] transition-all ${activeTab === "employer"
                                    ? "bg-primary text-white shadow-md"
                                    : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 shadow-sm"
                                }`}
                            onPress={() => setActiveTab("employer")}
                        >
                            Employers
                        </Button>
                        <Button
                            size="lg"
                            radius="full"
                            className={`min-w-[140px] font-bold text-[15px] transition-all ${activeTab === "worker"
                                    ? "bg-primary text-white shadow-md"
                                    : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 shadow-sm"
                                }`}
                            onPress={() => setActiveTab("worker")}
                        >
                            Workers
                        </Button>
                    </div>
                </div>
            </section>

            {/* Mission – "Changing Lives, One Remote Job at a Time." */}
            <section className="py-20 bg-background">
                <div className="container px-4 mx-auto max-w-4xl">
                    <h2 className="text-[32px] md:text-[40px] font-bold text-primary text-center mb-8">
                        Changing Lives, One Remote Job at a Time.
                    </h2>
                    <div className="space-y-5 text-[17px] text-gray-600 leading-relaxed text-center">
                        <p>
                            We believe everyone deserves the opportunity to work with dignity and grow on their own terms. Remote work isn&apos;t just about convenience—it&apos;s about opening doors for people regardless of where they live.
                        </p>
                        <p>
                            Our platform connects talented individuals with businesses that value quality and reliability. We provide the tools, support, and community so that both employers and workers can succeed together.
                        </p>
                        <p>
                            Whether you&apos;re hiring your first remote team member or taking your first step into remote work, we&apos;re here to support you every step of the way.
                        </p>
                    </div>
                </div>
            </section>

            {/* Text testimonials – 5 cards with stars, quote, avatar, name & role */}
            <section className="py-20 bg-gray-50/80">
                <div className="container px-4 mx-auto">
                    <h2 className="text-[28px] md:text-[34px] font-bold text-primary text-center mb-12">
                        What Our Community Says
                    </h2>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {TESTIMONIALS.slice(0, 3).map((t) => (
                            <Card key={t.name} className="rounded-2xl border border-gray-200 shadow-sm">
                                <CardBody className="p-6">
                                    <div className="flex gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star key={i} className="w-5 h-5 fill-primary text-primary" strokeWidth={0} />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 text-[15px] leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                                    <div className="flex items-center gap-3">
                                        <Avatar src={t.avatar} name={t.name} className="w-12 h-12 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-foreground">{t.name}</p>
                                            <p className="text-sm text-gray-500">{t.role}</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                    <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto mt-6">
                        {TESTIMONIALS.slice(3, 5).map((t) => (
                            <Card key={t.name} className="rounded-2xl border border-gray-200 shadow-sm">
                                <CardBody className="p-6">
                                    <div className="flex gap-1 mb-4">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star key={i} className="w-5 h-5 fill-primary text-primary" strokeWidth={0} />
                                        ))}
                                    </div>
                                    <p className="text-gray-600 text-[15px] leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                                    <div className="flex items-center gap-3">
                                        <Avatar src={t.avatar} name={t.name} className="w-12 h-12 shrink-0" />
                                        <div>
                                            <p className="font-semibold text-foreground">{t.name}</p>
                                            <p className="text-sm text-gray-500">{t.role}</p>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
