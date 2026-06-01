# How People See Me

> Discover how your friends really appreciate you — in under 3 seconds.

A viral social web application where users create anonymous appreciation pages and share them with friends. Built for mobile, built for sharing, built for joy.

## ✨ Features

- 🔗 **Shareable links** — Create your page, share the URL
- ⚡ **3-second voting** — Friends tap one card, done
- 🔒 **100% anonymous** — IP hashed with SHA-256, never stored
- 🌟 **Live results** — Updates every 8 seconds
- ⏱ **Auto-expires** — 48-hour sessions, MongoDB TTL auto-deletes everything
- 📱 **Mobile-first** — Beautiful on any screen size
- 🎨 **Premium UI** — Dark mode, glassmorphism, Framer Motion animations

## 🚀 Quick Start

```bash
# Install
npm install

# Set up environment
cp .env.example .env.local
# Fill in MONGODB_URI and IP_HASH_SALT

# Run locally
npm run dev
```

## 📖 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for full deployment guide.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | SCSS Modules |
| Animations | Framer Motion |
| Forms | React Hook Form + Zod |
| Database | MongoDB Atlas + Mongoose |
| Deployment | Vercel |

## 📁 Architecture

```
src/
├── app/           # Pages + API routes
├── components/    # Reusable UI
├── features/      # Feature modules
├── hooks/         # Custom React hooks
├── lib/           # Core utilities
├── models/        # Mongoose models (with TTL)
├── services/      # API service layer
├── styles/        # SCSS design system
├── types/         # TypeScript types
├── utils/         # Pure utilities
└── validators/    # Zod schemas
```

## 🔐 Security

- SHA-256 IP hashing with salt
- Rate limiting on all routes
- Zod input validation
- MongoDB compound indexes prevent spam
- XSS protection + security headers

---

Made with ❤️ by Rakshith Acharya
