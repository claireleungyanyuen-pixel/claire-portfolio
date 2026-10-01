"use client";

/**
 * 等距 2.5D 房子（纯 SVG，写实/动漫风细节）
 * 参考 SIM/动森等距小屋：坡屋顶 + 受光/背光面 + 山墙 + 烟囱 + 拱门拱窗 +
 * 瓦片 + 屋檐阴影 + 台阶 + 地面投影。颜色可换，屋顶支持 peaked / flat / dome。
 */

function shade(hex: string, amt: number): string {
  const h = hex.replace("#", "");
  const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  if (amt >= 0) {
    r = Math.round(r + (255 - r) * amt);
    g = Math.round(g + (255 - g) * amt);
    b = Math.round(b + (255 - b) * amt);
  } else {
    r = Math.round(r * (1 + amt));
    g = Math.round(g * (1 + amt));
    b = Math.round(b * (1 + amt));
  }
  return `rgb(${r},${g},${b})`;
}

export type RoofKind = "peaked" | "flat" | "dome";

export default function IsometricHouse({
  wall = "#f4efff",
  roof = "#b79cf0",
  roofKind = "peaked",
  width = 150,
}: {
  wall?: string;
  roof?: string;
  roofKind?: RoofKind;
  width?: number;
}) {
  const W = 200;
  const H = 200;
  const wallLight = shade(wall, 0.12);
  const wallDark = shade(wall, -0.1);
  const roofLight = shade(roof, 0.16);
  const roofDark = shade(roof, -0.22);

  return (
    <svg
      viewBox="0 0 200 200"
      width={width}
      height={width}
      style={{ display: "block", overflow: "visible", filter: "drop-shadow(0 10px 8px rgba(90,70,130,0.22))" }}
      aria-hidden
    >
      {/* 地面椭圆投影 */}
      <ellipse cx="104" cy="168" rx="72" ry="20" fill="rgba(90,70,130,0.16)" />

      {/* ===== 墙体：左(受光) + 右(背光) 两面，等距 ===== */}
      {/* 左墙面 */}
      <polygon points="56,96 100,118 100,160 56,138" fill={wallLight} stroke={shade(wall, -0.22)} strokeWidth="1.4" strokeLinejoin="round" />
      {/* 右墙面 */}
      <polygon points="152,96 100,118 100,160 152,138" fill={wallDark} stroke={shade(wall, -0.28)} strokeWidth="1.4" strokeLinejoin="round" />

      {/* 墙基/踢脚线 */}
      <polygon points="56,138 100,160 100,166 56,144" fill={shade(wall, -0.28)} opacity="0.55" />
      <polygon points="152,138 100,160 100,166 152,144" fill={shade(wall, -0.4)} opacity="0.55" />

      {/* ===== 坡屋顶（沿深度方向，前山墙 + 两坡面） ===== */}
      {roofKind === "peaked" && (
        <g>
          {/* 后坡面（远、较暗） */}
          <polygon points="50,96 100,70 158,96 152,100 100,76 56,100" fill={roofDark} stroke={shade(roof, -0.34)} strokeWidth="1.2" strokeLinejoin="round" />
          {/* 左坡面（受光） */}
          <polygon points="50,96 100,70 100,118 56,100" fill={roofLight} stroke={shade(roof, -0.2)} strokeWidth="1.4" strokeLinejoin="round" />
          {/* 右坡面（背光） */}
          <polygon points="158,96 100,70 100,118 152,100" fill={roof} stroke={shade(roof, -0.28)} strokeWidth="1.4" strokeLinejoin="round" />
          {/* 瓦片横棱（左坡面） */}
          <g stroke={shade(roof, -0.18)} strokeWidth="1" opacity="0.55">
            <line x1="63" y1="94" x2="100" y2="112" />
            <line x1="72" y1="89" x2="100" y2="103" />
            <line x1="82" y1="83" x2="100" y2="93" />
          </g>
          {/* 烟囱（右坡面） */}
          <polygon points="124,72 134,77 134,92 124,87" fill="#d98f7d" stroke="#b46f5e" strokeWidth="1.2" strokeLinejoin="round" />
          <polygon points="122,70 136,77 134,80 120,73" fill="#c97f6d" stroke="#b46f5e" strokeWidth="1" strokeLinejoin="round" />
        </g>
      )}

      {/* 平顶（带女儿墙/屋檐） */}
      {roofKind === "flat" && (
        <g>
          <polygon points="50,94 100,68 158,94 100,119" fill={roofLight} stroke={shade(roof, -0.24)} strokeWidth="1.4" strokeLinejoin="round" />
          <polygon points="50,94 100,68 100,74 50,100" fill={roofDark} opacity="0.7" />
          <polygon points="158,94 100,68 100,74 158,100" fill={shade(roof, -0.12)} opacity="0.6" />
          <line x1="100" y1="68" x2="100" y2="119" stroke={shade(roof, -0.3)} strokeWidth="1" opacity="0.5" />
        </g>
      )}

      {/* 圆顶（徽章馆/特色建筑） */}
      {roofKind === "dome" && (
        <g>
          <path d="M52,96 A48,40 0 0 1 148,96 Z" fill={roofLight} stroke={shade(roof, -0.24)} strokeWidth="1.4" />
          <path d="M100,58 A48,40 0 0 1 148,96 L100,96 Z" fill={roofDark} opacity="0.55" />
          <circle cx="100" cy="56" r="3.4" fill={shade(roof, -0.2)} />
        </g>
      )}

      {/* ===== 正面（山墙在前面，朝观察者）拱门拱窗 ===== */}
      {/* 拱门 */}
      <path d="M88 160 v-14 a12 12 0 0 1 24 0 v14 z" fill={shade(roof, -0.06)} stroke={shade(wall, -0.3)} strokeWidth="1.4" />
      <path d="M92 160 v-13 a8 8 0 0 1 16 0 v13 z" fill={shade("#6d5a9e", -0.1)} opacity="0.85" />
      <circle cx="105" cy="146" r="1.3" fill="#f2d98a" />
      {/* 台阶 */}
      <polygon points="84,162 116,162 122,166 78,166" fill="#d9d2ec" stroke="#b7aed6" strokeWidth="1" />

      {/* 左墙拱窗（受光面） */}
      <g>
        <path d="M64 132 v-10 a8 8 0 0 1 16 0 v10 z" fill="#cfe8ff" stroke={shade(wall, -0.3)} strokeWidth="1.3" />
        <line x1="72" y1="116" x2="72" y2="132" stroke="#9fc0e8" strokeWidth="1" />
        <line x1="65" y1="125" x2="79" y2="125" stroke="#9fc0e8" strokeWidth="1" />
      </g>
      {/* 右墙圆窗（背光面） */}
      <g>
        <circle cx="128" cy="120" r="9" fill="#cfe8ff" stroke={shade(wall, -0.34)} strokeWidth="1.3" />
        <line x1="128" y1="111" x2="128" y2="129" stroke="#9fc0e8" strokeWidth="1" />
        <line x1="119" y1="120" x2="137" y2="120" stroke="#9fc0e8" strokeWidth="1" />
      </g>

      {/* 墙上小圆装饰灯 */}
      <circle cx="58" cy="104" r="2" fill="#ffe6a8" stroke="#e8c873" strokeWidth="0.8" />
      <circle cx="150" cy="104" r="2" fill="#ffe6a8" stroke="#e8c873" strokeWidth="0.8" />
    </svg>
  );
}
