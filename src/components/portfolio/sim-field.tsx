"use client";

import { useEffect, useRef } from "react";

/**
 * SimField —— SIM 风格背景：浅色闪光微粒缓慢上浮 + 鼠标轻微牵引 + 柔光球
 * 替代深色粒子夜空；明亮、活泼、稀疏、不抢戏。
 */
export default function SimField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    type Mote = {
      x: number; y: number; r: number;
      vy: number; vx: number;
      drift: number; phase: number;
      color: string; alpha: number;
    };
    let motes: Mote[] = [];
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };

    const COLORS = ["300,85%,72%", "305,80%,78%", "280,75%,75%", "165,70%,72%", "90,85%,78%"];

    const seed = () => {
      const isMobile = width < 640;
      const count = reduced
        ? 0
        : Math.min(isMobile ? 34 : 70, Math.floor((width * height) / 26000));
      motes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1.2 + Math.random() * 2.6,
        vy: -(0.12 + Math.random() * 0.32), // 缓慢上浮
        vx: (Math.random() - 0.5) * 0.12,
        drift: 0.2 + Math.random() * 0.5,
        phase: Math.random() * Math.PI * 2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: 0.35 + Math.random() * 0.45,
      }));
    };

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      seed();
    };

    const draw = (t: number) => {
      ctx.clearRect(0, 0, width, height);
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;

      for (const m of motes) {
        m.phase += 0.01;
        m.x += m.vx + Math.sin(t * 0.0004 + m.phase) * m.drift * 0.3;
        m.y += m.vy;

        // 鼠标轻微牵引（像被角色走过带起的光点）
        const dx = m.x - mouse.x;
        const dy = m.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 130 * 130) {
          const f = (1 - Math.sqrt(d2) / 130) * 0.6;
          m.x += (dx / (Math.sqrt(d2) || 1)) * f;
          m.y += (dy / (Math.sqrt(d2) || 1)) * f;
        }

        if (m.y < -10) { m.y = height + 10; m.x = Math.random() * width; }
        if (m.x < -10) m.x = width + 10;
        if (m.x > width + 10) m.x = -10;

        const tw = 0.6 + 0.4 * Math.sin(t * 0.002 + m.phase * 3);
        const glow = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 4);
        glow.addColorStop(0, `hsla(${m.color},${m.alpha * tw})`);
        glow.addColorStop(1, `hsla(${m.color},0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 4, 0, Math.PI * 2);
        ctx.fill();

        // 星点核心
        ctx.fillStyle = `hsla(${m.color},${Math.min(1, m.alpha * tw + 0.3)})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r * 0.7, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };

    resize();
    if (!reduced) {
      raf = requestAnimationFrame(draw);
      window.addEventListener("pointermove", onMove);
    } else {
      // 静态：画一次柔和光点
      for (const m of motes) {
        ctx.fillStyle = `hsla(${m.color},${m.alpha})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* 柔光球 */}
      <div
        className="pointer-events-none absolute -top-32 right-[-10%] h-[46rem] w-[46rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.85 0.12 305/0.5), transparent 65%)" }}
      />
      <div
        className="pointer-events-none absolute bottom-[-20%] left-[-8%] h-[40rem] w-[40rem] rounded-full blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.86 0.1 250/0.4), transparent 65%)" }}
      />
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* 漂浮 Plumbob 晶锥装饰 */}
      <Plumbob className="left-[6%] top-[16%]" size={26} delay={0} opacity={0.5} />
      <Plumbob className="right-[9%] top-[30%]" size={18} delay={1.4} opacity={0.4} />
      <Plumbob className="left-[14%] bottom-[14%]" size={20} delay={2.2} opacity={0.35} />
      <Plumbob className="right-[16%] bottom-[22%]" size={30} delay={0.8} opacity={0.45} />
    </div>
  );
}

function Plumbob({
  className,
  size,
  delay,
  opacity,
}: {
  className: string;
  size: number;
  delay: number;
  opacity: number;
}) {
  return (
    <div
      className={`pointer-events-none absolute plumbob-float ${className}`}
      style={{ animationDelay: `${delay}s`, opacity }}
      aria-hidden
    >
      <div
        className="plumbob plumbob-top"
        style={{
          borderLeftWidth: size / 2,
          borderRightWidth: size / 2,
          borderBottomWidth: size * 0.8,
        }}
      />
      <div
        className="plumbob plumbob-bottom"
        style={{
          borderLeftWidth: size / 2,
          borderRightWidth: size / 2,
          borderTopWidth: size * 0.8,
        }}
      />
    </div>
  );
}
