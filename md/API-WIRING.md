# API wiring — Frontend ↔ Backend

Kurasa na APIs zilizounganishwa na backend (winga-backend). Sample data inatumika kama fallback wakati API inashindwa au inarudisha tupu.

---

## Environment

Weka backend URL kwenye `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Bila hii, requests zitaenda kwenye `/api` (same-origin); weka proxy kwa backend ikiwa unahitaji.

---

## Auth (OTP flow)

| Page        | API | Fallback |
|------------|-----|----------|
| Register   | `POST /auth/send-otp`, `POST /auth/verify-otp`, `POST /auth/register/complete` | — |
| Login      | `POST /auth/send-otp`, `POST /auth/verify-otp` | — |

- **auth.service:** `sendOtp`, `verifyOtp`, `completeRegistration`, `me`, `logout`.
- Register: Email → OTP → Role → Industry (au Skip) → complete → redirect.
- Login: Email → OTP → redirect kwa role (CLIENT → /client, FREELANCER → /freelancer).

---

## Jobs

| Page | API | Fallback |
|------|-----|----------|
| (public) find-jobs | `GET /jobs?keyword=&category=&size=` | dummyJobs |
| (public) find-jobs/[id] | `GET /jobs/:id` | dummyJobs by id |
| (worker) find-jobs | `GET /jobs`, `GET /jobs/saved` (saved IDs), `POST/DELETE /jobs/:id/save` (bookmark) | dummyJobs |
| (worker) saved-jobs | `GET /jobs/saved` | savedJobsSample |
| (client) jobs | `GET /jobs/my-jobs` | dummyJobs (first 3) |

- **job.service:** `getJobs`, `getJobById`, `getCategories`, `getMyJobs`, `getSavedJobs`, `createJob`, `updateJob`, `deleteJob`, `saveJob`, `unsaveJob`.
- Worker find-jobs: bookmark (save/unsave) wired — `JobCardAdvanced` accepts `saved` and `onSaveToggle`; page loads saved IDs via `getSavedJobs`, then `saveJob`/`unsaveJob` on click.
- Backend inarudisha `ApiResponse<SpringPage<JobResponse>>`; frontend inabadilisha kuwa `JobListItem[]` na sample ikiwa API inashindwa.

---

## Contracts & Freelancer

| Page | API | Fallback |
|------|-----|----------|
| (worker) my-jobs | Tab **Applied:** `GET /freelancer/my-proposals`. Tab **Hired:** `GET /freelancer/my-contracts` | appliedJobsSample / hiredJobsSample |

- **contract.service:** `getMyContracts`, `getContract`.
- **freelancer.service:** `getDashboard()` → balance, totalEarned, activeContractsCount, pendingProposalsCount.

---

## Proposals & Hire

| Page / Component | API | Fallback |
|------------------|-----|----------|
| (client) jobs | `GET /jobs/my-jobs`; cards link to `/client/jobs/:id` (applicants) | dummyJobs |
| (client) jobs/[id] | `GET /jobs/:id`, `GET /proposals/jobs/:id/applicants` | — |
| HireModal | `POST /contracts/hire/:proposalId` | — |

- **proposal.service:** `getMyProposals`, `getJobApplicants(jobId)`, `submitProposal(jobId, body)`.
- **contract.service:** `hire(proposalId)` → creates contract, locks escrow.
- Client: Job list uses `getJobHref={(j) => /client/jobs/${j.id}}`; applicants page lists proposals and "Hire" opens HireModal → on confirm calls `contractService.hire(proposalId)`, then refreshes list.

---

## Notifications

| Component | API | Fallback |
|-----------|-----|----------|
| Worker topbar (bell) | `GET /notifications/unread-count`, `GET /notifications` (on open) | dummyNotifications count/list |
| Mark all read | `PATCH /notifications/read-all` | — |

- **notification.service:** `list`, `unreadCount`, `markAsRead`, `markAllAsRead`.

---

## Chat

| Page / Component | API | Fallback |
|------------------|-----|----------|
| (dashboard) chat / ChatWindow | Contracts: `GET /freelancer/my-contracts` (FREELANCER) or `GET /contracts/client/my-contracts` (CLIENT). Messages: `GET /chat/contracts/:id/messages`, `POST /chat/contracts/:id/messages`, `POST /chat/contracts/:id/read` | Empty list / message |

- **contract.service:** `getMyContracts`, `getClientContracts`, `getContract`.
- **chat.service:** `getContractMessages`, `sendContractMessage`, `markContractRead`, `unreadCount`; job: `getJobMessages`, `sendJobMessage`, `markJobRead`.
- ChatWindow: lists contracts by role, selects one, loads and sends messages; shows “Sign in” if not authenticated, “No contracts yet” if empty.

---

## Profile

| Page / Component | API | Fallback |
|------------------|-----|----------|
| (worker) profile | `GET /users/me` (authService.me), `GET /users/:id/rating`, `PATCH /users/me` (edit) | — |

- **profile.service:** `getMe()`, `updateProfile(body)`, `getPublicProfile(userId)`, `getReviews(userId)`, `getRatingSummary(userId)`.
- Worker profile: load via `authService.me()` + `profileService.getRatingSummary(me.id)`; Edit opens modal → `profileService.updateProfile({ fullName, phoneNumber, bio })` then `setUser` + local state update.

---

## Wallet & Earnings

| Page / Component | API | Fallback |
|------------------|-----|----------|
| (dashboard) /freelancer | `GET /freelancer/dashboard` | — |
| (dashboard) /freelancer/earnings | `GET /freelancer/dashboard`, `GET /wallet/transactions` | Empty / null |

- **freelancer.service:** `getDashboard()` → balance, totalEarned, currency, activeContractsCount, pendingProposalsCount.
- **wallet.service:** `getBalance()`, `getTransactions()`.
- Earnings page: summary cards (balance, total earned, active contracts, pending proposals) + recent transactions table.

---

## Response shape

Backend inarudisha:

```ts
{ success: boolean, message?: string, data: T, timestamp?: string }
```

Paginated (Spring Page):

```ts
{ content: T[], totalElements, totalPages, size, number, first, last }
```

`lib/axios.ts`: baseURL = `NEXT_PUBLIC_API_URL + "/api"`.  
`types/api-response.ts`: `ApiResponse<T>`, `SpringPage<T>`.
