"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, Search, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authService } from "@/services/auth.service";
import { useUserStore } from "@/store/use-user-store";
import { REGISTRATION_STORAGE_KEY } from "../register/page";

type Role = "EMPLOYER" | "SEEKER" | null;

export default function WhatAreYouPage() {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [payload, setPayload] = useState<{ registrationToken: string; email: string } | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem(REGISTRATION_STORAGE_KEY);
      const data = raw ? JSON.parse(raw) : null;
      if (!data?.registrationToken) {
        router.replace("/register");
        return;
      }
      setPayload(data);
    } catch {
      router.replace("/register");
    }
  }, [router]);

  const handleContinue = async () => {
    if (!role || !payload) return;
    setError("");
    setLoading(true);
    try {
      if (role === "EMPLOYER") {
        sessionStorage.setItem(
          REGISTRATION_STORAGE_KEY,
          JSON.stringify({ ...payload, role: "EMPLOYER" })
        );
        router.push("/registration-employer");
        return;
      } else {
        sessionStorage.setItem(
          REGISTRATION_STORAGE_KEY,
          JSON.stringify({ ...payload, role: "SEEKER" })
        );
        router.push("/registration-job-seeker");
      }
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
          "Something went wrong."
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
      <div className="w-full max-w-xl mx-auto text-center px-4">
        <h1 className="text-[26px] sm:text-[30px] md:text-[34px] font-bold mb-10 text-[#006E42]">
          What are you?
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <button
            type="button"
            onClick={() => setRole("EMPLOYER")}
            className={`p-6 sm:p-8 bg-white border-2 rounded-2xl text-left transition-all min-h-[220px] ${
              role === "EMPLOYER"
                ? "border-[#006e42] shadow-md shadow-[#006e42]/10"
                : "border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md"
            }`}
          >
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-5 transition-colors ${
                role === "EMPLOYER" ? "bg-[#006e42] text-white" : "bg-[#eaf3ed] text-[#006e42]"
              }`}
            >
              <Briefcase className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <h3 className="font-bold text-lg sm:text-xl text-[#1f2937] mb-2">Employer</h3>
            <p className="text-sm text-[#4b5563] leading-relaxed">
              Connect with top talent. Post your vacancies and discover your next great hire.
            </p>
          </button>

          <button
            type="button"
            onClick={() => setRole("SEEKER")}
            className={`p-6 sm:p-8 bg-white border-2 rounded-2xl text-left transition-all min-h-[220px] ${
              role === "SEEKER"
                ? "border-[#006e42] shadow-md shadow-[#006e42]/10"
                : "border-gray-200 shadow-sm hover:border-gray-300 hover:shadow-md"
            }`}
          >
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center mb-5 transition-colors ${
                role === "SEEKER" ? "bg-[#006e42] text-white" : "bg-[#eaf3ed] text-[#006e42]"
              }`}
            >
              <Search className="h-7 w-7 sm:h-8 sm:w-8" />
            </div>
            <h3 className="font-bold text-lg sm:text-xl text-[#1f2937] mb-2">Job Seeker</h3>
            <p className="text-sm text-[#4b5563] leading-relaxed">
              Kickstart your career journey. Find and apply to your ideal job today.
            </p>
          </button>
        </div>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
        <Button
          onClick={handleContinue}
          disabled={!role || loading}
          className={`w-full max-w-[220px] h-12 text-base font-bold mx-auto rounded-xl transition-all ${
            role && !loading
              ? "bg-[#006e42] text-white hover:bg-[#005c36]"
              : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {loading ? "…" : "Continue"}
        </Button>
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
