import { getAuthHeaders } from "../hooks/useAuth";

// Dev: empty = relative URL so Vite proxy (→ localhost:8080) is used; prod: set VITE_API_URL to full API URL
const API_BASE = import.meta.env.VITE_API_URL ?? "";

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data?: T;
};

export async function api<T>(path: string, options?: RequestInit): Promise<ApiResponse<T>> {
  const url = path.startsWith("http") ? path : `${API_BASE}/api${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", ...getAuthHeaders(), ...options?.headers },
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || res.statusText);
  return json as ApiResponse<T>;
}

export async function getDashboardOverview() {
  return api<{
    activeJobs: number;
    applicationsToday: number;
    applicationsThisMonth: number;
    hiresMade: number;
    responseRatePercent: number;
    revenue: number;
    pendingModerationCount: number;
    applicationsOverTime: { date: string; count: number }[];
    topCategories: { categoryName: string; count: number }[];
  }>("/admin/dashboard/overview");
}

export async function getStats() {
  return api<{
    totalUsers: number;
    totalClients: number;
    totalFreelancers: number;
    openJobs: number;
    totalJobs: number;
    activeContracts: number;
    completedContracts: number;
    disputedContracts: number;
    totalPlatformRevenue: number;
  }>("/admin/stats");
}

export type UserRow = {
  id: number;
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  role?: string;
  isVerified?: boolean;
  verificationStatus?: string;
  isActive?: boolean;
  createdAt?: string;
};

export async function getUsers(page = 0, size = 20) {
  return api<{ content: UserRow[]; totalElements: number }>(`/admin/users?page=${page}&size=${size}`);
}

export async function getUser(id: number) {
  return api<UserRow>(`/admin/users/${id}`);
}

export async function createUser(body: { email: string; fullName: string; password: string; role: string; phoneNumber?: string }) {
  return api<UserRow>("/admin/users", { method: "POST", body: JSON.stringify(body) });
}

export async function updateUser(id: number, body: Partial<{ fullName: string; email: string; password: string; role: string; phoneNumber: string; isVerified: boolean; isActive: boolean }>) {
  return api<UserRow>(`/admin/users/${id}`, { method: "PUT", body: JSON.stringify(body) });
}

export async function deleteUser(id: number) {
  return api(`/admin/users/${id}`, { method: "DELETE" });
}

export async function getModerationJobs(page = 0, size = 20) {
  return api<{ content: unknown[]; totalElements: number }>(`/admin/jobs/moderation?page=${page}&size=${size}`);
}

export async function moderateJob(id: number, status: string, rejectReason?: string) {
  return api(`/admin/jobs/${id}/moderate`, {
    method: "PATCH",
    body: JSON.stringify({ status, rejectReason: rejectReason || null }),
  });
}

export async function getCategories() {
  return api<{ id: number; name: string; slug: string; sortOrder: number }[]>("/admin/categories");
}

export async function createCategory(name: string, slug: string, sortOrder?: number) {
  return api("/admin/categories", {
    method: "POST",
    body: JSON.stringify({ name, slug, sortOrder: sortOrder ?? 0 }),
  });
}

export async function updateCategory(id: number, name: string, slug: string, sortOrder?: number) {
  return api(`/admin/categories/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name, slug, sortOrder: sortOrder ?? 0 }),
  });
}

export async function deleteCategory(id: number) {
  return api(`/admin/categories/${id}`, { method: "DELETE" });
}

// ─── Admin Jobs (all jobs, CRUD) ─────────────────────────────────────────────
export type JobRow = {
  id: number;
  title?: string;
  description?: string;
  budget?: number;
  deadline?: string;
  status?: string;
  category?: string;
  experienceLevel?: string;
  viewCount?: number;
  proposalCount?: number;
  client?: UserRow;
  createdAt?: string;
  moderationStatus?: string;
  isFeatured?: boolean;
  isBoostedTelegram?: boolean;
};

export async function getAdminJobs(page = 0, size = 20, status?: string) {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (status) params.set("status", status);
  return api<{ content: JobRow[]; totalElements: number }>(`/admin/jobs?${params}`);
}

export async function getAdminJob(id: number) {
  return api<JobRow>(`/admin/jobs/${id}`);
}

export async function updateAdminJob(id: number, body: Partial<{ title: string; description: string; budget: number; deadline: string; tags: string[]; category: string; experienceLevel: string; status: string; moderationStatus: string; isFeatured: boolean; isBoostedTelegram: boolean }>) {
  return api<JobRow>(`/admin/jobs/${id}`, { method: "PUT", body: JSON.stringify(body) });
}

export async function deleteAdminJob(id: number) {
  return api(`/admin/jobs/${id}`, { method: "DELETE" });
}

export async function createAdminJob(body: { clientId: number; title: string; description: string; budget: number; deadline?: string; tags?: string[]; category?: string; experienceLevel?: string }) {
  return api<JobRow>("/admin/jobs", { method: "POST", body: JSON.stringify(body) });
}

// ─── Applications / Proposals ───────────────────────────────────────────────
export type ProposalRow = {
  id: number;
  jobId: number;
  jobTitle?: string;
  freelancer?: UserRow;
  coverLetter?: string;
  bidAmount?: number;
  estimatedDuration?: string;
  revisionLimit?: number;
  status?: string;
  createdAt?: string;
};

export async function getAdminProposals(page = 0, size = 20, jobId?: number, status?: string) {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (jobId != null) params.set("jobId", String(jobId));
  if (status) params.set("status", status);
  return api<{ content: ProposalRow[]; totalElements: number }>(`/admin/proposals?${params}`);
}

export async function getAdminProposal(id: number) {
  return api<ProposalRow>(`/admin/proposals/${id}`);
}

export async function updateProposalStatus(id: number, status: string) {
  return api<ProposalRow>(`/admin/proposals/${id}/status?status=${encodeURIComponent(status)}`, { method: "PATCH" });
}

export async function bulkUpdateProposalStatus(proposalIds: number[], status: string) {
  return api<ProposalRow[]>("/admin/proposals/bulk-status", { method: "POST", body: JSON.stringify({ proposalIds, status }) });
}

// ─── Contracts / Hires ───────────────────────────────────────────────────────
export type ContractRow = {
  id: number;
  jobId: number;
  jobTitle?: string;
  client?: UserRow;
  freelancer?: UserRow;
  totalAmount?: number;
  escrowAmount?: number;
  releasedAmount?: number;
  status?: string;
  milestones?: { id: number; title?: string; amount?: number; status?: string }[];
  createdAt?: string;
  completedAt?: string;
};

export async function getAdminContracts(page = 0, size = 20, status?: string) {
  const params = new URLSearchParams({ page: String(page), size: String(size) });
  if (status) params.set("status", status);
  return api<{ content: ContractRow[]; totalElements: number }>(`/admin/contracts?${params}`);
}

export async function getAdminContract(id: number) {
  return api<ContractRow>(`/admin/contracts/${id}`);
}

export async function terminateContract(id: number) {
  return api<ContractRow>(`/admin/contracts/${id}/terminate`, { method: "POST" });
}

// ─── Payment options ─────────────────────────────────────────────────────────
export type PaymentOptionRow = {
  id: number;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  sortOrder: number;
  createdAt?: string;
};

export async function getPaymentOptions() {
  return api<PaymentOptionRow[]>("/admin/payment-options");
}

export async function createPaymentOption(body: { name: string; slug: string; description?: string; isActive?: boolean; sortOrder?: number }) {
  return api<PaymentOptionRow>("/admin/payment-options", { method: "POST", body: JSON.stringify(body) });
}

export async function updatePaymentOption(id: number, body: Partial<{ name: string; slug: string; description: string; isActive: boolean; sortOrder: number }>) {
  return api<PaymentOptionRow>(`/admin/payment-options/${id}`, { method: "PUT", body: JSON.stringify(body) });
}

export async function deletePaymentOption(id: number) {
  return api(`/admin/payment-options/${id}`, { method: "DELETE" });
}

export async function getDisputes(page = 0, size = 20) {
  return api<{ content: unknown[] }>(`/admin/disputes?page=${page}&size=${size}`);
}
