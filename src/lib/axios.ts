import axios from "axios";
import { authService } from "@/services/auth.service";

const apiHost = process.env.NEXT_PUBLIC_API_URL ?? "";
const baseURL = apiHost ? `${apiHost.replace(/\/$/, "")}/api` : "/api";

export const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry && typeof window !== "undefined") {
      originalRequest._retry = true;
      const refreshed = await authService.refreshTokens();
      if (refreshed?.token) {
        originalRequest.headers.Authorization = `Bearer ${refreshed.token}`;
        return api(originalRequest);
      }
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    }
    return Promise.reject(error);
  }
);
