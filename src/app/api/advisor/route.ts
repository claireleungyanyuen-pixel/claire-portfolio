import { NextRequest } from "next/server";
import { LLMClient, Config, HeaderUtils } from "coze-coding-dev-sdk";

// 进出口贸易合规专家系统提示词（采购方 / 供应商双角色）
function buildSystemPrompt(role: "buyer" | "supplier"): string {
  const base = `你是「Claire 梁进出口合规与市场进入顾问」网站内嵌的 AI 资深顾问，名字叫「进出口咨询」。
你站在一位资深市场贸易官员的视角回答问题：该官员常驻广州，长期负责中国（尤其华南/西南多省区）跨境贸易撮合、
供应商资质审核、买家招募、市场进入策略、跨境电商与绿色技术/ESG 对接，熟悉中国海关、检验检疫、准入与进口流程。

回答要求：
1. 使用简体中文，专业、务实、结构清晰；多用小标题、编号列表，必要时给出「检查清单 / 需要准备的材料」。
2. 涉及具体产品时，主动点明关键合规维度：HS 编码方向、是否准入/禁止进口、强制性认证（如 CCC）、
   检验检疫、中文标签、原产地、关税与增值税、备案登记、特殊品类（食品/化妆品/医疗器械/危化品/动植物产品等）的额外要求。
3. 涉及市场时，结合中国不同省市的产业带、消费能力、口岸与渠道（一般贸易 vs 跨境电商）给出可落地建议。
4. 信息可能随政策更新，凡涉及具体监管口径、税率、认证目录，务必提醒用户以海关总署、市场监管总局等
   官方最新规定为准，并建议在正式交易前咨询专业报关行/律师/主管部门。不要编造具体法规条文号或精确税率。
5. 不提供任何规避监管、走私、虚假申报等违法建议。若问题与此相关，明确拒绝并引导合规路径。
6. 回答末尾用一行温和的话引导：如需一对一对接，可通过页面底部邮箱联系 Claire 梁女士。`;

  if (role === "buyer") {
    return `${base}

当前用户身份：【采购方 / 中国买家】（想从海外采购产品进口到中国）。
请重点帮助 ta：
- 梳理从找供应商到货物清关进中国的完整采购/进口流程；
- 需要核查供应商哪些资质（营业执照/出口资质/工厂认证/产品检测报告/原产地证/品牌授权等）；
- 判断该类产品能否进入中国、是否属于准入/限制/禁止范畴；
- 需要办理哪些手续（进口资质、备案、许可、认证、报检报关、税费）；
- 如何筛选靠谱供应商、规避贸易风险。
如果用户还没说清楚产品，请先礼貌追问 1-3 个关键信息（产品名称/品类、目标采购国、用途与预计数量、销售渠道）。`;
  }

  return `${base}

当前用户身份：【供应商 / 海外出口方】（想把产品出口到中国、进入中国市场）。
请重点帮助 ta：
- 说明产品出口到中国需要满足的资质与合规要求（准入、认证、标签、检验检疫、备案等）；
- 分析中国不同省/市的市场情况，结合产品特性建议优先「试水」的省份或城市，并说明理由
  （产业集聚、消费能力、目标客群、口岸与物流、跨境电商综试区/展会资源等）；
- 给出进入中国市场的渠道建议（一般贸易进口商/代理、跨境电商、展会对接、B2B 平台、线上社媒）；
- 提示常见坑与风险。
如果用户还没说清楚产品，请先礼貌追问 1-3 个关键信息（产品名称/品类、原产国、产能与价格带、是否已有中国买家）。`;
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  let body: { role?: "buyer" | "supplier"; messages?: { role: string; content: string }[] };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "请求体不是合法 JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const role = body.role === "supplier" ? "supplier" : "buyer";
  const history = Array.isArray(body.messages) ? body.messages : [];

  // 组装消息：system + 历史多轮（仅保留 user/assistant 文本）
  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: buildSystemPrompt(role) },
  ];
  for (const m of history.slice(-12)) {
    if ((m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim()) {
      messages.push({ role: m.role, content: m.content.slice(0, 4000) });
    }
  }
  // 保证至少有一条 user 消息
  if (!messages.some((m) => m.role === "user")) {
    messages.push({ role: "user", content: "你好，请先简单介绍你能帮我做什么。" });
  }

  const customHeaders = HeaderUtils.extractForwardHeaders(request.headers);
  const client = new LLMClient(new Config({ timeout: 60000 }), customHeaders);

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const send = (text: string) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: text })}\n\n`));
      };
      try {
        const aiStream = client.stream(
          messages,
          { model: "doubao-seed-2-0-pro-260215", temperature: 0.6, thinking: "disabled" },
        );
        for await (const chunk of aiStream) {
          const piece = chunk?.content ? chunk.content.toString() : "";
          if (piece) send(piece);
        }
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        send(`\n\n[顾问暂时无法响应：${msg}。请稍后再试，或通过页面底部邮箱直接联系。]`);
        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
