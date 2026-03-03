/** Format backend job to JobListItem (for cards/list) */
import type { JobListItem } from "@/types";
import type { JobResponseBackend } from "@/types";

export function formatRelativeTime(iso: string): string {
  const date = new Date(iso);
  const now = new Date();
  const sec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (sec < 60) return "Just now";
  if (sec < 3600) return `${Math.floor(sec / 60)}m ago`;
  if (sec < 86400) return `${Math.floor(sec / 3600)}h ago`;
  if (sec < 604800) return `${Math.floor(sec / 86400)}d ago`;
  if (sec < 2592000) return `${Math.floor(sec / 604800)}w ago`;
  return date.toLocaleDateString();
}

export function formatBudgetTzs(amount: number): string {
  return `TZS ${amount.toLocaleString("en-US")}`;
}

export function jobResponseToListItem(j: JobResponseBackend): JobListItem {
  return {
    id: String(j.id),
    title: j.title,
    description: j.description,
    category: j.category ?? "General",
    tags: Array.isArray(j.tags) ? j.tags.filter(Boolean) : (typeof (j.tags as any) === "string" && (j.tags as any) ? (j.tags as any).split(",").map((s: string) => s.trim()).filter(Boolean) : []),
    budget: formatBudgetTzs(j.budget),
    budgetType: "Fixed Price",
    clientName: j.client?.fullName ?? "Client",
    clientLogo: j.client?.profileImageUrl ?? null,
    isVerified: j.client?.isVerified ?? false,
    postedAt: formatRelativeTime(j.createdAt),
    createdAt: j.createdAt,
  };
}
