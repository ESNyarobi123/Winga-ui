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
  skills?: string;
  country?: string;
  workType?: string;
  languages?: string;
}

function toWorkerListItem(u: UserResponseBackend): WorkerListItem {
  const skillsStr = u.skills ?? "";
  const tags: string[] = [];
  if (u.workType) tags.push(u.workType);
  if (skillsStr) {
    try {
      const arr = skillsStr.includes(",") ? skillsStr.split(",").map((s) => s.trim()) : [skillsStr];
      tags.push(...arr.filter(Boolean).slice(0, 4));
    } catch {
      tags.push(skillsStr.slice(0, 30));
    }
  }
  const title = tags[0] ?? u.workType ?? "Worker";
  return {
    id: String(u.id),
    name: u.fullName ?? "—",
    location: u.country ?? "—",
    title,
    description: u.bio ?? "",
    tags: tags.length ? tags : ["Available"],
    profileImageUrl: u.profileImageUrl,
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
  }): Promise<WorkersPageResult> {
    const { data } = await api.get<ApiResponse<SpringPage<UserResponseBackend>>>("/workers", {
      params: { page: params?.page ?? 0, size: params?.size ?? 20, keyword: params?.keyword ?? undefined },
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
