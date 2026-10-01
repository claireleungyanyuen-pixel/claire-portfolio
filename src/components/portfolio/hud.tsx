"use client";

import { useEffect, useState } from "react";

/**
 * HUD —— SIM 风格装置元件：实时时钟(GMT+8) + 鼠标坐标 + 顶部滚动进度条
 * 明亮浅色底上的胶囊小面板。
 */
export default function Hud() {
  const [time, setTime] = useState("--:--:--");
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [progress, setProgress] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () => {
      const d = new Date();
      const p = (n: number) => String(n).padStart(2, "0");
      setTime(`${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`);
    };
    tick();
    const t = setInterval(tick, 1000);

    const onMove = (e: PointerEvent) => setCoords({ x: e.clientX, y: e.clientY });
    const onScroll = () => {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      setProgress(max > 0 ? h.scrollTop / max : 0);
    };
    onScroll();
    window.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      clearInterval(t);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const pad = (n: number) => String(n).padStart(4, "0");

  return (
    <>
      {/* 顶部滚动进度条 */}
      <div className="fixed inset-x-0 top-0 z-[60] h-1">
        <div
          className="h-full origin-left rounded-r-full transition-[width] duration-150"
          style={{
            width: `${progress * 100}%`,
            background: "linear-gradient(90deg, var(--color-violet), var(--color-violet-bright))",
            boxShadow: "0 0 12px oklch(0.65 0.2 305/0.7)",
          }}
        />
      </div>

      {/* 左下角：时钟胶囊 */}
      <div className="pointer-events-none fixed bottom-5 left-5 z-40 hidden items-center gap-3 rounded-full border-[1.5px] border-[color:color-mix(in_oklch,var(--color-violet)_25%,transparent)] bg-[color:color-mix(in_oklch,var(--color-panel)_85%,transparent)] px-4 py-2 backdrop-blur-md sm:flex">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--color-mint)] opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--color-mint)]" />
        </span>
        <span className="font-mono text-xs font-bold tabular-nums tracking-wider text-[color:var(--color-ink)]">
          {mounted ? time : "--:--:--"}
        </span>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-ink-faint)]">
          GMT+8 · GZ
        </span>
      </div>

      {/* 右下角：鼠标坐标胶囊 */}
      <div className="pointer-events-none fixed bottom-5 right-5 z-40 hidden rounded-full border-[1.5px] border-[color:color-mix(in_oklch,var(--color-violet)_25%,transparent)] bg-[color:color-mix(in_oklch,var(--color-panel)_85%,transparent)] px-4 py-2 backdrop-blur-md sm:block">
        <span className="font-mono text-xs font-bold tabular-nums tracking-wider text-[color:var(--color-ink-soft)]">
          {pad(coords.x)} X {pad(coords.y)} Y
        </span>
      </div>
    </>
  );
}
