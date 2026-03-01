"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth.service";
import { profileService } from "@/services/profile.service";
import { uploadFile } from "@/services/upload.service";
import { useUserStore } from "@/store/use-user-store";
import { REGISTRATION_STORAGE_KEY } from "../register/page";
import { MessageCircle, Upload, Plus, X } from "lucide-react";

const TOTAL_STEPS = 8;
const STEP_KEYS = [2, 3, 4, 5, 6, 7, 8, 9] as const;

const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];
const TOP_SKILLS = ["Marketing", "Sales", "Customer Support", "Content Writing", "Design", "Development", "Data Entry", "Other"];
const BIRTH_YEARS = Array.from({ length: 50 }, (_, i) => 2007 - i);
const LANGUAGES_LIST = ["English", "Swahili", "French", "Arabic", "Portuguese", "Spanish", "German", "Other"];
const COUNTRIES = ["Tanzania", "Kenya", "Uganda", "Rwanda", "Nigeria", "South Africa", "Ghana", "Other"];
const WORK_TYPES = ["Full-time", "Part-time", "Contract", "Freelance"];
const TIMEZONES = ["EAT (UTC+3)", "Pacific Standard Time (UTC-08:00)", "Eastern Time (UTC-05:00)", "GMT (UTC+0)", "Other"];
const PAYMENT_OPTIONS = ["Bank Transfer", "PayPal", "Paxum", "Skrill", "Wise", "Venmo", "Crypto"];

export interface JobSeekerFormData {
  firstName: string;
  lastName: string;
  gender: string;
  topSkill: string;
  birthYear: string;
  profileHeadline: string;
  phoneCountry: string;
  phone: string;
  telegram: string;
  languages: string[];
  country: string;
  cvFile: File | null;
  cvSkipped: boolean;
  profileImageFile: File | null;
  experiences: Array<{ title: string; company: string; startDate: string; endDate: string; description: string }>;
  workType: string;
  timezone: string;
  paymentMethods: string[];
}

const defaultForm: JobSeekerFormData = {
  firstName: "",
  lastName: "",
  gender: "",
  topSkill: "",
  birthYear: "",
  profileHeadline: "",
  phoneCountry: "+255",
  phone: "",
  telegram: "",
  languages: [],
  country: "Tanzania",
  cvFile: null,
  cvSkipped: false,
  profileImageFile: null,
  experiences: [],
  workType: "",
  timezone: "",
  paymentMethods: [],
};

function getPayload(): { registrationToken: string; email: string } | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(REGISTRATION_STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : null;
    return data?.registrationToken && data?.email ? data : null;
  } catch {
    return null;
  }
}

export default function RegistrationJobSeekerPage() {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);
  const [stepIndex, setStepIndex] = useState(0);
  const [form, setForm] = useState<JobSeekerFormData>(defaultForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payload, setPayload] = useState<{ registrationToken: string; email: string } | null>(null);
  const [addingExperience, setAddingExperience] = useState(false);
  const [newExp, setNewExp] = useState({ title: "", company: "", startDate: "", endDate: "", description: "" });

  const step = STEP_KEYS[stepIndex];
  const progress = (stepIndex + 1) / TOTAL_STEPS;

  useEffect(() => {
    const p = getPayload();
    if (!p) {
      router.replace("/register");
      return;
    }
    setPayload(p);
  }, [router]);

  const update = useCallback((updates: Partial<JobSeekerFormData>) => {
    setForm((prev) => ({ ...prev, ...updates }));
  }, []);

  const canContinueStep2 = form.firstName.trim() && form.lastName.trim() && form.gender && form.topSkill && form.birthYear && form.profileHeadline.length >= 50 && form.profileHeadline.length <= 140;
  const canContinueStep3 = form.phone.trim().length >= 6;
  const canContinueStep4 = form.languages.length > 0;
  const canContinueStep5 = !!form.country;
  const canContinueStep6 = form.cvFile !== null || form.cvSkipped;
  const canContinueStep7 = true; // optional: allow skip profile picture
  const canContinueStep8 = true;
  const canContinueStep9 = form.workType && form.timezone && form.paymentMethods.length > 0;

  const canContinue =
    step === 2 ? canContinueStep2 :
    step === 3 ? canContinueStep3 :
    step === 4 ? canContinueStep4 :
    step === 5 ? canContinueStep5 :
    step === 6 ? canContinueStep6 :
    step === 7 ? canContinueStep7 :
    step === 8 ? canContinueStep8 :
    canContinueStep9;

  const handlePrevious = () => {
    if (stepIndex > 0) setStepIndex(stepIndex - 1);
    setError("");
  };

  const handleNext = () => {
    if (stepIndex < TOTAL_STEPS - 1) {
      setStepIndex(stepIndex + 1);
      setError("");
    }
  };

  const handleSubmitFinal = async () => {
    if (!payload || !canContinueStep9) return;
    setError("");
    setLoading(true);
    try {
      const fullName = `${form.firstName.trim()} ${form.lastName.trim()}`;
      const res = await authService.completeRegistration(payload.registrationToken, {
        role: "FREELANCER",
        fullName,
        industry: form.topSkill || undefined,
        companyName: undefined,
      });
      setUser(res.user);
      if (typeof window !== "undefined") {
        localStorage.setItem("token", res.token);
        sessionStorage.removeItem(REGISTRATION_STORAGE_KEY);
      }

      let profileImageUrl: string | undefined;
      if (form.profileImageFile) {
        try {
          profileImageUrl = await uploadFile(form.profileImageFile, "profile");
        } catch {
          // continue without profile image
        }
      }

      let cvUrl: string | undefined;
      if (form.cvFile) {
        try {
          cvUrl = await uploadFile(form.cvFile, "general");
        } catch {
          // continue without CV
        }
      }

      const phoneNumber = form.phoneCountry && form.phone ? `${form.phoneCountry.replace(/\s/g, "")}${form.phone.replace(/\D/g, "")}` : undefined;
      await profileService.updateProfile({
        fullName,
        phoneNumber,
        bio: form.profileHeadline || undefined,
        skills: form.topSkill || undefined,
        profileImageUrl,
        telegram: form.telegram?.trim() || undefined,
        country: form.country || undefined,
        languages: form.languages.length > 0 ? JSON.stringify(form.languages) : undefined,
        cvUrl,
        workType: form.workType || undefined,
        timezone: form.timezone || undefined,
        paymentPreferences: form.paymentMethods.length > 0 ? JSON.stringify(form.paymentMethods) : undefined,
      });

      const experiencesPayload = form.experiences
        .filter((e) => e.title?.trim())
        .map((e) => ({
          title: e.title.trim(),
          company: e.company?.trim() || undefined,
          startDate: e.startDate || undefined,
          endDate: e.endDate || undefined,
          description: e.description?.trim() || undefined,
        }));
      if (experiencesPayload.length > 0) {
        await profileService.replaceExperiences(experiencesPayload);
      }

      router.replace("/worker/profile");
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!payload) {
    return (
      <div className="w-full max-w-md p-6 flex items-center justify-center min-h-[200px]">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 pb-24">
      {/* Progress: thick black for completed/current steps, thinner gray for rest (Image 1) */}
      <div className="flex gap-0.5 w-full mb-4">
        {STEP_KEYS.map((_, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full transition-all ${
              i <= stepIndex ? "h-2 bg-black" : "h-1 bg-gray-200"
            }`}
          />
        ))}
      </div>
      <h1 className="text-2xl font-semibold text-center text-gray-800 tracking-wide mb-6 uppercase">
        WINGA
      </h1>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-md">
        {/* Step 2: Tell us about yourself */}
        {step === 2 && (
          <>
            <h2 className="text-xl font-bold mb-1">Tell us about yourself</h2>
            <p className="text-sm text-muted-foreground mb-6">Please enter your personal information to continue</p>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">First name *</label>
                <Input
                  value={form.firstName}
                  onChange={(e) => update({ firstName: e.target.value })}
                  placeholder="First name"
                  className="h-11"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Last name *</label>
                <Input
                  value={form.lastName}
                  onChange={(e) => update({ lastName: e.target.value })}
                  placeholder="Last name"
                  className="h-11"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Your gender *</label>
                <select
                  value={form.gender}
                  onChange={(e) => update({ gender: e.target.value })}
                  className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select</option>
                  {GENDERS.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Top Skill *</label>
                <select
                  value={form.topSkill}
                  onChange={(e) => update({ topSkill: e.target.value })}
                  className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select</option>
                  {TOP_SKILLS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Choose birth year *</label>
              <select
                value={form.birthYear}
                onChange={(e) => update({ birthYear: e.target.value })}
                className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm"
              >
                <option value="">Select year</option>
                {BIRTH_YEARS.map((y) => (
                  <option key={y} value={String(y)}>{y}</option>
                ))}
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Profile headline *</label>
              <textarea
                value={form.profileHeadline}
                onChange={(e) => update({ profileHeadline: e.target.value })}
                placeholder="5-year marketing specialist with a focus on Instagram"
                className="w-full min-h-[100px] rounded-lg border border-input bg-background px-3 py-2 text-sm resize-y"
                maxLength={140}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Minimum 50 characters</span>
                <span>{form.profileHeadline.length}/140 characters</span>
              </div>
            </div>
          </>
        )}

        {/* Step 3: Contact */}
        {step === 3 && (
          <>
            <h2 className="text-xl font-bold mb-1">Contact</h2>
            <p className="text-sm text-muted-foreground mb-6">WhatsApp number</p>
            <div className="flex gap-2 mb-4">
              <div className="w-32 shrink-0">
                <label className="block text-sm font-medium mb-1">Search country</label>
                <select
                  value={form.phoneCountry}
                  onChange={(e) => update({ phoneCountry: e.target.value })}
                  className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="+255">Tanzania +255</option>
                  <option value="+254">Kenya +254</option>
                  <option value="+256">Uganda +256</option>
                  <option value="+1">USA +1</option>
                  <option value="+44">UK +44</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Phone *</label>
                <Input
                  value={form.phone}
                  onChange={(e) => update({ phone: e.target.value })}
                  placeholder="Phone number"
                  type="tel"
                  className="h-11"
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Telegram handle (optional)</label>
              <Input
                value={form.telegram}
                onChange={(e) => update({ telegram: e.target.value })}
                placeholder="@telegram"
                className="h-11"
              />
            </div>
          </>
        )}

        {/* Step 4: Language */}
        {step === 4 && (
          <>
            <h2 className="text-xl font-bold mb-1">Language</h2>
            <p className="text-sm text-muted-foreground mb-4">What languages do you speak</p>
            <div className="mb-4">
              <select
                className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm"
                value=""
                onChange={(e) => {
                  const v = e.target.value;
                  if (v && !form.languages.includes(v)) update({ languages: [...form.languages, v] });
                  e.target.value = "";
                }}
              >
                <option value="">Search and select languages *</option>
                {LANGUAGES_LIST.filter((l) => !form.languages.includes(l)).map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.languages.map((l) => (
                  <span
                    key={l}
                    className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-sm"
                  >
                    {l}
                    <button type="button" onClick={() => update({ languages: form.languages.filter((x) => x !== l) })} className="hover:opacity-70">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step 5: Location */}
        {step === 5 && (
          <>
            <h2 className="text-xl font-bold mb-1">Location</h2>
            <p className="text-sm text-muted-foreground mb-6">Where are you from</p>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Search country *</label>
              <select
                value={form.country}
                onChange={(e) => update({ country: e.target.value })}
                className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </>
        )}

        {/* Step 6: Upload CV */}
        {step === 6 && (
          <>
            <h2 className="text-xl font-bold mb-1">Upload your CV</h2>
            <p className="text-sm text-muted-foreground mb-6">Please upload your CV to extract relevant experience.</p>
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center mb-4 ${form.cvFile ? "border-primary bg-primary/5" : "border-gray-300 bg-[#eaf3ed]"}`}
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("border-primary"); }}
              onDragLeave={(e) => { e.currentTarget.classList.remove("border-primary"); }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("border-primary");
                const f = e.dataTransfer.files[0];
                if (f?.type === "application/pdf" && f.size < 2 * 1024 * 1024) update({ cvFile: f });
              }}
            >
              <p className="text-sm text-muted-foreground mb-4">Drag file here to upload or choose file</p>
              <input
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                id="cv-upload"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f?.type === "application/pdf" && f.size < 2 * 1024 * 1024) update({ cvFile: f });
                }}
              />
              <Button type="button" variant="outline" className="text-primary border-primary" onClick={() => document.getElementById("cv-upload")?.click()}>
                Choose File
              </Button>
              {form.cvFile && <p className="mt-2 text-sm text-primary font-medium">{form.cvFile.name}</p>}
            </div>
            <ul className="text-sm text-muted-foreground list-disc list-inside mb-6">
              <li>PDF only</li>
              <li>File size less than 2MB</li>
            </ul>
            <button
              type="button"
              onClick={() => update({ cvSkipped: true })}
              className="text-sm text-primary underline hover:no-underline mb-4 block"
            >
              I&apos;ll add this later
            </button>
          </>
        )}

        {/* Step 7: Profile picture */}
        {step === 7 && (
          <>
            <h2 className="text-xl font-bold mb-1">Profile picture</h2>
            <p className="text-sm text-muted-foreground mb-6">Uploaded picture will be seen by employers</p>
            <div className="flex flex-col md:flex-row gap-6 items-start mb-6">
              <div className="shrink-0 mx-auto md:mx-0">
                <div className="w-40 h-40 rounded-full border-2 border-[#006e42]/30 bg-[#eaf3ed] flex items-center justify-center overflow-hidden">
                  {form.profileImageFile ? (
                    <img src={URL.createObjectURL(form.profileImageFile)} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[#006e42]">👤</span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  id="profile-upload"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f?.type.startsWith("image/")) update({ profileImageFile: f });
                  }}
                />
                <Button type="button" variant="outline" className="mt-4 w-full text-primary border-primary" onClick={() => document.getElementById("profile-upload")?.click()}>
                  <Upload className="h-4 w-4 mr-2" /> Upload
                </Button>
              </div>
              <div className="text-sm text-gray-700">
                <p className="font-bold mb-1">Must be an actual photo of you</p>
                <p>Logos, clip-art, group photos and digitally-altered images are not allowed</p>
              </div>
            </div>
          </>
        )}

        {/* Step 8: Your experience */}
        {step === 8 && (
          <>
            <h2 className="text-xl font-bold mb-1">Your experience</h2>
            <p className="text-sm text-muted-foreground mb-4">Input your past jobs</p>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2">Positions:</label>
              <div className="rounded-xl border border-input bg-muted/30 p-6 min-h-[120px]">
                {form.experiences.length === 0 && !addingExperience ? (
                  <p className="text-muted-foreground text-sm mb-4">No jobs yet</p>
                ) : (
                  <ul className="space-y-4 mb-4">
                    {form.experiences.map((exp, i) => (
                      <li key={i} className="p-3 bg-white rounded-lg border text-sm">
                        <div className="font-medium">{exp.title} {exp.company ? `at ${exp.company}` : ""}</div>
                        <div className="text-muted-foreground">{(exp.startDate || exp.endDate) ? `${exp.startDate || "?"} – ${exp.endDate || "Present"}` : ""}</div>
                        {exp.description && <p className="mt-1 text-muted-foreground text-xs">{exp.description}</p>}
                        <button type="button" className="text-primary text-xs mt-2" onClick={() => update({ experiences: form.experiences.filter((_, j) => j !== i) })}>Remove</button>
                      </li>
                    ))}
                  </ul>
                )}
                {addingExperience ? (
                  <div className="space-y-3 p-3 bg-white rounded-lg border mb-4">
                    <Input placeholder="Job title" value={newExp.title} onChange={(e) => setNewExp((p) => ({ ...p, title: e.target.value }))} className="h-10" />
                    <Input placeholder="Company" value={newExp.company} onChange={(e) => setNewExp((p) => ({ ...p, company: e.target.value }))} className="h-10" />
                    <div className="grid grid-cols-2 gap-2">
                      <Input type="month" placeholder="Start" value={newExp.startDate} onChange={(e) => setNewExp((p) => ({ ...p, startDate: e.target.value }))} className="h-10" />
                      <Input type="month" placeholder="End" value={newExp.endDate} onChange={(e) => setNewExp((p) => ({ ...p, endDate: e.target.value }))} className="h-10" />
                    </div>
                    <textarea placeholder="Description" value={newExp.description} onChange={(e) => setNewExp((p) => ({ ...p, description: e.target.value }))} className="w-full min-h-[60px] rounded-lg border border-input px-3 py-2 text-sm" />
                    <div className="flex gap-2">
                      <Button type="button" variant="outline" className="text-sm py-1.5" onClick={() => { setAddingExperience(false); setNewExp({ title: "", company: "", startDate: "", endDate: "", description: "" }); }}>Cancel</Button>
                      <Button type="button" className="text-sm py-1.5 bg-[#006e42] text-white" onClick={() => { update({ experiences: [...form.experiences, { ...newExp }] }); setAddingExperience(false); setNewExp({ title: "", company: "", startDate: "", endDate: "", description: "" }); }}>Save</Button>
                    </div>
                  </div>
                ) : null}
                {!addingExperience && (
                  <Button
                    type="button"
                    variant="outline"
                    className="text-primary border-primary"
                    onClick={() => setAddingExperience(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add job experience
                  </Button>
                )}
              </div>
            </div>
          </>
        )}

        {/* Step 9: Availability */}
        {step === 9 && (
          <>
            <h2 className="text-xl font-bold mb-1">Availability</h2>
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-1">Work Type *</label>
                <select
                  value={form.workType}
                  onChange={(e) => update({ workType: e.target.value })}
                  className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select Work Type *</option>
                  {WORK_TYPES.map((w) => (
                    <option key={w} value={w}>{w}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Time zone *</label>
                <select
                  value={form.timezone}
                  onChange={(e) => update({ timezone: e.target.value })}
                  className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select timezone *</option>
                  {TIMEZONES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Preferred way of payment *</label>
                <div className="flex flex-wrap gap-3">
                  {PAYMENT_OPTIONS.map((p) => (
                    <label key={p} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={form.paymentMethods.includes(p)}
                        onChange={(e) => {
                          if (e.target.checked) update({ paymentMethods: [...form.paymentMethods, p] });
                          else update({ paymentMethods: form.paymentMethods.filter((x) => x !== p) });
                        }}
                        className="rounded border-input"
                      />
                      <span className="text-sm">{p}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        <div className="flex gap-4">
          <Button
            variant="outline"
            className="flex-1 h-12 rounded-xl text-[#006e42] border-2 border-[#006e42] bg-white font-semibold hover:bg-[#006e42]/5"
            onClick={handlePrevious}
            disabled={stepIndex === 0}
          >
            Previous
          </Button>
          {step === 9 ? (
            <Button
              className={`flex-1 h-12 rounded-xl font-semibold ${
                canContinue && !loading
                  ? "bg-[#006e42] text-white hover:bg-[#005c36] cursor-pointer"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              onClick={handleSubmitFinal}
              disabled={!canContinue || loading}
            >
              {loading ? "Saving…" : "Continue"}
            </Button>
          ) : (
            <Button
              className={`flex-1 h-12 rounded-xl font-semibold ${
                canContinue
                  ? "bg-[#006e42] text-white hover:bg-[#005c36]"
                  : "bg-gray-200 text-gray-500 cursor-not-allowed"
              }`}
              onClick={handleNext}
              disabled={!canContinue}
            >
              Continue
            </Button>
          )}
        </div>
      </div>

      <a
        href="#"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-xl bg-[#006e42] text-white flex items-center justify-center shadow-lg hover:bg-[#005c36]"
        aria-label="Chat"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </div>
  );
}
