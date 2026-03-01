import { api } from "@/lib/axios";
import type { User } from "@/types";
import type { LoginInput, RegisterInput } from "@/lib/validators/auth-schema";
import type { ApiResponse } from "@/types/api-response";
import { roleCookie } from "@/lib/cookies";

interface AuthResponsePayload {
  accessToken: string;
  refreshToken: string;
  user: User;
}

/** Backend VerifyOtpResponse: requiresRegistration, registrationToken, auth (AuthResponse) */
export interface VerifyOtpResult {
  requiresRegistration: boolean;
  registrationToken: string | null;
  auth: AuthResponsePayload | null;
}

function persistAuth(payload: AuthResponsePayload) {
  const user = { ...payload.user, role: payload.user.role ?? "CLIENT" };
  if (typeof window !== "undefined") {
    localStorage.setItem("token", payload.accessToken);
    if (user.role) roleCookie.set(user.role);
  }
  return { user, token: payload.accessToken };
}

export const authService = {
  async sendOtp(email: string): Promise<void> {
    await api.post<ApiResponse<unknown>>("/auth/send-otp", { email });
  },

  async verifyOtp(email: string, otp: string): Promise<VerifyOtpResult> {
    const { data } = await api.post<ApiResponse<VerifyOtpResult>>("/auth/verify-otp", { email, otp });
    const res = data.data;
    if (res.requiresRegistration) {
      return { requiresRegistration: true, registrationToken: res.registrationToken, auth: null };
    }
    if (res.auth) {
      persistAuth({
        accessToken: res.auth.accessToken ?? (res.auth as { token?: string }).token ?? "",
        refreshToken: res.auth.refreshToken ?? "",
        user: res.auth.user,
      });
    }
    return res;
  },

  async completeRegistration(
    registrationToken: string,
    body: { role: "CLIENT" | "FREELANCER"; fullName?: string; industry?: string; companyName?: string }
  ): Promise<{ user: User; token: string }> {
    const { data } = await api.post<ApiResponse<AuthResponsePayload>>("/auth/register/complete", body, {
      headers: { Authorization: `Bearer ${registrationToken}` },
    });
    const payload = data.data;
    return persistAuth(payload);
  },

  async login(input: LoginInput): Promise<{ user: User; token: string }> {
    const { data } = await api.post<ApiResponse<AuthResponsePayload>>("/auth/login", input);
    return persistAuth(data.data);
  },

  async register(input: RegisterInput): Promise<{ user: User; token: string }> {
    const { data } = await api.post<ApiResponse<AuthResponsePayload>>("/auth/register", input);
    return persistAuth(data.data);
  },

  async me(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>("/users/me");
    return data.data;
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      roleCookie.remove();
    }
  },
};
