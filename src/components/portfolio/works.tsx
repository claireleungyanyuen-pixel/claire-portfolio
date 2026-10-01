"use client";

import { profile } from "@/data/profile";
import Reveal from "./reveal";
import SectionHeading from "./section-heading";

export default function Projects() {
  return (
    <section id="projects" className="mx-auto max-w-[1180px] px-6 py-24 md:py-28">
      <SectionHeading index="03" labelEn="Key Projects" labelZh="重点项目" />

      <div className="space-y-4">
        {profile.projects.items.map((p, i) => (
          <Reveal key={p.index} delay={Math.min(i * 0.06, 0.3)}>
            <article className="sim-panel group grid gap-4 p-6 md:grid-cols-[auto_1fr_auto] md:items-start md:gap-7 md:p-8">
              {/* 编号晶锥 */}
              <div className="flex items-center gap-3 md:flex-col md:items-center md:pt-1">
                <span className="plumbob-float inline-block" aria-hidden>
                  <span className="plumbob plumbob-top block" style={{ borderLeftWidth: 9, borderRightWidth: 9, borderBottomWidth: 15 }} />
                  <span className="plumbob plumbob-bottom block -mt-px" style={{ borderLeftWidth: 9, borderRightWidth: 9, borderTopWidth: 15 }} />
                </span>
                <span className="font-mono text-sm font-bold text-[color:var(--color-violet)]">{p.index}</span>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="font-rounded text-xl font-extrabold text-[color:var(--color-ink)] transition-colors group-hover:text-[color:var(--color-violet)] md:text-2xl">
                    {p.nameZh}
                  </h3>
                  <span className="badge">{p.role}</span>
                </div>
                <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-ink-faint)]">
                  {p.nameEn}
                </p>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                  {p.descZh}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-[color:color-mix(in_oklch,var(--color-violet)_25%,transparent)] bg-[color:color-mix(in_oklch,var(--color-lilac)_30%,white)] px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-[color:var(--color-violet)]"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-left md:text-right">
                <div className="font-mono text-xs font-bold tabular-nums text-[color:var(--color-ink-soft)]">
                  {p.period}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
