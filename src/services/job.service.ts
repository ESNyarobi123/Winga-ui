import { api } from "@/lib/axios";
import type { JobResponseBackend } from "@/types";
import type { JobListItem } from "@/types";
import type { JobInput } from "@/lib/validators/job-schema";
import type { ApiResponse, SpringPage } from "@/types/api-response";
import { jobResponseToListItem } from "@/lib/format";

export interface JobsPageResult {
  list: JobListItem[];
  totalElements: number;
  totalPages: number;
  number: number;
}

function unwrapPage(res: ApiResponse<SpringPage<JobResponseBackend>>): SpringPage<JobResponseBackend> {
  return res.data;
}

export const jobService = {
  async getJobs(params?: {
    page?: number;
    size?: number;
    keyword?: string;
    category?: string;
    employmentType?: string;
    socialMedia?: string;
    software?: string;
    language?: string;
    minBudget?: number;
    maxBudget?: number;
  }): Promise<JobsPageResult> {
    const { data } = await api.get<ApiResponse<SpringPage<JobResponseBackend>>>("/jobs", {
      params: { page: params?.page ?? 0, size: params?.size ?? 20, ...params },
    });
    const page = unwrapPage(data);
    return {
      list: page.content.map(jobResponseToListItem),
      totalElements: page.totalElements,
      totalPages: page.totalPages,
      number: page.number,
    };
  },

  async getJobById(id: string): Promise<JobResponseBackend | null> {
    const { data } = await api.get<ApiResponse<JobResponseBackend>>(`/jobs/${id}`);
    return data.data;
  },

  async getCategories(): Promise<string[]> {
    const { data } = await api.get<ApiResponse<string[]>>("/jobs/categories");
    return data.data ?? [];
  },

  /** GET /jobs/filter-options — employment types, social media, software, languages (admin-managed; seed in v8) */
  async getFilterOptions(): Promise<{
    employmentTypes: { id: number; name: string; slug: string }[];
    socialMedia: { id: number; name: string; slug: string }[];
    software: { id: number; name: string; slug: string }[];
    languages: { id: number; name: string; slug: string }[];
  }> {
    const { data } = await api.get<ApiResponse<{
      employmentTypes?: { id: number; name: string; slug: string; sortOrder?: number }[];
      socialMedia?: { id: number; name: string; slug: string; sortOrder?: number }[];
      software?: { id: number; name: string; slug: string; sortOrder?: number }[];
      languages?: { id: number; name: string; slug: string; sortOrder?: number }[];
    }>>("/jobs/filter-options");
    const raw = data?.data ?? data;
    const o = (raw as Record<string, unknown>) ?? {};
    const map = (arr: unknown) =>
      Array.isArray(arr) ? arr.map((x: { id?: number; name?: string; slug?: string }) => ({ id: x.id ?? 0, name: String(x.name ?? ""), slug: String(x.slug ?? "") })) : [];
    return {
      employmentTypes: map(o.employmentTypes),
      socialMedia: map(o.socialMedia),
      software: map(o.software),
      languages: map(o.languages),
    };
  },

  async getMyJobs(params?: { page?: number; size?: number }): Promise<JobsPageResult> {
    const { data } = await api.get<ApiResponse<SpringPage<JobResponseBackend>>>("/jobs/my-jobs", {
      params: { page: params?.page ?? 0, size: params?.size ?? 20 },
    });
    const page = unwrapPage(data);
    return {
      list: page.content.map(jobResponseToListItem),
      totalElements: page.totalElements,
      totalPages: page.totalPages,
      number: page.number,
    };
  },

  async getSavedJobs(params?: { page?: number; size?: number }): Promise<JobsPageResult> {
    const { data } = await api.get<ApiResponse<SpringPage<JobResponseBackend>>>("/jobs/saved", {
      params: { page: params?.page ?? 0, size: params?.size ?? 20 },
    });
    const page = unwrapPage(data);
    return {
      list: page.content.map(jobResponseToListItem),
      totalElements: page.totalElements,
      totalPages: page.totalPages,
      number: page.number,
    };
  },

  async createJob(input: JobInput) {
    const { data } = await api.post<ApiResponse<JobResponseBackend>>("/jobs", input);
    return data.data;
  },

  async updateJob(id: string, input: Partial<JobInput>) {
    const { data } = await api.put<ApiResponse<JobResponseBackend>>(`/jobs/${id}`, input);
    return data.data;
  },

  async deleteJob(id: string) {
    await api.delete(`/jobs/${id}`);
  },

  async saveJob(jobId: string) {
    await api.post(`/jobs/${jobId}/save`);
  },

  async unsaveJob(jobId: string) {
    await api.delete(`/jobs/${jobId}/save`);
  },
};
