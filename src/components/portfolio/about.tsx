"use client";

import { profile } from "@/data/profile";
import Reveal from "./reveal";
import SectionHeading from "./section-heading";
import PalsChat from "./pals-chat";

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-[1180px] px-6 py-24 md:py-28">
      <SectionHeading index="01" labelEn="About" labelZh="关于我" />

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* 陈述面板 */}
        <Reveal className="sim-panel p-8 md:p-10">
          <p className="font-serif-sc text-lg leading-relaxed text-[color:var(--color-ink)] md:text-xl">
            {profile.about.paragraphsZh.map((p, i) => (
              <span key={i}>
                {p}
                {i < profile.about.paragraphsZh.length - 1 && <><br /><br /></>}
              </span>
            ))}
          </p>
          <div className="mt-6 border-t border-dashed border-[color:var(--color-line)] pt-5">
            <p className="font-mono text-sm leading-relaxed text-[color:var(--color-ink-soft)]">
              {profile.about.paragraphsEn.map((p, i) => (
                <span key={i}>
                  {p}
                  {i < profile.about.paragraphsEn.length - 1 && <><br /><br /></>}
                </span>
              ))}
            </p>
          </div>
        </Reveal>

        {/* 数据 + 语言 */}
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-2 gap-4">
            {profile.stats.map((s, i) => (
              <Reveal key={s.labelEn} delay={i * 0.08} className="sim-panel p-5">
                <div className="font-rounded text-3xl font-extrabold text-[color:var(--color-violet)]">
                  {s.value}
                  <span className="text-lg">{s.suffix}</span>
                </div>
                <div className="mt-2 text-xs font-medium text-[color:var(--color-ink-soft)]">{s.labelZh}</div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-[color:var(--color-ink-faint)]">
                  {s.labelEn}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="pt-6">
            <PalsChat
              title="语言能力 · LANGUAGES"
              messages={profile.languages.map((l, i) => ({
                who: l.name,
                color: ["#a988e6", "#f0a8c4", "#7fc4f0", "#f0c068"][i % 4],
                text: l.level,
              }))}
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
