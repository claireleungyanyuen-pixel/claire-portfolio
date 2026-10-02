/**
 * GitHub 项目展示数据（来源：GitHub 用户 claireleungyanyuen-pixel 各仓库 README）
 * 说明：四个项目均为黑客松 / 社会创新作品，仓库暂无 homepage 与外链，
 * 故详情页按钮按需求保留为空状态（敬请期待），不提供下载。
 */

export type ProjectStatus = "prototype" | "mvp" | "concept";

export interface GithubProject {
  slug: string;
  repo: string;
  nameZh: string;
  nameEn: string;
  tagline: string;
  status: ProjectStatus;
  statusLabel: string;
  hackathon: string;
  period: string;
  mission: string;
  features: { title: string; desc: string }[];
  highlights: string[];
  accent: string;
}

export const githubProjects: GithubProject[] = [
  {
    slug: "go-go",
    repo: "Go-Go",
    nameZh: "行不行 Go?Go!",
    nameEn: "Can I Go? Go!",
    tagline: "为行动受限者生成一份「敢出门」的个性化行动清单",
    status: "prototype",
    statusLabel: "黑客松原型",
    hackathon: "AI for Social Good · SheShapes 黑客松",
    period: "社会创新 · 无障碍出行",
    mission:
      "面向轮椅使用者、助行器用户、听障人士、慢病患者与术后康复人群，回答他们出门前最关心的问题——「今天我到底行不行？」。产品沿「天气 → 对我的影响 → 我要做什么」的逻辑，把环境信息翻译成每个人可执行的个性化出行清单，让行动受限者也能安心、独立地走出家门。",
    features: [
      { title: "定制化出行清单", desc: "结合天气、无障碍条件与个人身体状况，生成当日可执行的出门行动建议。" },
      { title: "健康记录", desc: "记录日常身体状态与出行情况，为清单个性化提供长期依据。" },
      { title: "无障碍上报", desc: "用户可上报途中遇到的无障碍设施问题，互助完善出行地图。" },
      { title: "紧急求助 SOS", desc: "一键拨打 110 / 119 / 120，并在危急时刻快速通知紧急联系人。" },
      { title: "AI 问答", desc: "用自然语言询问出行与健康相关问题，获得贴合个人情况的解答。" },
      { title: "独居报平安", desc: "面向独居行动受限者，定时确认安全，异常时主动提醒联系人。" },
    ],
    highlights: ["AI for Social Good", "无障碍出行", "个性化清单", "SOS 紧急求助", "适老化"],
    accent: "#2f7de1",
  },
  {
    slug: "shesources",
    repo: "-SheSources",
    nameZh: "SheSources 她选",
    nameEn: "SheSources",
    tagline: "面向女性创业者的反向出海合规助手 · 输华资质卡生成工具",
    status: "prototype",
    statusLabel: "v0.1 原型",
    hackathon: "SheNicest 2026 黑客松",
    period: "2026 · 落地窗口：马来西亚 MIHAS Women in Export",
    mission:
      "帮助海外女性创业者把产品卖进中国市场。选定品类后，工具一键生成「输华资质卡」，清晰呈现所需资质、办理路径与材料清单，并区分跨境电商与一般贸易两条进入路径。产品定位为合规导航而非自由问答，结论结构化、可核验，避免 AI 编造合规建议；计划于 2026 年 9 月马来西亚 MIHAS Women in Export 展会对接落地。",
    features: [
      { title: "品类 → 资质卡生成", desc: "选择产品品类即可生成结构化的输华资质卡，所需证照一目了然。" },
      { title: "办理路径导航", desc: "按步骤指引资质办理流程与所需材料，降低女性创业者的合规门槛。" },
      { title: "双路径对比", desc: "并排呈现跨境电商与一般贸易两种进入方式，辅助选择最优路径。" },
      { title: "展会对接", desc: "面向 MIHAS Women in Export 等展会场景，支持现场商机与资质咨询对接。" },
    ],
    highlights: ["反向出海", "输华合规", "资质卡", "Coze 智能体原型", "女性创业", "MIHAS 2026"],
    accent: "#c0518f",
  },
  {
    slug: "enya",
    repo: "ENYA-",
    nameZh: "ENYA · 恩雅",
    nameEn: "Emergency Network for Your Assistance",
    tagline: "离线优先、女性友好的灾难应急 AI 助手",
    status: "prototype",
    statusLabel: "黑客松原型",
    hackathon: "SheNicest 2026 黑客松",
    period: "社会创新 · 灾害应急",
    mission:
      "灾难来临时基站与网络往往最先中断，女性与孕产妇、哺乳期母亲、带娃家庭又有特殊的应急需求。ENYA（Emergency Network for Your Assistance）以离线知识库为核心，在无网环境下依然可用，轻量、低功耗，聚焦女性视角的备灾、避险与灾后恢复。",
    features: [
      { title: "离线应急指南", desc: "核心知识库内置本地，断网状态下仍可查询避险、自救与物资指引。" },
      { title: "女性专属模块", desc: "覆盖生理期、孕期、哺乳期与带娃疏散等特殊场景的应对建议。" },
      { title: "紧急联系人与 SOS", desc: "预存紧急联系人，联网恢复后自动补发求助信息与位置。" },
      { title: "灾后恢复清单", desc: "灾后按清单清点物资、健康与手续，帮助家庭逐步恢复生活秩序。" },
    ],
    highlights: ["离线优先", "女性友好", "低功耗", "灾害应急", "SOS"],
    accent: "#7c5cd6",
  },
  {
    slug: "pomi",
    repo: "POMI",
    nameZh: "POMI",
    nameEn: "POMI",
    tagline: "把散落检查单，变成医生敢直接看的一页报告",
    status: "mvp",
    statusLabel: "可体验 Demo（演示数据）",
    hackathon: "软件应用赛道 · 滴水穿石",
    period: "女性健康 · 多囊卵巢综合征（PCOS）管理",
    mission:
      "多囊卵巢综合征患者长期往返多家医院，手里攒着厚厚一摞化验单，复诊时医生很难在短时间内看清趋势。POMI 把跨院、跨年份的病历材料智能整理为一份循证、可追溯的一页复诊报告：异常指标画出趋势线，每份结论都可回溯到原始单据。产品只做整理与呈现，不做诊断、不推荐用药。",
    features: [
      { title: "检验单智能识别", desc: "识别化验单、病历、处方等四类材料，自动抽取关键指标。" },
      { title: "异常指标趋势线", desc: "跨院跨年份串联同一指标，异常项以趋势线直观呈现变化。" },
      { title: "来源签署存证", desc: "每条结论标注来源医院与时间，支持回溯原始单据，保证可信。" },
      { title: "用药计划管理", desc: "帮助患者整理与跟进用药计划（仅提醒管理，不做用药建议）。" },
    ],
    highlights: ["PCOS 健康管理", "一页复诊报告", "OCR 识别", "循证可追溯", "Web + Android", "Freemium / B2B"],
    accent: "#1f9e8f",
  },
];

export function getProject(slug: string): GithubProject | undefined {
  return githubProjects.find((p) => p.slug === slug);
}
