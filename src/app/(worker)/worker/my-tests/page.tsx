"use client";

import { useState, useRef } from "react";
import { Keyboard, Wifi, Mic, Play } from "lucide-react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { Chip } from "@heroui/chip";
import { Progress } from "@heroui/progress";

/** Fixed heights for waveform bars (same on server and client to avoid hydration mismatch) */
const WAVEFORM_HEIGHTS = [
    10, 18, 13, 15, 11, 13, 18, 22, 18, 20, 17, 9, 18, 15, 15, 19,
    20, 18, 23, 6, 19, 21, 15, 23, 6, 21, 19, 23, 15, 13, 8, 19,
];

const englishTests = [
    {
        id: "b1",
        level: "Intermediate English (B1)",
        score: "N/A",
        topScore: "N/A",
        attempts: 0,
        maxAttempts: 10,
        status: "Pending",
    },
    {
        id: "b2",
        level: "Upper-Intermediate English (B2)",
        score: "N/A",
        topScore: "N/A",
        attempts: 0,
        maxAttempts: 10,
        status: "Pending",
    },
    {
        id: "c1",
        level: "Advanced English (C1)",
        score: "N/A",
        topScore: "N/A",
        attempts: 0,
        maxAttempts: 10,
        status: "Pending",
    },
];

export default function WorkerMyTestsPage() {
    const [typingText, setTypingText] = useState("");
    const [typingStarted, setTypingStarted] = useState(false);
    const [wpm, setWpm] = useState(0);
    const [accuracy, setAccuracy] = useState(0);
    const typingRef = useRef<HTMLInputElement>(null);
    const startTimeRef = useRef<number | null>(null);

    const sampleText = "The quick brown fox jumps over the lazy dog";

    function handleTypingChange(val: string) {
        if (!typingStarted) {
            setTypingStarted(true);
            startTimeRef.current = Date.now();
        }
        setTypingText(val);

        const words = val.trim().split(/\s+/).filter(Boolean).length;
        const elapsed = startTimeRef.current
            ? (Date.now() - startTimeRef.current) / 60000
            : 0.0001;
        setWpm(elapsed > 0 ? Math.round(words / elapsed) : 0);

        const correct = val
            .split("")
            .filter((c, i) => c === sampleText[i]).length;
        setAccuracy(val.length > 0 ? Math.round((correct / val.length) * 100) : 0);
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-[1000px] mx-auto px-6 py-8">
                <h2 className="text-lg font-bold text-foreground mb-4">General Tests</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                    <Card className="border border-default-200" shadow="sm">
                        <CardBody className="p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <Keyboard className="w-5 h-5 text-default-500" />
                                <span className="text-[15px] font-bold text-foreground">Typing Test</span>
                            </div>
                            <div className="flex items-end gap-4 mb-2">
                                <div>
                                    <div className="text-[28px] font-extrabold text-foreground">{wpm}</div>
                                    <div className="text-[11px] text-default-400 font-medium">Words/Min</div>
                                </div>
                                <div>
                                    <div className="text-[28px] font-extrabold text-foreground">{accuracy}%</div>
                                    <div className="text-[11px] text-default-400 font-medium">Accuracy</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <Chip size="sm" variant="flat">{typingStarted ? "In progress" : "Not started"}</Chip>
                                <Chip size="sm" variant="flat">Attempts: 0/10</Chip>
                            </div>
                            <div className="mb-3 bg-default-100 rounded-xl p-3 text-[13px] text-default-500 leading-relaxed font-mono">
                                {sampleText}
                            </div>
                            <Input
                                ref={typingRef}
                                type="text"
                                value={typingText}
                                onValueChange={handleTypingChange}
                                placeholder="Start typing here…"
                                size="sm"
                                classNames={{ input: "text-[13px]" }}
                                className="mb-3"
                            />
                            <Button color="primary" className="w-full font-bold" size="lg">Take Test</Button>
                        </CardBody>
                    </Card>

                    <Card className="border border-default-200" shadow="sm">
                        <CardBody className="p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <Wifi className="w-5 h-5 text-default-500" />
                                <span className="text-[15px] font-bold text-foreground">Internet Speed</span>
                            </div>
                            <div className="flex items-end gap-4 mb-2">
                                <div>
                                    <div className="text-[28px] font-extrabold text-foreground">0</div>
                                    <div className="text-[11px] text-default-400 font-medium">Mbps Download</div>
                                </div>
                                <div>
                                    <div className="text-[28px] font-extrabold text-foreground">0</div>
                                    <div className="text-[11px] text-default-400 font-medium">Mbps Upload</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <Chip size="sm" variant="flat">Not started</Chip>
                                <Chip size="sm" variant="flat">Attempts: 0/10</Chip>
                            </div>
                            <Progress value={0} color="primary" className="mb-8" size="sm" />
                            <Button color="primary" className="w-full font-bold" size="lg">Take Test</Button>
                        </CardBody>
                    </Card>

                    <Card className="border border-default-200" shadow="sm">
                        <CardBody className="p-5">
                            <div className="flex items-center gap-2 mb-3">
                                <Mic className="w-5 h-5 text-default-500" />
                                <span className="text-[15px] font-bold text-foreground">2 Minute Verbal</span>
                            </div>
                            <div className="flex items-center gap-2 mb-4 bg-default-100 rounded-xl px-3 py-3">
                                <Button isIconOnly size="sm" variant="flat" color="primary" className="min-w-9 w-9 h-9">
                                    <Play className="w-4 h-4 ml-0.5" />
                                </Button>
                                <div className="flex items-center gap-0.5 flex-1">
                                    {WAVEFORM_HEIGHTS.map((h, i) => (
                                        <div key={i} className="flex-1 bg-default-300 rounded-full" style={{ height: `${h}px` }} />
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 mb-4">
                                <Chip size="sm" variant="flat">Not started</Chip>
                                <Chip size="sm" variant="flat">Attempts: 0/10</Chip>
                            </div>
                            <Button color="primary" className="w-full font-bold" size="lg">Take Test</Button>
                        </CardBody>
                    </Card>
                </div>

                <h2 className="text-lg font-bold text-foreground mb-4">English Tests</h2>
                <div className="space-y-3">
                    {englishTests.map((test) => (
                        <Card key={test.id} className="border border-default-200 hover:border-primary/30 transition-all" shadow="sm">
                            <CardBody className="p-4">
                                <div className="flex items-center justify-between flex-wrap gap-3">
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-[15px] font-bold text-foreground mb-1">{test.level}</h3>
                                        <div className="flex items-center gap-1.5 text-[13px] text-default-500">
                                            <span>🏆</span>
                                            <span>Score: {test.score} | Top {test.topScore}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0">
                                        <Chip size="sm" variant="flat">{test.status}</Chip>
                                        <Chip size="sm" variant="flat">Attempts {test.attempts}/{test.maxAttempts}</Chip>
                                        <Button color="primary" size="sm" className="font-bold whitespace-nowrap">Take Test</Button>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
