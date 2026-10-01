"use client";

import { profile } from "@/data/profile";
import Reveal from "./reveal";
import SectionHeading from "./section-heading";

/** 熟练度 → 星星/等级气泡（替代百分比进度条） */
function Level({ pct }: { pct: number }) {
  const level = pct >= 90 ? "★★★★★" : pct >= 80 ? "★★★★☆" : pct >= 70 ? "★★★☆☆" : "★★☆☆☆";
  const tag = pct >= 90 ? "精通" : pct >= 80 ? "擅长" : pct >= 70 ? "熟练" : "掌握";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 12,
        fontWeight: 800,
        color: "var(--color-violet)",
        background: "rgba(169,136,230,0.12)",
        border: "1.5px solid rgba(169,136,230,0.35)",
        borderRadius: 999,
        padding: "3px 10px",
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ color: "#f0b429", letterSpacing: 1 }}>{level}</span>
      {tag}
    </span>
  );
}

export default function Skills() {
  const words = [...profile.skills.marquee, ...profile.skills.marquee];

  return (
    <section id="expertise" className="py-24 md:py-28">
      <div className="mx-auto max-w-[1180px] px-6">
        <SectionHeading index="02" labelEn="Expertise" labelZh="专长领域" />
      </div>

      {/* 跑马灯 */}
      <Reveal className="marquee mb-16 overflow-hidden border-y-[1.5px] border-[color:color-mix(in_oklch,var(--color-violet)_25%,transparent)] bg-white/40 py-5 backdrop-blur-sm">
        <div className="marquee-track gap-8">
          {words.map((w, i) => (
            <span key={i} className="flex items-center gap-8 whitespace-nowrap">
              <span className="font-rounded text-2xl font-extrabold text-[color:var(--color-ink)]/70 md:text-3xl">
                {w}
              </span>
              <span className="text-2xl text-[color:var(--color-violet)]">✦</span>
            </span>
          ))}
        </div>
      </Reveal>

      {/* 三列技能徽章面板 */}
      <div className="mx-auto grid max-w-[1180px] gap-6 px-6 md:grid-cols-3">
        {profile.skills.groups.map((g, gi) => (
          <Reveal key={g.titleEn} delay={gi * 0.1} className="sim-panel p-7">
            <div className="mb-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-[color:var(--color-violet)]">
                {g.titleEn}
              </div>
              <h3 className="mt-1 font-rounded text-xl font-extrabold text-[color:var(--color-ink)]">
                <span style={{ marginRight: 6 }}>{["🎯", "🌱", "🤝"][gi] ?? "✦"}</span>
                {g.titleZh}
              </h3>
            </div>
            <ul className="flex flex-col gap-3">
              {g.items.map((it) => (
                <li
                  key={it.name}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    background: "rgba(255,255,255,0.6)",
                    border: "1.5px solid rgba(169,136,230,0.2)",
                    borderRadius: 14,
                    padding: "10px 14px",
                  }}
                >
                  <span className="text-sm font-bold text-[color:var(--color-ink)]">
                    <span style={{ color: "var(--color-violet)", marginRight: 6 }}>◆</span>
                    {it.name}
                  </span>
                  <Level pct={it.pct} />
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
