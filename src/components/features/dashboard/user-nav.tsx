"use client";

import { useAuth } from "@/hooks/use-auth";

export function UserNav() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="flex items-center justify-end gap-4">
      {isAuthenticated ? (
        <span className="text-sm text-muted-foreground">
          {user?.email ?? "User"}
        </span>
      ) : (
        <span className="text-sm text-muted-foreground">Not signed in</span>
      )}
    </div>
  );
}
