# How People See Me — Deployment Guide

## Prerequisites

- [Vercel Account](https://vercel.com) (free tier works)
- [MongoDB Atlas Account](https://cloud.mongodb.com) (free tier works)
- [Node.js 20+](https://nodejs.org)

---

## Step 1 — MongoDB Atlas Setup

1. Create a free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Under **Database Access**, create a user with `readWrite` permissions
3. Under **Network Access**, add `0.0.0.0/0` (allows Vercel IPs)
4. Get your connection string:
   - Click **Connect** → **Drivers** → copy the URI
   - Replace `<username>`, `<password>`, and `<cluster>` with your values

**TTL Indexes** are created automatically by Mongoose when the app first connects. Verify them in:
Atlas → Collections → Indexes tab — look for `expiresAt` field with `TTL: 0`

---

## Step 2 — Local Development

```bash
# 1. Clone and install
git clone <repo-url>
cd HowPeopleSeeMe
npm install

# 2. Set up environment
cp .env.example .env.local
# Edit .env.local with your MongoDB URI and a random IP_HASH_SALT

# 3. Generate IP hash salt
openssl rand -hex 32

# 4. Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Step 3 — Deploy to Vercel

### Option A: Vercel CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

### Option B: GitHub Integration

1. Push your repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. Configure environment variables (see below)
5. Deploy

---

## Step 4 — Environment Variables on Vercel

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

| Key | Value | Environment |
|-----|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://...` | Production, Preview |
| `NEXT_PUBLIC_APP_URL` | `https://your-domain.vercel.app` | Production |
| `IP_HASH_SALT` | Random 32-char hex string | Production, Preview |

---

## Architecture Notes

### Auto-Delete (No Cron Jobs Needed)

MongoDB TTL indexes on `expiresAt` automatically delete documents after 48 hours:
- `sessions` collection
- `responses` collection  
- `analytics` collection

MongoDB's TTL monitor runs every 60 seconds by default.

### Rate Limiting

In-memory rate limiting is used (works per Vercel instance). For production with high traffic, consider upgrading to Redis-based rate limiting via [Upstash](https://upstash.com).

### Scaling

- **Frontend**: Vercel Edge Network handles CDN automatically
- **API Routes**: Serverless functions scale to zero, no cost when idle
- **Database**: MongoDB Atlas M0 (free) supports ~500 connections

---

## Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 90+ |
| Lighthouse Accessibility | 95+ |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |

---

## Security Checklist

- [x] IP addresses hashed with SHA-256 + salt — never stored raw
- [x] Rate limiting on all API routes
- [x] Zod validation on all inputs
- [x] MongoDB compound unique indexes prevent duplicate votes
- [x] XSS protection via Next.js escaping
- [x] Security headers (X-Frame-Options, X-XSS-Protection, etc.)
- [x] No sensitive data in client-side code
- [x] `.env.local` gitignored

---

## Project Structure

```
src/
├── app/                    # Next.js App Router pages + API routes
├── components/ui/          # Reusable UI primitives
├── features/               # Feature-specific components
├── hooks/                  # Custom React hooks
├── lib/                    # Core utilities (DB, rate limiter, constants)
├── models/                 # Mongoose models with TTL indexes
├── services/api/           # Client-side API service functions
├── styles/                 # Global SCSS design system
├── types/                  # TypeScript interfaces
├── utils/                  # Pure utility functions
└── validators/             # Zod schemas
```
