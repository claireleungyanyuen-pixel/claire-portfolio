"use client";

import { useEffect, useRef, useState } from "react";

/**
 * SIM 小人鼠标 —— 梁恩源形象
 * 灰色西装外套 + 白色及膝裙 + 杏色高跟鞋；长卷黑发 + 银白挑染；头顶 Plumbob。
 * 慢速移动 = 走路（轻摆臂/腿），快速移动 = 跑步（大幅摆臂/抬腿、前倾）；
 * 脚下留一串真实小脚印，便于找回鼠标。
 */

type Mode = "idle" | "walk" | "run";

function Plumbob({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 56" style={{ filter: "drop-shadow(0 0 6px rgba(124,205,124,0.8))" }}>
      <polygon
        points="20,2 34,22 20,54 6,22"
        fill="url(#pb)"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.2"
      />
      <polygon points="20,2 34,22 20,26" fill="rgba(255,255,255,0.45)" />
      <defs>
        <linearGradient id="pb" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#bff0a0" />
          <stop offset="55%" stopColor="#7ccf6a" />
          <stop offset="100%" stopColor="#3f9e4d" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** 卡通小人（面向右侧，-scaleX 翻面） */
function SimGirl({ mode }: { mode: Mode }) {
  const running = mode === "run";
  const walking = mode === "walk";
  const anim = running ? "sim-run" : walking ? "sim-walk" : "sim-idle";

  return (
    <svg
      width="76"
      height="120"
      viewBox="0 0 90 150"
      className={`sim-girl ${anim}`}
      style={{ overflow: "visible" }}
    >
      {/* 影子 */}
      <ellipse cx="48" cy="146" rx="22" ry="5" fill="rgba(90,60,140,0.18)" />

      {/* 后腿（先画，在后面） */}
      <g className="leg leg-back">
        {/* 小腿（裸肤色） */}
        <rect x="46" y="96" width="9" height="34" rx="4.5" fill="#f2c9a8" />
        {/* 杏色高跟鞋 */}
        <path d="M44 130 h16 l-2 9 h-12 l-2 -6 z" fill="#e3b07f" />
        <rect x="56" y="134" width="3" height="6" fill="#c98f5a" />
      </g>
      {/* 前腿 */}
      <g className="leg leg-front">
        <rect x="40" y="96" width="9" height="34" rx="4.5" fill="#f7d4b6" />
        <path d="M38 130 h16 l-2 9 h-12 l-2 -6 z" fill="#ecc18f" />
        <rect x="50" y="134" width="3" height="6" fill="#c98f5a" />
      </g>

      {/* 白色及膝裙（补齐臀部） */}
      <path
        d="M34 74 h30 l6 26 a3 3 0 0 1 -3 4 H31 a3 3 0 0 1 -3 -4 z"
        fill="#ffffff"
        stroke="#e7d9f5"
        strokeWidth="1.5"
      />
      {/* 灰色西装外套（衣身） */}
      <path
        d="M30 44 h32 l4 34 a4 4 0 0 1 -4 4 H30 a4 4 0 0 1 -4 -4 z"
        fill="#8b8f9c"
      />
      {/* 西装翻领 / 门襟 */}
      <path d="M46 44 l-8 14 l8 6 l8 -6 z" fill="#f4f1f8" />
      <path d="M46 50 v26" stroke="#6f7380" strokeWidth="1.4" />
      {/* 金色纽扣 */}
      <circle cx="46" cy="62" r="1.6" fill="#d8b45a" />
      <circle cx="46" cy="70" r="1.6" fill="#d8b45a" />

      {/* 后臂（肩关节 60,50，自然下垂贴体） */}
      <g className="arm arm-back">
        <rect x="56" y="48" width="8" height="30" rx="4" fill="#7d818e" />
        <circle cx="60" cy="80" r="4.6" fill="#f2c9a8" />
      </g>
      {/* 前臂（肩关节 28,50） */}
      <g className="arm arm-front">
        <rect x="24" y="48" width="8" height="30" rx="4" fill="#969aa6" />
        <circle cx="28" cy="80" r="4.8" fill="#f7d4b6" />
      </g>

      {/* 脖子 */}
      <rect x="42" y="36" width="9" height="10" fill="#f2c9a8" />

      {/* 头 */}
      <g className="head">
        {/* 长卷发（后层，黑发带银白挑染） */}
        <path
          d="M30 22 a18 18 0 0 1 36 0 c0 14 -4 30 -8 34 c-3 -6 -6 -8 -10 -8 c-4 0 -7 2 -10 8 c-4 -4 -8 -20 -8 -34 z"
          fill="#2e2636"
        />
        {/* 银白挑染发丝 */}
        <path d="M34 14 c-3 8 -5 18 -5 28" stroke="#cfd2dc" strokeWidth="2.4" fill="none" strokeLinecap="round" opacity="0.85" />
        <path d="M60 16 c3 8 4 18 4 26" stroke="#e6e8ef" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.8" />
        {/* 脸 */}
        <ellipse cx="48" cy="26" rx="13" ry="14.5" fill="#f7d4b6" />
        {/* 刘海（卷） */}
        <path d="M35 20 a13 13 0 0 1 26 0 c-4 -4 -8 -5 -13 -5 c-5 0 -9 1 -13 5 z" fill="#2e2636" />
        <path d="M36 19 c2 4 4 5 6 5" stroke="#cfd2dc" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.8" />
        {/* 眼睛（兴奋：弯弯笑眼 + 腮红） */}
        <path d="M42 26 q3 -3 6 0" stroke="#3a2f3e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <path d="M49 26 q3 -3 6 0" stroke="#3a2f3e" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        <circle cx="40.5" cy="30" r="2.4" fill="#f4a6b8" opacity="0.6" />
        <circle cx="55.5" cy="30" r="2.4" fill="#f4a6b8" opacity="0.6" />
        {/* 笑容 */}
        <path d="M44 32 q4 4 8 0" stroke="#b56a5a" strokeWidth="1.8" fill="none" strokeLinecap="round" />
        {/* 两侧垂落卷发 */}
        <path d="M33 26 c-3 8 -3 16 0 22" stroke="#2e2636" strokeWidth="6" fill="none" strokeLinecap="round" />
        <path d="M63 26 c3 8 3 16 0 22" stroke="#2e2636" strokeWidth="6" fill="none" strokeLinecap="round" />
      </g>

      {/* 头顶晶锥底座小光 */}
      <circle cx="48" cy="6" r="2" fill="#bff0a0" opacity="0.9" />
    </svg>
  );
}

/** 单个小脚印（用 CSS animation 淡出，避免渲染期调用 Date.now） */
function Foot({ x, y, flip }: { x: number; y: number; flip: boolean }) {
  return (
    <div
      style={{
        position: "fixed",
        left: x,
        top: y,
        transform: `translate(-50%,-50%) scaleX(${flip ? -1 : 1})`,
        pointerEvents: "none",
        zIndex: 9998,
        animation: "simFootFade 2.4s ease-out forwards",
      }}
    >
      <svg width="16" height="24" viewBox="0 0 20 30">
        {/* 脚掌 */}
        <ellipse cx="10" cy="18" rx="6" ry="9" fill="rgba(124,92,170,0.5)" />
        {/* 脚趾 */}
        <circle cx="5" cy="7" r="2" fill="rgba(124,92,170,0.5)" />
        <circle cx="9" cy="5" r="2.3" fill="rgba(124,92,170,0.5)" />
        <circle cx="14" cy="6" r="2" fill="rgba(124,92,170,0.5)" />
      </svg>
    </div>
  );
}

interface FootMark {
  id: number;
  x: number;
  y: number;
  flip: boolean;
}

export default function SimCursor() {
  const [mounted, setMounted] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [facing, setFacing] = useState<1 | -1>(1);
  const [mode, setMode] = useState<Mode>("idle");
  const [feet, setFeet] = useState<FootMark[]>([]);

  const target = useRef({ x: -100, y: -100 });
  const cur = useRef({ x: -100, y: -100 });
  const lastFoot = useRef({ x: 0, y: 0 });
  const footId = useRef(0);
  const lastMove = useRef(0);
  const raf = useRef(0);

  useEffect(() => {
    setMounted(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    // 触屏不显示
    if (window.matchMedia("(pointer: coarse)").matches) return;

    document.body.classList.add("sim-cursor-on");

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const loop = () => {
      const tx = target.current.x;
      const ty = target.current.y;
      const cx = cur.current.x;
      const cy = cur.current.y;
      const dx = tx - cx;
      const dy = ty - cy;
      const dist = Math.hypot(dx, dy);
      const speed = Math.min(dist, 60);

      // 缓动跟随
      cur.current = { x: cx + dx * 0.22, y: cy + dy * 0.22 };
      setPos({ x: cur.current.x, y: cur.current.y });

      if (dist > 1) {
        if (Math.abs(dx) > 3) setFacing(dx > 0 ? 1 : -1);
        setMode(speed > 7 ? "run" : "walk");
        lastMove.current = performance.now();

        // 脚印：走/跑每移动一段距离落一个，左右交替
        const footDist = Math.hypot(cur.current.x - lastFoot.current.x, cur.current.y - lastFoot.current.y);
        const step = speed > 7 ? 34 : 46;
        if (footDist > step) {
          const flip = footId.current % 2 === 0;
          const fx = cur.current.x + (flip ? -10 : 10) * facing;
          const fy = cur.current.y + 30;
          const id = footId.current++;
          setFeet((f) => [...f.slice(-14), { id, x: fx, y: fy, flip: !flip }]);
          lastFoot.current = { x: cur.current.x, y: cur.current.y };
        }
      } else if (performance.now() - lastMove.current > 220) {
        setMode("idle");
      }
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    // 脚印清理（与 CSS 淡出时长对齐）
    const cleaner = setInterval(() => {
      setFeet((f) => f.slice(-14));
    }, 2400);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf.current);
      clearInterval(cleaner);
      document.body.classList.remove("sim-cursor-on");
    };
  }, [facing]);

  if (!mounted) return null;

  return (
    <>
      {feet.map((f) => (
        <Foot key={f.id} x={f.x} y={f.y} flip={f.flip} />
      ))}
      <div
        style={{
          position: "fixed",
          left: pos.x,
          top: pos.y,
          transform: `translate(-50%,16%) scaleX(${facing}) ${mode === "run" ? "rotate(6deg)" : ""}`,
          transformOrigin: "center bottom",
          pointerEvents: "none",
          zIndex: 9999,
          transition: "transform 0.12s ease-out",
        }}
      >
        {/* 晶锥悬浮头顶 */}
        <div
          className="sim-plumbob-float"
          style={{ position: "absolute", left: "50%", top: -30, transform: "translateX(-50%)" }}
        >
          <Plumbob size={24} />
        </div>
        <SimGirl mode={mode} />
      </div>
    </>
  );
}
