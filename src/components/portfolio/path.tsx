"use client";

import { profile } from "@/data/profile";
import Reveal from "./reveal";
import SectionHeading from "./section-heading";

export default function Path() {
  return (
    <section id="path" className="mx-auto max-w-[1180px] px-6 py-24 md:py-28">
      <SectionHeading index="04" labelEn="Experience" labelZh="工作经历" />

      <div className="relative">
        {/* 竖线 */}
        <div className="absolute left-[11px] top-2 bottom-2 w-0.5 rounded-full bg-gradient-to-b from-[color:var(--color-violet)] via-[color:var(--color-lilac)] to-transparent md:left-[15px]" />

        <div className="space-y-6">
          {profile.experience.items.map((job, i) => (
            <Reveal key={job.orgEn} delay={Math.min(i * 0.05, 0.3)} className="relative pl-10 md:pl-14">
              {/* 节点 */}
              <span className="absolute left-0 top-2 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[color:var(--color-violet)] bg-white shadow-[0_0_0_4px_oklch(0.86_0.09_305/0.4)] md:h-8 md:w-8">
                <span className="h-2 w-2 rounded-full bg-[color:var(--color-violet)]" />
              </span>

              <div className="sim-panel p-6 md:p-7">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h3 className="font-rounded text-lg font-extrabold text-[color:var(--color-ink)] md:text-xl">
                      {job.roleZh}
                    </h3>
                    <p className="mt-0.5 text-sm font-bold text-[color:var(--color-violet)]">{job.orgZh}</p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-wider text-[color:var(--color-ink-faint)]">
                      {job.roleEn} · {job.orgEn}
                    </p>
                  </div>
                  <span className="badge shrink-0">{job.period}</span>
                </div>
                <ul className="mt-4 space-y-2">
                  {job.pointsZh.map((pt, k) => (
                    <li key={k} className="flex gap-2.5 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--color-violet)]" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* 资质徽章 */}
      <Reveal className="mt-14">
        <h3 className="mb-5 flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--color-ink)]">
          <span className="text-[color:var(--color-coin)]">★</span> {profile.certifications.headingEn} · {profile.certifications.headingZh}
        </h3>
        <div className="flex flex-wrap gap-2.5">
          {profile.certifications.items.map((c) => (
            <span
              key={c}
              className="rounded-full border-[1.5px] border-[color:color-mix(in_oklch,var(--color-violet)_30%,transparent)] bg-white/70 px-4 py-2 text-sm font-bold text-[color:var(--color-ink)] shadow-sm transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-violet)] hover:text-[color:var(--color-violet)]"
            >
              {c}
            </span>
          ))}
        </div>
      </Reveal>

      {/* 教育 + 资源网络 */}
      <div className="mt-14 grid gap-6 md:grid-cols-2">
        <Reveal className="sim-panel p-7">
          <h3 className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--color-ink)]">
            {profile.education.headingEn} · {profile.education.headingZh}
          </h3>
          <ul className="space-y-4">
            {profile.education.items.map((e) => (
              <li key={e.school} className="flex items-start justify-between gap-3 border-b border-dashed border-[color:var(--color-line)] pb-3 last:border-0 last:pb-0">
                <div>
                  <div className="text-sm font-bold text-[color:var(--color-ink)]">{e.school}</div>
                  <div className="text-xs text-[color:var(--color-ink-soft)]">{e.degree}</div>
                </div>
                <span className="font-mono text-xs font-bold text-[color:var(--color-violet)]">{e.period}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.1} className="sim-panel p-7">
          <h3 className="mb-5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-[color:var(--color-ink)]">
            {profile.resources.headingEn} · {profile.resources.headingZh}
          </h3>
          <div className="space-y-3">
            {profile.resources.groups.map((g) => (
              <div key={g.title}>
                <div className="text-xs font-bold text-[color:var(--color-violet)]">{g.title}</div>
                <div className="mt-1 text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
                  {g.items.join(" · ")}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
