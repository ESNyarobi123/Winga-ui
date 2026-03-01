import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody, CardHeader, Input } from "@heroui/react";
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
    const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8080";
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
    <div className="min-h-screen flex">
      {/* Left: Winga brand panel */}
      <div className="hidden lg:flex lg:w-[42%] bg-winga-primary flex-col justify-between p-12 text-white">
        <div>
          <div className="flex items-center gap-2 text-white/90">
            <ShieldCheck size={28} strokeWidth={2} />
            <span className="font-semibold text-lg">Winga</span>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold leading-tight max-w-xs">
            Admin panel for OFM Jobs
          </h2>
          <p className="mt-3 text-white/80 text-sm max-w-sm">
            Manage jobs, users, categories, and moderation from one place.
          </p>
        </div>
        <p className="text-white/60 text-xs">Winga — OFM Jobs</p>
      </div>

      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center bg-winga-muted p-6">
        <Card className="w-full max-w-md border border-winga-border bg-white shadow-winga-card-hover rounded-winga-xl overflow-hidden">
          <CardHeader className="flex flex-col gap-1 pb-0 pt-10 px-10">
            <h1 className="text-2xl font-bold text-winga-primary">Winga Admin</h1>
            <p className="text-winga-muted-foreground text-sm">Sign in to continue</p>
          </CardHeader>
          <CardBody className="p-10 pt-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                type="email"
                label="Email"
                placeholder="admin@winga.co.tz"
                value={email}
                onValueChange={setEmail}
                isRequired
                autoComplete="email"
                variant="bordered"
                classNames={{
                  inputWrapper: "border-winga-border hover:border-winga-primary/50 focus-within:!border-winga-primary",
                  input: "text-foreground",
                }}
              />
              <Input
                type="password"
                label="Password"
                placeholder="••••••••"
                value={password}
                onValueChange={setPassword}
                isRequired
                autoComplete="current-password"
                variant="bordered"
                classNames={{
                  inputWrapper: "border-winga-border hover:border-winga-primary/50 focus-within:!border-winga-primary",
                  input: "text-foreground",
                }}
              />
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className="btn-primary-winga font-medium rounded-xl h-12"
                size="lg"
                fullWidth
                isLoading={loading}
              >
                Sign in
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
