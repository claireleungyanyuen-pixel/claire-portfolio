import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ExternalLink, Github } from "lucide-react";
import { getProject, githubProjects } from "@/data/projects";

// 静态预渲染全部项目
export function generateStaticParams() {
  return githubProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return { title: "项目未找到" };
  return {
    title: `${project.nameZh} ${project.nameEn}`,
    description: project.tagline,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const idx = githubProjects.findIndex((p) => p.slug === slug);
  const prev = githubProjects[(idx - 1 + githubProjects.length) % githubProjects.length];
  const next = githubProjects[(idx + 1) % githubProjects.length];

  return (
    <main className="min-h-screen bg-[#0b1020] text-[#e8edff]">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0"
        style={{
          background: `radial-gradient(900px 520px at 88% -12%, ${project.accent}26, transparent 60%), radial-gradient(760px 560px at -5% 100%, rgba(122,150,255,0.12), transparent 60%)`,
        }}
      />

      <div className="relative mx-auto max-w-4xl px-6 py-10 md:px-10 md:py-14">
        {/* 面包屑 / 返回 */}
        <nav className="flex flex-wrap items-center gap-2 font-mono text-xs tracking-widest text-white/45">
          <Link href="/" className="transition-colors hover:text-white">
            主页
          </Link>
          <span className="text-white/25">/</span>
          <Link href="/projects" className="transition-colors hover:text-white">
            项目集
          </Link>
          <span className="text-white/25">/</span>
          <span style={{ color: project.accent }}>{project.slug}</span>
        </nav>

        {/* 标题区 */}
        <header className="mt-10">
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="rounded-full px-3 py-1 text-[11px] font-medium"
              style={{
                color: project.accent,
                background: `${project.accent}1f`,
                border: `1px solid ${project.accent}55`,
              }}
            >
              {project.statusLabel}
            </span>
            <span className="font-mono text-[11px] tracking-wider text-white/40">
              {project.hackathon}
            </span>
          </div>

          <h1
            className="mt-5 text-4xl font-black leading-tight md:text-6xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {project.nameZh}
          </h1>
          <div className="mt-2 font-mono text-sm tracking-wide text-white/45">
            {project.nameEn}
          </div>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/75">
            {project.tagline}
          </p>
        </header>

        {/* 预留操作按钮：项目暂无外链 / 下载，保持空状态 */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled
            aria-disabled
            title="链接即将上线"
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-white/45"
            style={{
              background: `${project.accent}22`,
              border: `1px dashed ${project.accent}66`,
            }}
          >
            <ExternalLink className="h-4 w-4" />
            在线体验 · 敬请期待
          </button>

          <button
            type="button"
            disabled
            aria-disabled
            title="仓库链接即将补充"
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-full border border-dashed border-white/25 bg-white/[0.03] px-5 py-2.5 text-sm font-medium text-white/40"
          >
            <Github className="h-4 w-4" />
            源代码 · 即将开放
          </button>
        </div>
        <p className="mt-3 font-mono text-[11px] tracking-wider text-white/30">
          * 项目当前为参赛 / 原型阶段，公开链接暂未上线，按钮位置已预留。
        </p>

        {/* 项目使命 / 介绍 */}
        <section className="mt-12 rounded-3xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur-md md:p-9">
          <h2
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            项目介绍
          </h2>
          <p className="mt-4 text-sm leading-8 text-white/70 md:text-[15px]">
            {project.mission}
          </p>

          {/* 标签 */}
          <div className="mt-6 flex flex-wrap gap-2">
            {project.highlights.map((t) => (
              <span
                key={t}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/60"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        {/* 核心功能 */}
        <section className="mt-8">
          <h2
            className="text-xl font-bold text-white"
            style={{ fontFamily: "var(--font-display)" }}
          >
            核心功能
          </h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {project.features.map((f, i) => (
              <div
                key={f.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/22"
              >
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-7 w-7 flex-none items-center justify-center rounded-full font-mono text-xs font-bold"
                    style={{ color: project.accent, background: `${project.accent}1a` }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="text-sm font-bold text-white">{f.title}</h3>
                </div>
                <p className="mt-3 pl-10 text-[13px] leading-6 text-white/60">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 上一个 / 下一个 */}
        <nav className="mt-14 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-2">
          <Link
            href={`/projects/${prev.slug}`}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-colors hover:border-white/25"
          >
            <div className="font-mono text-[11px] tracking-widest text-white/40">← 上一个</div>
            <div className="mt-2 flex items-center gap-2 text-sm font-bold text-white">
              <ArrowLeft className="h-4 w-4 text-white/40 transition-transform group-hover:-translate-x-0.5" />
              {prev.nameZh}
            </div>
          </Link>
          <Link
            href={`/projects/${next.slug}`}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-right transition-colors hover:border-white/25"
          >
            <div className="font-mono text-[11px] tracking-widest text-white/40">下一个 →</div>
            <div className="mt-2 flex items-center justify-end gap-2 text-sm font-bold text-white">
              {next.nameZh}
              <ArrowRight className="h-4 w-4 text-white/40 transition-transform group-hover:translate-x-0.5" />
            </div>
          </Link>
        </nav>

        <div className="mt-10">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-white/55 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            返回全部项目
          </Link>
        </div>
      </div>
    </main>
  );
}
