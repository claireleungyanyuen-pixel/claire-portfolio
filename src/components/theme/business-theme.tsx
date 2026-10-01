"use client";

/* 主题 01 · 商务精英 BUSINESS
   深蓝海军 + 鎏金点缀，衬线高端排版，克制的入场动效。自包含、不使用全局 SIM 样式。 */

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";
import Advisor from "./advisor";

/* ---------- 小工具 ---------- */

function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setShown(true)),
      { threshold }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return { ref, shown };
}

function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, shown } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(26px)",
        transition: `opacity .8s cubic-bezier(.22,1,.36,1) ${delay}ms, transform .8s cubic-bezier(.22,1,.36,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ---------- 导航 ---------- */

function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("top");
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      let cur = "top";
      for (const n of profile.navItems) {
        const el = document.getElementById(`biz-${n.id}`);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) cur = n.id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header
      className="safe-pt fixed inset-x-0 top-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? "oklch(0.19 0.04 265 / 0.88)" : "transparent",
        backdropFilter: scrolled ? "blur(14px)" : "none",
        borderBottom: scrolled ? "1px solid oklch(0.72 0.1 85 / 0.22)" : "1px solid transparent",
      }}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a href="#biz-top" className="flex items-baseline gap-2 text-white">
          <span className="font-serif-sc text-lg font-bold tracking-wide">Claire 梁</span>
          <span className="font-mono text-[10px] tracking-[0.3em] text-[var(--biz-gold)]">
            CLAIRE&nbsp;LIANG
          </span>
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {profile.navItems.map((n) => (
            <a
              key={n.id}
              href={`#biz-${n.id}`}
              className="group relative text-sm text-white/75 transition-colors hover:text-white"
            >
              {n.labelZh}
              <span
                className="absolute -bottom-1.5 left-0 h-px bg-[var(--biz-gold)] transition-all duration-300"
                style={{ width: active === n.id ? "100%" : "0%" }}
              />
            </a>
          ))}
          <a
            href="#advisor"
            className="group relative text-sm text-[var(--biz-gold)] transition-colors hover:text-white"
          >
            智能顾问
            <span
              className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-100 bg-[var(--biz-gold)]"
            />
          </a>
        </nav>
        <a
          href={`mailto:${profile.email}`}
          className="hidden rounded-full border border-[var(--biz-gold)]/60 px-4 py-1.5 text-xs tracking-widest text-[var(--biz-gold)] transition-all hover:bg-[var(--biz-gold)] hover:text-[#101826] md:inline-block"
        >
          联系我
        </a>
      </div>
    </header>
  );
}

/* ---------- 章节标题 ---------- */

function SectionTitle({ zh, en, num }: { zh: string; en: string; num: string }) {
  return (
    <Reveal className="mb-12">
      <div className="flex items-end justify-between border-b border-white/15 pb-5">
        <div>
          <div className="mb-2 flex items-center gap-3">
            <span className="h-2 w-2 rotate-45 bg-[var(--biz-gold)]" />
            <span className="font-mono text-xs tracking-[0.35em] text-[var(--biz-gold)]">{en}</span>
          </div>
          <h2 className="font-serif-sc text-3xl font-bold text-white md:text-4xl">{zh}</h2>
        </div>
        <span className="font-mono text-5xl font-light text-white/10 md:text-6xl">{num}</span>
      </div>
    </Reveal>
  );
}

/* ---------- 主组件 ---------- */

export function BusinessTheme() {
  // 打字机
  const [typeText, setTypeText] = useState("");
  const [rotIdx, setRotIdx] = useState(0);
  useEffect(() => {
    const full = profile.rotations[rotIdx];
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      i++;
      setTypeText(full.slice(0, i));
      if (i < full.length) {
        timer = setTimeout(tick, 70);
      } else {
        timer = setTimeout(() => {
          setRotIdx((r) => (r + 1) % profile.rotations.length);
        }, 2200);
      }
    };
    timer = setTimeout(tick, 400);
    return () => clearTimeout(timer);
  }, [rotIdx]);

  return (
    <div className="biz-root relative min-h-screen overflow-hidden" data-biz>
      {/* 背景纹理 */}
      <div className="biz-bg" aria-hidden />

      <Nav />

      {/* HERO */}
      <section
        id="biz-top"
        className="relative mx-auto flex min-h-screen max-w-6xl flex-col justify-center px-6 pt-24"
      >
        <Reveal>
          <div className="mb-6 flex items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[var(--biz-gold)]/40 px-4 py-1.5 font-mono text-[11px] tracking-[0.25em] text-[var(--biz-gold)]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {profile.status}
            </span>
          </div>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="font-serif-sc text-5xl font-black leading-tight text-white md:text-7xl">
            {profile.name}
            <span className="mt-3 block font-display text-2xl font-medium tracking-[0.15em] text-white/60 md:text-3xl">
              {profile.nameEn}
            </span>
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80 md:text-xl">
            {profile.titleZh}
          </p>
          <p className="mt-2 max-w-2xl font-mono text-sm text-[var(--biz-gold)]/80">
            {profile.titleEn}
          </p>
        </Reveal>
        <Reveal delay={360}>
          <div className="mt-8 h-8">
            <span className="text-lg text-white/85 md:text-xl">
              {typeText}
              <span className="ml-0.5 inline-block w-[2px] animate-pulse bg-[var(--biz-gold)]" style={{ height: "1.1em", verticalAlign: "-0.15em" }} />
            </span>
          </div>
        </Reveal>
        <Reveal delay={480}>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#biz-contact"
              className="rounded-sm bg-[var(--biz-gold)] px-7 py-3 text-sm font-bold tracking-widest text-[#101826] transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_30px_oklch(0.72_0.1_85/0.35)]"
            >
              预约洽谈
            </a>
            <a
              href="#biz-projects"
              className="rounded-sm border border-white/30 px-7 py-3 text-sm tracking-widest text-white/90 transition-all hover:border-[var(--biz-gold)] hover:text-[var(--biz-gold)]"
            >
              查看业绩
            </a>
          </div>
        </Reveal>
        <Reveal delay={600}>
          <div className="mt-16 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-sm border border-white/10 bg-white/10 md:grid-cols-4">
            {profile.stats.map((s) => (
              <div key={s.labelEn} className="bg-[oklch(0.2_0.04_265/0.6)] p-5">
                <div className="font-display text-2xl font-bold text-[var(--biz-gold)] md:text-3xl">
                  {s.value}
                  {s.suffix}
                </div>
                <div className="mt-1 text-xs leading-snug text-white/60">{s.labelZh}</div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ABOUT */}
      <section id="biz-about" className="relative mx-auto max-w-6xl px-6 py-28">
        <SectionTitle zh={profile.about.headingZh} en={profile.about.headingEn} num="01" />
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr]">
          <Reveal>
            <div className="space-y-6">
              {profile.about.paragraphsZh.map((p, i) => (
                <p key={i} className="text-lg leading-loose text-white/82 first-letter:text-[var(--biz-gold)]">
                  {p}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal delay={150}>
            <div className="rounded-sm border border-white/12 bg-white/[0.04] p-7">
              <h3 className="mb-5 font-mono text-xs tracking-[0.3em] text-[var(--biz-gold)]">LANGUAGES</h3>
              <div className="space-y-4">
                {profile.languages.map((l) => (
                  <div key={l.name}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="text-white/85">{l.name}</span>
                      <span className="text-white/45">{l.level}</span>
                    </div>
                    <div className="h-1 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--biz-gold-dark)] to-[var(--biz-gold)]"
                        style={{ width: `${l.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* EXPERTISE */}
      <section id="biz-expertise" className="relative mx-auto max-w-6xl px-6 py-28">
        <SectionTitle zh="专业专长" en="EXPERTISE" num="02" />
        <div className="grid gap-6 md:grid-cols-3">
          {profile.skills.groups.map((g, gi) => (
            <Reveal key={g.titleEn} delay={gi * 120}>
              <div className="h-full rounded-sm border border-white/12 bg-white/[0.04] p-7 transition-colors hover:border-[var(--biz-gold)]/50">
                <div className="mb-1 font-mono text-[10px] tracking-[0.3em] text-[var(--biz-gold)]/70">
                  {g.titleEn}
                </div>
                <h3 className="mb-6 font-serif-sc text-xl font-bold text-white">{g.titleZh}</h3>
                <div className="space-y-5">
                  {g.items.map((it) => (
                    <div key={it.name}>
                      <div className="mb-1.5 flex justify-between text-sm">
                        <span className="text-white/80">{it.name}</span>
                        <span className="font-mono text-xs text-white/40">{it.pct}%</span>
                      </div>
                      <div className="h-[3px] overflow-hidden rounded-full bg-white/10">
                        <Bar pct={it.pct} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={200}>
          <div className="mt-10 flex flex-wrap gap-2.5">
            {profile.skills.marquee.map((k) => (
              <span
                key={k}
                className="rounded-full border border-white/15 px-4 py-1.5 text-sm text-white/70 transition-colors hover:border-[var(--biz-gold)]/60 hover:text-[var(--biz-gold)]"
              >
                {k}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* PROJECTS */}
      <section id="biz-projects" className="relative mx-auto max-w-6xl px-6 py-28">
        <SectionTitle zh={profile.projects.headingZh} en={profile.projects.headingEn} num="03" />
        <div className="space-y-4">
          {profile.projects.items.map((p, i) => (
            <Reveal key={p.index} delay={i * 80}>
              <article className="group grid gap-4 rounded-sm border border-white/12 bg-white/[0.03] p-7 transition-all duration-300 hover:border-[var(--biz-gold)]/50 hover:bg-white/[0.06] md:grid-cols-[auto_1fr_auto] md:items-center md:gap-8">
                <div className="font-display text-4xl font-light text-white/20 transition-colors group-hover:text-[var(--biz-gold)]/70">
                  {p.index}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-serif-sc text-xl font-bold text-white">{p.nameZh}</h3>
                    <span className="rounded-full border border-[var(--biz-gold)]/40 px-2.5 py-0.5 text-[11px] text-[var(--biz-gold)]">
                      {p.role}
                    </span>
                  </div>
                  <p className="mt-1 font-mono text-xs text-white/40">{p.nameEn}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/70">{p.descZh}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span key={t} className="text-[11px] tracking-wider text-white/45">
                        · {t}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="font-mono text-xs tracking-widest text-white/45 md:text-right">
                  {p.period}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="biz-path" className="relative mx-auto max-w-6xl px-6 py-28">
        <SectionTitle zh={profile.experience.headingZh} en={profile.experience.headingEn} num="04" />
        <div className="relative border-l border-white/15 pl-8 md:pl-12">
          {profile.experience.items.map((e, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="relative pb-12 last:pb-0">
                <span
                  className="absolute -left-[37px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full border-2 border-[var(--biz-gold)] bg-[#141d2e] md:-left-[53px]"
                />
                <div className="flex flex-wrap items-baseline gap-x-4">
                  <h3 className="font-serif-sc text-xl font-bold text-white">{e.roleZh}</h3>
                  <span className="font-mono text-xs tracking-widest text-[var(--biz-gold)]">{e.period}</span>
                </div>
                <div className="mt-1 text-sm text-[var(--biz-gold)]/80">{e.orgZh}</div>
                <ul className="mt-3 space-y-1.5">
                  {e.pointsZh.map((pt, j) => (
                    <li key={j} className="flex gap-2.5 text-sm leading-relaxed text-white/68">
                      <span className="mt-2 h-1 w-1 shrink-0 bg-[var(--biz-gold)]/60" />
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        {/* 资质 + 教育 */}
        <div className="mt-16 grid gap-10 md:grid-cols-2">
          <Reveal>
            <h3 className="mb-5 font-mono text-xs tracking-[0.3em] text-[var(--biz-gold)]">
              {profile.certifications.headingEn}
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {profile.certifications.items.map((c) => (
                <div key={c} className="flex items-center gap-2 text-sm text-white/72">
                  <span className="text-[var(--biz-gold)]">◆</span>
                  {c}
                </div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <h3 className="mb-5 font-mono text-xs tracking-[0.3em] text-[var(--biz-gold)]">
              {profile.education.headingEn}
            </h3>
            <div className="space-y-4">
              {profile.education.items.map((ed) => (
                <div key={ed.school} className="border-l-2 border-white/15 pl-4">
                  <div className="font-medium text-white">{ed.school}</div>
                  <div className="text-sm text-white/60">{ed.degree}</div>
                  <div className="font-mono text-xs text-white/40">{ed.period}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* AI ADVISOR */}
      <Advisor />

      {/* OPEN CHANNEL · 进入华南市场 */}
      <section className="relative overflow-hidden bg-[#0a1120] py-24">
        {/* 星空 */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(1px 1px at 12% 22%, rgba(255,255,255,.5) 0, transparent 100%)," +
              "radial-gradient(1px 1px at 28% 68%, rgba(255,255,255,.42) 0, transparent 100%)," +
              "radial-gradient(1.4px 1.4px at 47% 14%, rgba(255,255,255,.55) 0, transparent 100%)," +
              "radial-gradient(1px 1px at 62% 78%, rgba(255,255,255,.4) 0, transparent 100%)," +
              "radial-gradient(1.3px 1.3px at 78% 32%, rgba(255,255,255,.48) 0, transparent 100%)," +
              "radial-gradient(1px 1px at 88% 60%, rgba(255,255,255,.38) 0, transparent 100%)",
          }}
        />
        {/* 金色光带（右下→左上 流动） */}
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-16 -right-10 h-72 w-[120%] rotate-[-14deg] opacity-70"
          style={{
            background:
              "linear-gradient(90deg, transparent, oklch(0.82 0.14 85 / 0.1) 30%, oklch(0.78 0.14 85 / 0.34) 55%, oklch(0.9 0.14 85 / 0.5) 70%, transparent)",
            filter: "blur(6px)",
          }}
        />
        {/* 光球点缀 */}
        {[
          "left-[8%] top-[22%] h-3 w-3",
          "left-[20%] bottom-[26%] h-2 w-2",
          "left-[46%] top-[18%] h-4 w-4",
          "right-[22%] top-[38%] h-2.5 w-2.5",
          "right-[10%] bottom-[18%] h-3 w-3",
        ].map((cls, i) => (
          <span
            key={i}
            aria-hidden
            className={`absolute rounded-full ${cls}`}
            style={{
              background: "radial-gradient(circle, #ffe6a6, oklch(0.75 0.13 85) 60%, transparent)",
              boxShadow: "0 0 18px oklch(0.78 0.13 85 / 0.6)",
            }}
          />
        ))}

        <div className="relative mx-auto max-w-6xl px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.5em] text-cyan-200/50">
            {profile.openChannel.en}
          </p>
          <h2 className="mt-5 font-serif-sc text-4xl font-bold leading-tight text-white md:text-6xl">
            {profile.openChannel.zh}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-white/60">{profile.openChannel.subZh}</p>
          <p className="mx-auto mt-2 max-w-2xl font-mono text-xs text-white/35">
            {profile.openChannel.subEn}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {profile.openChannel.tags.map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--biz-gold)]/30 px-4 py-1.5 text-sm text-[var(--biz-gold)]"
              >
                {t}
              </span>
            ))}
          </div>
          <a
            href={`mailto:${profile.email}`}
            className="mt-10 inline-block rounded-sm bg-[var(--biz-gold)] px-10 py-4 font-bold tracking-widest text-[#101826] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_36px_oklch(0.72_0.1_85/0.4)]"
          >
            {profile.openChannel.ctaZh}
          </a>
        </div>
      </section>

      {/* CONTACT */}
      <section id="biz-contact" className="relative mx-auto max-w-6xl px-6 py-28">
        <SectionTitle zh={profile.contact.headingZh} en={profile.contact.headingEn} num="05" />
        <Reveal>
          <div className="rounded-sm border border-[var(--biz-gold)]/25 bg-gradient-to-br from-white/[0.06] to-transparent p-10 text-center md:p-16">
            <h2 className="font-serif-sc text-3xl font-bold text-white md:text-5xl">
              {profile.contact.ctaZh}
            </h2>
            <p className="mt-3 text-white/60">{profile.contact.ctaEn}</p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-8 inline-block rounded-sm bg-[var(--biz-gold)] px-10 py-4 font-bold tracking-widest text-[#101826] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_36px_oklch(0.72_0.1_85/0.4)]"
            >
              {profile.email}
            </a>
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {profile.contact.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="rounded-full border border-white/18 px-5 py-2 text-sm text-white/75 transition-all hover:border-[var(--biz-gold)] hover:text-[var(--biz-gold)]"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <footer className="relative border-t border-white/10 py-8 text-center font-mono text-[11px] tracking-widest text-white/35">
        © {new Date().getFullYear()} {profile.name} · {profile.nameEn} · {profile.location}
      </footer>
    </div>
  );
}

function Bar({ pct }: { pct: number }) {
  const { ref, shown } = useInView<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className="h-full rounded-full bg-gradient-to-r from-[var(--biz-gold-dark)] to-[var(--biz-gold)]"
      style={{ width: shown ? `${pct}%` : "0%", transition: "width 1s cubic-bezier(.22,1,.36,1)" }}
    />
  );
}
