"use client";

import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authService } from "@/services/auth.service";
import { profileService } from "@/services/profile.service";
import { useAuth } from "@/hooks/use-auth";

function parseFullName(fullName?: string): { firstName: string; lastName: string } {
  if (!fullName?.trim()) return { firstName: "", lastName: "" };
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "" };
  const lastName = parts.pop() ?? "";
  return { firstName: parts.join(" "), lastName };
}

export default function ClientProfilePage() {
  const { setUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [agencyName, setAgencyName] = useState("");
  const [displayVerifiedBadge, setDisplayVerifiedBadge] = useState(false);
  const [displayCompanyName, setDisplayCompanyName] = useState(true);
  const [sendEmailNotifications, setSendEmailNotifications] = useState(true);
  const [email, setEmail] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [initialState, setInitialState] = useState("");

  useEffect(() => {
    authService
      .me()
      .then((user) => {
        setUser(user);
        const { firstName: f, lastName: l } = parseFullName(user.fullName);
        setFirstName(f);
        setLastName(l);
        setAgencyName(user.companyName ?? "");
        setEmail(user.email ?? "");
        setDisplayCompanyName(true);
        setInitialState(JSON.stringify({ f, l, agency: user.companyName ?? "" }));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [setUser]);

  useEffect(() => {
    const current = JSON.stringify({
      f: firstName,
      l: lastName,
      agency: agencyName,
    });
    setHasChanges(initialState !== "" && current !== initialState);
  }, [firstName, lastName, agencyName, initialState]);

  async function handleSave() {
    if (!hasChanges) return;
    setSaving(true);
    try {
      const fullName = [firstName.trim(), lastName.trim()].filter(Boolean).join(" ") || undefined;
      const updated = await profileService.updateProfile({
        fullName,
        companyName: agencyName.trim() || undefined,
      });
      setUser(updated);
      const { firstName: f, lastName: l } = parseFullName(updated.fullName);
      setFirstName(f);
      setLastName(l);
      setAgencyName(updated.companyName ?? "");
      setInitialState(JSON.stringify({ f, l, agency: updated.companyName ?? "" }));
    } catch {
      // keep form
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <p className="text-muted-foreground">Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="max-w-[560px] mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-[#111827] mb-8 text-center">Profile</h1>

      {/* Logo upload - square gray box like reference image */}
      <div className="mb-8 flex justify-center">
        <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg bg-[#e5e7eb] flex items-center justify-center border border-[#d1d5db] relative">
          <span className="text-[#6b7280] text-xs sm:text-sm font-semibold uppercase tracking-wider">LOGO</span>
          <button
            type="button"
            className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-white border-2 border-[#e5e7eb] flex items-center justify-center hover:bg-gray-50 shadow-md"
            aria-label="Upload logo"
          >
            <Camera className="w-4 h-4 text-[#555]" />
          </button>
        </div>
      </div>

      {/* Fields */}
      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">First Name</label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="h-11 bg-white border-[#E0E0E0]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">Last Name</label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="h-11 bg-white border-[#E0E0E0]"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[#374151] mb-1">Agency Name</label>
          <Input
            value={agencyName}
            onChange={(e) => setAgencyName(e.target.value)}
            className="h-11 bg-white border-[#E0E0E0]"
          />
        </div>
      </div>

      {/* Checkboxes */}
      <div className="space-y-3 mb-6">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-[#374151]">
          <input
            type="checkbox"
            checked={displayVerifiedBadge}
            onChange={(e) => setDisplayVerifiedBadge(e.target.checked)}
            className="rounded border-[#d1d5db] accent-[#006e42]"
          />
          Display verified employer badge
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-[#374151]">
          <input
            type="checkbox"
            checked={displayCompanyName}
            onChange={(e) => setDisplayCompanyName(e.target.checked)}
            className="rounded border-[#d1d5db] accent-[#006e42]"
          />
          Display company name
        </label>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-[#374151]">
          <input
            type="checkbox"
            checked={sendEmailNotifications}
            onChange={(e) => setSendEmailNotifications(e.target.checked)}
            className="rounded border-[#d1d5db] accent-[#006e42]"
          />
          Send email notifications
        </label>
      </div>

      <Button
        onClick={handleSave}
        disabled={!hasChanges || saving}
        className={`w-full h-12 rounded-xl font-semibold text-base ${
          hasChanges && !saving ? "bg-[#006e42] hover:bg-[#005c36] text-white" : "bg-gray-200 text-gray-500 cursor-default"
        }`}
      >
        {saving ? "Saving…" : "Save"}
      </Button>

      {/* Email change */}
      <div className="mt-10 pt-8 border-t border-[#E5E7EB]">
        <p className="text-sm text-[#6b7280] mb-2">
          To change your email please enter new one and hit send confirmation
        </p>
        <div className="flex gap-2">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="h-11 flex-1 bg-white border-[#E0E0E0]"
          />
          <Button variant="outline" className="h-11 px-4 border-[#E0E0E0] text-gray-600" disabled>
            Send Confirmation
          </Button>
        </div>
      </div>
    </div>
  );
}
