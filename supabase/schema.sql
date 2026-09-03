-- =====================================================================
-- Tejas Tarle — portfolio schema
-- Paste the whole file into Supabase → SQL Editor → Run.
-- Safe to re-run.
-- =====================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- projects
create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  title       text not null,
  tagline     text not null default '',
  body        text,
  category    text not null default 'web'
              check (category in ('web','android','enterprise','academic')),
  stack       text[] not null default '{}',
  repo_url    text,
  live_url    text,
  cover_url   text,
  language    text,
  featured    boolean not null default false,
  year        int not null default extract(year from now()),
  sort_order  int not null default 99,
  published   boolean not null default true,
  updated_at  timestamptz not null default now()
);

-- ------------------------------------------------------------- experience
create table if not exists public.experience (
  id              uuid primary key default gen_random_uuid(),
  role            text not null,
  company         text not null,
  location        text,
  employment_type text,
  start_date      date not null,
  end_date        date,
  highlights      text[] not null default '{}',
  sort_order      int not null default 99
);

-- --------------------------------------------------------- certifications
create table if not exists public.certifications (
  id             uuid primary key default gen_random_uuid(),
  name           text not null,
  issuer         text not null,
  year           int,
  credential_url text,
  sort_order     int not null default 99
);

-- ------------------------------------------------------------------ posts
create table if not exists public.posts (
  id           uuid primary key default gen_random_uuid(),
  slug         text unique not null,
  title        text not null,
  excerpt      text not null default '',
  body         text not null default '',
  cover_url    text,
  tags         text[] not null default '{}',
  published    boolean not null default false,
  published_at timestamptz not null default now()
);

-- ------------------------------------------------------- contact messages
create table if not exists public.messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  email      text not null,
  body       text not null,
  created_at timestamptz not null default now()
);

-- =====================================================================
-- Row Level Security
--   Public: read published rows only.
--   Authenticated (you): full control.
-- =====================================================================

alter table public.projects       enable row level security;
alter table public.experience     enable row level security;
alter table public.certifications enable row level security;
alter table public.posts          enable row level security;
alter table public.messages       enable row level security;

-- Projects
drop policy if exists "public reads published projects" on public.projects;
create policy "public reads published projects"
  on public.projects for select
  using (published = true);

drop policy if exists "admin manages projects" on public.projects;
create policy "admin manages projects"
  on public.projects for all
  to authenticated
  using (true) with check (true);

-- Experience (all public)
drop policy if exists "public reads experience" on public.experience;
create policy "public reads experience"
  on public.experience for select using (true);

drop policy if exists "admin manages experience" on public.experience;
create policy "admin manages experience"
  on public.experience for all
  to authenticated using (true) with check (true);

-- Certifications (all public)
drop policy if exists "public reads certifications" on public.certifications;
create policy "public reads certifications"
  on public.certifications for select using (true);

drop policy if exists "admin manages certifications" on public.certifications;
create policy "admin manages certifications"
  on public.certifications for all
  to authenticated using (true) with check (true);

-- Posts
drop policy if exists "public reads published posts" on public.posts;
create policy "public reads published posts"
  on public.posts for select using (published = true);

drop policy if exists "admin manages posts" on public.posts;
create policy "admin manages posts"
  on public.posts for all
  to authenticated using (true) with check (true);

-- Messages: anyone may write, only you may read.
drop policy if exists "anyone sends a message" on public.messages;
create policy "anyone sends a message"
  on public.messages for insert
  to anon, authenticated with check (true);

drop policy if exists "admin reads messages" on public.messages;
create policy "admin reads messages"
  on public.messages for select
  to authenticated using (true);

-- ----------------------------------------------------------- performance
create index if not exists projects_sort_idx on public.projects (sort_order);
create index if not exists projects_pub_idx  on public.projects (published);
create index if not exists posts_pub_idx     on public.posts (published, published_at desc);
