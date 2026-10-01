"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { profile } from "@/data/profile";
import IsometricHouse, { type RoofKind } from "./isometric-house";

/**
 * SIM 小镇地图：方向键 / WASD 控制镜头游走，Shift+拖动 或 鼠标拖动转身/平移；
 * 房子按类别（简介 / 工作经历 / 项目经历 / 资质 / 语言 / 联系）分布，点击查看内容。
 */

type Lot = {
  id: string;
  cat: string;
  title: string;
  sub: string;
  color: string; // 屋顶色
  wall: string; // 墙面色
  roof: RoofKind;
  x: number;
  y: number;
  w: number;
  h: number;
  body: React.ReactNode;
};

const HOUSE_COLORS = ["#b79cf0", "#f0b0c9", "#9fd0f0", "#f6c98a", "#a8e6c4", "#e6b3f0"];
const WALL_COLORS = ["#f4efff", "#fff2f8", "#f0f8ff", "#fffaf0", "#f2fbf5", "#faf2ff"];

function House({ lot, onOpen }: { lot: Lot; onOpen: (l: Lot) => void }) {
  return (
    <button
      onClick={() => onOpen(lot)}
      className="sim-house"
      style={{
        position: "absolute",
        left: lot.x,
        top: lot.y,
        width: lot.w,
        height: lot.w + 30,
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: 0,
      }}
      aria-label={lot.title}
    >
      {/* 等距 3D 房子 */}
      <div style={{ width: lot.w, height: lot.w, filter: "drop-shadow(0 6px 6px rgba(120,90,170,0.18))" }}>
        <IsometricHouse wall={lot.wall} roof={lot.color} roofKind={lot.roof} width={lot.w} />
      </div>
      {/* 名牌 */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          whiteSpace: "nowrap",
          fontSize: 12,
          fontWeight: 700,
          color: "var(--color-ink)",
          background: "rgba(255,255,255,0.9)",
          padding: "3px 12px",
          borderRadius: 999,
          border: "1.5px solid rgba(150,120,200,0.35)",
          boxShadow: "0 3px 8px rgba(120,90,170,0.15)",
        }}
      >
        {lot.title}
      </div>
    </button>
  );
}

/** 中央站立的 SIM 小人（背身简化：西装+卷发+晶锥） */
function TownMe() {
  return (
    <div style={{ position: "relative", width: 60, height: 90, transform: "translate(-50%,-90%)" }}>
      <div style={{ position: "absolute", left: "50%", top: -26, transform: "translateX(-50%)" }}>
        <svg width="20" height="30" viewBox="0 0 40 56">
          <polygon points="20,2 34,22 20,54 6,22" fill="url(#pb2)" stroke="rgba(255,255,255,0.7)" strokeWidth="1.2" />
          <defs>
            <linearGradient id="pb2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#bff0a0" /><stop offset="100%" stopColor="#3f9e4d" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      <svg width="60" height="90" viewBox="0 0 90 150">
        <ellipse cx="45" cy="146" rx="20" ry="5" fill="rgba(90,60,140,0.18)" />
        <rect x="36" y="96" width="8" height="32" rx="4" fill="#f2c9a8" />
        <rect x="47" y="96" width="8" height="32" rx="4" fill="#f2c9a8" />
        <path d="M30 72 h32 l5 26 a3 3 0 0 1 -3 4 H28 a3 3 0 0 1 -3 -4 z" fill="#fff" stroke="#e7d9f5" strokeWidth="1.5" />
        <path d="M28 44 h36 l3 32 a4 4 0 0 1 -4 4 H29 a4 4 0 0 1 -4 -4 z" fill="#8b8f9c" />
        <circle cx="46" cy="24" r="15" fill="#2e2636" />
        <path d="M33 22 c-3 8 -3 18 0 26 M59 22 c3 8 3 18 0 26" stroke="#2e2636" strokeWidth="6" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export default function SimTown() {
  const WORLD_W = 1600;
  const WORLD_H = 2200;
  const [cam, setCam] = useState({ x: 400, y: 500 }); // 世界坐标（小人所在位置）
  const [open, setOpen] = useState<Lot | null>(null);
  const keys = useRef<Record<string, boolean>>({});
  const dragging = useRef(false);
  const lastDrag = useRef({ x: 0, y: 0 });
  const raf = useRef(0);

  // 构造地块
  const lots: Lot[] = [];
  const pushLot = (
    l: Omit<Lot, "color" | "wall" | "roof"> & { color?: string; wall?: string; roof?: RoofKind },
    i: number,
  ) => {
    const roofCycle: RoofKind[] = ["peaked", "flat", "dome"];
    lots.push({
      ...l,
      color: l.color ?? HOUSE_COLORS[i % HOUSE_COLORS.length],
      wall: l.wall ?? WALL_COLORS[i % WALL_COLORS.length],
      roof: l.roof ?? roofCycle[i % roofCycle.length],
    } as Lot);
  };

  // 个人简介（中央大屋）
  pushLot(
    {
      id: "about",
      cat: "个人简介",
      title: "我的家",
      sub: "ABOUT",
      x: 680,
      y: 240,
      w: 240,
      h: 150,
      color: "#a988e6",
      roof: "peaked",
      body: (
        <div>
          <p style={{ lineHeight: 1.8 }}>{profile.about.paragraphsZh[0]}</p>
          <p style={{ lineHeight: 1.8, marginTop: 10, opacity: 0.85 }}>{profile.about.paragraphsZh[1]}</p>
        </div>
      ),
    },
    0,
  );

  // 工作经历（一排房子）
  profile.experience.items.forEach((e, i) => {
    pushLot(
      {
        id: `exp-${i}`,
        cat: "工作经历",
        title: e.roleZh,
        sub: e.period,
        x: 120 + (i % 3) * 480,
        y: 560 + Math.floor(i / 3) * 360,
        w: 200,
        h: 120,
        body: (
          <div>
            <div style={{ fontSize: 13, color: "var(--color-violet)", fontWeight: 700, marginBottom: 6 }}>{e.period}</div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{e.roleZh}</div>
            <div style={{ fontSize: 12, opacity: 0.7, marginBottom: 8 }}>{e.orgZh}</div>
            <ul style={{ paddingLeft: 18, lineHeight: 1.7, fontSize: 14 }}>
              {e.pointsZh.slice(0, 3).map((p, j) => (
                <li key={j}>{p}</li>
              ))}
            </ul>
          </div>
        ),
      },
      i + 1,
    );
  });

  // 项目经历（另一区）
  profile.projects.items.forEach((p, i) => {
    pushLot(
      {
        id: `proj-${i}`,
        cat: "项目经历",
        title: p.nameZh,
        sub: p.period,
        x: 120 + (i % 3) * 480,
        y: 1380 + (i % 2) * 300,
        w: 200,
        h: 120,
        color: "#f0b0c9",
        roof: "peaked",
        body: (
          <div>
            <div style={{ fontSize: 13, color: "var(--color-violet)", fontWeight: 700, marginBottom: 6 }}>
              {p.period} · {p.role}
            </div>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{p.nameZh}</div>
            <p style={{ lineHeight: 1.7, fontSize: 14 }}>{p.descZh}</p>
          </div>
        ),
      },
      i,
    );
  });

  // 资质证书（徽章塔）
  pushLot(
    {
      id: "certs",
      cat: "资质证书",
      title: "徽章馆",
      sub: "CERTIFICATES",
      x: 1300,
      y: 760,
      w: 220,
      h: 150,
      color: "#f6c98a",
      roof: "dome",
      body: (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {profile.certifications.items.map((c, i) => (
            <span
              key={i}
              style={{
                fontSize: 12,
                padding: "4px 10px",
                borderRadius: 999,
                background: "rgba(169,136,230,0.14)",
                border: "1.5px solid rgba(169,136,230,0.4)",
                color: "var(--color-violet)",
                fontWeight: 700,
              }}
            >
              🏅 {c}
            </span>
          ))}
        </div>
      ),
    },
    4,
  );

  // 语言能力
  pushLot(
    {
      id: "lang",
      cat: "语言能力",
      title: "语言亭",
      sub: "LANGUAGES",
      x: 1300,
      y: 1080,
      w: 200,
      h: 120,
      color: "#a8e6c4",
      roof: "flat",
      body: (
        <div style={{ width: "100%" }}>
          {profile.languages.map((l, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 14, fontWeight: 700 }}>
                <span>{l.name}</span>
                <span style={{ opacity: 0.6 }}>{l.level}</span>
              </div>
              <div style={{ height: 8, borderRadius: 99, background: "rgba(169,136,230,0.15)", marginTop: 4, overflow: "hidden" }}>
                <div
                  style={{
                    height: "100%",
                    width: `${l.pct}%`,
                    background: "linear-gradient(90deg,var(--color-lilac),var(--color-violet))",
                    borderRadius: 99,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ),
    },
    5,
  );

  // 联系（市政厅）
  pushLot(
    {
      id: "contact",
      cat: "联系我",
      title: "联络站",
      sub: "CONTACT",
      x: 700,
      y: 1860,
      w: 240,
      h: 150,
      color: "#9fd0f0",
      roof: "flat",
      body: (
        <div style={{ textAlign: "center", width: "100%" }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>很高兴在小镇遇见你</div>
          <a
            href={`mailto:${profile.email}`}
            style={{
              display: "inline-block",
              background: "var(--color-violet)",
              color: "#fff",
              padding: "10px 22px",
              borderRadius: 999,
              fontWeight: 700,
              textDecoration: "none",
              marginBottom: 12,
            }}
          >
            ✉ {profile.email}
          </a>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", marginTop: 6, flexWrap: "wrap" }}>
            {profile.contact.socials
              .filter((s) => s.href.startsWith("http"))
              .map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" style={{ color: "var(--color-violet)", fontWeight: 700, fontSize: 13 }}>
                  {s.label}
                </a>
              ))}
          </div>
        </div>
      ),
    },
    6,
  );

  // 键盘控制镜头
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", "w", "a", "s", "d", " "].includes(k)) {
        keys.current[k] = true;
      }
    };
    const up = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useEffect(() => {
    const speed = 7;
    const loop = () => {
      const k = keys.current;
      setCam((c) => {
        let { x, y } = c;
        if (k["arrowup"] || k["w"]) y -= speed;
        if (k["arrowdown"] || k["s"]) y += speed;
        if (k["arrowleft"] || k["a"]) x -= speed;
        if (k["arrowright"] || k["d"]) x += speed;
        x = Math.max(120, Math.min(WORLD_W - 120, x));
        y = Math.max(200, Math.min(WORLD_H - 200, y));
        return { x, y };
      });
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf.current);
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragging.current = true;
    lastDrag.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  }, []);
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastDrag.current.x;
    const dy = e.clientY - lastDrag.current.y;
    lastDrag.current = { x: e.clientX, y: e.clientY };
    // Shift+拖动 = 转身（这里体现为更快的平移）；普通拖动 = 移动
    const factor = e.shiftKey ? 2.2 : 1.4;
    setCam((c) => ({
      x: Math.max(120, Math.min(WORLD_W - 120, c.x - dx * factor)),
      y: Math.max(200, Math.min(WORLD_H - 200, c.y - dy * factor)),
    }));
  }, []);
  const onPointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  return (
    <section className="sim-town-section" style={{ position: "relative", paddingTop: 20 }}>
      <div style={{ textAlign: "center", marginBottom: 16 }}>
        <p
          style={{
            display: "inline-block",
            fontFamily: "var(--font-mono)",
            fontSize: 11,
            letterSpacing: "0.3em",
            color: "var(--color-violet)",
            background: "rgba(255,255,255,0.7)",
            border: "1.5px solid rgba(169,136,230,0.4)",
            borderRadius: 999,
            padding: "6px 16px",
          }}
        >
          MY NEIGHBORHOOD · 我的小镇
        </p>
        <p style={{ fontSize: 13, color: "var(--color-ink)", opacity: 0.7, marginTop: 10 }}>
          方向键 / WASD 游走 · 拖动移动视角（Shift+拖动更快 / 手机上单指拖动）· 点击房子参观
        </p>
      </div>

      <div
        style={{
          position: "relative",
          height: "70vh",
          minHeight: 480,
          borderRadius: 24,
          overflow: "hidden",
          border: "2px solid rgba(169,136,230,0.4)",
          boxShadow: "0 20px 50px rgba(120,90,170,0.2)",
          background: "linear-gradient(180deg, #d9f0d0 0%, #c7e8c0 40%, #bfe0b4 100%)",
          cursor: "grab",
          touchAction: "none",
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* 世界层：小人固定视口中心，世界随镜头反向平移 */}
        <div
          style={{
            position: "absolute",
            width: WORLD_W,
            height: WORLD_H,
            left: "50%",
            top: "55%",
            transform: `translate(-50%,-55%) translate(${WORLD_W / 2 - cam.x}px, ${WORLD_H / 2 - cam.y}px)`,
            willChange: "transform",
          }}
        >
          {/* 道路网格：横向 + 纵向道路 */}
          <div style={{ position: "absolute", inset: 0 }}>
            {[500, 900, 1300, 1700].map((y) => (
              <div
                key={y}
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: y,
                  height: 70,
                  background: "rgba(180,170,200,0.55)",
                  borderTop: "3px dashed rgba(255,255,255,0.8)",
                  borderBottom: "3px dashed rgba(255,255,255,0.8)",
                }}
              />
            ))}
            {[560, 1040].map((x) => (
              <div
                key={x}
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: x,
                  width: 70,
                  background: "rgba(180,170,200,0.45)",
                  borderLeft: "3px dashed rgba(255,255,255,0.8)",
                  borderRight: "3px dashed rgba(255,255,255,0.8)",
                }}
              />
            ))}
            {/* 装饰：树、花坛 */}
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={`tree-${i}`}
                style={{
                  position: "absolute",
                  left: (i * 137) % WORLD_W,
                  top: (i * 211) % WORLD_H,
                  fontSize: 30,
                  opacity: 0.85,
                  filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.1))",
                }}
              >
                🌳
              </div>
            ))}
            {Array.from({ length: 16 }).map((_, i) => (
              <div
                key={`flower-${i}`}
                style={{
                  position: "absolute",
                  left: (i * 193 + 60) % WORLD_W,
                  top: (i * 271 + 40) % WORLD_H,
                  fontSize: 18,
                }}
              >
                🌸
              </div>
            ))}
          </div>

          {/* 地块 */}
          {lots.map((l) => (
            <House key={l.id} lot={l} onOpen={setOpen} />
          ))}
        </div>

        {/* 中央小人（固定在视口中心，世界围绕移动） */}
        <div style={{ position: "absolute", left: "50%", top: "55%", zIndex: 5, pointerEvents: "none" }}>
          <TownMe />
        </div>

        {/* 小地图 */}
        <div
          style={{
            position: "absolute",
            right: 14,
            bottom: 14,
            width: 120,
            height: 150,
            background: "rgba(255,255,255,0.8)",
            border: "2px solid rgba(169,136,230,0.5)",
            borderRadius: 12,
            zIndex: 6,
          }}
        >
          <div
            style={{
              position: "absolute",
              left: `${(cam.x / WORLD_W) * 100}%`,
              top: `${(cam.y / WORLD_H) * 100}%`,
              width: 8,
              height: 8,
              marginLeft: -4,
              marginTop: -4,
              borderRadius: "50%",
              background: "var(--color-violet)",
              boxShadow: "0 0 0 3px rgba(169,136,230,0.3)",
            }}
          />
        </div>
      </div>

      {/* 房子内容弹窗 */}
      {open && (
        <div
          onClick={() => setOpen(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(60,40,90,0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="sim-panel"
            style={{
              maxWidth: 560,
              width: "100%",
              maxHeight: "78vh",
              overflowY: "auto",
              padding: 28,
              borderRadius: 22,
              background: "rgba(255,255,255,0.96)",
            }}
          >
            <div
              style={{
                display: "inline-block",
                fontSize: 11,
                fontFamily: "var(--font-mono)",
                letterSpacing: "0.2em",
                color: "var(--color-violet)",
                background: "rgba(169,136,230,0.14)",
                padding: "3px 10px",
                borderRadius: 999,
                marginBottom: 10,
              }}
            >
              {open.cat}
            </div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--color-ink)", marginBottom: 4 }}>
              {open.title}
            </h3>
            <div style={{ fontSize: 13, opacity: 0.6, marginBottom: 16 }}>{open.sub}</div>
            <div style={{ color: "var(--color-ink)", lineHeight: 1.7 }}>{open.body}</div>
            <button
              onClick={() => setOpen(null)}
              style={{
                marginTop: 20,
                background: "var(--color-violet)",
                color: "#fff",
                border: "none",
                borderRadius: 999,
                padding: "10px 24px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              回到小镇
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
