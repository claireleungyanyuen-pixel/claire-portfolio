"use client";

/* 星际迷航宇宙主题的「星舰穿越 + R2-D2 全息」装饰层：
   - 数艘小型飞船沿屏缓慢巡航（尾焰光晕 + 上下浮动 + 轻微摇摆），移动端降密度
   - 一尊 R2-D2 风格 SVG 机器人（头部蓝白警示灯 + 呼吸光晕），作为全息装饰浮于页面
   与 cosmos-canvas（银河粒子）分层：canvas 管银河，本组件管船只/机器人（DOM/CSS 精灵）。
   全部尊重 prefers-reduced-motion（降级为静态）。 */

import { useEffect, useState } from "react";

type FleetUnit = {
  id: number;
  left: number; // 起点横向 % 或负值（-20..-5）
  top: number; // 纵向 %
  size: number; // 尺寸 px
  dur: number; // 穿越秒数
  delay: number; // 启动延迟（初始散开）
  bob: number; // 上下浮动幅度 px
  tilt: number; // 倾斜（带一点航向感）
  hue: string; // 尾焰/船灯颜色
};

const FLEET: FleetUnit[] = [
  { id: 0, left: -22, top: 62, size: 46, dur: 52, delay: 0, bob: 6, tilt: -4, hue: "#8ab4ff" },
  { id: 1, left: -14, top: 82, size: 34, dur: 66, delay: 8, bob: 8, tilt: 3, hue: "#e8c46a" },
  { id: 2, left: -18, top: 40, size: 40, dur: 58, delay: 16, bob: 5, tilt: -2, hue: "#bfe0ff" },
  { id: 3, left: -10, top: 70, size: 26, dur: 74, delay: 24, bob: 7, tilt: 5, hue: "#ff9a2e" },
  { id: 4, left: -26, top: 24, size: 52, dur: 48, delay: 32, bob: 9, tilt: -6, hue: "#8ab4ff" },
];

function StarshipIcon({ hue, size }: { hue: string; size: number }) {
  return (
    <svg width={size} height={size * 0.42} viewBox="0 0 120 50" aria-hidden="true">
      {/* 尾焰光晕 */}
      <ellipse cx="108" cy="25" rx="26" ry="9" fill={hue} opacity="0.5">
        <animate attributeName="rx" values="26;34;26" dur="1.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0.85;0.5" dur="1.4s" repeatCount="indefinite" />
      </ellipse>
      <ellipse cx="116" cy="25" rx="16" ry="5" fill="#fff" opacity="0.55" />
      {/* 机身 */}
      <path d="M8 25 L34 16 L92 15 L112 25 L92 35 L34 34 Z" fill="#cfd8ea" stroke="#2a3550" strokeWidth="1.5" />
      {/* 驾驶舱/舷窗 */}
      <circle cx="78" cy="25" r="5" fill="#bfe0ff" opacity="0.9" />
      <circle cx="66" cy="25" r="4" fill="#8ab4ff" opacity="0.7" />
      <circle cx="54" cy="25" r="3.4" fill="#8ab4ff" opacity="0.5" />
      {/* 机翼灯 */}
      <circle cx="16" cy="24" r="2.2" fill={hue} />
      <circle cx="30" cy="12" r="2" fill={hue} opacity="0.8" />
    </svg>
  );
}

function R2D2() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  return (
    <div className="r2d2 float pointer-events-none select-none" aria-hidden="true">
      {/* 全息晕轮 */}
      <div className="r2d2-halo" />
      <svg width="120" height="150" viewBox="0 0 120 150" aria-hidden="true">
        {/* 停机坪阴影 */}
        <ellipse cx="60" cy="146" rx="42" ry="5" fill="#000" opacity="0.4" />
        {/* 头 */}
        <g>
          <path d="M36 8 a6 6 0 0 1 6-6 h36 a6 6 0 0 1 6 6 v26 h-48 Z" fill="#e8eef7" stroke="#9fb0c8" strokeWidth="1.5" />
          {/* 蓝色额头条 */}
          <rect x="38" y="12" width="44" height="4" rx="2" fill="#3a6bc0" />
          {/* 眼睛/传感器 */}
          <circle cx="48" cy="24" r="4" fill="#12141c" />
          <circle cx="72" cy="24" r="4" fill="#12141c" />
          <circle cx="60" cy="24" r="2" fill="#12141c" />
          {/* 中心红蓝警示灯（呼吸闪烁） */}
          <g>
            <circle cx="60" cy="15" r="3" fill="#ff4b4b" opacity={reduced ? 0.9 : 0.9}>
              {!reduced && <animate attributeName="opacity" values="0.4;1;0.4" dur="1.6s" repeatCount="indefinite" />}
            </circle>
            <circle cx="47" cy="15" r="2" fill="#4a9bff" opacity={reduced ? 0.8 : 0.8}>
              {!reduced && <animate attributeName="opacity" values="0.3;0.9;0.3" dur="2s" repeatCount="indefinite" />}
            </circle>
          </g>
          {/* 头顶圆顶小灯 */}
          <circle cx="60" cy="7" r="3" fill="#e8c46a" stroke="#b89a3a" strokeWidth="1" />
        </g>
        {/* 颈 */}
        <rect x="46" y="34" width="28" height="8" rx="2" fill="#bcc8dc" />
        {/* 躯干 */}
        <g>
          <path d="M34 42 h52 a6 6 0 0 1 6 6 v72 a6 6 0 0 1-6 6 h-52 a6 6 0 0 1-6-6 V48 a6 6 0 0 1 6-6 Z" fill="#e8eef7" stroke="#9fb0c8" strokeWidth="1.5" />
          {/* 面板纹理 */}
          <rect x="42" y="50" width="36" height="28" rx="6" fill="#dfe7f2" stroke="#9fb0c8" strokeWidth="1" />
          {/* 蓝色数据屏（呼吸） */}
          <rect x="48" y="56" width="24" height="14" rx="3" fill="#12233f">
            {!reduced && (
              <animate attributeName="fill" values="#12233f;#2a6bd6;#12233f" dur="3s" repeatCount="indefinite" />
            )}
          </rect>
          {/* 装饰点 */}
          <circle cx="78" cy="58" r="2" fill="#3a6bc0" />
          <circle cx="78" cy="68" r="2" fill="#3a6bc0" />
          {/* 侧边蓝条 */}
          <rect x="36" y="48" width="4" height="74" rx="2" fill="#4a7bc0" />
        </g>
        {/* 辊筒底座（三足辊轮） */}
        <g>
          <path d="M34 120 h52 a16 16 0 0 1 16 16 v0 h-84 Z" fill="#d6dfee" stroke="#9fb0c8" strokeWidth="1.5" />
          <rect x="30" y="128" width="10" height="14" rx="3" fill="#bcc8dc" />
          <rect x="80" y="128" width="10" height="14" rx="3" fill="#bcc8dc" />
          <path d="M42 120 h36 v16 h-36 Z" fill="#c3cfe1" />
        </g>
      </svg>
    </div>
  );
}

export function StarfleetLayer() {
  const [mobile, setMobile] = useState(false);
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    setMobile(window.innerWidth < 768);
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);
  const units = mobile ? FLEET.slice(0, 2) : FLEET; // 移动端只保留 2 艘，避免抢戏
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      {units.map((u) => (
        <div
          key={u.id}
          className="starfleet absolute"
          style={
            {
              left: `${u.left}%`,
              top: `${u.top}%`,
              "--dur": `${reduced ? 0 : u.dur}s`,
              "--delay": `${u.delay}s`,
              "--bob": `${u.bob}px`,
              "--tilt": `${u.tilt}deg`,
              animationDelay: `-${u.delay}s`,
            } as React.CSSProperties
          }
        >
          <div className="starfleet-ship" style={{ animationDelay: `-${u.delay}s` }}>
            <StarshipIcon hue={u.hue} size={u.size} />
          </div>
        </div>
      ))}
      {/* R2-D2 全息（右下，但避开底部 LCARS 终端——置于其上方留白） */}
      <div className="absolute right-8 top-[9%] hidden md:block" style={{ opacity: 0.85 }}>
        <R2D2 />
      </div>
      <style>{`
        .starfleet{ animation: sf-traverse var(--dur) linear infinite; }
        .starfleet-ship{ animation: sf-float calc(var(--dur) * 0.3) ease-in-out infinite; }
        @keyframes sf-traverse{ from{ transform: translateX(0) rotate(0deg); } to{ transform: translateX(140vw) rotate(2deg); } }
        @keyframes sf-float{ 0%,100%{ transform: translateY(var(--bob,0px)) rotate(var(--tilt,0deg)); } 50%{ transform: translateY(calc(var(--bob,0px) * -1)) rotate(calc(var(--tilt,0deg) * -1)); } }
        .r2d2{ position: relative; animation: sf-bob 5s ease-in-out infinite; }
        @keyframes sf-bob{ 0%,100%{ transform: translateY(0) rotate(-2deg); } 50%{ transform: translateY(-8px) rotate(2deg); } }
        .r2d2-halo{
          position: absolute; inset: -18px; border-radius: 50%;
          background: radial-gradient(circle, rgba(140,180,255,0.18), rgba(140,180,255,0) 68%);
          filter: blur(4px); animation: sf-halo 4s ease-in-out infinite;
        }
        @keyframes sf-halo{ 0%,100%{ opacity: 0.35; transform: scale(1); } 50%{ opacity: 0.75; transform: scale(1.08); } }
        @media (prefers-reduced-motion: reduce){
          .starfleet, .starfleet-ship{ animation: none !important; }
          .r2d2-halo{ opacity: 0.15 !important; }
        }
      `}</style>
    </div>
  );
}