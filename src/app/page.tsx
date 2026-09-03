import Nav from "@/components/Nav";
import Spine from "@/components/Spine";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Metrics from "@/components/Metrics";
import SectionHeading from "@/components/SectionHeading";
import ProjectGrid from "@/components/ProjectGrid";
import Timeline from "@/components/Timeline";
import Skills from "@/components/Skills";
import Credentials from "@/components/Credentials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import { getCertifications, getExperience, getProjects } from "@/lib/data";

// Rebuild hourly so admin edits appear without a redeploy.
export const revalidate = 3600;

export default async function Home() {
  const [projects, experience, certifications] = await Promise.all([
    getProjects(),
    getExperience(),
    getCertifications(),
  ]);

  return (
    <>
      <Nav />
      <Spine />

      <main className="lg:pl-[var(--spine-w)]">
        <Hero />
        <Marquee />

        {/* 01 — Work */}
        <section id="work" className="px-5 py-24 sm:px-8 lg:px-14 lg:py-32">
          <div className="mx-auto max-w-[1400px]">
            <Reveal className="mb-16">
              <Metrics />
            </Reveal>

            <SectionHeading
              index="01 — work"
              title="Things I've shipped"
              note={`${projects.length} projects across payments, web, Android, and enterprise delivery.`}
            />
            <ProjectGrid projects={projects} />
          </div>
        </section>

        {/* 02 — Experience */}
        <section
          id="experience"
          className="border-t border-line bg-ink-2/30 px-5 py-24 sm:px-8 lg:px-14 lg:py-32"
        >
          <div className="mx-auto max-w-[1400px]">
            <SectionHeading
              index="02 — experience"
              title="Intern to VP in under two years"
              note="Promoted from full-stack intern to team leader within 90 days, then into program management — while staying hands-on with backend and payments."
            />
            <div className="max-w-3xl">
              <Timeline items={experience} />
            </div>
          </div>
        </section>

        {/* 03 — Skills */}
        <section id="skills" className="px-5 py-24 sm:px-8 lg:px-14 lg:py-32">
          <div className="mx-auto max-w-[1400px]">
            <SectionHeading
              index="03 — skills"
              title="What I work with"
              note="Grouped by what it's for, not by how impressive it sounds."
            />
            <Skills />
          </div>
        </section>

        {/* 04 — Credentials */}
        <section
          id="credentials"
          className="border-t border-line bg-ink-2/30 px-5 py-24 sm:px-8 lg:px-14 lg:py-32"
        >
          <div className="mx-auto max-w-[1400px]">
            <SectionHeading
              index="04 — credentials"
              title="Education & proof"
            />
            <Credentials items={certifications} />
          </div>
        </section>

        {/* 05 — Contact */}
        <Contact />
        <Footer />
      </main>
    </>
  );
}
