# Winga UI — Mapitio Kamili: Muundo, Flow, Mfumo na Docs

Hati hii inaelezea kila kitu ndani ya frontend: muundo wa mradi, mtiririko (flow) wa auth na kurasa, mfumo (state, API, protection), na uhusiano na backend.

---

## 1. Muundo wa Mradi (Structure)

```
src/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Auth group (login, register) — layout bila navbar
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx
│   ├── (public)/                  # Kurasa za umma (na navbar + footer)
│   │   ├── layout.tsx
│   │   ├── page.tsx               # Landing
│   │   ├── find-jobs/page.tsx     # Job feed (OFM style)
│   │   ├── find-jobs/[id]/page.tsx
│   │   ├── find-workers/page.tsx
│   │   ├── jobs/page.tsx, jobs/[id]/page.tsx
│   │   ├── results/page.tsx
│   │   ├── pricing/page.tsx
│   │   └── resources/page.tsx
│   ├── (dashboard)/               # App ya ndani (sidebar + header)
│   │   ├── layout.tsx             # Sidebar + UserNav
│   │   ├── client/page.tsx, client/post-job, client/proposals/[id]
│   │   ├── freelancer/page.tsx, freelancer/my-jobs, freelancer/earnings
│   │   └── chat/page.tsx
│   ├── access-denied/page.tsx
│   ├── api/auth/[...nextauth]/route.ts  # NextAuth (optional)
│   ├── page.tsx                  # Root → redirect "/find-jobs"
│   └── layout.tsx                # Root layout (providers)
│
├── components/
│   ├── ui/                       # Primitives (button, card, input, dialog, skeleton)
│   ├── shared/                   # navbar, footer, logo
│   ├── features/
│   │   ├── jobs/                  # job-card, job-list, job-filter, apply-modal
│   │   ├── proposals/             # proposal-list, hire-modal
│   │   ├── chat/                  # chat-window, message-bubble
│   │   ├── workers/               # worker-list, worker-card
│   │   └── dashboard/             # sidebar, user-nav
│   └── layouts/                   # max-width-wrapper
│
├── lib/
│   ├── axios.ts                  # Axios instance: baseURL = NEXT_PUBLIC_API_URL ?? "/api"
│   ├── utils.ts                  # cn(), formatters
│   ├── constants.ts              # JOB_CATEGORIES
│   ├── cookies.ts                # roleCookie, tokenCookie (winga_role, winga_token)
│   └── validators/                # auth-schema (login/register Zod), job-schema
│
├── hooks/                        # use-auth (Zustand), use-socket, use-debounce
├── services/                     # auth.service, job.service, payment.service
├── store/                        # use-user-store (Zustand: user, setUser, logout)
├── types/                        # index.ts (User, Job, Proposal, JobListItem), api-response.ts
├── data/                         # dummy-jobs.ts, dummy-workers.ts
└── middleware.ts                 # Role guard: /client/* → CLIENT, /freelancer/* → FREELANCER
```

**Stack:** Next.js 16, React 19, TypeScript, Tailwind 4, Zustand, React Query, Axios, Zod, React Hook Form.

---

## 2. Flow za Auth (Register na Login)

### 2.1 Register (register/page.tsx)

| Step   | UI                         | Backend (sasa) |
|--------|----------------------------|----------------|
| 1      | Enter Email + terms checkbox | **Hakuna API** — setStep("OTP") tu |
| 2      | Enter OTP + Resend         | **Hakuna API** — setStep("ROLE") tu |
| 3      | Chagua Role: Employer / Seeker | setStep("INDUSTRY") |
| 4      | Industry (dropdown) au **Skip** | **Hakuna API** — router.push(role === "EMPLOYER" ? "/client" : "/freelancer") |
| 5      | Dashboard                  | User hajasajiliwa kwenye backend; token hapo hapo |

**Hitimisho:** Flow ya UI (Email → OTP → Role → Industry/Skip → Dashboard) iko sawa na backend, lakini **hajawaiunganishwa**. Hakuna:
- `POST /api/auth/send-otp`
- `POST /api/auth/verify-otp`
- `POST /api/auth/register/complete` (na `registrationToken`)

### 2.2 Login (login/page.tsx)

| Step   | UI              | Backend (sasa) |
|--------|-----------------|----------------|
| 1      | Enter Email     | **Hakuna API** — setStep("OTP") |
| 2      | Enter OTP       | **Hakuna API** — router.push("/client") (hardcoded) |
| 3      | Dashboard       | Hakuna token; role haijaseti |

**Hitimisho:** Login flow (Email → OTP → Dashboard) iko kwenye UI, lakini **haiitumii backend**. Inabaki ku-wire:
- send-otp → verify-otp → ikiwa `requiresRegistration: false` → store token + role, redirect kwa dashboard (kwa role).

---

## 3. Mfumo (System)

### 3.1 State (Zustand)

- **use-user-store:** `user`, `setUser`, `logout`. Token inahifadhiwa **localStorage** ("token"), na role kwenye **cookie** "winga_role" (kupitia auth.service).
- **use-auth:** wrapper juu ya user store; `user`, `isAuthenticated`, `setUser`, `logout`.

### 3.2 API (Axios)

- **baseURL:** `process.env.NEXT_PUBLIC_API_URL ?? "/api"`. Lazima backend iwe reachable (mfano `http://localhost:8080` na proxy/rewrite, au `NEXT_PUBLIC_API_URL=http://localhost:8080` ikiwa backend iko port 8080).
- **Interceptor:** Authorization header = `Bearer ${localStorage.token}`; 401 → clear token.
- **auth.service:** `login`, `register` (password-based, **sio OTP**), `me()`, `logout`. Inasubiri backend response shape `{ data: { accessToken, refreshToken, user } }`.

### 3.3 Route protection (middleware)

- **/client/** → cookie `winga_role` lazima iwe "CLIENT"; vinginevyo → `/access-denied`.
- **/freelancer/** → cookie `winga_role` lazima iwe "FREELANCER"; vinginevyo → `/access-denied`.
- Hakuna ukaguzi wa JWT kwenye middleware (token iko localStorage; cookie ya role tu).

### 3.4 Data: dummy vs backend

- **find-jobs:** Inatumia **dummyJobs** (data/dummy-jobs.ts), **si** job.service.getJobs().
- **jobs/** (na job.service): jobService inaenda `/jobs` — ikiwa baseURL iko sawa na backend, inaweza kuwa wired (backend ina GET /api/jobs).
- **Dashboard (client/freelancer):** Kurasa za overview ziko; zinaweza kuwa na API calls baadaye.

---

## 4. Docs (Dux / Documentation)

- **md/structure.md:** Muundo wa folders na maelezo mafupi (App Router, components, lib, hooks, services, store, types, middleware). Ni msingi wa “docs” ya UI.
- **Hati hii (UI-REVIEW-FLOW-AND-SYSTEM.md):** Mapitio kamili ya flow, mfumo na mambo yanayobaki ku-wire.

---

## 5. Ulinganisho na Backend (Auth)

| Kipande              | Backend (winga-backend)                    | UI (Winga ui) sasa                          |
|----------------------|--------------------------------------------|---------------------------------------------|
| Register step 1      | POST /api/auth/send-otp { email }          | Local state only                            |
| Register step 2      | POST /api/auth/verify-otp { email, otp }   | Local state only                            |
| Register step 3      | —                                          | Role (Employer/Seeker) ✅                    |
| Register step 4      | —                                          | Industry / Skip ✅                          |
| Register step 5      | POST /api/auth/register/complete + token   | Redirect without API                        |
| Login                | send-otp → verify-otp → auth (tokens+user)| Local state → redirect /client              |
| Role mapping         | CLIENT, FREELANCER                         | EMPLOYER→/client, SEEKER→/freelancer (map to CLIENT/FREELANCER) |

---

## 6. Mapendekezo (Wiring)

1. **Register:**  
   - Step 1: Submit email → `authService.sendOtp(email)` (service mpya) → on success setStep("OTP").  
   - Step 2: Submit OTP → `authService.verifyOtp(email, otp)` → ikiwa `requiresRegistration: true`, store `registrationToken`, setStep("ROLE"); ikiwa false, store tokens + user, set role cookie, redirect dashboard.  
   - Step 4 (after role): "Continue" au "Skip" → `authService.completeRegistration(registrationToken, { role, fullName?, industry?, companyName? })` → store tokens + user, set role cookie, redirect `/client` au `/freelancer`.

2. **Login:**  
   - Step 1: Submit email → `authService.sendOtp(email)`.  
   - Step 2: Submit OTP → `authService.verifyOtp(email, otp)` → ikiwa `requiresRegistration: false`, store tokens + user, set role cookie, redirect by role (`/client` au `/freelancer`).

3. **auth.service:**  
   - Ongeza `sendOtp`, `verifyOtp`, `completeRegistration` kwa OTP flow; weka/endelea kutumia `login`/`register` za password kama “legacy” ikiwa unahitaji.  
   - Baada ya verify-otp / complete: `localStorage.setItem("token", accessToken)`, `roleCookie.set(user.role)` (CLIENT / FREELANCER), `setUser(user)` (Zustand).

4. **Environment:**  
   - Thibitisha `NEXT_PUBLIC_API_URL` inaelekeza kwenye backend (mfano `http://localhost:8080` ikiwa backend iko huko), ili OTP na jobs API zifanye kazi.

5. **Find-jobs:**  
   - Optionally replace dummy data na `jobService.getJobs()` (na backend GET /api/jobs) ili job feed iwe live.

---

## 7. Muhtasari

| Kipengele        | Hali |
|------------------|------|
| Muundo (structure) | ✅ Wazi — auth, public, dashboard groups; components, lib, store, services |
| Flow Register     | ✅ UI: Email→OTP→Role→Industry/Skip→Dashboard; ❌ haija-wire kwa backend OTP |
| Flow Login        | ✅ UI: Email→OTP→Dashboard; ❌ haija-wire; redirect hardcoded /client |
| State (Zustand)   | ✅ use-user-store, use-auth; token localStorage, role cookie |
| Route protection  | ✅ middleware kwa /client na /freelancer kwa cookie ya role |
| Auth service      | ⚠️ Inatumia password login/register; OTP flow haijaanza |
| Jobs data         | ⚠️ find-jobs: dummy; job.service iko tayari kwa backend |
| Docs              | ✅ structure.md; hati hii (flow + mfumo + wiring) |

Ukishawire auth (send-otp, verify-otp, register/complete) na backend, flow yote (register na login) na mfumo wa UI na “dux” (docs) zinaendana na backend na ndani ya UI yenyewe.
