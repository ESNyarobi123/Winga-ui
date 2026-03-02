"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Checkbox } from "@heroui/checkbox";
import { authService } from "@/services/auth.service";
import { useUserStore } from "@/store/use-user-store";

const REGISTRATION_STORAGE_KEY = "winga_registration";

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);
  const [step, setStep] = useState<"EMAIL" | "OTP">("EMAIL");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      if (result.requiresRegistration && result.registrationToken) {
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            REGISTRATION_STORAGE_KEY,
            JSON.stringify({ registrationToken: result.registrationToken, email })
          );
        }
        router.replace("/what-are-you");
        return;
      }
      if (result.auth) {
        const user = result.auth.user;
        setUser(user);
        const role = (user.role ?? "").toUpperCase();
        router.replace(role === "CLIENT" ? "/client" : "/worker/find-jobs");
      }
    } catch (err: unknown) {
      setError((err as { response?: { data?: { message?: string } } })?.response?.data?.message ?? "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = () => {
    setError("");
    setLoading(true);
    authService.sendOtp(email).then(() => setLoading(false)).catch(() => setLoading(false));
  };

  return (
    <div className="w-full max-w-md p-6">
      {step === "EMAIL" && (
        <>
          <h1 className="text-4xl font-extrabold mb-3 text-foreground">Welcome</h1>
          <p className="text-default-500 text-sm mb-6 pb-2">
            Please enter your email to get started. If you already have an account we will log you in.
          </p>

          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <Input
              type="email"
              placeholder="Enter email"
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

            <Checkbox isRequired classNames={{ label: "text-sm text-default-500" }}>
              I agree to the Winga{" "}
              <Link href="#" className="font-semibold text-[#006e42] hover:underline">Privacy Policy</Link>
              {" "}and{" "}
              <Link href="#" className="font-semibold text-[#006e42] hover:underline">Terms and Conditions</Link>
            </Checkbox>

            {error && <p className="text-sm text-danger">{error}</p>}
            <Button type="submit" size="lg" className="w-full font-bold rounded-xl h-12 bg-[#006e42] text-white hover:bg-[#005c36]" isLoading={loading}>
              {loading ? "Sending…" : "Submit"}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-default-500">
            Already have an account?{" "}
            <Link href="/login" className="text-primary font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </>
      )}

      {step === "OTP" && (
        <>
          <h1 className="text-3xl font-bold mb-2 text-foreground">Enter OTP</h1>
          <p className="text-default-500 text-sm mb-4">
            Please enter the OTP sent to your email.
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
            Change Email
          </Button>

          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Enter OTP"
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
              {loading ? "Verifying…" : "Verify OTP"}
            </Button>

            <Button
              type="button"
              variant="bordered"
              color="primary"
              size="lg"
              className="w-full font-semibold mt-2"
              isDisabled={loading}
              onPress={handleResendOtp}
            >
              Resend OTP
            </Button>
          </form>
        </>
      )}
    </div>
  );
}

export { REGISTRATION_STORAGE_KEY };
