"use client";

import Link from "next/link";
import { Github, ArrowUpRight } from "lucide-react";

/**
 * 主页 → GitHub 项目列表页的全站入口。
 * 固定在左下角，与右下角的主题切换器对称，独立于四套主题配色，
 * 使用半透明玻璃质感，适配深色（商务/宇宙/工作室）与浅色（SIM）底。
 */
export function ProjectsEntry() {
  return (
    <Link
      href="/projects"
      className="group fixed left-3 bottom-3 z-[80] inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/20 bg-black/55 py-2 pl-2.5 pr-3.5 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/40 hover:bg-black/70 sm:left-6 sm:bottom-6"
      style={{
        // 适配 iOS 底部安全区（home 指示条）/ 安卓手势条
        transform: "translateY(calc(-1 * env(safe-area-inset-bottom, 0px)))",
      }}
      aria-label="查看 GitHub 项目"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">
        <Github className="h-4 w-4" />
      </span>
      <span className="whitespace-nowrap text-sm font-medium tracking-wide">我的项目</span>
      <ArrowUpRight className="hidden h-4 w-4 text-white/60 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white sm:block" />
    </Link>
  );
}
