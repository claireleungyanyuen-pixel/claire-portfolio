"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { profile } from "@/data/profile";

type Role = "buyer" | "supplier";
type Msg = { role: "user" | "assistant"; content: string };

const QUICK: Record<Role, string[]> = {
  buyer: [
    "我想从东南亚进口燕窝/食品到中国，需要核查供应商哪些资质？",
    "进口一批化妆品，需要办理哪些手续和认证？",
    "怎么判断一个海外供应商靠不靠谱？",
  ],
  supplier: [
    "我们是马来西亚的食品企业，想出口到中国，需要什么资质？",
    "我们的产品适合先在中国哪个省份/城市试水？为什么？",
    "海外供应商进入中国市场有哪些渠道？",
  ],
};

const ROLE_META: Record<Role, { label: string; icon: string; desc: string }> = {
  buyer: { label: "采购方 · 中国买家", icon: "🛒", desc: "我想采购海外产品进口到中国" },
  supplier: { label: "供应商 · 海外出口方", icon: "🌏", desc: "我想把产品出口、卖到中国市场" },
};

/** 简易渲染：保留换行，去掉可能的 markdown 符号干扰（轻量） */
function RenderText({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i}>
          {line}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      ))}
    </>
  );
}

export default function Advisor() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const coinRef = useRef<HTMLDivElement>(null);

  const [phase, setPhase] = useState<"coin" | "typing" | "burst" | "chat">("coin");
  const [typed, setTyped] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [role, setRole] = useState<Role>("buyer");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [abort, setAbort] = useState<AbortController | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const burstTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // —— 金币随滚动进入视口触发动画序列 ——
  useEffect(() => {
    if (phase !== "coin") return;
    const el = coinRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        // 金币滚到视口中部附近时启动
        if (e.isIntersecting && e.intersectionRatio > 0.55) {
          setPhase("typing");
          io.disconnect();
        }
      },
      { threshold: [0, 0.55, 1] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [phase]);

  // —— 逐字敲出「进出口咨询」 ——
  useEffect(() => {
    if (phase !== "typing") return;
    const word = "进出口咨询";
    let i = 0;
    setTyped("");
    const tick = () => {
      i += 1;
      setTyped(word.slice(0, i));
      if (i < word.length) {
        typingTimer.current = setTimeout(tick, 260);
      } else {
        // 停留后金币放大变透明
        burstTimer.current = setTimeout(() => setPhase("burst"), 900);
      }
    };
    typingTimer.current = setTimeout(tick, 350);
    return () => {
      if (typingTimer.current) clearTimeout(typingTimer.current);
      if (burstTimer.current) clearTimeout(burstTimer.current);
    };
  }, [phase]);

  // —— 爆发后浮现聊天框 ——
  useEffect(() => {
    if (phase !== "burst") return;
    const t = setTimeout(() => {
      setPhase("chat");
      setChatOpen(true);
    }, 1100);
    return () => clearTimeout(t);
  }, [phase]);

  // 自动滚到底
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || loading) return;
      const next: Msg[] = [...messages, { role: "user", content }];
      setMessages(next);
      setInput("");
      setLoading(true);

      const controller = new AbortController();
      setAbort(controller);
      // 先插入空的助手消息
      setMessages([...next, { role: "assistant", content: "" }]);

      try {
        const res = await fetch("/api/advisor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            role,
            messages: next.map((m) => ({ role: m.role, content: m.content })),
          }),
        });
        if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n")) {
            const t = line.trim();
            if (!t.startsWith("data:")) continue;
            const payload = t.slice(5).trim();
            if (payload === "[DONE]") continue;
            try {
              const json = JSON.parse(payload) as { content?: string };
              if (json.content) {
                acc += json.content;
                setMessages([...next, { role: "assistant", content: acc }]);
              }
            } catch {
              /* ignore parse fragment */
            }
          }
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setMessages([
          ...next,
          { role: "assistant", content: `[连接中断：${msg}。请重试，或通过邮箱 ${profile.email} 直接联系。]` },
        ]);
      } finally {
        setLoading(false);
        setAbort(null);
      }
    },
    [messages, loading, role],
  );

  return (
    <section ref={sectionRef} id="advisor" className="biz-section" style={{ padding: "120px 24px 60px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}>
        <p className="biz-eyebrow" style={{ textAlign: "center" }}>AI ADVISORY · 智能咨询</p>
        <h2 className="biz-section-title" style={{ textAlign: "center" }}>
          进出口合规<span style={{ color: "var(--biz-gold)" }}>智能顾问</span>
        </h2>
        <p className="biz-section-sub" style={{ textAlign: "center", margin: "0 auto 8px" }}>
          由大语言模型驱动，7×24 小时为你解答采购流程、供应商资质、产品准入与市场进入策略
        </p>

        {/* 金币引导舞台 */}
        <div
          ref={coinRef}
          style={{
            position: "relative",
            height: 300,
            margin: "40px auto 0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <div
            className={
              phase === "typing"
                ? "biz-coin biz-coin-spin"
                : phase === "burst"
                ? "biz-coin biz-coin-burst"
                : "biz-coin"
            }
          >
            <div className="biz-coin-face">¥</div>
          </div>

          {phase !== "coin" && phase !== "burst" && (
            <div className="biz-coin-word">{typed}<span className="biz-caret">|</span></div>
          )}

          {phase === "burst" && <div className="biz-flash" />}

          {phase === "coin" && (
            <p
              style={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                color: "var(--biz-gold-dim)",
                letterSpacing: "0.3em",
                fontSize: 12,
              }}
            >
              ↓ 继续向下，唤醒进出口顾问 ↓
            </p>
          )}
        </div>

        {/* 触发 / 打开聊天按钮（金币动画后或手动） */}
        <div style={{ marginTop: 8 }}>
          <button
            onClick={() => setChatOpen(true)}
            className="biz-cta"
            style={{ borderColor: "var(--biz-gold)", color: "var(--biz-gold)" }}
          >
            <span style={{ marginRight: 8 }}>💬</span>立即咨询进出口顾问
          </button>
        </div>
      </div>

      {/* 聊天面板（模态） */}
      {chatOpen && (
        <div className="biz-chat-mask" onClick={() => setChatOpen(false)}>
          <div className="biz-chat-panel" onClick={(e) => e.stopPropagation()}>
            {/* 头部：角色切换 */}
            <div className="biz-chat-head">
              <div>
                <div style={{ fontFamily: "var(--biz-serif)", fontSize: 20, color: "var(--biz-gold)" }}>
                  进出口合规智能顾问
                </div>
                <div style={{ fontSize: 11, color: "var(--biz-muted)", marginTop: 2 }}>
                  AI ADVISOR · 由大语言模型驱动，仅供参考
                </div>
              </div>
              <button className="biz-chat-close" onClick={() => setChatOpen(false)} aria-label="关闭">
                ×
              </button>
            </div>

            <div className="biz-role-tabs">
              {(Object.keys(ROLE_META) as Role[]).map((r) => (
                <button
                  key={r}
                  className={r === role ? "biz-role-tab active" : "biz-role-tab"}
                  onClick={() => setRole(r)}
                >
                  <span style={{ marginRight: 6 }}>{ROLE_META[r].icon}</span>
                  {ROLE_META[r].label}
                </button>
              ))}
            </div>

            <div ref={scrollRef} className="biz-chat-body">
              <div className="biz-msg biz-msg-ai">
                <div className="biz-msg-avatar">AI</div>
                <div className="biz-bubble biz-bubble-ai">
                  你好，我是 Claire 梁网站的<strong>进出口合规与市场进入顾问</strong>。
                  <br />
                  当前身份：<strong>{ROLE_META[role].desc}</strong>。
                  <br />
                  请告诉我你关心的<strong>产品品类 / 目标国家 / 用途</strong>，我来为你梳理流程、资质与市场建议。
                  <div className="biz-quick">
                    {QUICK[role].map((q) => (
                      <button key={q} className="biz-quick-btn" onClick={() => send(q)} disabled={loading}>
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "biz-msg biz-msg-user" : "biz-msg biz-msg-ai"}>
                  {m.role === "assistant" && <div className="biz-msg-avatar">AI</div>}
                  <div className={m.role === "user" ? "biz-bubble biz-bubble-user" : "biz-bubble biz-bubble-ai"}>
                    {m.content ? <RenderText text={m.content} /> : <span className="biz-typing-dots"><i /><i /><i /></span>}
                  </div>
                </div>
              ))}
            </div>

            <div className="biz-chat-input">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") send(input);
                }}
                placeholder={role === "buyer" ? "例如：我想进口某类产品，需要哪些资质…" : "例如：我们的产品出口中国需要什么…"}
                disabled={loading}
              />
              {loading ? (
                <button
                  className="biz-send-btn stop"
                  onClick={() => abort?.abort()}
                >
                  停止
                </button>
              ) : (
                <button className="biz-send-btn" onClick={() => send(input)} disabled={!input.trim()}>
                  发送
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
