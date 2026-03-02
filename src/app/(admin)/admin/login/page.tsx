"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { ShieldCheck } from "lucide-react";
import { authService } from "@/services/auth.service";
import { useUserStore } from "@/store/use-user-store";

export default function AdminLoginPage() {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { user } = await authService.adminLogin(email, password);
      setUser(user);
      router.replace("/admin/dashboard");
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        "Login failed. Admin or Super Admin only.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Left: Brand */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-primary/10 justify-center items-center flex-col">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary/20 mix-blend-multiply" />
        <div className="absolute bottom-[-15%] left-[-20%] w-[700px] h-[700px] rounded-full bg-primary-dark/30 mix-blend-multiply" />
        <div className="z-10 flex flex-col items-center text-center px-12">
          <div className="flex items-center gap-3 text-primary mb-6">
            <ShieldCheck size={48} strokeWidth={2.5} />
            <span className="font-bold text-3xl tracking-tight">Winga Admin</span>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-4 max-w-md">
            Command center for Winga
          </h2>
          <p className="text-muted-foreground text-base max-w-sm">
            Manage jobs, users, categories, and moderation from one place.
          </p>
        </div>
        <p className="absolute bottom-8 text-muted-foreground text-sm z-10 text-center w-full">
          © {new Date().getFullYear()} Winga — Admin Portal
        </p>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12">
        <div className="mx-auto w-full max-w-[440px]">
          <h1 className="text-3xl font-bold mb-2 text-foreground">Welcome back</h1>
          <p className="text-muted-foreground text-[15px] mb-8">
            Sign in to access the admin dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              placeholder="admin@winga.co.tz"
              size="lg"
              value={email}
              onValueChange={setEmail}
              isRequired
              autoComplete="email"
              label="Email"
              variant="bordered"
              classNames={{
                inputWrapper: "rounded-xl border-2 border-border hover:border-primary/50 focus-within:!border-primary",
              }}
            />
            <Input
              type="password"
              placeholder="••••••••"
              size="lg"
              value={password}
              onValueChange={setPassword}
              isRequired
              autoComplete="current-password"
              label="Password"
              variant="bordered"
              classNames={{
                inputWrapper: "rounded-xl border-2 border-border hover:border-primary/50 focus-within:!border-primary",
              }}
            />

            {error && (
              <p className="text-sm text-destructive font-medium">{error}</p>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full font-semibold rounded-xl h-12 bg-primary text-primary-foreground hover:bg-primary-dark"
              isLoading={loading}
              isDisabled={!email || !password}
            >
              Sign in
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
