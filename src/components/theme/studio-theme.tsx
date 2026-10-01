"use client";

/* 主题 04 · 艺术装置 STUDIO（参考 caliyang.dpdns.org 气质）
   深色近黑 + 大字宣言排版 + 等宽 HUD（时钟 / 鼠标坐标 / 网格线）+
   随鼠标缓慢流动的紫色果冻流体背景。文案均为梁恩源本人信息。 */

import { useEffect, useRef, useState } from "react";
import { profile } from "@/data/profile";

/* ---------- 流体背景（紫色果冻 blob，随鼠标流动） ---------- */
function FluidBg() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, raf = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    const blobs = [
      { h: 278, r: 0.34, sx: 0.28, sy: 0.3, va: 0.0009, vr: 0.0006, ph: 0 },
      { h: 295, r: 0.28, sx: 0.72, sy: 0.66, va: 0.0007, vr: 0.0008, ph: 2 },
      { h: 320, r: 0.22, sx: 0.5, sy: 0.2, va: 0.0011, vr: 0.0005, ph: 4 },
    ];
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      canvas.style.width = w + "px"; canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const onMove = (e: PointerEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const frame = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "screen";
      for (const b of blobs) {
        const mx = mouse.x >= 0 ? (mouse.x / w - b.sx) * 60 : 0;
        const my = mouse.y >= 0 ? (mouse.y / h - b.sy) * 60 : 0;
        const cx = b.sx * w + Math.sin(t * b.va + b.ph) * w * 0.05 + mx;
        const cy = b.sy * h + Math.cos(t * b.va * 1.3 + b.ph) * h * 0.05 + my;
        const rad = (Math.min(w, h) * b.r) * (1 + Math.sin(t * b.vr + b.ph) * 0.12);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad);
        g.addColorStop(0, `hsla(${b.h},70%,60%,0.32)`);
        g.addColorStop(0.6, `hsla(${b.h},70%,45%,0.10)`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(frame);
    };
    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    if (!reduced) raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);
  return <canvas ref={ref} className="pointer-events-none fixed inset-0 z-0" aria-hidden />;
}

/* ---------- HUD ---------- */
function Hud() {
  const [time, setTime] = useState("--:--:--");
  const [pos, setPos] = useState({ x: 0, y: 0 });
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setTime(d.toLocaleTimeString("zh-CN", { hour12: false, timeZone: "Asia/Shanghai" }));
    };
    tick();
    const t = setInterval(tick, 1000);
    const onMove = (e: PointerEvent) => setPos({ x: Math.round(e.clientX), y: Math.round(e.clientY) });
    window.addEventListener("pointermove", onMove);
    return () => { clearInterval(t); window.removeEventListener("pointermove", onMove); };
  }, []);
  return (
    <>
      <div className="pointer-events-none fixed bottom-5 left-6 z-50 font-mono text-xs tracking-[0.2em] text-white/50 md:left-10">
        {time} · GMT+8
      </div>
      <div className="pointer-events-none fixed bottom-5 right-6 z-50 font-mono text-xs tracking-[0.2em] text-white/50 md:right-10">
        {String(pos.x).padStart(4, "0")} X {String(pos.y).padStart(4, "0")} Y
      </div>
    </>
  );
}

export function StudioTheme() {
  const [typed, setTyped] = useState("");
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const lines = [profile.intro.zh, ...profile.rotations];
    const full = lines[idx];
    let i = 0;
    let timer: ReturnType<typeof setTimeout>;
    const tick = () => {
      i++;
      setTyped(full.slice(0, i));
      if (i < full.length) timer = setTimeout(tick, 60);
      else timer = setTimeout(() => setIdx((v) => (v + 1) % lines.length), 2600);
    };
    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, [idx]);

  return (
    <div className="studio-root relative min-h-screen overflow-hidden text-white">
      <FluidBg />
      <Hud />

      {/* 顶部导航条 */}
      <header className="relative z-30 flex items-center justify-between px-6 py-6 md:px-12">
        <div className="font-mono text-sm tracking-[0.35em]">CLAIRE®</div>
        <nav className="hidden gap-10 font-mono text-[12px] tracking-[0.25em] text-white/60 md:flex">
          <a href="#st-about" className="transition-colors hover:text-white">ABOUT</a>
          <a href="#st-work" className="transition-colors hover:text-white">WORK</a>
          <a href="#st-contact" className="transition-colors hover:text-white">CONTACT</a>
        </nav>
        <div className="font-mono text-[12px] tracking-[0.25em] text-white/60">LANG[中]</div>
      </header>

      {/* HERO 大字宣言 */}
      <section className="relative z-10 mx-auto flex min-h-[90vh] max-w-6xl flex-col justify-center px-6 md:px-12">
        <div className="font-mono text-[12px] tracking-[0.35em] text-white/50">( CREATIVE · TRADE · IMPACT )</div>
        <h1 className="mt-6 font-display text-[18vw] font-black leading-[0.92] tracking-tight md:text-[15vw]">
          <span className="block">CLAIRE</span>
          <span className="block bg-gradient-to-r from-[#c4b5fd] via-white to-[#a78bfa] bg-clip-text text-transparent">
            LIANG
          </span>
        </h1>
        <div className="mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
          {typed}
          <span className="ml-1 inline-block h-5 w-[2px] animate-pulse bg-white align-middle" />
        </div>
        <div className="mt-6 font-mono text-[11px] tracking-[0.3em] text-white/40">
          {profile.titleEn}
        </div>
      </section>

      {/* ABOUT */}
      <section id="st-about" className="relative z-10 mx-auto max-w-6xl px-6 py-32 md:px-12">
        <div className="mb-10 font-mono text-[12px] tracking-[0.35em] text-white/50">01 / ABOUT</div>
        <p className="max-w-4xl text-2xl font-light leading-relaxed text-white/85 md:text-4xl md:leading-relaxed">
          {profile.about.paragraphsZh[0]}
        </p>
        <div className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-md bg-white/10 md:grid-cols-4">
          {profile.stats.map((s) => (
            <div key={s.labelEn} className="bg-black/40 p-6">
              <div className="font-display text-3xl font-bold text-[#c4b5fd]">{s.value}{s.suffix}</div>
              <div className="mt-2 text-xs text-white/55">{s.labelZh}</div>
            </div>
          ))}
        </div>
      </section>

      {/* WORK */}
      <section id="st-work" className="relative z-10 mx-auto max-w-6xl px-6 py-24 md:px-12">
        <div className="mb-10 font-mono text-[12px] tracking-[0.35em] text-white/50">02 / SELECTED WORK</div>
        <div className="border-t border-white/15">
          {profile.projects.items.map((p) => (
            <a
              key={p.index}
              href={`mailto:${profile.email}`}
              className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-4 border-b border-white/15 py-7 transition-colors hover:bg-white/[0.03] md:gap-8 md:py-9"
            >
              <span className="font-mono text-sm text-white/40">{p.index}</span>
              <div>
                <h3 className="text-xl font-medium text-white transition-transform duration-300 group-hover:translate-x-2 md:text-3xl">
                  {p.nameZh}
                </h3>
                <p className="mt-1 text-sm text-white/45">{p.role} · {p.tags.join(" / ")}</p>
              </div>
              <span className="font-mono text-[11px] tracking-widest text-white/40">{p.period}</span>
            </a>
          ))}
        </div>
      </section>

      {/* CONTACT */}
      <section id="st-contact" className="relative z-10 mx-auto max-w-6xl px-6 py-32 md:px-12">
        <div className="mb-10 font-mono text-[12px] tracking-[0.35em] text-white/50">03 / CONTACT</div>
        <a
          href={`mailto:${profile.email}`}
          className="block break-all font-display text-3xl font-bold text-white transition-colors hover:text-[#c4b5fd] md:text-6xl"
        >
          {profile.email}
        </a>
        <div className="mt-12 flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm tracking-[0.2em]">
          {profile.contact.socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target={s.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="border-b border-dotted border-white/40 pb-0.5 text-white/70 transition-colors hover:border-[#c4b5fd] hover:text-[#c4b5fd]"
            >
              {s.label}
            </a>
          ))}
        </div>
      </section>

      <footer className="relative z-10 px-6 py-10 text-center font-mono text-[10px] tracking-[0.3em] text-white/30 md:px-12">
        © {new Date().getFullYear()} {profile.nameEn} · MADE WITH INTENT · GUANGZHOU
      </footer>
    </div>
  );
}
