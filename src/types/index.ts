export type UserRole = "CLIENT" | "FREELANCER" | "ADMIN" | "SUPER_ADMIN";

export interface User {
  id: number | string;
  email: string;
  fullName?: string;
  name?: string;
  role?: UserRole;
  phoneNumber?: string;
  profileImageUrl?: string;
  bio?: string;
  industry?: string;
  companyName?: string;
  isVerified?: boolean;
  verificationStatus?: string;
  createdAt?: string;
  /** Job seeker: telegram handle */
  telegram?: string;
  /** Job seeker: country */
  country?: string;
  /** Job seeker: JSON array string e.g. ["English","Swahili"] */
  languages?: string;
  /** Job seeker: CV file URL */
  cvUrl?: string;
  /** Job seeker: e.g. Full-time */
  workType?: string;
  /** Job seeker: timezone string */
  timezone?: string;
  /** Job seeker: JSON array string e.g. ["Bank Transfer","PayPal"] */
  paymentPreferences?: string;
  /** Job seeker: comma-separated or JSON e.g. "Chatting, Copywriting" */
  skills?: string;
  city?: string;
  region?: string;
  latitude?: number;
  longitude?: number;
  defaultCategoryId?: number;
}

/** Worker list item for client Find Workers page (from API UserResponse) */
export interface WorkerListItem {
  id: string;
  name: string;
  location: string;
  title: string;
  description: string;
  tags: string[];
  profileImageUrl?: string;
}

/** Backend JobResponse shape (for API) */
export interface JobResponseBackend {
  id: number;
  title: string;
  description: string;
  budget: number;
  deadline?: string;
  status: string;
  tags: string[];
  category: string;
  experienceLevel?: string;
  viewCount: number;
  proposalCount: number;
  client?: { fullName?: string; profileImageUrl?: string; isVerified?: boolean };
  createdAt: string;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget?: number;
  budgetType?: "fixed" | "hourly";
  createdAt: string;
  createdBy: string;
}

/** Job list item (card view) — client name, verified, tags, posted time */
export interface JobListItem {
  id: string;
  title: string;
  description?: string;
  category: string;
  tags: string[];
  budget: string;
  budgetType: "Fixed Price" | "Hourly";
  clientName: string;
  clientLogo?: string | null;
  isVerified?: boolean;
  postedAt: string;
  location?: string;
}

export interface Proposal {
  id: string;
  jobId: string;
  freelancerId: string;
  coverLetter: string;
  bid?: number;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}
