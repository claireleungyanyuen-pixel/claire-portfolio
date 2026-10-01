"use client";

/* 主题 03 · 模拟人生 SIM LIFE
   SIM 明亮区块（hero/about/skills/works/path/contact）+ 小人鼠标（SimCursor）
   + 小镇地图（SimTown：方向键游走、点击房子查看内容）+ 漂浮晶锥背景。 */

import SimCursor from "./sim-cursor";
import SimTown from "./sim-town";
import SimField from "@/components/portfolio/sim-field";
import Navbar from "@/components/portfolio/navbar";
import Hero from "@/components/portfolio/hero";
import About from "@/components/portfolio/about";
import Skills from "@/components/portfolio/skills";
import Works from "@/components/portfolio/works";
import Path from "@/components/portfolio/path";
import Contact from "@/components/portfolio/contact";
import Footer from "@/components/portfolio/footer";

export function SimsTheme() {
  return (
    <div className="relative min-h-screen">
      <SimField />
      <SimCursor />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        {/* 小镇地图：键盘/拖动游走，点击房子看详情 */}
        <div className="mx-auto max-w-6xl px-5 pb-8 md:px-8">
          <SimTown />
        </div>
        <Skills />
        <Works />
        <Path />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
