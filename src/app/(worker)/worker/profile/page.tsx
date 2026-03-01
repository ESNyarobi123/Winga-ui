"use client";

import { useState, useEffect } from "react";
import { Pencil, Plus, Trash2, AlignLeft, Camera, Check, Image, Award } from "lucide-react";
import { Card, CardBody } from "@heroui/card";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Input, Textarea } from "@heroui/input";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/modal";
import { Chip } from "@heroui/chip";
import { authService } from "@/services/auth.service";
import { profileService } from "@/services/profile.service";
import { portfolioService } from "@/services/portfolio.service";
import { certificationService } from "@/services/certification.service";
import { useAuth } from "@/hooks/use-auth";
import { LocationFields } from "@/components/features/location/location-fields";
import type { User } from "@/types";

const defaultProfile = {
    name: "",
    location: "Tanzania 🇹🇿",
    tagline: "",
    whatsapp: "",
    telegram: "",
    email: "",
    avatar: null as string | null,
    details: {
        languages: [{ name: "English", level: "Fluent/Native" }],
        paymentMethods: ["Bank Transfer", "PayPal", "Skrill", "Crypto"],
        workType: "Full-time",
        typingSpeed: "10 per minute",
        internetSpeed: "Not specified",
        computerSpecs: "Not specified",
        webcam: "Not specified",
        microphone: "Not specified",
    },
    experiences: [
        {
            id: "1",
            company: "Unida tech limited",
            role: "Application development",
            period: "Feb 2026 - Present",
            title: "Software developer",
            skills: [{ icon: "🚀", name: "Development - Advanced" }],
            software: [{ icon: "❓", name: "Other" }],
        },
    ],
};

function userToProfile(u: User) {
    return {
        ...defaultProfile,
        name: u.fullName ?? u.email ?? "",
        email: u.email ?? "",
        avatar: u.profileImageUrl ?? null,
        tagline: u.bio ?? defaultProfile.tagline,
        whatsapp: u.phoneNumber ?? defaultProfile.whatsapp,
    };
}

export default function WorkerProfilePage() {
    const { setUser } = useAuth();
    const [profile, setProfile] = useState(defaultProfile);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({ fullName: "", phoneNumber: "", bio: "" });
    const [location, setLocation] = useState<{ city?: string; region?: string; latitude?: number; longitude?: number }>({});
    const [saving, setSaving] = useState(false);
    const [rating, setRating] = useState<{ averageRating: number; reviewCount: number } | null>(null);
    const [portfolio, setPortfolio] = useState<Awaited<ReturnType<typeof portfolioService.getMyPortfolio>>>([]);
    const [certifications, setCertifications] = useState<Awaited<ReturnType<typeof certificationService.getMyCertifications>>>([]);

    function loadProfile() {
        setLoading(true);
        authService
            .me()
            .then((user) => {
                setUser(user);
                setProfile((prev) => ({ ...prev, ...userToProfile(user) }));
                setEditForm({
                    fullName: user.fullName ?? "",
                    phoneNumber: user.phoneNumber ?? "",
                    bio: user.bio ?? "",
                });
                setLocation({
                    city: user.city,
                    region: user.region,
                    latitude: user.latitude,
                    longitude: user.longitude,
                });
                return user;
            })
            .then((user) => {
                if (user?.id != null) {
                    profileService.getRatingSummary(String(user.id)).then(setRating).catch(() => setRating(null));
                }
            })
            .then(() => {
                portfolioService.getMyPortfolio().then(setPortfolio).catch(() => setPortfolio([]));
                certificationService.getMyCertifications().then(setCertifications).catch(() => setCertifications([]));
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        loadProfile();
    }, []);

    async function handleSaveProfile() {
        setSaving(true);
        try {
            const updated = await profileService.updateProfile({
                fullName: editForm.fullName || undefined,
                phoneNumber: editForm.phoneNumber || undefined,
                bio: editForm.bio || undefined,
                city: location.city,
                region: location.region,
                latitude: location.latitude,
                longitude: location.longitude,
            });
            setUser(updated);
            setProfile((prev) => ({ ...prev, ...userToProfile(updated) }));
            setEditing(false);
        } catch {
            // keep form open on error
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <p className="text-default-500">Loading profile…</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-[900px] mx-auto px-6 py-8">
                <Card className="border border-default-200 rounded-2xl p-6 mb-6 relative" shadow="sm">
                    <Button
                        isIconOnly
                        variant="bordered"
                        size="sm"
                        className="absolute top-5 right-5"
                        onPress={() => setEditing(true)}
                        aria-label="Edit profile"
                    >
                        <Pencil className="w-4 h-4 text-default-500" />
                    </Button>

                    <CardBody className="p-0">
                        <div className="flex items-start gap-5">
                            <div className="relative shrink-0">
                                <Avatar
                                    src={profile.avatar ?? undefined}
                                    name={profile.name}
                                    className="w-20 h-20 text-2xl font-bold text-primary bg-primary-100"
                                />
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="bordered"
                                    className="absolute bottom-0 right-0 w-7 h-7 min-w-7 bg-background shadow-sm"
                                    aria-label="Change photo"
                                >
                                    <Camera className="w-3.5 h-3.5 text-default-500" />
                                </Button>
                            </div>

                            <div className="flex-1 min-w-0">
                                <h1 className="text-xl font-bold text-primary mb-0.5">{profile.name}</h1>
                                {rating != null && rating.reviewCount > 0 && (
                                    <p className="text-[13px] text-default-500 mb-0.5">
                                        ★ {rating.averageRating.toFixed(1)} ({rating.reviewCount} review{rating.reviewCount !== 1 ? "s" : ""})
                                    </p>
                                )}
                                <p className="text-[13.5px] text-default-500 mb-0.5">
                                    {[location.city, location.region].filter(Boolean).join(", ") || profile.location}
                                </p>
                                <p className="text-[13px] text-default-400 mb-4 max-w-[480px]">{profile.tagline}</p>

                                <div className="flex flex-wrap gap-x-8 gap-y-2">
                                    <div>
                                        <div className="text-[11px] text-default-400 font-semibold mb-0.5">📞 WhatsApp</div>
                                        <div className="text-[13.5px] font-bold text-foreground">{profile.whatsapp}</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] text-default-400 font-semibold mb-0.5">💬 Telegram</div>
                                        <div className="text-[13.5px] font-bold text-foreground">{profile.telegram}</div>
                                    </div>
                                    <div>
                                        <div className="text-[11px] text-default-400 font-semibold mb-0.5">✉️ Email</div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="text-[13.5px] font-bold text-foreground">{profile.email}</span>
                                            <Button isIconOnly size="sm" variant="light" className="min-w-6 w-6 h-6 text-default-400" aria-label="Edit email">
                                                <Pencil className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
                    <div>
                        <h2 className="text-[17px] font-bold text-foreground mb-3">Details</h2>
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-1.5 text-[13px] text-default-500 mb-1">🌐 <span className="font-semibold text-foreground">Languages</span></div>
                                    {profile.details.languages.map((lang) => (
                                        <div key={lang.name} className="text-[13.5px] text-foreground font-medium">{lang.name}: <span className="text-default-500">{lang.level}</span></div>
                                    ))}
                                </div>
                                <Button isIconOnly size="sm" variant="flat" color="primary" className="bg-primary-100 min-w-8 w-8 h-8" aria-label="Edit languages"><Pencil className="w-3.5 h-3.5" /></Button>
                            </div>
                            <div>
                                <div className="text-[13px] text-default-500 mb-1">💳 <span className="font-semibold text-foreground">Preferred way of payment</span></div>
                                <div className="text-[13.5px] font-medium text-foreground">{profile.details.paymentMethods.join(", ")}</div>
                            </div>
                            <div>
                                <div className="text-[13px] text-default-500 mb-1">💼 <span className="font-semibold text-foreground">Work type</span></div>
                                <div className="text-[13.5px] font-medium text-foreground">{profile.details.workType}</div>
                            </div>
                            <div>
                                <div className="text-[13px] text-default-500 mb-1">⏱️ <span className="font-semibold text-foreground">Type speed</span></div>
                                <div className="text-[13.5px] font-medium text-foreground">{profile.details.typingSpeed}</div>
                            </div>
                            <div>
                                <div className="text-[13px] text-default-500 mb-1">🌐 <span className="font-semibold text-foreground">Internet speed</span></div>
                                <div className="text-[13.5px] text-default-500">{profile.details.internetSpeed}</div>
                            </div>
                            <div>
                                <div className="text-[13px] text-default-500 mb-1">💻 <span className="font-semibold text-foreground">Computer specs</span></div>
                                <div className="text-[13.5px] text-default-500">{profile.details.computerSpecs}</div>
                            </div>
                            <div>
                                <div className="text-[13px] text-default-500 mb-1">📷 <span className="font-semibold text-foreground">Webcam</span></div>
                                <div className="text-[13.5px] text-default-500">{profile.details.webcam}</div>
                            </div>
                            <div>
                                <div className="text-[13px] text-default-500 mb-1">🎙️ <span className="font-semibold text-foreground">Microphone</span></div>
                                <div className="text-[13.5px] text-default-500">{profile.details.microphone}</div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-[17px] font-bold text-primary mb-3 flex items-center gap-2">
                            <Image className="w-5 h-5" /> Portfolio
                        </h2>
                        {portfolio.length === 0 ? (
                            <p className="text-default-500 text-sm">No portfolio items yet. Add images, videos or projects from your dashboard.</p>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {portfolio.filter((p) => p.moderationStatus === "APPROVED").map((p) => (
                                    <a key={p.id} href={p.url} target="_blank" rel="noopener noreferrer" className="block rounded-lg border border-default-200 overflow-hidden hover:border-primary/50 transition-colors">
                                        {p.type === "IMAGE" && <img src={p.url} alt={p.title ?? ""} className="w-full aspect-video object-cover" />}
                                        {p.type !== "IMAGE" && <div className="w-full aspect-video bg-default-100 flex items-center justify-center text-default-500 text-sm">{p.type}</div>}
                                        {p.title && <p className="p-2 text-sm font-medium truncate">{p.title}</p>}
                                    </a>
                                ))}
                            </div>
                        )}
                    </div>

                    <div>
                        <h2 className="text-[17px] font-bold text-primary mb-3 flex items-center gap-2">
                            <Award className="w-5 h-5" /> Certifications
                        </h2>
                        {certifications.length === 0 ? (
                            <p className="text-default-500 text-sm">No certifications added yet.</p>
                        ) : (
                            <ul className="space-y-2">
                                {certifications.filter((c) => c.moderationStatus === "APPROVED").map((c) => (
                                    <li key={c.id} className="flex items-center justify-between rounded-lg border border-default-200 p-3">
                                        <div>
                                            <p className="font-medium text-foreground">{c.name}</p>
                                            {c.issuer && <p className="text-sm text-default-500">{c.issuer}</p>}
                                        </div>
                                        <a href={c.fileUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">View</a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-[17px] font-bold text-primary">Experiences</h2>
                            <Button size="sm" variant="bordered" startContent={<Plus className="w-3.5 h-3.5" />}>Add experience</Button>
                        </div>
                        <div className="space-y-4">
                            {profile.experiences.map((exp) => (
                                <Card key={exp.id} className="border border-default-200 hover:border-primary/30 transition-all" shadow="sm">
                                    <CardBody className="p-4 relative">
                                        <div className="absolute top-4 right-4 flex items-center gap-1.5">
                                            <Button isIconOnly size="sm" variant="light" className="min-w-8 w-8 h-8" aria-label="Reorder"><AlignLeft className="w-3.5 h-3.5 text-default-500" /></Button>
                                            <Button isIconOnly size="sm" variant="light" color="danger" className="min-w-8 w-8 h-8" aria-label="Delete"><Trash2 className="w-3.5 h-3.5" /></Button>
                                        </div>
                                        <div className="text-[12px] text-default-400 font-medium mb-1">{exp.company}</div>
                                        <h3 className="text-[17px] font-bold text-foreground mb-0.5">{exp.role}</h3>
                                        <div className="text-[13px] text-default-500 mb-1">{exp.period}</div>
                                        <div className="text-[13px] text-default-500 mb-3">{exp.title}</div>
                                        <div className="mb-2">
                                            <div className="text-[13px] font-bold text-foreground mb-2">Skills Learned</div>
                                            <div className="flex flex-wrap gap-2">
                                                {exp.skills.map((skill) => (
                                                    <Chip key={skill.name} size="sm" color="primary" variant="flat" startContent={skill.icon}>{skill.name}</Chip>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="text-[13px] font-bold text-foreground mb-2">Software Used</div>
                                            <div className="flex flex-wrap gap-2">
                                                {exp.software.map((sw) => (
                                                    <Chip key={sw.name} size="sm" variant="bordered" startContent={sw.icon}>{sw.name}</Chip>
                                                ))}
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={editing} onOpenChange={(open) => !saving && setEditing(open)} size="md" radius="lg">
                <ModalContent>
                    <ModalHeader className="text-lg font-bold">Edit profile</ModalHeader>
                    <ModalBody>
                        <Input
                            label="Name"
                            placeholder="Full name"
                            value={editForm.fullName}
                            onValueChange={(v) => setEditForm((f) => ({ ...f, fullName: v }))}
                            size="sm"
                        />
                        <Input
                            label="Phone / WhatsApp"
                            placeholder="+255..."
                            value={editForm.phoneNumber}
                            onValueChange={(v) => setEditForm((f) => ({ ...f, phoneNumber: v }))}
                            size="sm"
                        />
                        <Textarea
                            label="Bio / Tagline"
                            placeholder="Short bio"
                            value={editForm.bio}
                            onValueChange={(v) => setEditForm((f) => ({ ...f, bio: v }))}
                            minRows={3}
                            size="sm"
                        />
                        <div>
                            <p className="text-sm font-medium text-default-700 mb-2">Location</p>
                            <LocationFields value={location} onChange={setLocation} />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="bordered" onPress={() => !saving && setEditing(false)}>Cancel</Button>
                        <Button color="primary" onPress={handleSaveProfile} isLoading={saving} startContent={saving ? undefined : <Check className="w-4 h-4" />}>
                            {saving ? "Saving…" : "Save"}
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </div>
    );
}
