import { useUserStore } from "@/store/use-user-store";

export function useAuth() {
  const { user, setUser, logout } = useUserStore();
  const isAuthenticated = !!user;

  return {
    user,
    isAuthenticated,
    setUser,
    logout,
  };
}
