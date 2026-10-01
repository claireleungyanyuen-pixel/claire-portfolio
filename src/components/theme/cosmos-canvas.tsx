"use client";

/* 宇宙星图背景画布（水平螺旋星系视角，参考银河生成图/短视频）：
   - 深邃星空：闪烁星点
   - 一条纵贯屏幕中央地平线的「螺旋银河旋臂」：S 形涡旋粒子，整体缓慢绕核旋转、向中心缓慢流动
   - 旋臂中央亮核 + 上方竖直的银河辉光（dust lane）
   - 相机缓慢推进（粒子缓慢径向漂移）
   - 银河沙砾河：鼠标拖过会把旋臂上的发光微粒像拨水面一样推开、再弹簧回弹
   - 流星鼠标：跟随光标带闪光尾巴，快速移动拖尾更长
   2D canvas 粒子系统；reduced-motion 下降级为静态。 */

import { useEffect, useRef } from "react";

interface Grain {
  // 极坐标（相对星系中心）
  a: number; // 角度
  r: number; // 半径
  // 挤压为水平星系盘面（椭圆）
  squash: number;
  size: number;
  hue: number;
  sat: number;
  isStone: boolean;
  light: number;
  tw: number;
  tws: number;
  speed: number; // 绕转角速度
  drift: number; // 向中心流动速度
  // 鼠标拨开
  ox: number;
  oy: number;
  vx: number;
  vy: number;
  depth: number; // 0..1 用于视差推进
}

interface Star {
  x: number;
  y: number;
  r: number;
  tw: number;
  tws: number;
  depth: number;
}

interface TrailBit {
  x: number;
  y: number;
  life: number;
  max: number;
  size: number;
  hue: number;
}

export function CosmosCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    let stars: Star[] = [];
    let grains: Grain[] = [];
    let trail: TrailBit[] = [];

    const mouse = { x: -9999, y: -9999, px: -9999, py: -9999, speed: 0, active: false };
    let raf = 0;
    let running = true;
    let t = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    const build = () => {
      const isMobile = w < 768;
      // ---- 星空（全屏，含视差深度）----
      const starCount = isMobile ? 150 : 300;
      stars = Array.from({ length: starCount }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.2,
        tw: Math.random() * Math.PI * 2,
        tws: 0.004 + Math.random() * 0.02,
        depth: Math.random(),
      }));

      // ---- 螺旋银河旋臂：金沙 / 石沙颗粒 ----
      // 颗粒集中贴着旋臂盘面（窄散度），大小差异明显，暖金主调 + 少量冷石沙
      const grainCount = isMobile ? 360 : 780;
      grains = [];
      const arms = 2; // 两条主旋臂
      const maxR = Math.max(w, h) * 0.62; // 收敛半径：沙砾贴近中央旋臂，不铺太远
      const SQUASH = isMobile ? 0.34 : 0.3; // 盘面压扁成水平星系
      for (let i = 0; i < grainCount; i++) {
        // 让粒子更集中在中心：半径用平方分布
        const rr = Math.pow(Math.random(), 1.5) * maxR;
        const arm = i % arms;
        // 螺旋方程：角度随半径收紧（对数螺旋）
        const armOffset = (arm / arms) * Math.PI * 2;
        const wind = (rr / maxR) * 3.4; // 缠绕程度
        // 贴臂：散度收窄，让沙砾像堆积在旋臂脊线上
        const spread = 0.06 + (rr / maxR) * 0.22;
        const a = armOffset + wind + (Math.random() - 0.5) * spread;

        // 颜色：以金沙为主（暖金/米金/古铜），少量冷石沙（蓝灰/紫灰）
        const nearCore = 1 - rr / maxR;
        let hue: number;
        let sat: number;
        const cPick = Math.random();
        if (cPick < 0.62) {
          // 金沙：暖金 → 米金
          hue = 34 + Math.random() * 18;
          sat = 78 + Math.random() * 18;
        } else if (cPick < 0.8) {
          // 古铜 / 琥珀
          hue = 24 + Math.random() * 12;
          sat = 60 + Math.random() * 20;
        } else if (cPick < 0.94) {
          // 冷石沙：蓝灰
          hue = 218 + Math.random() * 30;
          sat = 26 + Math.random() * 26;
        } else {
          // 少量银白亮点
          hue = 42;
          sat = 18 + Math.random() * 20;
        }

        // 大小有明显差异：大量细沙 + 少量较大的石砾（幂律）
        const big = Math.random() < 0.12;
        const size = big
          ? 2.4 + Math.pow(Math.random(), 1.4) * 3.4 + nearCore * 1.2 // 大石砾
          : 0.35 + Math.pow(Math.random(), 1.6) * 1.7 + nearCore * 0.5; // 细沙
        // 石砾比细沙更不透明、更不闪（质感），金沙更亮
        const isStone = big;

        grains.push({
          a,
          r: rr,
          squash: SQUASH + (Math.random() - 0.5) * 0.05,
          size,
          hue,
          sat,
          isStone,
          light: 58 + nearCore * 28 + Math.random() * 9,
          tw: Math.random() * Math.PI * 2,
          tws: isStone ? 0.004 + Math.random() * 0.012 : 0.012 + Math.random() * 0.05,
          speed: 0.05 / (0.35 + rr / maxR), // 内快外慢（较差自转）
          drift: 0.02 + Math.random() * 0.05,
          ox: 0,
          oy: 0,
          vx: 0,
          vy: 0,
          depth: Math.random(),
        });
      }
    };

    const onMove = (e: PointerEvent) => {
      mouse.px = mouse.x;
      mouse.py = mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      const dx = mouse.x - mouse.px;
      const dy = mouse.y - mouse.py;
      mouse.speed = Math.hypot(dx, dy);
      const n = Math.min(6, 2 + Math.floor(mouse.speed / 12));
      for (let i = 0; i < n; i++) {
        trail.push({
          x: mouse.x + (Math.random() - 0.5) * 4,
          y: mouse.y + (Math.random() - 0.5) * 4,
          life: 0,
          max: 26 + Math.random() * 26,
          size: Math.random() * 2.4 + 0.6,
          hue: 200 + Math.random() * 90,
        });
      }
      if (trail.length > 220) trail.splice(0, trail.length - 220);
    };
    const onLeave = () => {
      mouse.active = false;
      mouse.x = mouse.y = -9999;
    };

    const R = 100;
    const R2 = R * R;

    const frame = () => {
      if (!running) return;
      t += 1;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h * 0.52; // 星系核（地平线）略偏下

      // ---- 背景深空渐变 ----
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, "#05060f");
      bg.addColorStop(0.45, "#070a1c");
      bg.addColorStop(0.52, "#0c1030");
      bg.addColorStop(1, "#04050c");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // ---- 星空（更灵动的一闪一闪，大星带十字光芒，呼应全息屏星空）----
      for (const s of stars) {
        s.tw += s.tws;
        const a = reduced ? 0.5 : 0.22 + Math.abs(Math.sin(s.tw)) * 0.74;
        const flicker = reduced ? 1 : 1 + Math.sin(s.tw * 1.7) * 0.12;
        const cr = s.r * flicker;
        ctx.beginPath();
        ctx.arc(s.x, s.y, cr, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(222, 80%, 90%, ${a})`;
        ctx.fill();
        // 稍大的亮星：十字光芒（Holographic 屏闪质感），仅在闪烁峰值附近浮现
        if (!reduced && s.r > 0.85 && a > 0.6) {
          const ray = s.r * 4.2;
          ctx.strokeStyle = `hsla(210, 95%, 92%, ${(a - 0.6) * 1.4})`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(s.x - ray, s.y);
          ctx.lineTo(s.x + ray, s.y);
          ctx.moveTo(s.x, s.y - ray);
          ctx.lineTo(s.x, s.y + ray);
          ctx.stroke();
        }
      }

      // ---- 上方竖直银河辉光（dust lane）----
      const vertical = ctx.createLinearGradient(cx, 0, cx, cy);
      vertical.addColorStop(0, "hsla(232,70%,60%,0)");
      vertical.addColorStop(0.55, "hsla(250,70%,62%,0.10)");
      vertical.addColorStop(1, "hsla(45,90%,82%,0.22)");
      ctx.save();
      ctx.filter = "blur(18px)";
      ctx.fillStyle = vertical;
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.16, 0);
      ctx.lineTo(cx + w * 0.16, 0);
      ctx.lineTo(cx + w * 0.05, cy);
      ctx.lineTo(cx - w * 0.05, cy);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // ---- 旋臂亮核辉光 ----
      const core = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.5);
      core.addColorStop(0, "hsla(40,100%,92%,0.55)");
      core.addColorStop(0.18, "hsla(38,95%,78%,0.28)");
      core.addColorStop(0.45, "hsla(262,85%,66%,0.12)");
      core.addColorStop(1, "hsla(240,80%,50%,0)");
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(1, 0.42);
      ctx.translate(-cx, -cy);
      ctx.fillStyle = core;
      ctx.fillRect(0, 0, w, h * 2);
      ctx.restore();

      // ---- 螺旋旋臂粒子 ----
      const slow = reduced ? 0 : 1;
      for (const p of grains) {
        if (!reduced) {
          p.a += p.speed * 0.004 * slow; // 缓慢绕转
          p.r -= p.drift * 0.02; // 缓慢向心流动
          if (p.r < 8) p.r = Math.max(w, h) * 0.62; // 回收
          p.tw += p.tws;
        }

        // 相机缓慢推进：整体半径随时间轻微呼吸
        const push = reduced ? 1 : 1 + Math.sin(t * 0.0012 + p.depth * 6.28) * 0.012;
        const rr = p.r * push;
        let x = cx + Math.cos(p.a) * rr;
        let y = cy + Math.sin(p.a) * rr * p.squash;

        // 鼠标拨开（弹簧回弹）
        if (!reduced) {
          const curX = x + p.ox;
          const curY = y + p.oy;
          p.vx += (x - curX) * 0.02;
          p.vy += (y - curY) * 0.02;
          if (mouse.active) {
            const ddx = curX - mouse.x;
            const ddy = curY - mouse.y;
            const d2 = ddx * ddx + ddy * ddy;
            if (d2 < R2 && d2 > 0.01) {
              const d = Math.sqrt(d2);
              const force = (1 - d / R) * 2.6;
              p.vx += (ddx / d) * force;
              p.vy += (ddy / d) * force * 0.7;
            }
          }
          p.vx *= 0.9;
          p.vy *= 0.9;
          p.ox += p.vx;
          p.oy += p.vy;
          x += p.ox;
          y += p.oy;
        }

        const nearCore = 1 - Math.min(1, p.r / (Math.max(w, h) * 0.62));
        if (p.isStone) {
          // —— 大石砾：带受光面/暗面的颗粒质感（像被银河核光照亮的石子）——
          const twinkle = reduced ? 1 : 0.9 + Math.abs(Math.sin(p.tw)) * 0.1;
          const s = p.size;
          // 暗面主体
          const g = ctx.createRadialGradient(
            x - s * 0.32,
            y - s * 0.34,
            s * 0.1,
            x,
            y,
            s
          );
          g.addColorStop(0, `hsla(${p.hue}, ${p.sat}%, ${Math.min(88, p.light + 18)}%, ${0.95 * twinkle})`);
          g.addColorStop(0.55, `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${0.85 * twinkle})`);
          g.addColorStop(1, `hsla(${p.hue}, ${Math.max(18, p.sat - 30)}%, ${Math.max(26, p.light - 30)}%, ${0.7 * twinkle})`);
          ctx.beginPath();
          ctx.arc(x, y, s, 0, Math.PI * 2);
          ctx.fillStyle = g;
          ctx.shadowColor = `hsla(${p.hue}, 90%, 70%, 0.55)`;
          ctx.shadowBlur = 6 + nearCore * 6;
          ctx.fill();
          ctx.shadowBlur = 0;
        } else {
          // —— 细金沙：明亮发光小点，轻微闪烁 ——
          const glow = reduced ? 1 : 0.62 + Math.abs(Math.sin(p.tw)) * 0.38;
          const alpha = (0.34 + nearCore * 0.58) * glow;
          ctx.beginPath();
          ctx.arc(x, y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.light}%, ${Math.min(1, alpha)})`;
          if (nearCore > 0.45 || Math.random() < 0.012) {
            ctx.shadowColor = `hsla(${p.hue}, 95%, 72%, 0.9)`;
            ctx.shadowBlur = 4 + nearCore * 7;
          }
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }

      // ---- 流星尾巴 ----
      for (let i = trail.length - 1; i >= 0; i--) {
        const b = trail[i];
        b.life++;
        if (b.life >= b.max) {
          trail.splice(i, 1);
          continue;
        }
        const tt = b.life / b.max;
        const a = (1 - tt) * (1 - tt);
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.size * (1 - tt * 0.5), 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${b.hue}, 95%, 84%, ${a})`;
        ctx.shadowColor = `hsla(${b.hue}, 95%, 75%, ${a})`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ---- 流星头部 ----
      if (mouse.active) {
        const g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 16);
        g.addColorStop(0, "hsla(0,0%,100%,0.95)");
        g.addColorStop(0.4, "hsla(230,90%,80%,0.5)");
        g.addColorStop(1, "hsla(230,90%,80%,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 16, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    };

    resize();
    frame();
    if (reduced) {
      running = false;
      cancelAnimationFrame(raf);
    }

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    document.addEventListener("pointerleave", onLeave);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
