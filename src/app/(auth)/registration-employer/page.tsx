"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth.service";
import { useUserStore } from "@/store/use-user-store";
import { REGISTRATION_STORAGE_KEY } from "../register/page";
import { MessageCircle } from "lucide-react";

const INDUSTRIES = [
  "OnlyFans / Creator Economy",
  "Digital Marketing",
  "Technology & IT",
  "Agency",
  "E-commerce",
  "Healthcare",
  "Finance",
  "Education",
  "Other",
];

export default function RegistrationEmployerPage() {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);
  const [step, setStep] = useState(1);
  const [industry, setIndustry] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [displayCompanyName, setDisplayCompanyName] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payload, setPayload] = useState<{ registrationToken: string; email: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(REGISTRATION_STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : null;
      if (!data?.registrationToken || data?.role !== "EMPLOYER") {
        router.replace("/register");
        return;
      }
      setPayload(data);
    } catch {
      router.replace("/register");
    }
  }, [router]);

  const canContinueStep1 = !!industry.trim();
  const canContinueStep2 = !!companyName.trim();

  const handlePrevious = () => {
    if (step === 2) setStep(1);
    setError("");
  };

  const handleSubmit = async () => {
    if (!payload || !canContinueStep2) return;
    setError("");
    setLoading(true);
    try {
      const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ") || payload.email.split("@")[0];
      const res = await authService.completeRegistration(payload.registrationToken, {
        role: "CLIENT",
        fullName,
        industry: industry.trim() || undefined,
        companyName: companyName.trim() || undefined,
      });
      setUser(res.user);
      sessionStorage.removeItem(REGISTRATION_STORAGE_KEY);
      router.replace("/client/workers");
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
    <>
      <div className="w-full max-w-lg mx-auto px-4 pb-24">
        {/* Progress: thick black = done/current, thin grey = rest (like reference image) */}
        <div className="flex gap-0.5 w-full mb-5">
          <div className={`flex-1 rounded-full ${step >= 1 ? "h-2 bg-black" : "h-1 bg-gray-200"}`} />
          <div className={`flex-1 rounded-full ${step >= 2 ? "h-2 bg-black" : "h-1 bg-gray-200"}`} />
        </div>
        <h1 className="text-xl sm:text-2xl font-semibold text-center text-gray-800 tracking-wide mb-6 uppercase">
          WINGA
        </h1>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-md">
          {step === 1 && (
            <>
              <h2 className="text-xl font-bold mb-1">What industry is your business in?</h2>
              <p className="text-sm text-muted-foreground mb-6">
                We&apos;ll use this to show you the most relevant workers.
              </p>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Select your industry *</label>
                <select
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  className="w-full h-11 rounded-lg border border-input bg-background px-3 text-sm"
                >
                  <option value="">Select your industry *</option>
                  {INDUSTRIES.map((ind) => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h2 className="text-xl font-bold mb-1">Tell us about yourself</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Provided information will not be visible to other users.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First name</label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First name"
                    className="h-11"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last name</label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last name"
                    className="h-11"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Company name *</label>
                <Input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Company or Agency name"
                  className="h-11"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer text-sm text-muted-foreground mb-6">
                <input
                  type="checkbox"
                  checked={displayCompanyName}
                  onChange={(e) => setDisplayCompanyName(e.target.checked)}
                  className="rounded border-input accent-[#006e42]"
                />
                I want to display my company name to other users
              </label>
            </>
          )}

          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          <div className="flex gap-4 mt-6">
            <Button
              variant="outline"
              className="flex-1 h-12 rounded-xl text-[#006e42] border-2 border-[#006e42] bg-white font-semibold hover:bg-[#006e42]/5"
              onClick={handlePrevious}
              disabled={step === 1}
            >
              Previous
            </Button>
            {step === 1 ? (
              <Button
                className={`flex-1 h-12 rounded-xl font-semibold ${
                  canContinueStep1 ? "bg-[#006e42] text-white hover:bg-[#005c36]" : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                onClick={() => setStep(2)}
                disabled={!canContinueStep1}
              >
                Continue
              </Button>
            ) : (
              <Button
                className={`flex-1 h-12 rounded-xl font-semibold ${
                  canContinueStep2 && !loading ? "bg-[#006e42] text-white hover:bg-[#005c36]" : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}
                onClick={handleSubmit}
                disabled={!canContinueStep2 || loading}
              >
                {loading ? "Saving…" : "Continue"}
              </Button>
            )}
          </div>
        </div>
      </div>

      <a
        href="#"
        className="fixed bottom-6 right-6 w-12 h-12 rounded-xl bg-[#006e42] text-white flex items-center justify-center shadow-lg hover:bg-[#005c36] transition-colors"
        aria-label="Chat"
      >
        <MessageCircle className="h-6 w-6" />
      </a>
    </>
  );
}
