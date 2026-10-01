"use client";

/* 主题 02 · 宇宙星图 COSMOS（水平螺旋星系视角，参考银河生成图/短视频）
   每段经历 = 一颗真实自转行星，沿横贯屏幕的水平螺旋旋臂上下交替散布（大小按远近/重要性差异），
   点击行星进入「星球表面」详情页；每个重点项目 = 一座空间站。
   背景为 S 形螺旋星系 + 流星鼠标 + 可拨开旋臂沙砾，见 cosmos-canvas。 */

import { useState } from "react";
import { profile } from "@/data/profile";
import { CosmosCanvas } from "./cosmos-canvas";
import { StarfleetLayer } from "./starfleet-layer";
import { LcarsTerminal } from "./lcars-terminal";
import EnterpriseCursor from "./enterprise-cursor";
import Planet3D, { PlanetSurface, type PlanetType } from "./planet-3d";

/* 每段经历配一颗真实感 3D 行星（type 决定地表材质；size 按「实际比例」差异化）
   axisTilt / spinDirection / spin 按真实天文动力学呈现（金星逆行倒转、土星大仰角A环、木星快转强扁平等） */
/* 真实星球照片贴图（public/planets） */
export const PLANET_TEXTURES: Record<PlanetType, string> = {
  earth: "/planets/earth.jpg",
  gas: "/planets/saturn.jpg",
  rocky: "/planets/mars.jpg",
  lava: "/planets/venus.jpg",
  ice: "/planets/neptune.jpg",
  ring: "/planets/jupiter.jpg",
};

const PLANET_STYLES: {
  type: PlanetType;
  seed: number;
  ring?: boolean;
  size: number; // 按实际相对比例差异化（现任最大、早期最小）
  spin: number; // 自转速度已按真实节奏放慢
  axisTilt?: number; // 自转轴倾角（弧度）
  spinDirection?: "prograde" | "retrograde";
  atmo: string;
  name: string;
}[] = [
  { type: "earth", seed: 11, size: 156, spin: 0.002, axisTilt: 0.41, atmo: "rgba(120,170,255,0.55)", name: "Violet Prime" }, // MATRADE 现任·最大（类地球 23.4°）
  { type: "gas", seed: 23, ring: true, size: 106, spin: 0.0032, axisTilt: 0.466, atmo: "rgba(230,200,160,0.5)", name: "Azure Hub" }, // 新加坡总助（类土星 26.7°·A环·碎石环带）
  { type: "rocky", seed: 37, size: 92, spin: 0.0018, axisTilt: 0.44, atmo: "rgba(240,160,200,0.45)", name: "Magenta Node" }, // 市场总监（类火星 25.2°）
  { type: "lava", seed: 41, size: 72, spin: 0.0012, axisTilt: 3.09, spinDirection: "retrograde", atmo: "rgba(255,140,80,0.4)", name: "Verdant Lab" }, // 生物科技（类金星：逆行倒转 177°·很慢）
  { type: "ice", seed: 53, ring: true, size: 84, spin: 0.0022, axisTilt: 0.49, atmo: "rgba(180,220,255,0.5)", name: "Golden Chamber" }, // 商会（类海王星 28.3°·暗环）
  { type: "ring", seed: 67, size: 64, spin: 0.004, axisTilt: 0.055, atmo: "rgba(200,180,255,0.45)", name: "Nexus Star" }, // BNI（类木星：快转强扁平 3.1°）
  { type: "rocky", seed: 79, size: 48, spin: 0.0026, axisTilt: 0.035, atmo: "rgba(150,170,220,0.4)", name: "Origins Belt" }, // 早期·最小（类水星 0.03°）
];

const PROJECT_STYLES: { type: PlanetType; seed: number; atmo: string; name: string; axisTilt?: number; size: number }[] = [
  { type: "earth", seed: 101, atmo: "rgba(120,230,180,0.5)", name: "Green Center", axisTilt: 0.41, size: 96 },
  { type: "ice", seed: 113, atmo: "rgba(240,170,210,0.5)", name: "SheShapes", axisTilt: 1.7, size: 72 },
  { type: "gas", seed: 127, atmo: "rgba(140,190,255,0.5)", name: "Monitor Station", axisTilt: 0.466, size: 84 },
  { type: "ring", seed: 149, atmo: "rgba(190,160,255,0.5)", name: "Bridge Net", axisTilt: 0.5, size: 64 },
];

export function CosmosTheme() {
  const [detail, setDetail] = useState<{
    kind: "exp" | "proj";
    idx: number;
  } | null>(null);

  const exp = detail?.kind === "exp" ? profile.experience.items[detail.idx] : null;
  const proj = detail?.kind === "proj" ? profile.projects.items[detail.idx] : null;
  const planetStyle = detail?.kind === "exp" ? PLANET_STYLES[detail.idx] : null;
  const projectStyle = detail?.kind === "proj" ? PROJECT_STYLES[detail.idx] : null;

  return (
    <div className="cosmos-root relative min-h-screen overflow-hidden text-[#dfe8ff]">
      <CosmosCanvas />
      {/* 星舰穿越 + R2-D2 全息（星际迷航舰队层） */}
      <StarfleetLayer />
      {/* 企业号飞船光标（跟随鼠标；触屏隐藏） */}
      <EnterpriseCursor />

      {/* 顶部 HUD */}
      <header className="relative z-20 flex items-center justify-between px-6 pt-7 md:px-12">
        <div className="font-mono text-xs tracking-[0.3em] text-white/60">
          CLAIRE&nbsp;LIANG · <span className="text-[#8ab4ff]">STARFLEET MAP</span>
        </div>
        <div className="hidden font-mono text-[10px] tracking-[0.25em] text-white/40 md:block">
          ENTERPRISE EN ROUTE · CLICK A PLANET
        </div>
      </header>

      {/* 首屏 */}
      <section className="relative z-10 mx-auto flex min-h-[88vh] max-w-5xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 font-mono text-xs tracking-[0.4em] text-[#8ab4ff]">
          ✦ CROSS-BORDER TRADE · GREEN-TECH · ESG ✦
        </div>
        <h1
          className="font-display text-6xl font-black leading-none tracking-tight text-white md:text-8xl"
          style={{ textShadow: "0 0 40px rgba(140,170,255,0.5)" }}
        >
          {profile.nameEn.split(" ")[0]}
        </h1>
        <div className="mt-3 font-serif-sc text-2xl text-white/80 md:text-3xl">{profile.name}</div>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/65 md:text-lg">
          {profile.titleZh}
        </p>
        <div className="mt-10 flex animate-bounce flex-col items-center gap-2 text-white/40">
          <span className="font-mono text-[10px] tracking-[0.3em]">FOLLOW THE STAR TRAIL</span>
          <span className="text-xl">↓</span>
        </div>
      </section>

      {/* 星系散游：经历行星散布在水平旋臂上下（参考银河生成图） */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <div className="font-mono text-xs tracking-[0.35em] text-[#8ab4ff]">CAREER GALAXY</div>
          <h2 className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">职业星系</h2>
          <p className="mt-2 text-sm text-white/45">行星沿旋臂缓慢自转，点击任意星球登陆查看详情</p>
        </div>

        <div className="relative">
          {/* 水平旋臂连接带：所有行星由这条发光银河串联（含漂移光点） */}
          <div className="cosmos-galaxy-belt-h absolute left-0 right-0 top-1/2 h-14 -translate-y-1/2" aria-hidden>
            <span className="galaxy-grain-h h1" />
            <span className="galaxy-grain-h h2" />
            <span className="galaxy-grain-h h3" />
            <span className="galaxy-grain-h h4" />
            <span className="galaxy-grain-h h5" />
            <span className="galaxy-grain-h h6" />
            <span className="galaxy-grain-h h7" />
            <span className="galaxy-grain-h h8" />
          </div>

          <div className="mx-auto flex max-w-5xl flex-col gap-4 md:gap-8">
            {profile.experience.items.map((e, i) => {
              const ps = PLANET_STYLES[i];
              // 沿银河中轴左右交替，并加固定的上下错落偏移
              const right = i % 2 === 1;
              // 每颗星相对中轴的错落高度（正负上下），大小越大越靠近
              const offsets = [10, -46, 26, -18, 40, -40, 14];
              const yOff = offsets[i % offsets.length];
              return (
                <div
                  key={i}
                  className="relative z-20 flex justify-center"
                  style={
                    {
                      // 每颗星相对银河中轴的上下错落
                      "--yOff": `${yOff}px`,
                    } as React.CSSProperties
                  }
                >
                  {/* 星球 + 卡片绑定为一个整体；移动端纵向堆叠，桌面端左右交替 + 上下错落 */}
                  <div
                    className={`cosmos-cluster flex flex-col items-center gap-3 md:flex-row md:gap-4 ${
                      right ? "md:flex-row-reverse" : ""
                    }`}
                    style={{ transform: "translateY(var(--yOff,0px))" }}
                  >
                    {/* 星球（点击点）：大小分明 */}
                    <button
                      onClick={() => setDetail({ kind: "exp", idx: i })}
                      style={{ width: ps.size, height: ps.size }}
                      className="group relative z-20 block flex-none leading-none transition-transform duration-300"
                      aria-label={e.roleZh}
                    >
                      <span
                        className="pointer-events-none absolute -inset-6 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                        style={{ background: `radial-gradient(circle, ${ps.atmo}, transparent 70%)` }}
                      />
                      <span
                        className="cosmos-float pointer-events-none block"
                        style={{ animationDelay: `${i * 0.4}s`, transformOrigin: `${ps.size / 2}px ${ps.size / 2}px` }}
                      >
                        <span className="cosmos-planet-zoom block" style={{ transformOrigin: "center center" }}>
                        <Planet3D
                          type={ps.type}
                          seed={ps.seed}
                          size={ps.size}
                          spinSpeed={ps.spin}
                          axisTilt={ps.axisTilt}
                          spinDirection={ps.spinDirection}
                          ring={ps.ring}
                          atmosphere={ps.atmo}
                          texture={PLANET_TEXTURES[ps.type]}
                        />
                        </span>
                      </span>
                    </button>

                    {/* 卡片紧贴星球（同一整体，不再分离） */}
                    <div
                      className={`w-[min(82vw,420px)] rounded-2xl border border-white/10 bg-[#0a0e24]/75 p-4 text-center shadow-[0_8px_30px_rgba(0,0,0,0.35)] backdrop-blur-md transition-colors hover:border-[#8ab4ff]/50 md:w-auto md:p-5 ${
                        right ? "md:text-right" : "md:text-left"
                      }`}
                    >
                      <div className="font-mono text-[11px] tracking-[0.18em] text-[#8ab4ff]">{e.period}</div>
                      <h3 className="mt-1 text-base font-bold text-white md:text-lg">{e.roleZh}</h3>
                      <div className={`mt-0.5 max-w-[230px] text-xs text-white/55 ${right ? "md:ml-auto" : "mx-auto md:mx-0"}`}>{e.orgZh}</div>
                      <button
                        onClick={() => setDetail({ kind: "exp", idx: i })}
                        className="mt-2.5 font-mono text-[11px] tracking-widest text-[#8ab4ff] underline-offset-4 hover:underline"
                      >
                        登陆星球 →
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 项目空间站 */}
      <section className="relative z-10 mx-auto max-w-5xl px-6 py-20">
        <div className="mb-14 text-center">
          <div className="font-mono text-xs tracking-[0.35em] text-[#c9a3ff]">SPACE STATIONS</div>
          <h2 className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">项目空间站</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {profile.projects.items.map((p, i) => {
            const st = PROJECT_STYLES[i];
            return (
              <button
                key={p.index}
                onClick={() => setDetail({ kind: "proj", idx: i })}
                className="group flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-center transition-all hover:-translate-y-1.5 hover:border-white/30"
              >
                <span className="cosmos-float block" style={{ animationDelay: `${i * 0.25}s` }}>
                  <Planet3D type={st.type} seed={st.seed} size={st.size} spinSpeed={0.0026} axisTilt={st.axisTilt} atmosphere={st.atmo} texture={PLANET_TEXTURES[st.type]} />
                </span>
                <div className="mt-4 font-mono text-[10px] tracking-widest text-white/40">{p.period}</div>
                <h3 className="mt-1.5 text-base font-bold leading-snug text-white">{p.nameZh}</h3>
                <div className="mt-2 rounded-full border border-white/15 px-2.5 py-0.5 text-[10px] text-[#c9a3ff]">{p.role}</div>
                <span className="mt-3 font-mono text-[10px] tracking-widest text-white/40 group-hover:text-[#c9a3ff]">对接查看 →</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* 联系 */}
      <section className="relative z-10 mx-auto max-w-3xl px-6 py-24 text-center">
        <div className="font-mono text-xs tracking-[0.35em] text-[#8ab4ff]">OPEN CHANNEL</div>
        <h2 className="mt-4 font-display text-3xl font-bold text-white md:text-5xl">
          {profile.contact.ctaZh}
        </h2>
        <a
          href={`mailto:${profile.email}`}
          className="mt-8 inline-block rounded-full border border-[#8ab4ff]/50 px-8 py-3.5 text-sm tracking-widest text-[#bcd6ff] transition-all hover:bg-[#8ab4ff] hover:text-[#03040c]"
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
              className="rounded-full border border-white/15 px-4 py-1.5 text-xs text-white/70 transition-colors hover:border-[#8ab4ff] hover:text-[#8ab4ff]"
            >
              {s.label}
            </a>
          ))}
        </div>
      </section>

      <footer className="relative z-10 py-8 text-center font-mono text-[10px] tracking-widest text-white/30">
        © {new Date().getFullYear()} {profile.nameEn} · DEEP SPACE MAP
      </footer>

      {/* 舰桥终端（LCARS） */}
      <LcarsTerminal />

      {/* ===== 星球表面详情页 ===== */}
      {detail && (
        <div className="cosmos-detail fixed inset-0 z-[80] overflow-y-auto">
          {/* 站在星球表面的立体虚化背景 */}
          {detail.kind === "exp" && planetStyle ? (
            <PlanetSurface type={planetStyle.type} seed={planetStyle.seed} texture={PLANET_TEXTURES[planetStyle.type]} />
          ) : projectStyle ? (
            <PlanetSurface type={projectStyle.type} seed={projectStyle.seed} texture={PLANET_TEXTURES[projectStyle.type]} />
          ) : null}
          {/* 虚化遮罩，突出文字 */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(120% 90% at 50% 30%, rgba(3,4,12,0.3) 0%, rgba(3,4,12,0.6) 55%, rgba(3,4,12,0.82) 100%)",
              backdropFilter: "blur(1.5px)",
            }}
          />

          <div className="relative z-10 mx-auto max-w-3xl px-6 py-12">
            <button
              onClick={() => setDetail(null)}
              className="mb-10 rounded-full border border-white/30 px-5 py-2 font-mono text-xs tracking-widest text-white/80 backdrop-blur transition-colors hover:border-white hover:bg-white/10"
            >
              ← 返回星图 BACK TO MAP
            </button>

            <div className="mb-6 flex items-center gap-5">
              {detail.kind === "exp" && planetStyle ? (
                <span className="cosmos-float block">
                  <Planet3D
                    type={planetStyle.type}
                    seed={planetStyle.seed}
                    size={92}
                    spinSpeed={planetStyle.spin * 1.4}
                    axisTilt={planetStyle.axisTilt}
                    spinDirection={planetStyle.spinDirection}
                    ring={planetStyle.ring}
                    atmosphere={planetStyle.atmo}
                    texture={PLANET_TEXTURES[planetStyle.type]}
                  />
                </span>
              ) : projectStyle ? (
                <span className="cosmos-float block">
                  <Planet3D type={projectStyle.type} seed={projectStyle.seed} size={88} spinSpeed={0.003} axisTilt={projectStyle.axisTilt} atmosphere={projectStyle.atmo} texture={PLANET_TEXTURES[projectStyle.type]} />
                </span>
              ) : null}
              <div className="font-mono text-xs tracking-[0.3em] text-white/70">
                {detail.kind === "exp" ? "PLANET" : "SPACE STATION"} · {String(detail.idx + 1).padStart(2, "0")}
              </div>
            </div>

            {exp && (
              <div className="surface-card">
                <div className="font-mono text-sm tracking-widest text-[#8ab4ff]">{exp.period}</div>
                <h2 className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">{exp.roleZh}</h2>
                <div className="mt-1 text-white/70">{exp.roleEn}</div>
                <div className="mt-1 text-sm text-[#bcd6ff]">{exp.orgZh}</div>
                <ul className="mt-6 space-y-3">
                  {exp.pointsZh.map((p, j) => (
                    <li key={j} className="flex gap-3 text-white/80 leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#8ab4ff]" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {proj && (
              <div className="surface-card">
                <div className="font-mono text-sm tracking-widest text-[#c9a3ff]">{proj.period}</div>
                <h2 className="mt-2 font-display text-3xl font-bold text-white md:text-4xl">{proj.nameZh}</h2>
                <div className="mt-1 text-white/70">{proj.nameEn}</div>
                <div className="mt-2 inline-block rounded-full border border-[#c9a3ff]/40 px-3 py-0.5 text-xs text-[#c9a3ff]">{proj.role}</div>
                <p className="mt-6 leading-relaxed text-white/82">{proj.descZh}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {proj.tags.map((t) => (
                    <span key={t} className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/70">{t}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
