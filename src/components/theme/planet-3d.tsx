"use client";

import { useEffect, useRef } from "react";

/**
 * 3D 行星渲染器。
 * - 优先加载「真实星球照片」贴图（/planets/*.jpg），自转采样让球体呈现真实表面；
 *   无 texture 时回退到程序化生成的噪声地表。
 * - 支持真实天文动力学：axisTilt（自转轴倾角）、spinDirection（顺/逆行，如金星）。
 * - 存在 ring 时绘制「碎石环带」：由许多可见小石块沿椭圆环缓慢公转（细腻缓慢动效）。
 */

export type PlanetType = "rocky" | "gas" | "earth" | "lava" | "ice" | "ring";

type RGB = [number, number, number];

const PALETTES: Record<PlanetType, { base: RGB[]; cloud?: boolean; band?: boolean }> = {
  rocky: { base: [[150, 110, 90], [110, 78, 60], [180, 150, 120], [90, 70, 60]] },
  gas: { base: [[210, 180, 140], [190, 150, 110], [230, 210, 180], [170, 130, 95]], band: true },
  earth: { base: [[40, 90, 160], [30, 70, 130], [70, 140, 90], [90, 160, 100]], cloud: true },
  lava: { base: [[60, 30, 30], [120, 50, 30], [220, 120, 40], [240, 180, 70]] },
  ice: { base: [[200, 220, 240], [170, 200, 230], [235, 245, 255], [150, 185, 220]], cloud: true },
  ring: { base: [[180, 160, 140], [140, 120, 105], [210, 195, 175]], band: true },
};

/** 可重复伪随机 */
function makeNoise(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** 回退：程序化生成球面纹理 */
function makeTexture(type: PlanetType, seed: number): HTMLCanvasElement {
  const W = 512;
  const H = 256;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d")!;
  const pal = PALETTES[type];
  const rand = makeNoise(seed);
  const img = ctx.createImageData(W, H);

  const GW = 64;
  const GH = 32;
  const field: number[] = [];
  for (let i = 0; i < GW * GH; i++) field.push(rand());

  const sample = (gx: number, gy: number) => {
    const x = ((gx % GW) + GW) % GW;
    const y = Math.min(GH - 1, Math.max(0, gy));
    return field[y * GW + x];
  };

  const pick = (t: number): RGB => {
    const cols = pal.base;
    return cols[Math.min(cols.length - 1, Math.floor(t * cols.length))];
  };

  for (let y = 0; y < H; y++) {
    const v = y / H;
    for (let x = 0; x < W; x++) {
      const u = x / W;
      let n = sample(Math.floor(u * GW), Math.floor(v * GH));
      if (pal.band) {
        const stripe = 0.5 + 0.5 * Math.sin(v * Math.PI * (6 + (seed % 4)) + n * 1.5);
        n = n * 0.25 + stripe * 0.75;
      }
      let col = pick(n);
      if (type === "earth") {
        const land = n > 0.56;
        col = land ? [70 + n * 40, 130 + n * 40, 80 + n * 30] : [30 + n * 30, 70 + n * 40, 140 + n * 40];
        if (v < 0.12 || v > 0.88) col = [230, 240, 250];
      }
      if (type === "lava") {
        const crack = n > 0.72;
        if (crack) col = [240, 170 + n * 60, 70];
      }
      const o = (y * W + x) * 4;
      img.data[o] = col[0];
      img.data[o + 1] = col[1];
      img.data[o + 2] = col[2];
      img.data[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  if (pal.cloud) {
    const crand = makeNoise(seed + 99);
    ctx.globalAlpha = 0.45;
    for (let i = 0; i < 80; i++) {
      const cx = crand() * W;
      const cy = crand() * H;
      const r = 12 + crand() * 34;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, "rgba(255,255,255,0.85)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(cx, cy, r * 1.6, r * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }
  return c;
}

type Tex = HTMLCanvasElement | HTMLImageElement;

interface Props {
  type: PlanetType;
  seed?: number;
  size?: number;
  spinSpeed?: number; // 自转速度（负值=逆行，如金星）
  ring?: boolean;
  atmosphere?: string;
  axisTilt?: number; // 自转轴倾角（弧度）：土星26.7° 天王星97.8°…
  spinDirection?: "prograde" | "retrograde";
  texture?: string; // 真实星球照片 URL；不传则程序化生成
}

export default function Planet3D({
  type,
  seed = 7,
  size = 200,
  spinSpeed = 0.004,
  ring = false,
  atmosphere = "rgba(150,180,255,0.5)",
  axisTilt = 0,
  spinDirection = "prograde",
  texture,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = size;
    const H = size;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = `${W}px`;
    canvas.style.height = `${H}px`;
    ctx.scale(dpr, dpr);

    // 真实贴图优先，否则程序化
    let tex: Tex | null = null;
    let imgLoading = false;
    if (texture) {
      imgLoading = true;
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        tex = img;
        imgLoading = false;
        if (!raf) {
          draw();
          if (!reduce) {
            raf = requestAnimationFrame(draw);
          }
        }
      };
      img.src = texture;
    } else {
      tex = makeTexture(type, seed);
    }

    const sphere = document.createElement("canvas");
    sphere.width = W;
    sphere.height = H;
    const sctx = sphere.getContext("2d")!;

    let ang = seed * 0.1;
    let raf = 0;
    const dir = spinDirection === "retrograde" ? -1 : 1;
    const ringSquash = Math.cos(Math.min(Math.abs(axisTilt), 1.5));
    const tiltSign = Math.sign(axisTilt) >= 0 ? 1 : -1;
    const ringTilt = 0.35 + tiltSign * Math.abs(axisTilt) * 0.6;
    // 环上碎石（每颗石头在椭圆环上的角度/半径比例，公转而自转不转）
    const pebbles = Array.from({ length: 48 }, (_, i) => ({
      a: (i / 48) * Math.PI * 2,
      rad: 1.28 + ((i * 7919) % 97) / 100 * 0.18,
      sz: 1.5 + ((i * 104729) % 40) / 12,
      alpha: 0.35 + ((i * 15485863) % 60) / 90,
    }));
    let ringAng = 0;

    const draw = () => {
      const cx = W / 2;
      const cy = H / 2;
      const r = W * 0.42;

      ctx.clearRect(0, 0, W, H);

      // 大气辉光
      const glow = ctx.createRadialGradient(cx, cy, r * 0.9, cx, cy, r * 1.35);
      glow.addColorStop(0, atmosphere);
      glow.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(cx, cy, r * 1.35, 0, Math.PI * 2);
      ctx.fill();

      // 环带（后半，用碎石绘制）
      const hasRing = ring;
      if (hasRing) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ringTilt);
        for (const p of pebbles) {
          const px = Math.cos(p.a + ringAng) * r * p.rad;
          const py = Math.sin(p.a + ringAng) * r * 0.4 * ringSquash;
          if (p.a > Math.PI || (p.a + ringAng) % (Math.PI * 2) > Math.PI) {
            ctx.fillStyle = `hsla(40,35%,70%,${p.alpha * 0.6})`;
            ctx.beginPath();
            ctx.arc(px, py, p.sz, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.restore();
      }

      // 构建球体
      if (tex) {
        const TW = (tex as HTMLCanvasElement).width || (tex as HTMLImageElement).naturalWidth;
        const TH = (tex as HTMLCanvasElement).height || (tex as HTMLImageElement).naturalHeight;
        sctx.clearRect(0, 0, W, H);
        const cols = Math.max(90, Math.floor(W));
        for (let i = 0; i < cols; i++) {
          const px = (i / cols) * W;
          const dx = (px - cx) / r;
          if (Math.abs(dx) > 1) continue;
          const lon = Math.asin(Math.max(-1, Math.min(1, dx)));
          const surfX = (((lon / Math.PI + 0.5 + ang) % 1) + 1) % 1;
          const sliceW = W / cols + 1;
          const srcX = surfX * TW;
          const light = 0.32 + 0.68 * Math.max(0, -dx * 0.6 + 0.6);
          const halfH = r * Math.sqrt(1 - dx * dx);
          sctx.globalAlpha = 1;
          sctx.drawImage(tex, srcX, 0, Math.max(2, TW / cols), TH, px, cy - halfH, sliceW, halfH * 2);
          sctx.fillStyle = `rgba(0,0,10,${1 - light})`;
          sctx.fillRect(px, cy - halfH, sliceW, halfH * 2);
        }
      }

      // 裁剪贴球
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.clip();
      if (tex) ctx.drawImage(sphere, 0, 0);
      else {
        // 无贴图时仍给一点底色
        ctx.fillStyle = "rgba(20,18,30,1)";
        ctx.fillRect(0, 0, W, H);
      }
      const rim = ctx.createRadialGradient(cx - r * 0.3, cy - r * 0.3, r * 0.2, cx, cy, r);
      rim.addColorStop(0, "rgba(255,255,255,0.1)");
      rim.addColorStop(0.7, "rgba(0,0,0,0)");
      rim.addColorStop(1, "rgba(0,0,10,0.6)");
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 环带（前半，碎石覆盖球体前）
      if (hasRing) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ringTilt);
        for (const p of pebbles) {
          const a = (p.a + ringAng) % (Math.PI * 2);
          const px = Math.cos(a) * r * p.rad;
          const py = Math.sin(a) * r * 0.4 * ringSquash;
          if (a >= Math.PI) continue;
          ctx.fillStyle = `hsla(42,38%,74%,${p.alpha})`;
          ctx.beginPath();
          ctx.arc(px, py, p.sz, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      if (!reduce) {
        ang += spinSpeed * dir;
        ringAng += spinSpeed * 0.22 * dir; // 环带碎石缓慢公转
        raf = requestAnimationFrame(draw);
      }
    };

    if (imgLoading) return; // 等 onload 后启动
    draw();
    if (!reduce) {
      raf = requestAnimationFrame(draw);
    }

    return () => {
      cancelAnimationFrame(raf);
      if (tex instanceof HTMLImageElement) tex.src = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, seed, size, spinSpeed, ring, atmosphere, axisTilt, spinDirection, texture]);

  return <canvas ref={canvasRef} style={{ width: size, height: size, display: "block" }} aria-hidden />;
}

/** 详情页：站在星球表面的立体背景（真实地表照片，清晰突出纹理） */
export function PlanetSurface({ type, seed = 7, texture }: { type: PlanetType; seed?: number; texture?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let surfTex: HTMLImageElement | null = null;
    let loaded = false;
    if (texture) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        surfTex = img;
        loaded = true;
        resize();
        draw();
      };
      img.src = texture;
    }

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      const w = canvas.width / Math.min(window.devicePixelRatio || 1, 2);
      const h = canvas.height / Math.min(window.devicePixelRatio || 1, 2);
      const groundCol: Record<PlanetType, [string, string]> = {
        rocky: ["#7a5c3f", "#201611"],
        gas: ["#c9a878", "#3a2a1c"],
        earth: ["#3f6d4e", "#101d16"],
        lava: ["#7a2e1a", "#12070a"],
        ice: ["#dceaf7", "#6f8aa6"],
        ring: ["#b9a688", "#2f2a20"],
      };
      const [g1, g2] = groundCol[type];
      const horizon = h * 0.55;

      // 天空（深色，突出地表）
      const sky = ctx.createLinearGradient(0, 0, 0, horizon);
      sky.addColorStop(0, "#04060f");
      sky.addColorStop(1, type === "ice" ? "#7fa0c4" : "#131c38");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, horizon);

      const rand = makeNoise(seed + 500);
      ctx.fillStyle = "rgba(255,255,255,0.8)";
      for (let i = 0; i < 140; i++) {
        const sx = rand() * w;
        const sy = rand() * horizon * 0.92;
        const sr = rand() * 1.5;
        ctx.globalAlpha = 0.3 + rand() * 0.7;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      // 远处大星体挂地平线
      const px = w * 0.78;
      const py = horizon - h * 0.16;
      const pr = Math.min(w, h) * 0.14;
      const pg = ctx.createRadialGradient(px - pr * 0.3, py - pr * 0.3, pr * 0.2, px, py, pr);
      pg.addColorStop(0, "rgba(220,225,245,0.9)");
      pg.addColorStop(1, "rgba(50,60,100,0.35)");
      ctx.fillStyle = pg;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();

      // 地表：真实贴图（提高清晰度）或回退渐变
      if (surfTex) {
        // 用真实贴图中部带横向拉伸铺成地表，形成站在表面的广袤视角
        const iw = surfTex.width;
        const ih = surfTex.height;
        const srcH = Math.floor(ih * 0.5); // 取中带（赤道）做地面
        const srcY = Math.floor(ih * 0.25);
        const dstH = h - horizon;
        const drawChunk = (y0: number, y1: number, srcYOff: number, alpha: number) => {
          if (!surfTex) return;
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.translate(0, y0);
          ctx.transform(1, 0, 0, (y1 - y0) / dstH, 0, 0); // 垂直透视压缩
          ctx.drawImage(surfTex, 0, srcY + srcYOff, iw, srcH, -w * 0.15, 0, w * 1.3, dstH + 40);
          ctx.restore();
        };
        drawChunk(horizon, h, 0, 1);
        // 叠加地平面雾化（远景淡蓝大气）
        const haze = ctx.createLinearGradient(0, horizon, 0, h);
        haze.addColorStop(0, "rgba(200,220,255,0.22)");
        haze.addColorStop(0.18, "rgba(0,0,0,0)");
        ctx.fillStyle = haze;
        ctx.fillRect(0, horizon, w, h - horizon);
        // 地表明暗
        const ground = ctx.createLinearGradient(0, horizon, 0, h);
        ground.addColorStop(0, "rgba(0,0,0,0)");
        ground.addColorStop(1, "rgba(0,0,0,0.55)");
        ctx.fillStyle = ground;
        ctx.fillRect(0, horizon, w, h - horizon);
      } else {
        const ground = ctx.createLinearGradient(0, horizon, 0, h);
        ground.addColorStop(0, g1);
        ground.addColorStop(1, g2);
        ctx.fillStyle = ground;
        ctx.fillRect(0, horizon, w, h - horizon);
        for (let i = 0; i < 40; i++) {
          const gx = rand() * w;
          const gy = horizon + rand() * (h - horizon);
          const gr = 10 + rand() * 60;
          ctx.fillStyle = `rgba(0,0,0,${0.05 + rand() * 0.12})`;
          ctx.beginPath();
          ctx.ellipse(gx, gy, gr * 1.6, gr * 0.4, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      // 地平线辉光
      const hl = ctx.createLinearGradient(0, horizon - 40, 0, horizon + 20);
      hl.addColorStop(0, "rgba(255,255,255,0)");
      hl.addColorStop(1, "rgba(255,255,255,0.2)");
      ctx.fillStyle = hl;
      ctx.fillRect(0, horizon - 40, w, 60);
    };

    resize();
    if (loaded) draw();
    else draw(); // 无贴图也画回退
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, seed, texture]);

  return (
    <canvas
      ref={ref}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        filter: "saturate(1.15) contrast(1.02)",
        transform: "scale(1.06)",
      }}
      aria-hidden
    />
  );
}