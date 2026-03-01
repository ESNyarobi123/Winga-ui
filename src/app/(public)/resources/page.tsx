"use client";

import { useState } from "react";
import { ChevronDown, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// Dummy data for Articles
const workerArticles = [
    {
        title: "How to Create a Standout Profile",
        summary: "Learn the secrets to creating a profile that attracts top employers and gets you hired faster.",
        link: "#",
    },
    {
        title: "Navigating Your First Gig on OFM Jobs",
        summary: "A complete guide on what to expect, how to communicate with clients, and delivering great results.",
        link: "#",
    },
    {
        title: "Setting Your Rates: A Guide for Freelancers",
        summary: "Discover how to price your services competitively while ensuring you get paid what you're worth.",
        link: "#",
    },
];

const employerArticles = [
    {
        title: "Best Practices for Writing Job Descriptions",
        summary: "Attract the right talent by writing clear, concise, and compelling job descriptions.",
        link: "#",
    },
    {
        title: "How to Interview Freelancers Effectively",
        summary: "Top questions to ask and red flags to look out for when interviewing potential candidates.",
        link: "#",
    },
    {
        title: "Managing Remote Workers for Success",
        summary: "Strategies and tools for keeping your remote team engaged, productive, and aligned.",
        link: "#",
    },
];

// Dummy data for FAQs
const faqs = [
    {
        question: "How do I get started as a worker?",
        answer: "Simply sign up for a free account, complete your profile, and start browsing available jobs. Make sure to highlight your skills and experience to attract employers.",
    },
    {
        question: "Are there any fees for employers to post jobs?",
        answer: "We offer both free and premium plans for employers. Our free plan allows you to browse and post basic listings, while premium plans offer advanced features and visibility.",
    },
    {
        question: "How does the payment process work?",
        answer: "Payments are handled securely through our platform. Employers fund the milestone upfront, and funds are released to the worker once the work is approved.",
    },
    {
        question: "What if I have a dispute with a client/worker?",
        answer: "We have a dedicated dispute resolution team. If an issue arises, you can open a ticket, and our team will step in to mediate and find a fair resolution.",
    }
];

// Simple Accordion Component
function FAQItem({ question, answer }: { question: string, answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-border rounded-lg mb-4 overflow-hidden bg-white shadow-sm transition-all duration-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-5 text-left focus:outline-none hover:bg-muted/50 transition-colors"
            >
                <h3 className="font-semibold text-lg text-foreground">{question}</h3>
                <ChevronDown
                    className={`h-5 w-5 text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>
            <div
                className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
            >
                <p className="text-muted-foreground text-sm leading-relaxed">{answer}</p>
            </div>
        </div>
    );
}

export default function ResourcesPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="bg-primary/5 py-20 px-4 sm:px-6 lg:px-8 border-b border-border">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
                    <div className="md:w-1/2 space-y-6">
                        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                            Resources & <span className="text-primary">Guides</span>
                        </h1>
                        <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                            Everything you need to know about hiring top talent and finding the best work opportunities on our platform.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <Button className="font-semibold px-8 h-12 text-lg">
                                Browse Guides
                            </Button>
                        </div>
                    </div>
                    <div className="md:w-1/2 flex justify-center">
                        {/* Illustration Placeholder - Using a designed card stack to mimic an illustration */}
                        <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
                            <Card className="w-64 h-80 bg-white shadow-xl z-20 border-primary/20 rotate-3 transform transition-transform hover:rotate-6">
                                <CardContent className="p-6 flex flex-col items-center justify-center h-full text-center space-y-4">
                                    <BookOpen className="h-16 w-16 text-primary" />
                                    <div className="w-full h-2 bg-muted rounded-full mt-4"></div>
                                    <div className="w-3/4 h-2 bg-muted rounded-full"></div>
                                    <div className="w-5/6 h-2 bg-muted rounded-full"></div>
                                </CardContent>
                            </Card>
                            <Card className="absolute top-10 -left-6 w-48 h-64 bg-white/90 shadow-lg z-10 border-border -rotate-6 backdrop-blur-sm">
                                <CardContent className="p-4"></CardContent>
                            </Card>
                            <Card className="absolute bottom-10 -right-6 w-56 h-48 bg-white/90 shadow-lg z-30 border-border rotate-12 backdrop-blur-sm flex items-end p-4">
                                <div className="w-full h-8 bg-primary/20 rounded-md"></div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            {/* Articles Section (Two Columns) */}
            <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold text-foreground">Latest Articles</h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Explore our curated collection of articles designed to help both workers and employers succeed.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    {/* Employers Column */}
                    <div className="space-y-8">
                        <h3 className="text-2xl font-bold border-b border-border pb-4 flex items-center gap-3">
                            <span className="bg-primary/10 text-primary p-2 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                            </span>
                            For Employers
                        </h3>
                        <div className="space-y-6">
                            {employerArticles.map((article, index) => (
                                <div key={index} className="group">
                                    <a href={article.link} className="block group-hover:bg-muted/30 p-4 -mx-4 rounded-xl transition-colors">
                                        <h4 className="text-lg font-semibold text-primary group-hover:text-primary-dark transition-colors mb-2">
                                            {article.title}
                                        </h4>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {article.summary}
                                        </p>
                                    </a>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full md:w-auto mt-4 group">
                            See more employer articles
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>

                    {/* Workers Column */}
                    <div className="space-y-8">
                        <h3 className="text-2xl font-bold border-b border-border pb-4 flex items-center gap-3">
                            <span className="bg-primary/10 text-primary p-2 rounded-lg">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                            </span>
                            For Workers
                        </h3>
                        <div className="space-y-6">
                            {workerArticles.map((article, index) => (
                                <div key={index} className="group">
                                    <a href={article.link} className="block group-hover:bg-muted/30 p-4 -mx-4 rounded-xl transition-colors">
                                        <h4 className="text-lg font-semibold text-primary group-hover:text-primary-dark transition-colors mb-2">
                                            {article.title}
                                        </h4>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {article.summary}
                                        </p>
                                    </a>
                                </div>
                            ))}
                        </div>
                        <Button variant="outline" className="w-full md:w-auto mt-4 group">
                            See more worker articles
                            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="bg-muted/30 py-24 px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-foreground">Frequently Asked Questions</h2>
                        <p className="text-muted-foreground mt-4">Find answers to common questions about navigating our platform.</p>
                    </div>

                    <div className="space-y-1">
                        {faqs.map((faq, index) => (
                            <FAQItem key={index} question={faq.question} answer={faq.answer} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
