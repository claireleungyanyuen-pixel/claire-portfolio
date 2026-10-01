"use client";

import { profile } from "@/data/profile";
import Reveal from "./reveal";
import SectionHeading from "./section-heading";

export default function Contact() {
  return (
    <section id="contact" className="mx-auto max-w-[1180px] px-6 py-24 md:py-32">
      <SectionHeading index="05" labelEn="Contact" labelZh="保持联系" />

      <Reveal className="sim-panel relative overflow-hidden p-10 text-center md:p-16">
        {/* 背景晶锥装饰 */}
        <div className="pointer-events-none absolute -right-10 -top-10 opacity-20" aria-hidden>
          <span className="plumbob-float inline-block">
            <span className="plumbob plumbob-top block" style={{ borderLeftWidth: 34, borderRightWidth: 34, borderBottomWidth: 54 }} />
            <span className="plumbob plumbob-bottom block -mt-px" style={{ borderLeftWidth: 34, borderRightWidth: 34, borderTopWidth: 54 }} />
          </span>
        </div>

        <p className="font-rounded text-2xl font-extrabold text-[color:var(--color-ink)] md:text-4xl">
          {profile.contact.ctaZh}
        </p>
        <p className="mt-3 font-mono text-sm uppercase tracking-wider text-[color:var(--color-ink-soft)] md:text-base">
          {profile.contact.ctaEn}
        </p>

        <a
          href={`mailto:${profile.email}`}
          className="group mt-8 inline-block break-all font-rounded text-2xl font-extrabold text-[color:var(--color-violet)] underline-offset-8 transition-colors hover:underline md:text-4xl"
        >
          {profile.email}
        </a>

        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {profile.contact.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel={s.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="rounded-2xl border-[1.5px] border-[color:color-mix(in_oklch,var(--color-violet)_22%,transparent)] bg-white/60 p-4 text-left transition-all hover:-translate-y-1 hover:border-[color:var(--color-violet)] hover:shadow-[0_16px_30px_-16px_oklch(0.55_0.2_300/0.5)]"
            >
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-ink-faint)]">
                {s.label}
              </div>
              <div className="mt-1 truncate text-sm font-bold text-[color:var(--color-ink)]">{s.value}</div>
            </a>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
