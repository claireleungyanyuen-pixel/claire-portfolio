"use client";

/**
 * SIM 风格「小人趴框聊天」面板：
 * 一排 SIM 小人趴在面板上沿、双腿摆动，用聊天气泡展示语言能力（替代分值进度条）。
 */

function Pal({ color, delay }: { color: string; delay: number }) {
  return (
    <div style={{ position: "relative", width: 40, height: 44, flex: "none" }}>
      {/* 头 */}
      <div
        className="pal-head"
        style={{
          width: 26,
          height: 26,
          borderRadius: "50%",
          background: "#f7d4b6",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
          border: "2px solid rgba(120,90,170,0.25)",
          animation: `palKick 1.1s ease-in-out ${delay}s infinite`,
        }}
      >
        {/* 头发/帽子色块 */}
        <div style={{ position: "absolute", top: -4, left: "50%", transform: "translateX(-50%)", width: 22, height: 12, background: color, borderRadius: "11px 11px 4px 4px" }} />
        {/* 笑眼 */}
        <span style={{ position: "absolute", top: 10, left: 6, width: 5, height: 3, borderBottom: "2px solid #4a3a55", borderRadius: "0 0 5px 5px" }} />
        <span style={{ position: "absolute", top: 10, right: 6, width: 5, height: 3, borderBottom: "2px solid #4a3a55", borderRadius: "0 0 5px 5px" }} />
      </div>
      {/* 两条摆动的腿（趴在框上，腿垂在框外侧） */}
      <div
        className="pal-leg"
        style={{
          position: "absolute",
          top: 30,
          left: 12,
          width: 6,
          height: 16,
          background: color,
          borderRadius: 3,
          transformOrigin: "top center",
          animation: `palSwing 1.1s ease-in-out ${delay}s infinite`,
        }}
      />
      <div
        className="pal-leg"
        style={{
          position: "absolute",
          top: 30,
          right: 12,
          width: 6,
          height: 16,
          background: color,
          borderRadius: 3,
          transformOrigin: "top center",
          animation: `palSwing 1.1s ease-in-out ${delay + 0.15}s infinite`,
        }}
      />
    </div>
  );
}

export default function PalsChat({
  title,
  messages,
}: {
  title: string;
  messages: { who: string; color: string; text: string }[];
}) {
  const pals = [
    { color: "#a988e6", delay: 0 },
    { color: "#f0a8c4", delay: 0.2 },
    { color: "#7fc4f0", delay: 0.4 },
    { color: "#f0c068", delay: 0.1 },
    { color: "#8fd9b0", delay: 0.3 },
  ];

  return (
    <div className="sim-panel" style={{ padding: 0, overflow: "visible", position: "relative", marginTop: 18 }}>
      {/* 趴在框上的小人 */}
      <div
        style={{
          position: "absolute",
          top: -26,
          left: 18,
          right: 18,
          display: "flex",
          justifyContent: "space-between",
          zIndex: 3,
          pointerEvents: "none",
        }}
      >
        {pals.map((p, i) => (
          <Pal key={i} color={p.color} delay={p.delay} />
        ))}
      </div>

      <div style={{ padding: "28px 22px 22px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
          <span className="plumbob-float" aria-hidden>
            <span className="plumbob plumbob-top block" style={{ borderLeftWidth: 5, borderRightWidth: 5, borderBottomWidth: 8 }} />
          </span>
          <h3 style={{ fontFamily: "var(--font-mono)", fontSize: 12, fontWeight: 700, letterSpacing: "0.2em", color: "var(--color-ink)" }}>
            {title}
          </h3>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {messages.map((m, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                flexDirection: i % 2 === 0 ? "row" : "row-reverse",
              }}
            >
              <div
                style={{
                  flex: "none",
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: m.color,
                  color: "#fff",
                  display: "grid",
                  placeItems: "center",
                  fontSize: 13,
                  fontWeight: 800,
                  border: "2px solid rgba(255,255,255,0.7)",
                }}
              >
                {m.who.slice(0, 1)}
              </div>
              <div
                style={{
                  background: i % 2 === 0 ? "rgba(169,136,230,0.14)" : "rgba(127,196,240,0.16)",
                  border: `1.5px solid ${m.color}55`,
                  borderRadius: 14,
                  padding: "9px 14px",
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: "var(--color-ink)",
                  maxWidth: "82%",
                }}
              >
                <span style={{ fontWeight: 800, marginRight: 6, color: m.color }}>{m.who}</span>
                {m.text}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes palSwing { 0%,100% { transform: rotate(18deg); } 50% { transform: rotate(-18deg); } }
        @keyframes palKick { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
      `}</style>
    </div>
  );
}
