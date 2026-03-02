import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@heroui/react";
import { useAuth } from "../hooks/useAuth";
import { ShieldCheck } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // Dev: use relative URL so Vite proxy (→ localhost:8080) is used and CORS/NetworkError is avoided
    const apiBase = import.meta.env.VITE_API_URL ?? "";
    try {
      const res = await fetch(`${apiBase}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const text = await res.text();
      let data: { success?: boolean; message?: string; data?: { accessToken?: string; token?: string } };
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        const hint = text.startsWith("<") ? " (HTML – wrong server?)" : text ? ` (got: ${text.slice(0, 80)}…)` : " (empty)";
        setError(`Backend returned invalid response${hint}. Ensure Spring Boot runs on :8080.`);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(data.message || "Login failed");
      const token = data.data?.accessToken ?? data.data?.token;
      if (token) {
        login(token);
        navigate("/dashboard");
      } else throw new Error("No token received");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Pane - Brand Pattern */}
      <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-[#eaf3ed] justify-center items-center flex-col">
        {/* Decorative Circles */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-winga-primary/20 mix-blend-multiply"></div>
        <div className="absolute top-[-5%] right-[-15%] w-[600px] h-[600px] rounded-full bg-winga-primary mix-blend-multiply"></div>
        <div className="absolute bottom-[-15%] left-[-20%] w-[700px] h-[700px] rounded-full bg-[#005c36] mix-blend-multiply"></div>
        <div className="absolute bottom-[-10%] left-[10%] w-[400px] h-[400px] rounded-full bg-winga-primary/40 mix-blend-multiply"></div>

        {/* Brand Content */}
        <div className="z-10 flex flex-col items-center justify-center text-center px-12">
          <div className="flex items-center gap-3 text-white mb-6">
            <ShieldCheck size={48} strokeWidth={2.5} className="drop-shadow-md" />
            <span className="font-extrabold text-[40px] tracking-tight drop-shadow-md">Winga Admin</span>
          </div>
          <h2 className="text-[28px] font-bold text-white mb-4 max-w-md drop-shadow-sm leading-tight">
            Command Center for Winga
          </h2>
          <p className="text-white/90 text-[18px] max-w-sm drop-shadow-sm">
            Manage jobs, users, categories, and moderation from one central place.
          </p>
        </div>

        <p className="absolute bottom-8 text-white/70 text-sm font-medium z-10 w-full text-center">
          © {new Date().getFullYear()} Winga — Secure Admin Portal
        </p>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-12 bg-white">
        <div className="mx-auto w-full max-w-[440px] p-6 sm:p-0">
          <h1 className="text-[40px] font-bold mb-2 text-[#232426] leading-tight">Welcome Back</h1>
          <p className="text-[#6b7280] text-[16px] mb-8">
            Sign in to access the administrator dashboard.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              placeholder="admin@winga.co.tz"
              size="lg"
              value={email}
              onValueChange={setEmail}
              isRequired
              autoComplete="email"
              aria-label="Email Address"
              variant="bordered"
              classNames={{
                inputWrapper: "h-[56px] rounded-xl border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-gray-300 data-[focus=true]:border-[#006e42]",
                input: "text-[#232426] text-[16px]",
              }}
            />
            <Input
              type="password"
              placeholder="Password (••••••••)"
              size="lg"
              value={password}
              onValueChange={setPassword}
              isRequired
              autoComplete="current-password"
              aria-label="Password"
              variant="bordered"
              classNames={{
                inputWrapper: "h-[56px] rounded-xl border-2 border-gray-200 bg-white shadow-sm data-[hover=true]:border-gray-300 data-[focus=true]:border-[#006e42]",
                input: "text-[#232426] text-[16px]",
              }}
            />

            {error && (
              <p className="text-sm text-danger-500 font-medium">
                {error}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={!email || !password || loading}
              className={`w-full font-bold rounded-xl h-[56px] text-[16px] transition-colors mt-2 ${(!email || !password)
                ? "bg-black/10 text-white cursor-not-allowed"
                : "bg-[#006e42] text-white hover:bg-[#005c36] shadow-md"
                }`}
              isLoading={loading}
            >
              Sign In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
