"use client";

/* 星际迷航主题 · LCARS 舰桥终端面板（Starfleet Command Terminal）
   参考 thelcars / LCARS：圆角色条、等宽字体、数据列、舰桥视讯终端质感。
   - 顶部状态条：实时 Stardate 时钟 + 终端号
   - 身份档案区：姓名 / 职位 / 基地 / 星历
   - 「职业星系」以数据列列出每段经历（roleZh · orgZh · period）
   - 技能 / 语言用 LCARS 色条进度列
   可折叠（点左上角按钮）；prefers-reduced-motion 降级。 */

import { useEffect, useState } from "react";
import { profile } from "@/data/profile";

function prettyPeriod(p: string) {
  // "2021—今" / "2019—2021" 等，保持原样即可，仅去多余空格
  return p.trim();
}

export function LcarsTerminal() {
  const [open, setOpen] = useState(true);
  const [now, setNow] = useState<string>("");
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    const tick = () => {
      const d = new Date();
      // 星际迷航式星历日期（9977.x）
      const b = 9977 + (d.getFullYear() - 2378) * 0.5 + (d.getMonth() * 30 + d.getDate()) / 365;
      const fmt = d.toUTCString().slice(0, 16).toUpperCase();
      setNow(`STARDATE ${b.toFixed(2)} · ${fmt}`);
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, []);

  // skills 结构：{ marquee: string[], groups: { titleEn, items: { name, pct }[] }[] }
  const skillGroups =
    "groups" in (profile.skills as Record<string, unknown>)
      ? ((profile.skills as Record<string, unknown>).groups as unknown as {
          titleEn: string;
          items: { name: string; pct: number }[];
        }[])
      : [];
  const languages = profile.languages ?? [];
  const expItems = profile.experience.items;

  return (
    <div className="lcars fixed bottom-32 right-4 z-50 w-[min(88vw,320px)] font-mono md:bottom-32 md:right-7 md:w-[340px]">
      {/* 折叠开关（LCARS 圆角按钮） */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="舰桥终端"
        className="lcars-bar mb-0 flex w-full cursor-pointer items-center justify-between rounded-md bg-[#18335e] px-2 py-1.5 text-[10px] tracking-widest text-[#bfe0ff] transition-colors hover:bg-[#1d3d72]"
        style={{
          clipPath: "polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%)",
        }}
      >
        <span className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-[#8ab4ff]" style={{ animation: reduced ? undefined : "lcars-blink 1.4s step-end infinite" }} />
          BRIDGE TERMINAL
        </span>
        <span>{open ? "▾" : "▸"}</span>
      </button>

      {/* 可折叠面板 */}
      <div
        className={`overflow-hidden transition-all duration-500 ${open ? "max-h-[70vh]" : "max-h-0"}`}
        style={{ transitionTimingFunction: "cubic-bezier(.34,1.56,.64,1)" }}
      >
        <div className="rounded-lg border border-[#2a4678] bg-[#04070f]/92 p-3 shadow-[0_18px_50px_rgba(0,0,0,0.6)] backdrop-blur-md">
          {/* 状态行 */}
          <div className="flex items-center justify-between border-b border-[#1d3d72] pb-2 text-[9px] tracking-[0.15em] text-[#8ab4ff]">
            <span className="text-[#ff9a2e]">{now}</span>
          </div>

          {/* 身份档案 */}
          <div className="mt-3">
            <div className="grid grid-cols-3 gap-1.5">
              <LcarsCell label="NAME" value={profile.nameEn.split(" ")[0]} color="#ff9a2e" />
              <LcarsCell label="RANK" value="OFFICER" color="#ff9a2e" />
              <LcarsCell label="BASE" value="GZ" color="#8ab4ff" />
            </div>
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[9px] leading-relaxed text-white/55">
              <span>◈ {profile.titleZh}</span>
            </div>
            <div className="mt-1 text-[9px] text-[#bfe0ff]/70">{profile.intro.zh.slice(0, 44)}…</div>
          </div>

          {/* 职业星系（数据列） */}
          <div className="mt-3">
            <LcarsSectionTitle>CAREER LOGS</LcarsSectionTitle>
            <div className="mt-1.5 flex max-h-36 flex-col gap-1 overflow-y-auto pr-1">
              {expItems.map((e, i) => (
                <div key={i} className="flex items-center gap-2 text-[9px] leading-tight">
                  <span className="h-2.5 w-1 flex-none" style={{ background: LCARS_COLORS[i % LCARS_COLORS.length], clipPath: "polygon(0 0,100% 0,70% 100%,0 100%)" }} />
                  <span className="min-w-0 flex-1 truncate text-white/75">{e.roleZh}</span>
                  <span className="flex-none text-white/35">{prettyPeriod(e.period)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 技能：LCARS 分组色条 */}
          {skillGroups.length > 0 && (
            <div className="mt-3">
              <LcarsSectionTitle>SKILLS</LcarsSectionTitle>
              <div className="mt-1.5 space-y-2">
                {skillGroups.map((g, gi) => (
                  <div key={g.titleEn}>
                    <div className="mb-0.5 text-[8px] tracking-widest text-white/45">{g.titleEn}</div>
                    <div className="space-y-0.5">
                      {g.items.map((it, ii) => (
                        <LcarsBar key={ii} label={it.name} pct={it.pct} color={LCARS_COLORS[(gi + ii + 2) % LCARS_COLORS.length]} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 语言 */}
          {languages.length > 0 && (
            <div className="mt-3">
              <LcarsSectionTitle>COMMS · LANG</LcarsSectionTitle>
              <div className="mt-1.5 space-y-1">
                {languages.map((l, i) => (
                  <LcarsBar key={i} label={`${l.name} · ${l.level}`} pct={l.pct} color={LCARS_COLORS[(i + 1) % LCARS_COLORS.length]} />
                ))}
              </div>
            </div>
          )}

          <style>{`
            .lcars-bar{ clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%); }
            @keyframes lcars-blink{ 0%,100%{ opacity:1; } 50%{ opacity:0.25; } }
          `}</style>
        </div>
      </div>
    </div>
  );
}

const LCARS_COLORS = ["#ff9a2e", "#bfe0ff", "#e8c46a", "#8ab4ff", "#f0e6d2"];

function LcarsCell({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="rounded-sm bg-[#081224] px-2 py-1.5">
      <div className="text-[8px] tracking-widest text-white/40">{label}</div>
      <div className="mt-0.5 text-[11px] font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function LcarsSectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2 w-1 flex-none" style={{ background: "#ff9a2e", clipPath: "polygon(0 0,100% 0,70% 100%,0 100%)" }} />
      <span className="text-[9px] tracking-[0.2em] text-[#ff9a2e]">{children}</span>
      <span className="h-px flex-1 bg-[#1d3d72]" />
    </div>
  );
}

function LcarsBar({ label, color, pct = 100 }: { label: string; color: string; pct?: number }) {
  return (
    <div className="flex items-center gap-2 text-[9px] leading-tight">
      <span className="w-1 flex-none" style={{ height: 10, background: color, clipPath: "polygon(0 0,100% 0,60% 100%,0 100%)" }} />
      <span className="min-w-0 flex-1 truncate text-white/70">{label}</span>
      <span className="h-1.5 w-10 flex-none overflow-hidden rounded-full bg-[#0c1730]">
        <span className="block h-full" style={{ width: `${pct}%`, background: color }} />
      </span>
    </div>
  );
}