"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { Skeleton } from "@heroui/skeleton";
import { authService } from "@/services/auth.service";
import { useUserStore } from "@/store/use-user-store";
import { useT } from "@/lib/i18n";

type Step = "EMAIL" | "OTP";

export default function LoginPage() {
  const t = useT();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);
  const [step, setStep] = useState<Step>("EMAIL");
  const [email, setEmail] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) return;
    setLoading(true);
    try {
      await authService.sendOtp(email);
      setStep("OTP");
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!otp || otp.length !== 6) return;
    setLoading(true);
    try {
      const result = await authService.verifyOtp(email, otp);
      if (result.requiresRegistration) {
        setError(t("auth.noAccountSignUp"));
        return;
      }
      if (result.auth) {
        const user = result.auth.user;
        setUser(user);
        const role = (user.role ?? "").toUpperCase();
        const destination = role === "CLIENT" ? "/client" : "/worker/find-jobs";
        router.replace(destination);
      }
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? t("auth.invalidOtp"));
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="w-full max-w-md p-6 space-y-4">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-12 w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-[440px] p-6 mx-auto sm:p-0">
      {step === "EMAIL" && (
        <>
          <h1 className="text-[40px] font-bold mb-2 text-[#232426] leading-tight">Welcome</h1>
          <p className="text-[#6b7280] text-[16px] mb-8">
            Please enter your email to get started...
          </p>

          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <Input
              type="email"
              placeholder="Enter email"
              size="lg"
              value={email}
              onValueChange={setEmail}
              isRequired
              aria-label="Email"
              classNames={{
                inputWrapper: "h-[52px] rounded-xl border border-gray-300 bg-white shadow-none data-[hover=true]:border-gray-400 data-[focus=true]:border-[#006e42] data-[focus-visible=true]:border-[#006e42] data-[focus-visible=true]:shadow-[0_0_0_1px_#006e42]",
                input: "text-[#232426] text-[16px]",
              }}
            />

            <div className="flex items-start gap-2 mt-4">
              <Checkbox
                isSelected={agreed}
                onValueChange={setAgreed}
                size="md"
                color="primary"
                classNames={{
                  wrapper: "rounded-[4px] border-gray-300 before:border-gray-300 group-data-[selected=true]:border-[#006E42] group-data-[selected=true]:bg-[#006E42]",
                }}
              />
              <span className="text-[14px] text-gray-500 leading-snug">
                I agree to the Winga <Link href="#" className="text-[#006E42] hover:underline">Privacy Policy</Link> and <Link href="#" className="text-[#006E42] hover:underline">Terms and Conditions.</Link>
              </span>
            </div>

            {error && <p className="text-sm text-danger">{error}</p>}

            <Button
              type="submit"
              size="lg"
              disabled={!email || !agreed || loading}
              className={`w-full font-bold rounded-xl h-[52px] text-[16px] transition-colors ${(!email || !agreed)
                ? "bg-black/10 text-white cursor-not-allowed"
                : "bg-[#006e42] text-white hover:bg-[#005c36]"
                }`}
              isLoading={loading}
            >
              Submit
            </Button>
          </form>
        </>
      )}

      {step === "OTP" && (
        <div className="relative -top-10">
          <h1 className="text-3xl font-bold mb-2 text-foreground">{t("auth.enterOtp")}</h1>
          <p className="text-default-500 text-sm mb-4">
            {t("auth.otpSentToEmail")}
          </p>

          <Button
            type="button"
            variant="light"
            color="primary"
            size="sm"
            className="mb-6 -ml-1 font-semibold uppercase"
            onPress={() => setStep("EMAIL")}
            startContent={<ChevronLeft className="h-4 w-4" />}
          >
            {t("auth.changeEmail")}
          </Button>

          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder={t("auth.enterOtpPlaceholder")}
              size="lg"
              value={otp}
              onValueChange={setOtp}
              maxLength={6}
              classNames={{
                inputWrapper: "h-[56px] rounded-xl border border-gray-300 bg-white shadow-none data-[hover=true]:border-gray-400 data-[focus=true]:border-[#006e42] data-[focus-visible=true]:border-[#006e42] data-[focus-visible=true]:shadow-[0_0_0_1px_#006e42]",
                input: "text-center tracking-[0.4em] font-medium text-lg text-foreground",
              }}
              isRequired
              aria-label="OTP"
            />

            {error && <p className="text-sm text-danger">{error}</p>}
            <Button
              type="submit"
              size="lg"
              className={`w-full font-bold rounded-xl h-[52px] text-[16px] transition-colors ${!otp || otp.length !== 6
                ? "bg-black/10 text-white cursor-not-allowed"
                : "bg-[#006e42] text-white hover:bg-[#005c36]"
                }`}
              isLoading={loading}
              disabled={!otp || otp.length !== 6 || loading}
            >
              Verify OTP
            </Button>

            <Button
              type="button"
              variant="bordered"
              size="lg"
              className="w-full font-bold rounded-xl h-[52px] text-[16px] mt-2 border-gray-300 text-gray-700 hover:bg-gray-50"
              onPress={() => authService.sendOtp(email)}
            >
              Resend OTP
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
