"use client";

import { useState } from "react";
import { THEMES, useTheme, type ThemeId } from "./theme-context";

/**
 * 一键风格切换器：右下角浮动按钮 + 展开面板。
 * 键盘 1/2/3/4 也可快速切换；点击遮罩或按钮收起。
 */
export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  const pick = (id: ThemeId) => {
    setTheme(id);
    setOpen(false);
  };

  return (
    <div
      className="fixed right-3 bottom-3 z-[90] flex flex-col items-end gap-3 sm:right-6 sm:bottom-6"
      style={{
        transform: "translateY(calc(-1 * env(safe-area-inset-bottom, 0px)))",
      }}
    >
      {open && (
        <div
          className="ts-panel w-[min(82vw,320px)] rounded-2xl border bg-[var(--ts-card,oklch(0.22_0.03_285/0.92))] p-3 text-[var(--ts-fg,oklch(0.96_0.01_300))] shadow-2xl backdrop-blur-xl"
          style={{
            borderColor: "var(--ts-border, oklch(0.7 0.1 300 / 0.35))",
            animation: "tsPop .38s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          <div className="mb-2 flex items-center justify-between px-1">
            <span
              className="font-mono text-[10px] tracking-[0.25em] opacity-70"
              style={{ animation: "tsBlink 1.6s steps(2) infinite" }}
            >
              SELECT&nbsp;STYLE
            </span>
            <span className="font-mono text-[10px] opacity-50">[1-4]</span>
          </div>
          <div className="flex flex-col gap-1.5">
            {THEMES.map((t) => {
              const active = t.id === theme;
              return (
                <button
                  key={t.id}
                  onClick={() => pick(t.id)}
                  className="group flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-200"
                  style={{
                    borderColor: active
                      ? "var(--ts-accent, oklch(0.7 0.18 300))"
                      : "transparent",
                    background: active
                      ? "var(--ts-accent-soft, oklch(0.7 0.18 300 / 0.16))"
                      : "transparent",
                    transform: active ? "translateX(-2px)" : "none",
                  }}
                >
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-bold"
                    style={{
                      background: active ? t.dot : "transparent",
                      border: `2px solid ${t.dot}`,
                      color: active ? "#12081f" : t.dot,
                    }}
                  >
                    {t.index}
                  </span>
                  <span className="flex-1">
                    <span className="flex items-center gap-2">
                      <span className="text-sm font-bold">{t.labelZh}</span>
                      <span className="font-mono text-[10px] uppercase tracking-widest opacity-60">
                        {t.labelEn}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-snug opacity-65">
                      {t.desc}
                    </span>
                  </span>
                  {active && (
                    <span
                      className="font-mono text-[10px]"
                      style={{ color: t.dot }}
                    >
                      ●
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="切换风格"
        className="flex h-13 items-center gap-2 rounded-full px-5 py-3 font-mono text-xs font-bold tracking-widest shadow-xl transition-transform duration-200 hover:scale-105 active:scale-95"
        style={{
          background: "var(--ts-accent, oklch(0.62 0.19 300))",
          color: "#fff",
          boxShadow: "0 8px 30px var(--ts-glow, oklch(0.62 0.19 300 / 0.45))",
        }}
      >
        <span
          className="text-base leading-none"
          style={{ display: "inline-block", animation: open ? "tsSpin .4s var(--ease-spring,ease)" : "none" }}
        >
          {open ? "✕" : "◈"}
        </span>
        {open ? "关闭" : "切换风格 STYLE"}
      </button>
    </div>
  );
}
