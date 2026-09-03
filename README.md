# Tejas Tarle — Portfolio

An animated, dynamic portfolio built with **Next.js 16**, **Tailwind CSS v4**,
**Framer Motion**, and **Supabase**. Includes a private admin panel for editing
projects the way you'd edit blog posts, and a one-click GitHub sync.

---

## Quick start (3 commands)

```bash
npm install
npm run dev
```

Open (http://portfolio-tejastarle-eta.vercel.app)

**It runs with no setup.** Supabase is optional. Without it, the site renders
from `src/content/fallback.ts`, which is already seeded with your 18 GitHub
repos, your work history, and your certifications. Add Supabase when you want
the admin panel.

---

## Open it in VS Code

```bash
cd tejas-portfolio
code .
```

Recommended extensions: **ESLint**, **Tailwind CSS IntelliSense**,
**Prettier**.

---

## Full setup with Supabase (for the admin panel)

### 1. Create the project

Go to [supabase.com](https://supabase.com) → **New project**. Pick a region
close to your visitors (Mumbai / `ap-south-1` for India).

### 2. Create the tables

Supabase dashboard → **SQL Editor** → **New query**. Paste all of
`supabase/schema.sql` and hit **Run**. Then do the same with
`supabase/seed.sql` to load your projects, experience, and certifications.

### 3. Add your keys

Copy the example env file:

```bash
cp .env.example .env.local
```

Fill it in from **Project Settings → API**:

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key — **server only, never commit** |
| `NEXT_PUBLIC_SITE_URL` | Your live domain, e.g. `https://tejastarle.com` |
| `GITHUB_TOKEN` | Optional. [Create one](https://github.com/settings/tokens) with `public_repo` scope |

### 4. Create your admin login

Supabase dashboard → **Authentication → Users → Add user**. Use your email and
a strong password. Confirm the email.

> Sign-ups are not exposed anywhere in the app — the only way in is a user you
> create by hand in the dashboard.

### 5. Restart and log in

```bash
npm run dev
```

Go to <http://portfolio-tejastarle-eta.vercel.app/admin>.

---

## Adding the background videos

The hero and contact sections look for `/public/videos/hero.mp4` and
`/public/videos/contact.mp4`. **If they're missing, nothing breaks** — the site
falls back to an animated canvas aurora in the same palette.

Grab free footage from [Pexels](https://pexels.com/videos),
[Coverr](https://coverr.co), or [Mixkit](https://mixkit.co/free-stock-video).
Search *night city timelapse*, *server room*, *abstract particles dark*.

Compress before shipping — a 40 MB video will destroy your Lighthouse score:

```bash
ffmpeg -i input.mp4 -t 15 -vf "scale=1920:-2" -c:v libx264 -crf 30 \
  -preset slow -an -movflags +faststart public/videos/hero.mp4
```

Target under 4 MB each. The video sits at ~32% opacity under a duotone wash, so
heavy compression is invisible.

Also drop your CV at `public/resume.pdf` — the nav links to it.

### Your photo

Already included and optimised at `public/images/tejas.webp` (48 KB, down from
1.3 MB) with a `.jpg` fallback. To swap it, replace the file at the same path
and keep a 3:4 portrait ratio — the frame crops to 4:5 and biases toward the
upper third so the face stays centred.

---

## Admin panel

| Route | What it does |
|---|---|
| `/admin` | Dashboard, counts, GitHub sync button |
| `/admin/projects` | Full CRUD: add, edit, reorder, feature, publish/unpublish |
| `/admin/login` | Supabase email + password |

Everything under `/admin` is gated by `src/proxy.ts` and excluded from
`robots.txt`.

### GitHub sync

The **Sync GitHub** button pulls every public, non-forked repo and upserts it
into the `projects` table. It **preserves anything you've hand-written** —
tagline, category, featured flag, sort order, and body are kept if they already
exist. Only language, year, and last-pushed refresh.

You can also run it from the terminal:

```bash
npm run sync:github
```

---

## Deploying to Vercel

```bash
npm i -g vercel
vercel
```

Then in the Vercel dashboard → **Settings → Environment Variables**, add every
variable from your `.env.local`. Set `NEXT_PUBLIC_SITE_URL` to your real
domain — the sitemap, canonical URLs, and OG tags all derive from it.

Push to `main` and Vercel rebuilds automatically.

---

## SEO

Already wired up, no work needed:

- **Metadata API** — title templates, description, keywords, canonicals
- **JSON-LD** — `ProfilePage` + `Person` on the home page, `SoftwareSourceCode`
  on every project page. This is what makes Google show your role, employer,
  and skills instead of a bare blue link.
- **`sitemap.xml`** — generated from live project data at build time
- **`robots.txt`** — allows everything except `/admin` and `/api`
- **`opengraph-image.tsx`** — a 1200×630 social card generated at build time,
  so LinkedIn and WhatsApp previews are never blank
- **Static generation** — every project page is prerendered HTML, revalidated
  hourly, which is what crawlers reward

After deploying, submit your sitemap at
[Google Search Console](https://search.google.com/search-console):
`https://yourdomain.com/sitemap.xml`

---

## Design system

| Token | Value | Role |
|---|---|---|
| `--color-ink` | `#0A0710` | Obsidian base, violet undertone |
| `--color-gold` | `#E9BE6C` | Primary — champagne gold |
| `--color-wine` | `#C2416A` | Secondary — wine rose |
| `--color-jade` | `#35D6B0` | Status only — "available", "open to work" |
| `--color-paper` | `#F5EFE6` | Warm ivory body text |
| `--grad-signature` | gold → rose → violet | The one gradient on the page |

The palette is pulled from your photo: champagne gold from the lobby
lighting, wine from the blazer. Jade is the single cool note and is used
*only* for availability status, so the colour always carries meaning rather
than decorating.

Type: **Bricolage Grotesque** (display) · **Instrument Sans** (body) ·
**JetBrains Mono** (data and labels).

Three signature elements carry the page:

1. **Your portrait** in a gradient-bordered frame with a warm halo, name
   plate, and an "open to work" badge.
2. **The deploy console** types out a build log where every line is a real
   figure from your CV.
3. **The commit spine** down the left rail draws itself as you scroll and
   doubles as section navigation.

All tokens live in `src/app/globals.css` under `@theme`. Change a hex there and
it propagates everywhere.

---

## Accessibility & performance

This isn't decoration — a recruiter on a slow phone is a real user.

- `prefers-reduced-motion` is honoured everywhere: video is disabled, the
  typing log renders instantly in its final state, and smooth scroll is off
- Background video pauses when off-screen or when the tab is hidden
- Visible focus rings on every interactive element
- Semantic landmarks, a skip link, `aria-expanded` on disclosures
- Text contrast ≥ 4.5:1 against the duotone wash
- Tested at 375, 768, 1024, and 1440px

---

## Project structure

```
src/
├── app/
│   ├── layout.tsx           Metadata, fonts, JSON-LD
│   ├── page.tsx             Home — composes all sections
│   ├── globals.css          Design tokens + keyframes
│   ├── sitemap.ts           Dynamic sitemap
│   ├── robots.ts
│   ├── opengraph-image.tsx  Generated social card
│   ├── projects/[slug]/     Project detail pages
│   ├── admin/               Gated CRUD panel
│   └── api/github-sync/     Repo importer
├── components/              Hero, Spine, DeployConsole, ProjectGrid…
├── lib/
│   ├── data.ts              Supabase reads with fallback
│   ├── site.ts              Your details in one place
│   └── supabase/            Server + browser clients
├── content/fallback.ts      Offline content
└── proxy.ts                 Auth gate for /admin
```

---

## Common issues

**`/admin` redirects to login in a loop** — your Supabase keys are missing or
wrong. Check `.env.local` and restart the dev server; env changes are not
hot-reloaded.

**"Sync GitHub" returns 403** — GitHub rate-limits unauthenticated requests.
Add a `GITHUB_TOKEN` to `.env.local`.

**Projects don't update after editing** — the home page revalidates hourly. In
development, hard-refresh. In production, redeploy or wait an hour.

**Fonts look wrong offline** — they load from Google Fonts. Offline you'll see
the system fallback; that's expected.

---

Built with Next.js 16, Tailwind CSS v4, Framer Motion, Lenis, and Supabase.

conslole diployes 

complete update 01092026

