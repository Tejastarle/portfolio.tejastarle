export type Project = {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  body: string | null;
  category: "web" | "android" | "enterprise" | "academic";
  stack: string[];
  repo_url: string | null;
  live_url: string | null;
  cover_url: string | null;
  language: string | null;
  featured: boolean;
  year: number;
  sort_order: number;
  published: boolean;
  updated_at: string;
};

export type Experience = {
  id: string;
  role: string;
  company: string;
  location: string | null;
  employment_type: string | null;
  start_date: string;
  end_date: string | null;
  highlights: string[];
  sort_order: number;
};

export type Certification = {
  id: string;
  name: string;
  issuer: string;
  year: number | null;
  credential_url: string | null;
  sort_order: number;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body: string;
  cover_url: string | null;
  tags: string[];
  published: boolean;
  published_at: string;
};

export type SiteContent = {
  projects: Project[];
  experience: Experience[];
  certifications: Certification[];
  posts: Post[];
};
