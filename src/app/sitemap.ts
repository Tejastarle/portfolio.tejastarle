import type { MetadataRoute } from "next";
import { getProjects } from "@/lib/data";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();

  return [
    {
      url: site.url,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...projects.map((p) => ({
      url: `${site.url}/projects/${p.slug}`,
      lastModified: new Date(p.updated_at),
      changeFrequency: "monthly" as const,
      priority: p.featured ? 0.8 : 0.6,
    })),
  ];
}
