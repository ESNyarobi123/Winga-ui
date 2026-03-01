import { api } from "@/lib/axios";
import type { User } from "@/types";
import type { ApiResponse, SpringPage } from "@/types/api-response";

/** Backend UpdateProfileRequest: all fields optional */
export interface UpdateProfileRequest {
  fullName?: string;
  phoneNumber?: string;
  bio?: string;
  skills?: string;
  profileImageUrl?: string;
  companyName?: string;
  telegram?: string;
  country?: string;
  /** JSON array string e.g. ["English","Swahili"] */
  languages?: string;
  cvUrl?: string;
  workType?: string;
  timezone?: string;
  /** JSON array string e.g. ["Bank Transfer","PayPal"] */
  paymentPreferences?: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  defaultCategoryId?: number;
}

/** Backend WorkExperienceResponse */
export interface WorkExperienceItem {
  id: number;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
  createdAt: string;
}

/** Backend WorkExperienceRequest (for POST/PUT) */
export interface WorkExperienceRequest {
  title: string;
  company?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

/** Backend RatingSummaryResponse */
export interface RatingSummary {
  averageRating: number;
  reviewCount: number;
}

/** Backend ReviewResponse */
export interface ReviewItem {
  id: number;
  contractId: number;
  reviewer: { id: number; fullName?: string };
  reviewee: { id: number; fullName?: string };
  rating: number;
  comment: string;
  createdAt: string;
}

export const profileService = {
  /** GET /users/me — same as authService.me(), use for consistency or after update */
  async getMe(): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>("/users/me");
    return data.data;
  },

  /** PATCH /users/me — update my profile (includes job seeker fields) */
  async updateProfile(body: UpdateProfileRequest): Promise<User> {
    const { data } = await api.patch<ApiResponse<User>>("/users/me", body);
    return data.data;
  },

  /** GET /users/me/experiences — my work experiences (job seeker) */
  async getMyExperiences(): Promise<WorkExperienceItem[]> {
    const { data } = await api.get<ApiResponse<WorkExperienceItem[]>>("/users/me/experiences");
    return data.data ?? [];
  },

  /** PUT /users/me/experiences — replace all my work experiences */
  async replaceExperiences(experiences: WorkExperienceRequest[]): Promise<WorkExperienceItem[]> {
    const { data } = await api.put<ApiResponse<WorkExperienceItem[]>>("/users/me/experiences", experiences);
    return data.data ?? [];
  },

  /** GET /users/:id — public profile */
  async getPublicProfile(userId: string | number): Promise<User> {
    const { data } = await api.get<ApiResponse<User>>(`/users/${userId}`);
    return data.data;
  },

  /** GET /users/:id/reviews — reviews received by this user */
  async getReviews(userId: string | number, params?: { page?: number; size?: number }) {
    const { data } = await api.get<ApiResponse<SpringPage<ReviewItem>>>(
      `/users/${userId}/reviews`,
      { params: { page: params?.page ?? 0, size: params?.size ?? 20 } }
    );
    return data.data;
  },

  /** GET /users/:id/rating — average rating and review count */
  async getRatingSummary(userId: string | number): Promise<RatingSummary> {
    const { data } = await api.get<ApiResponse<RatingSummary>>(`/users/${userId}/rating`);
    return data.data;
  },
};
