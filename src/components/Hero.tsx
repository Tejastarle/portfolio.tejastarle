"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin, MapPin } from "lucide-react";
import AmbientBackdrop from "./AmbientBackdrop";
import DeployConsole from "./DeployConsole";
import { site } from "@/lib/site";

const FIRST = "TEJAS";
const LAST = "TARLE";

export default function Hero() {
  const reduced = useReducedMotion();

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-5 pt-24 pb-14 sm:px-8 lg:px-14"
    >
      <AmbientBackdrop src="/videos/hero.mp4" opacity={0.3} />

      <div className="relative z-10 mx-auto grid w-full max-w-[1400px] gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
        {/* ---------------- Left: the pitch ---------------- */}
        <div>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="eyebrow mb-6 flex flex-wrap items-center gap-x-3 gap-y-1"
          >
            <MapPin className="h-3 w-3" aria-hidden="true" />
            {site.location}
            <span className="text-line">/</span>
            <span className="inline-flex items-center gap-1.5 text-jade">
              <span className="h-1.5 w-1.5 rounded-full bg-jade" aria-hidden="true" />
              Available immediately
            </span>
          </motion.p>

          <h1 className="display text-[clamp(3rem,10vw,8.5rem)]">
            <span className="sr-only">{`${FIRST} ${LAST}`}</span>
            <span aria-hidden="true" className="block">
              {[FIRST, LAST].map((word, wi) => (
                <span key={word} className="flex">
                  {word.split("").map((ch, i) => (
                    <motion.span
                      key={i}
                      initial={
                        reduced ? false : { opacity: 0, y: "0.45em", rotateX: -50 }
                      }
                      animate={{ opacity: 1, y: 0, rotateX: 0 }}
                      transition={{
                        duration: 0.8,
                        delay: 0.15 + (wi * 5 + i) * 0.04,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={
                        wi === 1
                          ? "grad-slice inline-block origin-bottom"
                          : "inline-block origin-bottom text-paper"
                      }
                      /* Each letter shows its own slice of ONE gradient sized
                         across the whole word, so the ramp reads as continuous
                         instead of restarting per character. */
                      style={
                        wi === 1
                          ? {
                              backgroundSize: `${word.length * 100}% 100%`,
                              backgroundPosition: `${(i / (word.length - 1)) * 100}% 0`,
                            }
                          : undefined
                      }
                    >
                      {ch}
                    </motion.span>
                  ))}
                </span>
              ))}
            </span>
          </h1>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.65 }}
          >
            <p className="mt-7 text-xl font-medium text-paper sm:text-2xl">
              Backend Engineer{" "}
              <span className="text-gold">· Payment Gateway Integrations</span>
            </p>

<p className="mt-4 max-w-xl leading-relaxed text-paper/75">
  I build production backends in{" "}
  <span className="text-gold">Node.js, Express and MongoDB</span>, with a core
  strength in payment gateway integration — Razorpay, Stripe and PayPal —
  covering checkout, webhooks, signature verification, idempotent retries,
  refunds and reconciliation. Five systems shipped end to end. Currently Vice
  President &amp; Program Manager at Agix International.
</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="group inline-flex cursor-pointer items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-ink transition-transform duration-200 hover:-translate-y-0.5"
                style={{ background: "var(--grad-signature)" }}
              >
                Get in touch
                <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="#work"
                className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-line px-6 py-3 text-sm font-semibold text-paper transition-colors duration-200 hover:border-gold hover:text-gold"
              >
                View projects
              </a>
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub profile"
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line text-dim transition-colors duration-200 hover:border-gold hover:text-gold"
              >
                <Github className="h-4 w-4" />
              </a>
              <a
                href={site.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn profile"
                className="inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-line text-dim transition-colors duration-200 hover:border-gold hover:text-gold"
              >
                <Linkedin className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>

        {/* ---------------- Right: portrait + console ---------------- */}
        <motion.div
          initial={reduced ? false : { opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[380px]"
        >
          {/* Warm halo picking up the lobby lighting behind him */}
          <div
            className="portrait-halo pointer-events-none absolute -inset-8 -z-10 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(closest-side, rgba(233,190,108,0.28), rgba(194,65,106,0.18), transparent 75%)",
            }}
            aria-hidden="true"
          />

          <div className="portrait-frame">
            <Image
              src="/images/tejas.webp"
              alt="Tejas Tarle, backend engineer specialising in Node.js, Express, MongoDB and payment gateway integrations"
              width={900}
              height={1200}
              priority
              sizes="(max-width: 1024px) 90vw, 40vw"
              className="aspect-[4/5] w-full object-cover object-[50%_15%]"
            />

            {/* Name plate sits inside the frame, over the gradient scrim */}
            <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-3 p-5">
              <div>
                <div className="mono text-[10px] uppercase tracking-[0.2em] text-gold">
                  Backend Engineer
                </div>
                <div className="mt-1 text-lg font-semibold text-paper">
                  Nashik, India
                </div>
              </div>
              <div className="mono rounded-full border border-jade/40 bg-jade/10 px-3 py-1 text-[10px] uppercase tracking-[0.14em] text-jade">
                Open to work
              </div>
            </div>
          </div>

          <div className="mt-5">
            <DeployConsole />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
