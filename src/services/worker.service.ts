import { api } from "@/lib/axios";
import type { ApiResponse, SpringPage } from "@/types/api-response";
import type { WorkerListItem } from "@/types";

/** Backend UserResponse when listing workers */
interface UserResponseBackend {
  id: number;
  fullName: string;
  email?: string;
  profileImageUrl?: string;
  bio?: string;
  headline?: string;
  skills?: string;
  country?: string;
  workType?: string;
  languages?: string;
  profileCompleteness?: number;
  isProfileComplete?: boolean;
  profileVerified?: boolean;
  profileVerifiedAt?: string;
}

function parseSkillsToTags(skillsStr: string | undefined): string[] {
  if (!skillsStr || typeof skillsStr !== "string") return [];
  const s = skillsStr.trim();
  if (!s) return [];
  if (s.startsWith("[")) {
    try {
      const arr = JSON.parse(s);
      return Array.isArray(arr) ? arr.map((x) => String(x).trim()).filter(Boolean).slice(0, 6) : [];
    } catch {
      return s.includes(",") ? s.split(",").map((x) => x.trim()).filter(Boolean).slice(0, 6) : [s];
    }
  }
  return s.includes(",") ? s.split(",").map((x) => x.trim()).filter(Boolean).slice(0, 6) : [s];
}

function toWorkerListItem(u: UserResponseBackend): WorkerListItem {
  const tags: string[] = [];
  if (u.workType) tags.push(u.workType);
  tags.push(...parseSkillsToTags(u.skills));
  const uniqueTags = [...new Set(tags.filter(Boolean))].slice(0, 6);
  const title = u.headline?.slice(0, 50) ?? uniqueTags[0] ?? u.workType ?? "Worker";
  return {
    id: String(u.id),
    name: u.fullName ?? "—",
    location: u.country ?? "—",
    title,
    description: u.bio ?? "",
    tags: uniqueTags.length ? uniqueTags : [],
    profileImageUrl: u.profileImageUrl,
    headline: u.headline,
    profileCompleteness: u.profileCompleteness,
    isProfileComplete: u.isProfileComplete,
    profileVerified: u.profileVerified,
  };
}

export interface WorkersPageResult {
  list: WorkerListItem[];
  totalElements: number;
  totalPages: number;
  number: number;
}

export const workerService = {
  async getWorkers(params?: {
    page?: number;
    size?: number;
    keyword?: string;
    employmentType?: string;
    language?: string;
    skill?: string;
    categoryId?: number;
    profileVerified?: boolean;
    profileComplete?: boolean;
  }): Promise<WorkersPageResult> {
    const { data } = await api.get<ApiResponse<SpringPage<UserResponseBackend>>>("/workers", {
      params: {
        page: params?.page ?? 0,
        size: params?.size ?? 20,
        keyword: params?.keyword ?? undefined,
        employmentType: params?.employmentType ?? undefined,
        language: params?.language ?? undefined,
        skill: params?.skill ?? undefined,
        categoryId: params?.categoryId ?? undefined,
        profileVerified: params?.profileVerified ?? undefined,
        profileComplete: params?.profileComplete ?? undefined,
      },
    });
    const page = data.data;
    return {
      list: page.content.map(toWorkerListItem),
      totalElements: page.totalElements,
      totalPages: page.totalPages,
      number: page.number,
    };
  },
};
