# Daiyan Finance — THE UNTOUCHABLE DAIYAN EMPIRE

A private, manually-tracked finance dashboard. No bank connections, no APIs, no crypto wallets — every income, expense, saving, and investment entry is logged by hand. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS, shadcn/ui-style components, Recharts, Framer Motion, and Prisma + Postgres (Neon).

---

## 1. What's inside

```
finance-dashboard/
├── prisma/
│   ├── schema.prisma        # Transaction + Settings models (Postgres)
│   └── seed.ts               # Optional sample data generator
├── src/
│   ├── app/
│   │   ├── page.tsx           # Dashboard (stat cards + 5 charts + recent activity)
│   │   ├── transactions/      # Full CRUD table with search/filter
│   │   ├── analytics/         # Expanded chart views
│   │   ├── export/            # CSV export
│   │   ├── settings/          # Currency, accent color, theme, default category
│   │   └── api/                # REST routes: transactions, stats, settings, export
│   ├── components/
│   │   ├── ui/                 # Button, Card, Dialog, Input, Select, etc.
│   │   ├── charts/              # Donut, line, bar, area, pie
│   │   ├── dashboard/            # Stat cards, animated counters
│   │   ├── transactions/          # Modal form, table, filter bar
│   │   └── layout/                 # Sidebar, navbar, mobile nav
│   ├── hooks/                   # useStats, useTransactions
│   ├── lib/                     # Prisma client, calculations, utils, event bus
│   └── types/
└── package.json
```

Every dollar figure on the dashboard is derived from `src/lib/calculations.ts` — pure functions that take the full transaction list and compute lifetime income, this month's income, total expenses, total savings, current bank balance, category totals, and the three monthly chart series. Nothing is hardcoded.

---

## 2. Running it locally (Mac Mini M4 / any machine)

**Requirements:** Node.js 20+ and npm.

```bash
# 1. Install dependencies
npm install

# 2. Your .env is already set up with your Neon connection string.
# If you're starting fresh, copy the example and fill in your own DATABASE_URL:
# cp .env.example .env

# 3. Create the database and tables
npm run db:push

# 4. (Optional) seed ~8 months of realistic sample data so the charts aren't empty
npm run db:seed

# 5. Start the dev server
npm run dev
```

Visit `http://localhost:3000`. Press **N** anywhere to open the "New transaction" modal.

> Note: `npm install` triggers `prisma generate` automatically (via `postinstall`), which downloads a small query-engine binary from Prisma's CDN. This requires normal internet access — it will work fine on your machine even though it was blocked inside the sandboxed environment this project was built in.

---

## 3. Deploying to your own domain (finance.mydomain.com)

### Step 1 — Push to GitHub

```bash
cd finance-dashboard
git init
git add .
git commit -m "Initial commit: finance dashboard"
gh repo create finance-dashboard --private --source=. --push
# or manually create a repo on GitHub and `git remote add origin ...` + `git push`
```

### Step 2 — Import into Vercel

1. Go to [vercel.com/new](https://vercel.com/new) and import the GitHub repo.
2. Framework preset: **Next.js** (auto-detected).
3. Build command: `prisma generate && prisma db push --skip-generate && next build` (already set in `package.json`'s `build` script — Vercel will run it automatically, syncing the schema on every deploy).
4. Don't deploy yet — add the database first (Step 3), then deploy.

### Step 3 — Database persistence (already done)

This project is wired up for **Postgres on Neon**, which is the right call for Vercel — its serverless filesystem is ephemeral, so a plain SQLite file (`file:./dev.db`) would not survive between requests. Postgres over a connection string has no such problem.

`prisma/schema.prisma` is already set to `provider = "postgresql"`, and `src/lib/db.ts` uses a plain `PrismaClient()` — no driver adapter needed for Postgres, it connects directly over `DATABASE_URL`.

**Important:** don't add `@prisma/adapter-libsql` or `@libsql/client` back in unless you also switch the schema's `provider` to `"sqlite"` to match. Mixing a Postgres schema with a libSQL/Turso adapter (or vice versa) is what was causing the crash before — Prisma's driver adapter has to match the datasource provider exactly, and the adapter/client major versions have to match each other too.

If you ever want to self-host on a VPS with a persistent disk instead, SQLite works fine there — just flip the schema provider back to `"sqlite"` and point `DATABASE_URL` at a local file.

### Step 4 — Environment variables

In Vercel → Project → Settings → Environment Variables, add:

| Key | Value |
|---|---|
| `DATABASE_URL` | Your Neon Postgres connection string (already in your local `.env`) |

### Step 5 — Deploy

Click **Deploy**. Vercel will run `prisma generate && prisma db push && next build` and give you a `*.vercel.app` URL.

### Step 6 — Connect your custom domain

1. In Vercel → Project → Settings → Domains, add `finance.mydomain.com`.
2. Vercel will show you a CNAME record (usually `cname.vercel-dns.com`).
3. In your domain registrar / DNS provider, add:
   ```
   Type:  CNAME
   Name:  finance
   Value: cname.vercel-dns.com
   ```
4. Wait for DNS propagation (usually minutes, sometimes up to a few hours). Vercel auto-provisions an SSL certificate once it verifies the domain.

### Step 7 — Updating the app later

```bash
git add .
git commit -m "Describe your change"
git push
```

Vercel redeploys automatically on every push to your main branch. The build script runs `prisma db push` on every deploy, which syncs the schema automatically — no manual migration step needed for a single-user app like this. If you'd rather have versioned migration files (recommended once you're past the prototyping stage), switch the build script to `prisma migrate deploy` and run `npx prisma migrate dev --name your_change_name` locally first to generate each migration before pushing.

---

## 4. Useful scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start local dev server |
| `npm run build` | Production build (runs `prisma generate` + `prisma db push` first) |
| `npm run start` | Start the production server after building |
| `npm run db:push` | Sync the schema to the database without a migration file (fast, good for local dev) |
| `npm run db:migrate` | Create a proper migration file (use before deploying schema changes) |
| `npm run db:studio` | Open Prisma Studio — a GUI to browse/edit your data directly |
| `npm run db:seed` | Populate ~8 months of realistic sample transactions |

---

## 5. Notes on the data model

```prisma
model Transaction {
  id          String
  amount      Float
  type        INCOME | EXPENSE
  category    INVESTING | SPENDING | SAVING
  description String
  date        DateTime
  createdAt   DateTime
  updatedAt   DateTime
}

model Settings {
  currency        USD | BDT | AED
  accentColor     string
  theme           dark | light
  defaultCategory INVESTING | SPENDING | SAVING
  startingBalance Float   // baseline for "Current bank balance"
}
```

Current bank balance = `startingBalance + lifetime income − lifetime expenses`. If you're onboarding with an existing balance, set `startingBalance` via `npm run db:studio` (edit the `Settings` row) before you start logging new transactions.
