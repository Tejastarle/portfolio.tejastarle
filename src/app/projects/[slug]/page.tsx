import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Github } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { getProject, getProjects } from "@/lib/data";
import { site } from "@/lib/site";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: "Project not found" };

  return {
    title: project.title,
    description: `${project.tagline} Built with ${project.stack.join(", ")}. A project by ${site.name}.`,
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      title: `${project.title} — ${site.name}`,
      description: project.tagline,
      type: "article",
      url: `${site.url}/projects/${project.slug}`,
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const all = await getProjects();
  const related = all
    .filter((p) => p.category === project.category && p.id !== project.id)
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name: project.title,
    description: project.tagline,
    programmingLanguage: project.language ?? project.stack[0],
    codeRepository: project.repo_url ?? undefined,
    author: { "@type": "Person", name: site.name, url: site.url },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />

      <main className="px-5 pt-32 pb-24 sm:px-8 lg:px-14">
        <div className="mx-auto max-w-3xl">
          <Link
            href="/#work"
            className="mono inline-flex cursor-pointer items-center gap-2 text-xs uppercase tracking-[0.16em] text-dim transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            All work
          </Link>

          <div className="mono mt-10 flex items-center gap-3 text-[10px] uppercase tracking-[0.18em]">
            <span className="text-gold">{project.category}</span>
            <span className="text-line">/</span>
            <span className="text-dim">{project.year}</span>
          </div>

          <h1 className="display mt-4 text-[clamp(2.5rem,8vw,5rem)] text-paper">
            {project.title}
          </h1>

          <p className="mt-5 text-xl leading-relaxed text-paper/80">
            {project.tagline}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <span
                key={s}
                className="mono rounded border border-line px-3 py-1.5 text-[11px] text-paper/70"
              >
                {s}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                View source
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-paper transition-colors hover:border-gold hover:text-gold"
              >
                <ExternalLink className="h-4 w-4" aria-hidden="true" />
                Live site
              </a>
            )}
          </div>

          {project.body && (
            <div className="mt-14 space-y-4 border-t border-line pt-10 text-base leading-relaxed text-dim">
              {project.body.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          )}

          {related.length > 0 && (
            <section className="mt-20 border-t border-line pt-10">
              <h2 className="mono mb-6 text-[10px] uppercase tracking-[0.18em] text-dim">
                More {project.category} work
              </h2>
              <ul className="grid gap-3 sm:grid-cols-3">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/projects/${r.slug}`}
                      className="block h-full cursor-pointer rounded-lg border border-line bg-ink-2/60 p-5 transition-colors hover:border-gold/50"
                    >
                      <div className="font-semibold text-paper">{r.title}</div>
                      <div className="mt-1.5 text-xs text-dim">{r.tagline}</div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
