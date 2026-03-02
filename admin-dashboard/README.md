# Winga Admin Dashboard

Admin panel ya Winga — **hii ndiyo admin-dashboard** unayotumia na kutaka updates.

**Path:** `Winga ui/admin-dashboard` (Vite + React, sio Next.js).

---

## Tech stack

| | |
|---|---|
| **Framework** | Vite + React 18 |
| **Routing** | react-router-dom v7 |
| **UI** | @heroui/react, Tailwind CSS, lucide-react |
| **Charts** | recharts |
| **Backend** | winga-backend (Spring Boot) — `POST /api/auth/admin/login`, `GET /api/admin/*` |

---

## Muundo wa folders

```
admin-dashboard/
├── src/
│   ├── api/
│   │   └── client.ts          # API calls (getDashboardOverview, getUsers, getCategories, …)
│   ├── components/
│   │   ├── Layout.tsx         # Sidebar (toggle) + header (bell, toggle) + <Outlet />
│   │   └── Modal.tsx          # Reusable modal
│   ├── hooks/
│   │   └── useAuth.ts         # token, user, login, logout, getAuthHeaders
│   ├── pages/
│   │   ├── Login.tsx          # Admin login → /api/auth/admin/login
│   │   ├── Dashboard.tsx      # Stats, charts, quick actions
│   │   ├── Jobs.tsx
│   │   ├── Moderation.tsx     # Jobs pending moderation
│   │   ├── Applications.tsx
│   │   ├── Contracts.tsx
│   │   ├── Users.tsx
│   │   ├── Categories.tsx
│   │   ├── PaymentOptions.tsx
│   │   ├── Disputes.tsx
│   │   └── Settings.tsx
│   ├── App.tsx                # Routes, ProtectedRoute
│   ├── main.tsx
│   └── index.css              # Tailwind + Winga theme
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── .env                       # VITE_API_URL (optional)
```

---

## Kuendesha

1. **Backend** (winga-backend) iwe inaendesha kwenye **http://localhost:8080**.
2. **Admin dashboard** (hii folder):
   ```bash
   cd "/Users/eunice/WORKS/Winga ui/admin-dashboard"
   npm install
   npm run dev
   ```
3. Fungua **http://localhost:5174** (au port ya Vite).
4. Login: `admin@winga.co.tz` / password ya admin (kwa mfano `Admin@1234`).

---

## Backend (API)

- **Login:** `POST /api/auth/admin/login` — ADMIN / SUPER_ADMIN tu.
- **Dashboard:** `GET /api/admin/dashboard/overview` — metrics + charts data.
- **Stats:** `GET /api/admin/stats`.
- **Users:** `GET/POST/PUT/DELETE /api/admin/users`.
- **Jobs:** `GET /api/admin/jobs`, `GET /api/admin/jobs/moderation`, `PATCH /api/admin/jobs/{id}/moderate`.
- **Proposals:** `GET /api/admin/proposals`, moderate, bulk status.
- **Contracts:** `GET /api/admin/contracts`, terminate.
- **Categories:** `GET/POST/PUT/DELETE /api/admin/categories`.
- **Payment options:** `GET/POST/PUT/DELETE /api/admin/payment-options`.
- **Disputes:** `GET /api/admin/disputes`, resolve.

---

## Tabia ya UI (sasa)

- **Sidebar:** Auto-hidden; kitufe cha **toggle** (icon ya panel) kwenye **header upande wa kushoto** inafungua/kuifunga. Kwenye rununu kuna backdrop; bofya link inafunga sidebar.
- **Theme:** Winga green (`#006e42`), Tailwind (winga-primary, winga-muted, n.k.) kwenye `index.css` na `tailwind.config.js`.

---

## Updates / uboreshaji unaotakiwa

Tafadhali ongeza hapa (au niambie) kipi unataka kufanyiwa update:

- [ ] …
- [ ] …

---

*Hii admin-dashboard iko ndani ya repo ya Winga ui; backend iko kwenye repo ya winga-backend.*
