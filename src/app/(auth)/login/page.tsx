"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
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
    <div className="w-full max-w-md p-6">
      {step === "EMAIL" && (
        <>
          <h1 className="text-4xl font-extrabold mb-3 text-foreground">{t("auth.welcomeBack")}</h1>
          <p className="text-default-500 text-sm mb-6 pb-2">
            {t("auth.enterEmailToStart")}
          </p>

          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <Input
              type="email"
              placeholder={t("auth.enterEmail")}
              size="lg"
              value={email}
              onValueChange={setEmail}
              isRequired
              aria-label="Email"
              classNames={{
                inputWrapper: "rounded-xl border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-gray-300 data-[focus=true]:border-[#006e42] data-[focus-visible=true]:border-[#006e42] data-[focus-visible=true]:shadow-[0_0_0_2px_#006e42]",
                input: "text-foreground",
              }}
            />

            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" size="lg" className="w-full font-bold rounded-xl h-12 bg-[#006e42] text-white hover:bg-[#005c36]" isLoading={loading}>
              {loading ? t("common.sending") : t("common.submit")}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-default-500">
            {t("auth.noAccount")}{" "}
            <Link href="/register" className="text-[#006e42] font-semibold hover:underline">
              {t("common.signUp")}
            </Link>
          </p>
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
                inputWrapper: "rounded-xl border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-gray-300 data-[focus=true]:border-[#006e42] data-[focus-visible=true]:border-[#006e42] data-[focus-visible=true]:shadow-[0_0_0_2px_#006e42]",
                input: "text-center tracking-[0.4em] font-medium text-lg text-foreground",
              }}
              isRequired
              aria-label="OTP"
            />

            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" color="primary" size="lg" className="w-full font-semibold" isLoading={loading}>
              {loading ? t("common.verifying") : t("auth.verifyOtp")}
            </Button>

            <Button
              type="button"
              variant="bordered"
              color="primary"
              size="lg"
              className="w-full font-semibold mt-2"
              onPress={() => authService.sendOtp(email)}
            >
              {t("auth.resendOtp")}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
