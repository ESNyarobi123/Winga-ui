# Winga Admin Dashboard (OFM Jobs)

Admin panel for Winga — Super Admin + Employer dashboard (Hero UI).  
Lives inside **Winga ui** so you run one workspace; backend stays on :8080, admin on :5174.

## Run

1. **Backend** (winga-backend): Spring Boot on **http://localhost:8080**
2. **Admin** (here):
   ```bash
   cd "/Users/eunice/WORKS/Winga ui/admin-dashboard"
   npm install
   npm run dev
   ```
3. Open **http://localhost:5174** → Login: `admin@winga.co.tz` / `Admin@1234`

## Optional: different backend port

If backend runs on another port (e.g. 8081), create `.env`:

```bash
echo 'VITE_API_URL=http://localhost:8081' > .env
```

Then `npm run dev` again.
