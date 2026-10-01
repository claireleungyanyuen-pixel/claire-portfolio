"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";
import JellyName from "./jelly-name";

export default function Hero() {
  const [text, setText] = useState("");
  const [phrase, setPhrase] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = profile.rotations[phrase % profile.rotations.length];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setText(current);
      return;
    }
    const speed = deleting ? 40 : 90;
    const timer = setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, text.length + 1);
        setText(next);
        if (next === current) setTimeout(() => setDeleting(true), 1800);
      } else {
        const next = current.slice(0, text.length - 1);
        setText(next);
        if (next.length === 0) {
          setDeleting(false);
          setPhrase((p) => p + 1);
        }
      }
    }, speed);
    return () => clearTimeout(timer);
  }, [text, deleting, phrase]);

  return (
    <section id="top" className="relative flex min-h-screen flex-col items-center justify-center px-6 pt-24 pb-16">
      {/* 状态徽章 */}
      <div className="rise-in badge mb-8" style={{ animationDelay: "0.1s" }}>
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--color-mint)] opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--color-mint)]" />
        </span>
        {profile.status}
      </div>

      {/* 果冻互动名字 */}
      <div className="rise-in w-full max-w-5xl" style={{ animationDelay: "0.25s" }}>
        <JellyName text={profile.jellyName} />
      </div>

      {/* 中文真名 + 身份 */}
      <div className="rise-in text-center" style={{ animationDelay: "0.45s" }}>
        <h1 className="font-rounded text-3xl font-extrabold tracking-tight text-[color:var(--color-ink)] sm:text-4xl md:text-5xl">
          {profile.name}
          <span className="ml-3 font-mono text-base font-bold uppercase tracking-[0.3em] text-[color:var(--color-violet)] sm:text-lg">
            / {profile.nameEn}
          </span>
        </h1>
        <p className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-[color:var(--color-ink-soft)] sm:text-sm">
          {profile.titleEn}
        </p>
      </div>

      {/* 打字机 */}
      <div className="rise-in mt-8 flex h-8 items-center justify-center" style={{ animationDelay: "0.6s" }}>
        <p className="font-mono text-sm text-[color:var(--color-ink-soft)] sm:text-base">
          <span className="text-[color:var(--color-violet)] font-bold">&gt; </span>
          {text}
          <span className="caret-blink ml-0.5 inline-block w-[2px] bg-[color:var(--color-violet)]" style={{ height: "1em" }} />
        </p>
      </div>

      {/* CTA */}
      <div className="rise-in mt-10 flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: "0.75s" }}>
        <a
          href="#contact"
          className="rounded-full bg-[color:var(--color-violet)] px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-white shadow-[0_14px_30px_-10px_oklch(0.55_0.2_300/0.7)] transition-all hover:-translate-y-1 hover:bg-[color:var(--color-violet-bright)]"
        >
          开始合作 · Let&apos;s Talk
        </a>
        <a
          href="#projects"
          className="rounded-full border-[1.5px] border-[color:color-mix(in_oklch,var(--color-violet)_40%,transparent)] bg-white/60 px-8 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-[color:var(--color-violet)] backdrop-blur transition-all hover:-translate-y-1 hover:bg-white"
        >
          查看项目
        </a>
      </div>

      {/* 滚动提示 */}
      <div className="scroll-hint absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[color:var(--color-ink-faint)]">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <span className="block h-6 w-px bg-current" />
      </div>
    </section>
  );
}
