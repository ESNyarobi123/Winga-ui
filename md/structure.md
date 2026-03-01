src/
├── app/                            # 🚀 App Router (Pages & Routing)
│   ├── (auth)/                     # Group: Authentication Routes
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx              # Clean layout (No Navbar/Footer)
│   │
│   ├── (public)/                   # Group: Public Website (OFM Style)
│   │   ├── layout.tsx              # Main Layout (Navbar + Footer)
│   │   ├── page.tsx                # Landing Page (Hero Section)
│   │   └── jobs/                   # The "Job Board"
│   │       ├── page.tsx            # Job Feed (Search + Filter + List)
│   │       ├── [id]/page.tsx       # Job Details Page
│   │       └── loading.tsx         # Skeleton Loader (Smart UX)
│   │
│   ├── (dashboard)/                # Group: Private App (Upwork Style)
│   │   ├── layout.tsx              # Dashboard Layout (Sidebar + Topbar)
│   │   ├── client/                 # Client-specific routes
│   │   │   ├── post-job/page.tsx
│   │   │   ├── proposals/[id]/page.tsx
│   │   │   └── page.tsx            # Client Home
│   │   ├── freelancer/             # Freelancer-specific routes
│   │   │   ├── my-jobs/page.tsx
│   │   │   ├── earnings/page.tsx
│   │   │   └── page.tsx            # Freelancer Home
│   │   └── chat/                   # Real-time Chat
│   │       └── page.tsx
│   │
│   ├── api/auth/[...nextauth]/route.ts # (Optional) NextAuth handler
│   ├── globals.css                 # Global Styles (Tailwind directives)
│   └── layout.tsx                  # Root Layout (Providers wrapper)
│
├── components/                     # 🧩 Reusable UI Components
│   ├── ui/                         # Shadcn/Radix Primitives (Atomic)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   └── input.tsx
│   │
│   ├── shared/                     # Global Components
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   └── logo.tsx
│   │
│   ├── features/                   # Smart Feature-Based Grouping
│   │   ├── jobs/
│   │   │   ├── job-card.tsx        # The "OFM" Style Card
│   │   │   ├── job-filter.tsx
│   │   │   └── apply-modal.tsx
│   │   ├── proposals/
│   │   │   ├── proposal-list.tsx
│   │   │   └── hire-modal.tsx      # The Escrow Logic UI
│   │   ├── chat/
│   │   │   ├── chat-window.tsx
│   │   │   └── message-bubble.tsx
│   │   └── dashboard/
│   │       ├── sidebar.tsx
│   │       └── user-nav.tsx
│   │
│   └── layouts/                    # Complex layout wrappers
│       └── max-width-wrapper.tsx
│
├── lib/                            # 🛠 Utilities & Configs
│   ├── axios.ts                    # Axios instance (Base URL + Interceptors)
│   ├── utils.ts                    # CSS class merger (cn) & Formatters
│   ├── constants.ts                # Static data (e.g., Job Categories)
│   └── validators/                 # Zod Schemas (Form Validation)
│       ├── auth-schema.ts
│       └── job-schema.ts
│
├── hooks/                          # 🎣 Custom React Hooks
│   ├── use-auth.ts                 # Zustand Auth Hook
│   ├── use-socket.ts               # WebSocket Logic
│   └── use-debounce.ts             # For Search Performance
│
├── services/                       # 🌐 API Calls (Separated from UI)
│   ├── auth.service.ts
│   ├── job.service.ts
│   └── payment.service.ts
│
├── store/                          # 📦 State Management (Zustand)
│   └── use-user-store.ts
│
├── types/                          # 📝 TypeScript Interfaces
│   ├── index.ts
│   └── api-response.ts
│
├── middleware.ts                   # 🛡 Route Protection (Auth Guard)
└── next.config.js                  # Next.js Configuration