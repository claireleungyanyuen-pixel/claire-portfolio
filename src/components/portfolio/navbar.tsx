"use client";

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const ids = profile.navItems.map((n) => n.id);
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => {
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <header
      className={`safe-pt fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-[color:var(--color-line)] bg-[color:color-mix(in_oklch,var(--color-panel)_82%,transparent)] backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-[1180px] items-center justify-between px-6 py-4">
        <a href="#top" className="group flex items-center gap-2">
          <span className="plumbob-float inline-block" aria-hidden>
            <span className="plumbob plumbob-top block" style={{ borderLeftWidth: 8, borderRightWidth: 8, borderBottomWidth: 13 }} />
            <span className="plumbob plumbob-bottom block -mt-px" style={{ borderLeftWidth: 8, borderRightWidth: 8, borderTopWidth: 13 }} />
          </span>
          <span className="font-rounded text-lg font-extrabold tracking-tight text-[color:var(--color-ink)]">
            {profile.brand.name}
          </span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {profile.navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`rounded-full px-4 py-2 font-mono text-xs uppercase tracking-[0.15em] transition-all ${
                  active === item.id
                    ? "bg-[color:var(--color-violet)] text-white shadow-[0_6px_16px_-6px_oklch(0.55_0.2_300/0.7)]"
                    : "text-[color:var(--color-ink-soft)] hover:bg-[color:color-mix(in_oklch,var(--color-lilac)_40%,transparent)] hover:text-[color:var(--color-violet)]"
                }`}
              >
                {item.labelEn}
              </a>
            </li>
          ))}
          <li>
            <a
              href={`mailto:${profile.email}`}
              className="ml-2 rounded-full border-[1.5px] border-[color:color-mix(in_oklch,var(--color-violet)_40%,transparent)] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-[color:var(--color-violet)] transition-all hover:bg-[color:var(--color-violet)] hover:text-white"
            >
              Say Hi 👋
            </a>
          </li>
        </ul>

        <button
          aria-label="菜单"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border-[1.5px] border-[color:var(--color-line)] text-[color:var(--color-ink)] md:hidden"
        >
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-5 bg-current transition-transform ${open ? "translate-y-2 rotate-45" : ""}`} />
            <span className={`block h-0.5 w-5 bg-current transition-opacity ${open ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 w-5 bg-current transition-transform ${open ? "-translate-y-2 -rotate-45" : ""}`} />
          </div>
        </button>
      </nav>

      <div
        className={`overflow-hidden border-b border-[color:var(--color-line)] bg-[color:color-mix(in_oklch,var(--color-panel)_95%,transparent)] backdrop-blur-xl transition-all duration-500 md:hidden ${
          open ? "max-h-96" : "max-h-0"
        }`}
      >
        <ul className="space-y-1 px-6 py-4">
          {profile.navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 font-mono text-sm uppercase tracking-widest text-[color:var(--color-ink-soft)] hover:bg-[color:color-mix(in_oklch,var(--color-lilac)_40%,transparent)]"
              >
                {item.labelEn} · {item.labelZh}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
