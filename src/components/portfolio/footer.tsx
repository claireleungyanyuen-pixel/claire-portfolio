"use client";

import { profile } from "@/data/profile";

export default function Footer() {
  return (
    <footer className="border-t border-[color:var(--color-line)] bg-white/40 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1180px] flex-col items-center justify-between gap-4 px-6 py-10 sm:flex-row">
        <div className="flex items-center gap-2">
          <span className="plumbob-float inline-block" aria-hidden>
            <span className="plumbob plumbob-top block" style={{ borderLeftWidth: 7, borderRightWidth: 7, borderBottomWidth: 11 }} />
            <span className="plumbob plumbob-bottom block -mt-px" style={{ borderLeftWidth: 7, borderRightWidth: 7, borderTopWidth: 11 }} />
          </span>
          <span className="font-rounded font-extrabold text-[color:var(--color-ink)]">{profile.brand.name}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-ink-faint)]">
            {profile.brand.sub}
          </span>
        </div>

        <p className="font-mono text-[11px] uppercase tracking-wider text-[color:var(--color-ink-faint)]">
          © {new Date().getFullYear()} {profile.name} · Guangzhou
        </p>

        <div className="flex gap-5 font-mono text-[11px] uppercase tracking-wider">
          <a href={`mailto:${profile.email}`} className="text-[color:var(--color-ink-soft)] transition-colors hover:text-[color:var(--color-violet)]">
            Email
          </a>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[color:var(--color-ink-soft)] transition-colors hover:text-[color:var(--color-violet)]"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
