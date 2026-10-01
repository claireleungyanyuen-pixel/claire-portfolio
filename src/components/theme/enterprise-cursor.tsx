"use client";

import { useEffect, useRef, useState } from "react";

/**
 * 企业号光变 · 企业号（U.S.S. Enterprise）
 * 跟随光标的是一艘小型飞船，飞船上方保留一个小鼠标图标指示实际点击点，
 * 尾部带蓝色曲速尾焰光晕。仅桌面（pointer:fine）显示，触屏与 reduced-motion 隐藏。
 */
export default function EnterpriseCursor() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [pos, setPos] = useState({ x: -200, y: -200 });

  const target = useRef({ x: -200, y: -200 });
  const cur = useRef({ x: -200, y: -200 });
  const raf = useRef(0);
  const seen = useRef(false);

  useEffect(() => {
    setMounted(true);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    document.body.classList.add("enterprise-cursor-on");

    // 桌面设备：即使尚未移动鼠标，也先显示飞船（避免"找不到鼠标"）
    setVisible(true);

    const onMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      if (!seen.current) {
        seen.current = true;
        cur.current = { x: e.clientX, y: e.clientY };
        setVisible(true);
      }
    };
    const onLeave = () => setVisible(false);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    const loop = () => {
      const tx = target.current.x;
      const ty = target.current.y;
      const cx = cur.current.x;
      const cy = cur.current.y;
      cur.current = { x: cx + (tx - cx) * 0.24, y: cy + (ty - cy) * 0.24 };
      setPos({ x: cur.current.x, y: cur.current.y });
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf.current);
      document.body.classList.remove("enterprise-cursor-on");
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden
      className={`enterprise-cursor pointer-events-none fixed left-0 top-0 z-[9999] ${visible ? "opacity-100" : "opacity-0"} transition-opacity duration-150`}
      style={{ transform: `translate(${pos.x}px, ${pos.y}px)` }}
    >
      {/* 上方小鼠标图标：指示可点击点 */}
      <svg
        width="22"
        height="30"
        viewBox="0 0 24 32"
        className="absolute"
        style={{ left: 6, top: -2 }}
      >
        <path
          d="M4 2 L20 12 L12.5 14.5 L16 24 L11.5 26 L8 16.5 L2 19 Z"
          fill="#ffffff"
          stroke="#0a0e24"
          strokeWidth="1.6"
          strokeLinejoin="round"
          opacity="0.98"
        />
      </svg>

      {/* 企业号飞船主体（位于鼠标右下方，舰首朝前） */}
      <div className="absolute" style={{ left: 2, top: 16 }}>
        {/* 曲速核心尾焰光晕 */}
        <div
          className="absolute"
          style={{
            left: -34,
            top: 13,
            width: 66,
            height: 32,
            background: "radial-gradient(ellipse at left, rgba(137,196,244,0.9), rgba(63,124,255,0.3) 52%, transparent 74%)",
            filter: "blur(2px)",
            animation: "warpFlame 0.9s ease-in-out infinite",
          }}
        />
        <svg width="80" height="52" viewBox="0 0 80 52" className="relative drop-shadow-[0_0_8px_rgba(137,196,244,0.95)]">
          {/* 碟形主舰体（企业号经典侧影） */}
          <ellipse cx="40" cy="22" rx="27" ry="11" fill="#dfe4ee" stroke="#4d5f86" strokeWidth="1" />
          <ellipse cx="37" cy="20" rx="22" ry="7.5" fill="#f2f5fb" />
          {/* 登舰圆顶 */}
          <ellipse cx="37" cy="17" rx="6.5" ry="3" fill="#aab8d8" />
          {/* 舰桥舷窗暖光 */}
          <rect x="34" y="16.4" width="5" height="1.2" rx="0.6" fill="#ffe9a8" />
          {/* 舷窗点列 */}
          {Array.from({ length: 9 }).map((_, i) => (
            <circle key={i} cx={20 + i * 4.4} cy="23.5" r="0.7" fill="#8fb6e8" opacity="0.9" />
          ))}
          {/* U.S.S ENTERPRISE / NCC 文字 */}
          <text x="37" y="26" fontSize="3.2" fill="#4d5f86" textAnchor="middle" fontFamily="monospace" letterSpacing="0.4" fontWeight="700">
            NCC-1701
          </text>
          {/* 连接颈 */}
          <rect x="29" y="27" width="16" height="8" rx="2.5" fill="#bcc8de" stroke="#7c8db0" strokeWidth="0.8" />
          {/* 曲速引擎舱（两个圆柱，上下对称） */}
          <rect x="8" y="29" width="24" height="7.5" rx="3.5" fill="#d4dcea" stroke="#8a9cc0" strokeWidth="0.9" />
          <rect x="48" y="29" width="24" height="7.5" rx="3.5" fill="#d4dcea" stroke="#8a9cc0" strokeWidth="0.9" />
          {/* 顶部引擎舱高光 */}
          <rect x="10" y="29.6" width="18" height="1.4" rx="0.7" fill="#ffffff" opacity="0.7" />
          <rect x="50" y="29.6" width="18" height="1.4" rx="0.7" fill="#ffffff" opacity="0.7" />
          {/* Bussard 红色集气口（每个引擎舱前端的红色发光端） */}
          <rect x="6" y="30" width="4.5" height="5.5" rx="2.2" fill="#ff5a4d" />
          <rect x="69.5" y="30" width="4.5" height="5.5" rx="2.2" fill="#ff5a4d" />
          {/* 引擎后端蓝色推进光 */}
          <rect x="72.5" y="30.5" width="3.5" height="4.5" rx="1.6" fill="#7fc4ff" className="enterprise-thruster" />
          <rect x="4" y="30.5" width="3.5" height="4.5" rx="1.6" fill="#7fc4ff" className="enterprise-thruster" />
          {/* 引擎舱红色条纹 */}
          <rect x="52" y="31.4" width="4" height="3" rx="1.2" fill="#e25454" />
          {/* 红色/琥珀导航灯 */}
          <circle cx="70" cy="23" r="1.3" fill="#ff5a5a" />
          <circle cx="8" cy="24" r="1.2" fill="#ffb14e" />
        </svg>
      </div>
    </div>
  );
}