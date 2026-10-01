"use client";

import { useEffect, useRef, useState } from "react";

/**
 * JellyName —— 啫喱/果冻质感互动名字
 * 原理：离屏 canvas 采样文字像素生成粒子点云；每个粒子用弹簧物理回到原位，
 *       鼠标靠近时被引力/斥力搅动并产生速度；绘制时大量半透明圆 + 'lighter' 叠加，
 *       重叠处自然融合成 metaball 果冻状；底层再加半透明文字保证可读。
 */
export default function JellyName({ text }: { text: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    type P = {
      hx: number; hy: number; // 家（目标位置）
      x: number; y: number;
      vx: number; vy: number;
      r: number;
      hue: number;
    };
    let particles: P[] = [];
    const mouse = { x: -9999, y: -9999, active: false };

    const sample = () => {
      const rect = wrap.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // 离屏画布绘制文字
      const off = document.createElement("canvas");
      off.width = Math.floor(width * dpr);
      off.height = Math.floor(height * dpr);
      const octx = off.getContext("2d");
      if (!octx) return;
      octx.scale(dpr, dpr);

      // 自适应字号：按宽度选
      let fontSize = Math.min(width / (text.length * 0.62), height * 0.92);
      fontSize = Math.max(36, Math.min(fontSize, 150));
      const family = `"Baloo 2", "Space Grotesk", "Noto Sans SC", sans-serif`;
      octx.fillStyle = "#fff";
      octx.font = `800 ${fontSize}px ${family}`;
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillText(text, width / 2, height / 2 + fontSize * 0.04);

      const data = octx.getImageData(0, 0, off.width, off.height).data;
      // 采样步长：移动端更稀疏
      const isMobile = width < 640;
      const gap = isMobile ? 5 : 4;
      const pts: P[] = [];
      for (let y = 0; y < off.height; y += gap) {
        for (let x = 0; x < off.width; x += gap) {
          const alpha = data[(y * off.width + x) * 4 + 3];
          if (alpha > 128) {
            const cx = x / dpr;
            const cy = y / dpr;
            pts.push({
              hx: cx,
              hy: cy,
              x: cx + (Math.random() - 0.5) * 40,
              y: cy + (Math.random() - 0.5) * 40,
              vx: 0,
              vy: 0,
              r: (isMobile ? 2.6 : 3.4) + Math.random() * 1.8,
              hue: 285 + Math.random() * 28, // 紫色相区间
            });
          }
        }
      }
      particles = pts;
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // 果冻融合：半透明圆 + lighter 叠加
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        // 弹簧回归
        const dx = p.hx - p.x;
        const dy = p.hy - p.y;
        p.vx += dx * 0.045;
        p.vy += dy * 0.045;

        // 鼠标扰动
        if (mouse.active) {
          const mdx = p.x - mouse.x;
          const mdy = p.y - mouse.y;
          const dist2 = mdx * mdx + mdy * mdy;
          const R = 110;
          if (dist2 < R * R) {
            const dist = Math.sqrt(dist2) || 1;
            const force = (1 - dist / R) * 6.5;
            // 切向搅动 + 轻微推开，形成果冻被搅的漩涡
            p.vx += (mdx / dist) * force * 0.6 + (-mdy / dist) * force * 0.9;
            p.vy += (mdy / dist) * force * 0.6 + (mdx / dist) * force * 0.9;
          }
        }

        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;

        const speed = Math.min(Math.abs(p.vx) + Math.abs(p.vy), 8);
        const light = 72 + speed * 1.6;
        const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.2);
        glow.addColorStop(0, `hsla(${p.hue}, 85%, ${light}%, 0.5)`);
        glow.addColorStop(1, `hsla(${p.hue}, 85%, 60%, 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
      raf = requestAnimationFrame(draw);
    };

    // 减少动效：只做静态采样一帧，不跑物理
    const renderStatic = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      for (const p of particles) {
        const glow = ctx.createRadialGradient(p.hx, p.hy, 0, p.hx, p.hy, p.r * 2.2);
        glow.addColorStop(0, "hsla(295, 85%, 72%, 0.5)");
        glow.addColorStop(1, "hsla(295, 85%, 60%, 0)");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(p.hx, p.hy, p.r * 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = "source-over";
    };

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
    };

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        sample();
        if (mq.matches) renderStatic();
      }, 200);
    };

    sample();
    if (mq.matches) {
      renderStatic();
    } else {
      raf = requestAnimationFrame(draw);
      window.addEventListener("pointermove", onMove);
      canvas.addEventListener("pointerleave", onLeave);
    }
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(resizeTimer);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerleave", onLeave);
    };
  }, [text]);

  return (
    <div ref={wrapRef} className="relative w-full select-none" style={{ height: "clamp(120px, 26vw, 240px)" }}>
      {/* 底层半透明文字，保证可读 + 果冻底色 */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center font-rounded font-extrabold leading-none whitespace-nowrap"
        style={{
          fontSize: "clamp(3rem, 13vw, 9.5rem)",
          color: "oklch(0.72 0.16 300 / 0.28)",
          textShadow: "0 2px 0 rgba(255,255,255,0.6), 0 10px 30px oklch(0.6 0.2 300/0.25)",
        }}
      >
        {text}
      </div>
      {/* 果冻粒子层 */}
      {!reduced && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full cursor-crosshair"
          aria-label={text}
        />
      )}
      {/* 无障碍可读名（屏幕阅读器） */}
      <span className="sr-only">{text}</span>
    </div>
  );
}
