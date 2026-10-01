import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Github } from "lucide-react";
import { githubProjects } from "@/data/projects";

export const metadata: Metadata = {
  title: "GitHub 项目集",
  description:
    "Claire 梁 在 GitHub 上的社会创新与黑客松项目：无障碍出行、反向出海合规、离线灾害应急、女性健康管理。",
};

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-[#0b1020] text-[#e8edff]">
      {/* 背景氛围 */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(900px 500px at 85% -10%, rgba(122,150,255,0.18), transparent 60%), radial-gradient(800px 600px at 0% 100%, rgba(192,81,143,0.12), transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-5xl px-6 py-10 md:px-10 md:py-16">
        {/* 顶部导航 */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-white/55 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          返回主页
        </Link>

        {/* 标题 */}
        <header className="mt-10">
          <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.3em] text-[#8ab4ff]">
            <Github className="h-4 w-4" />
            GITHUB · SELECTED WORKS
          </div>
          <h1
            className="mt-4 text-4xl font-black leading-tight md:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            项目作品集
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60 md:text-base">
            这里收录了我在黑客松与社会创新实践中主导 / 参与的产品原型——从无障碍出行、反向出海合规，到离线灾害应急与女性健康管理。
            点击任意项目，查看它试图解决的问题与核心功能。
          </p>
        </header>

        {/* 项目列表 */}
        <div className="mt-12 flex flex-col gap-5">
          {githubProjects.map((p, i) => (
            <Link
              key={p.slug}
              href={`/projects/${p.slug}`}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.07] md:p-8"
            >
              {/* 左侧色条 */}
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-1 opacity-70 transition-all duration-300 group-hover:w-1.5"
                style={{ background: p.accent }}
              />
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-xs text-white/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                      style={{
                        color: p.accent,
                        background: `${p.accent}1f`,
                        border: `1px solid ${p.accent}55`,
                      }}
                    >
                      {p.statusLabel}
                    </span>
                    <span className="font-mono text-[11px] tracking-wider text-white/40">
                      {p.hackathon}
                    </span>
                  </div>

                  <h2
                    className="mt-3 text-2xl font-bold text-white md:text-3xl"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {p.nameZh}
                    <span className="ml-3 align-middle text-sm font-normal text-white/40">
                      {p.nameEn}
                    </span>
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/60">
                    {p.tagline}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {p.highlights.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/55"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <span className="flex h-12 w-12 flex-none items-center justify-center self-start rounded-full border border-white/15 text-white/60 transition-all duration-300 group-hover:border-white/40 group-hover:bg-white/10 group-hover:text-white md:self-center">
                  <ArrowUpRight className="h-5 w-5" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <footer className="mt-16 border-t border-white/10 pt-6 font-mono text-[11px] tracking-widest text-white/35">
          CLAIRE LIANG · GITHUB PROJECTS · 原型作品，持续迭代中
        </footer>
      </div>
    </main>
  );
}
