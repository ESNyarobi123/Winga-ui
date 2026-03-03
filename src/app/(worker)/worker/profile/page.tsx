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
import type { ProfileChecklistResponse, WorkExperienceItem } from "@/services/profile.service";
import { portfolioService } from "@/services/portfolio.service";
import { certificationService } from "@/services/certification.service";
import { useAuth } from "@/hooks/use-auth";
import { LocationFields } from "@/components/features/location/location-fields";
import type { User } from "@/types";

const defaultDetails = {
    languages: [] as { name: string; level: string }[],
    paymentMethods: [] as string[],
    workType: "",
    typingSpeed: "",
    internetSpeed: "",
    computerSpecs: "",
    webcam: "",
    microphone: "—",
};

function parseLanguages(s: string | undefined): { name: string; level: string }[] {
    if (!s || typeof s !== "string") return [];
    if (s.startsWith("[")) {
        try {
            const arr = JSON.parse(s);
            return Array.isArray(arr) ? arr.map((x) => ({ name: String(x), level: "—" })) : [];
        } catch { return []; }
    }
    return s.split(",").map((x) => ({ name: x.trim(), level: "—" })).filter((x) => x.name);
}

function parsePaymentMethods(s: string | undefined): string[] {
    if (!s || typeof s !== "string") return [];
    if (s.startsWith("[")) {
        try {
            const arr = JSON.parse(s);
            return Array.isArray(arr) ? arr.map(String).filter(Boolean) : [];
        } catch { return []; }
    }
    return s.split(",").map((x) => x.trim()).filter(Boolean);
}

function userToProfile(u: User) {
    return {
        name: u.fullName ?? u.email ?? "",
        location: u.country ?? "Tanzania 🇹🇿",
        tagline: u.bio ?? "",
        whatsapp: u.phoneNumber ?? "",
        telegram: u.telegram ?? "",
        email: u.email ?? "",
        avatar: u.profileImageUrl ?? null,
        details: {
            ...defaultDetails,
            languages: parseLanguages(u.languages),
            paymentMethods: parsePaymentMethods(u.paymentPreferences),
            workType: u.workType ?? "",
            typingSpeed: u.typeSpeed ?? "",
            internetSpeed: u.internetSpeed ?? "",
            computerSpecs: u.computerSpecs ?? "",
            webcam: u.hasWebcam != null ? (u.hasWebcam ? "Yes" : "No") : "",
        },
    };
}

export default function WorkerProfilePage() {
    const { setUser } = useAuth();
    const [profile, setProfile] = useState(() => ({ ...userToProfile({} as User), details: defaultDetails }));
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [editForm, setEditForm] = useState({
        fullName: "",
        phoneNumber: "",
        bio: "",
        headline: "",
        country: "",
        workType: "",
        timezone: "",
        languages: "",
        paymentPreferences: "",
    });
    const [location, setLocation] = useState<{ city?: string; region?: string; latitude?: number; longitude?: number }>({});
    const [saving, setSaving] = useState(false);
    const [rating, setRating] = useState<{ averageRating: number; reviewCount: number } | null>(null);
    const [portfolio, setPortfolio] = useState<Awaited<ReturnType<typeof portfolioService.getMyPortfolio>>>([]);
    const [certifications, setCertifications] = useState<Awaited<ReturnType<typeof certificationService.getMyCertifications>>>([]);
    const [checklist, setChecklist] = useState<ProfileChecklistResponse | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [experiences, setExperiences] = useState<WorkExperienceItem[]>([]);

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
                    headline: user.headline ?? "",
                    country: user.country ?? "",
                    workType: user.workType ?? "",
                    timezone: user.timezone ?? "",
                    languages: (() => {
                        const s = user.languages;
                        if (!s || typeof s !== "string") return "";
                        if (s.startsWith("[")) {
                            try { return JSON.parse(s).filter(Boolean).join(", "); } catch { return s; }
                        }
                        return s;
                    })(),
                    paymentPreferences: (() => {
                        const s = user.paymentPreferences;
                        if (!s || typeof s !== "string") return "";
                        if (s.startsWith("[")) {
                            try { return JSON.parse(s).filter(Boolean).join(", "); } catch { return s; }
                        }
                        return s;
                    })(),
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
            .then(() => profileService.getProfileChecklist().then(setChecklist).catch(() => setChecklist(null)))
            .then(() => profileService.getMyExperiences().then(setExperiences).catch(() => setExperiences([])))
            .catch(() => {})
            .finally(() => setLoading(false));
    }

    useEffect(() => {
        loadProfile();
    }, []);

    async function handleSaveProfile() {
        setSaving(true);
        setSaveError(null);
        try {
            const langStr = editForm.languages?.trim();
            const payStr = editForm.paymentPreferences?.trim();
            const updated = await profileService.updateProfile({
                fullName: editForm.fullName || undefined,
                phoneNumber: editForm.phoneNumber || undefined,
                bio: editForm.bio || undefined,
                headline: editForm.headline || undefined,
                country: editForm.country || undefined,
                workType: editForm.workType || undefined,
                timezone: editForm.timezone || undefined,
                languages: langStr ? (langStr.includes(",") ? JSON.stringify(langStr.split(",").map((s) => s.trim()).filter(Boolean)) : JSON.stringify([langStr])) : undefined,
                paymentPreferences: payStr ? (payStr.includes(",") ? JSON.stringify(payStr.split(",").map((s) => s.trim()).filter(Boolean)) : JSON.stringify([payStr])) : undefined,
                city: location.city,
                region: location.region,
                latitude: location.latitude,
                longitude: location.longitude,
            });
            setUser(updated);
            setProfile((prev) => ({ ...prev, ...userToProfile(updated) }));
            setEditing(false);
            loadProfile();
        } catch (err: unknown) {
            const res = err && typeof err === "object" && "response" in err ? (err as { response?: { data?: { message?: string } } }).response?.data?.message : null;
            const msg = res || (err && typeof err === "object" && "message" in err ? String((err as { message: string }).message) : null) || "Failed to save. Complete required fields (e.g. country, headline, languages, payment, work type, timezone).";
            setSaveError(msg);
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
                {checklist && !checklist.complete && (
                    <Card className="border border-primary/30 rounded-2xl p-4 mb-4 bg-primary-50/50" shadow="sm">
                        <CardBody className="p-0">
                            <p className="text-sm font-semibold text-foreground mb-1">Profile completeness: {checklist.profileCompleteness}%</p>
                            <div className="h-2 w-full rounded-full bg-default-200 overflow-hidden mb-2">
                                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${checklist.profileCompleteness}%` }} />
                            </div>
                            {checklist.missingFields?.length > 0 && (
                                <p className="text-xs text-default-600">Complete: {checklist.missingFields.join(", ")}</p>
                            )}
                        </CardBody>
                    </Card>
                )}

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
                                    {profile.details.languages.length > 0 ? profile.details.languages.map((lang) => (
                                        <div key={lang.name} className="text-[13.5px] text-foreground font-medium">{lang.name}: <span className="text-default-500">{lang.level}</span></div>
                                    )) : <div className="text-[13.5px] text-default-500">—</div>}
                                </div>
                                <Button isIconOnly size="sm" variant="flat" color="primary" className="bg-primary-100 min-w-8 w-8 h-8" aria-label="Edit languages"><Pencil className="w-3.5 h-3.5" /></Button>
                            </div>
                            <div>
                                <div className="text-[13px] text-default-500 mb-1">💳 <span className="font-semibold text-foreground">Preferred way of payment</span></div>
                                <div className="text-[13.5px] font-medium text-foreground">{profile.details.paymentMethods.length > 0 ? profile.details.paymentMethods.join(", ") : "—"}</div>
                            </div>
                            <div>
                                <div className="text-[13px] text-default-500 mb-1">💼 <span className="font-semibold text-foreground">Work type</span></div>
                                <div className="text-[13.5px] font-medium text-foreground">{profile.details.workType || "—"}</div>
                            </div>
                            <div>
                                <div className="text-[13px] text-default-500 mb-1">⏱️ <span className="font-semibold text-foreground">Type speed</span></div>
                                <div className="text-[13.5px] font-medium text-foreground">{profile.details.typingSpeed || "—"}</div>
                            </div>
                            <div>
                                <div className="text-[13px] text-default-500 mb-1">🌐 <span className="font-semibold text-foreground">Internet speed</span></div>
                                <div className="text-[13.5px] text-default-500">{profile.details.internetSpeed || "—"}</div>
                            </div>
                            <div>
                                <div className="text-[13px] text-default-500 mb-1">💻 <span className="font-semibold text-foreground">Computer specs</span></div>
                                <div className="text-[13.5px] text-default-500">{profile.details.computerSpecs || "—"}</div>
                            </div>
                            <div>
                                <div className="text-[13px] text-default-500 mb-1">📷 <span className="font-semibold text-foreground">Webcam</span></div>
                                <div className="text-[13.5px] text-default-500">{profile.details.webcam || "—"}</div>
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
                            {experiences.length === 0 ? (
                                <p className="text-default-500 text-sm">No experiences added yet. Add work history from the edit form or dashboard.</p>
                            ) : (
                                experiences.map((exp) => (
                                    <Card key={exp.id} className="border border-default-200 hover:border-primary/30 transition-all" shadow="sm">
                                        <CardBody className="p-4 relative">
                                            <div className="text-[12px] text-default-400 font-medium mb-1">{exp.company || "—"}</div>
                                            <h3 className="text-[17px] font-bold text-foreground mb-0.5">{exp.title}</h3>
                                            <div className="text-[13px] text-default-500 mb-1">
                                                {exp.startDate ?? ""} — {exp.endDate ?? "Present"}
                                            </div>
                                            {exp.description && <div className="text-[13px] text-default-500 mb-3">{exp.description}</div>}
                                            {(exp.skillsLearned?.length ?? 0) > 0 && (
                                                <div className="mb-2">
                                                    <div className="text-[13px] font-bold text-foreground mb-2">Skills Learned</div>
                                                    <div className="flex flex-wrap gap-2">
                                                        {exp.skillsLearned!.map((skill, i) => (
                                                            <Chip key={`${i}-${skill}`} size="sm" color="primary" variant="flat">🚀 {skill}</Chip>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </CardBody>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal isOpen={editing} onOpenChange={(open) => { if (!saving) { setEditing(open); setSaveError(null); } }} size="md" radius="lg">
                <ModalContent>
                    <ModalHeader className="text-lg font-bold">Edit profile</ModalHeader>
                    <ModalBody>
                        {saveError && (
                            <p className="text-sm text-danger mb-3 rounded-lg bg-danger-50 p-2" role="alert">{saveError}</p>
                        )}
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
                            minRows={2}
                            size="sm"
                        />
                        <Input
                            label="Headline"
                            placeholder="e.g. Senior React Developer"
                            value={editForm.headline}
                            onValueChange={(v) => setEditForm((f) => ({ ...f, headline: v }))}
                            size="sm"
                        />
                        <Input
                            label="Country"
                            placeholder="e.g. Tanzania"
                            value={editForm.country}
                            onValueChange={(v) => setEditForm((f) => ({ ...f, country: v }))}
                            size="sm"
                        />
                        <Input
                            label="Work type"
                            placeholder="e.g. Full-time, Part-time"
                            value={editForm.workType}
                            onValueChange={(v) => setEditForm((f) => ({ ...f, workType: v }))}
                            size="sm"
                        />
                        <Input
                            label="Timezone"
                            placeholder="e.g. Africa/Dar_es_Salaam"
                            value={editForm.timezone}
                            onValueChange={(v) => setEditForm((f) => ({ ...f, timezone: v }))}
                            size="sm"
                        />
                        <Input
                            label="Languages (comma-separated)"
                            placeholder="e.g. English, Swahili"
                            value={editForm.languages}
                            onValueChange={(v) => setEditForm((f) => ({ ...f, languages: v }))}
                            size="sm"
                        />
                        <Input
                            label="Payment preferences (comma-separated)"
                            placeholder="e.g. Bank Transfer, PayPal"
                            value={editForm.paymentPreferences}
                            onValueChange={(v) => setEditForm((f) => ({ ...f, paymentPreferences: v }))}
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
