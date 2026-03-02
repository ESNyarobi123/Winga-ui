import { useState, useEffect, useCallback } from "react";

const TOKEN_KEY = "winga_admin_token";

export type AuthUser = {
  id: number;
  fullName: string | null;
  email: string | null;
  role?: string;
  isVerified?: boolean;
  isActive?: boolean;
};

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    }
  }, [token]);

  const fetchUser = useCallback(async () => {
    const t = localStorage.getItem(TOKEN_KEY);
    if (!t) {
      setLoading(false);
      return;
    }
    const apiBase = import.meta.env.VITE_API_URL ?? "";
    try {
      const res = await fetch(`${apiBase}/api/auth/me`, {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (res.ok) {
        const json = await res.json();
        const u = json?.data;
        if (u) setUser({ id: u.id, fullName: u.fullName ?? null, email: u.email ?? null, role: u.role, isVerified: u.isVerified, isActive: u.isActive });
      } else setUser(null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) fetchUser();
    else {
      setUser(null);
      setLoading(false);
    }
  }, [token, fetchUser]);

  const login = (t: string) => setToken(t);
  const logout = () => setToken(null);

  return { token, user, loading, login, logout, fetchUser };
}

export function getAuthHeaders(): HeadersInit {
  const t = localStorage.getItem(TOKEN_KEY);
  return t ? { Authorization: `Bearer ${t}` } : {};
}
