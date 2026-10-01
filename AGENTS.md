# 项目上下文

### 版本技术栈

- **Framework**: Next.js 16 (App Router)
- **Core**: React 19
- **Language**: TypeScript 5
- **UI 组件**: shadcn/ui (基于 Radix UI)
- **Styling**: Tailwind CSS 4

## 目录结构

```
├── public/                 # 静态资源
├── scripts/                # 构建与启动脚本
│   ├── build.sh            # 构建脚本
│   ├── dev.sh              # 开发环境启动脚本
│   ├── prepare.sh          # 预处理脚本
│   └── start.sh            # 生产环境启动脚本
├── src/
│   ├── app/                # 页面路由与布局
│   ├── components/ui/      # Shadcn UI 组件库
│   ├── hooks/              # 自定义 Hooks
│   ├── lib/                # 工具库
│   │   └── utils.ts        # 通用工具函数 (cn)
│   └── server.ts           # 自定义服务端入口
├── next.config.ts          # Next.js 配置
├── package.json            # 项目依赖管理
└── tsconfig.json           # TypeScript 配置
```

- 项目文件（如 app 目录、pages 目录、components 等）默认初始化到 `src/` 目录下。

## 包管理规范

**仅允许使用 pnpm** 作为包管理器，**严禁使用 npm 或 yarn**。
**常用命令**：
- 安装依赖：`pnpm add <package>`
- 安装开发依赖：`pnpm add -D <package>`
- 安装所有依赖：`pnpm install`
- 移除依赖：`pnpm remove <package>`

## 个人作品集项目说明（Personal Portfolio）

单页个人介绍 / 作品集网站（站主：梁恩源 Claire Liang，市场贸易官员 · 跨境贸易/绿色技术/ESG 顾问），支持**右下角一键切换 4 套主题风格**（默认「商务精英」，另有「宇宙星图」「模拟人生 SIM」「艺术装置」），设计规范见根目录 `DESIGN.md`。

> 内容**以《脱敏合规版 2026》简历为准**，敏感主体一律脱敏（某国/某市/XXXX/中* 等）；联系方式只留邮箱与社交外链，不含电话/微信。

### 多主题架构（src/components/theme/）

```
src/
├── app/
│   ├── page.tsx            # 仅组装：<ThemeProvider><ThemeRenderer/><ThemeSwitcher/><ProjectsEntry/></ThemeProvider>
│   ├── layout.tsx          # 根布局 + metadata
│   ├── globals.css         # @theme SIM token + body[data-theme=xxx] 各主题作用域样式 + 切换器/光标 keyframes
│   └── projects/           # ★ 独立于主题切换的 GitHub 项目页（自包含深色容器）
│       ├── page.tsx            # /projects 项目列表页（每项可点进详情）
│       └── [slug]/page.tsx     # /projects/[slug] 详情页（generateStaticParams 预渲染 4 个项目 + 预留空状态按钮 + notFound）
├── data/
│   ├── profile.ts          # ★ 所有简历文案集中在此（单一 profile 对象，来源：脱敏合规版简历）
│   └── projects.ts         # ★ GitHub 项目数据（githubProjects：go-go/shesources/enya/pomi + getProject(slug)）
├── app/
│   └── api/advisor/route.ts  # 进出口合规专家 LLM 流式接口（SSE，双角色 buyer/supplier）
├── components/
│   ├── theme/              # ★ 四套主题（切换系统）
│   │   ├── theme-context.tsx   # ThemeProvider + useTheme + THEMES 列表（localStorage key: claire-theme，默认 business）
│   │   ├── theme-renderer.tsx  # client 组件：按 theme switch 渲染
│   │   ├── theme-switcher.tsx  # 右下角浮动「切换风格 STYLE」面板
│   │   ├── projects-entry.tsx  # 左下角浮动「我的项目」胶囊入口 → /projects（四主题通用，cursor-pointer 适配全局 cursor:none）
│   │   ├── business-theme.tsx  # 主题01 商务精英（深蓝金，自包含、含自己的 Nav/章节，挂载 <Advisor/>）
│   │   ├── advisor.tsx         #   商务风「进出口合规专家」：金币动画→打字→爆发→浮现聊天框（SSE 流式）
│   │   ├── cosmos-theme.tsx    # 主题02 宇宙星图（水平螺旋星系布局：行星沿旋臂上下散布+点击详情+空间站）
│   │   ├── cosmos-canvas.tsx   #   宇宙背景：水平螺旋星系（S形旋臂粒子+核球辉光+dust lane+相机推进）+可拨开沙砾+流星光标
│   │   ├── starfleet-layer.tsx #   星际迷航舰队层（小型飞船缓慢穿越闪烁星空 + R2-D2 全息 SVG，移动端降密度）
│   │   ├── lcars-terminal.tsx  #   LCARS 舰桥终端面板（可折叠：Stardate 时钟/身份档案/CAREER LOGS/技能与语言色条，参考 thelcars）
│   │   ├── enterprise-cursor.tsx #  企业号（U.S.S.Enterprise）飞船光标：跟随鼠标 + 上方小鼠标箭头指示点击点 + 蓝色曲速尾焰，触屏/减少动效隐藏
│   │   ├── planet-3d.tsx       #   ★ 真实感 3D 自转行星（Canvas 程序化地表纹理+晨昏光照+大气辉光）+ PlanetSurface 详情背景
│   │   ├── sims-theme.tsx      # 主题03 模拟人生（复用 portfolio/* + 小镇地图 + SimCursor）
│   │   ├── sim-cursor.tsx      #   SIM 小人鼠标：SVG 女孩（灰西服白裙杏色高跟/长卷黑发银白挑染/补腿）走跑 + 真实脚印
│   │   ├── sim-town.tsx        #   ★ SIM 小镇地图：方向键/WASD/拖动游走，房子按类别分布，点击房子看内容，小地图
│   │   ├── isometric-house.tsx #   ★ 等距2.5D SVG房子（三向坡屋顶/平顶/圆顶、瓦片、明暗墙、拱门台阶、窗棂、地面投影）
│   │   └── studio-theme.tsx    # 主题04 艺术装置（深色大字宣言 + 流体背景 + HUD 时钟/坐标）
│   └── portfolio/          # SIM 主题的明亮区块（jelly-name/sim-field/hud/navbar/hero/about/skills/works/path/contact/footer/reveal/section-heading/pals-chat）
public/
├── claire-avatar.jpg       # 站主头像（简历证件照），用于 SIM 小人鼠标
└── planets/                # 真实星球照片贴图（earth/saturn/jupiter/mars/venus/neptune/mercury/moon），宇宙主题 texture 用
```

### 修改方式

- **换文案 / 联系方式**：只改 `src/data/profile.ts`（单一 `profile` 对象），四套主题都从此读取。脱敏字段（某国/XXXX/中*）勿改回真实全称；勿加入电话/微信。注意数据结构：`experience.items[]`（roleZh/orgZh/period/pointsZh）、`projects.items[]`（nameZh/nameEn/role/period/descZh/tags）、`certifications.items[]`、`languages[]`、`contact.socials[]`。
- **进出口合规专家 LLM**：接口在 `src/app/api/advisor/route.ts`（SSE 流式，`buildSystemPrompt(role)` 区分采购方 buyer / 供应商 supplier）；前端交互在 `src/components/theme/advisor.tsx`（金币动画阶段机 coin→typing→burst→chat + fetch reader 打字机渲染）。模型/温度在 route.ts 调整。
- **3D 行星外观**：改 `src/components/theme/planet-3d.tsx` 的 `PALETTES`（地表配色）/`makeTexture`（噪声大陆/气态条纹/云）/`texture`（真实贴图，未加载且回退）；每颗星的材质类型/大小/自转速度/辉光/轴倾「顺逆行」在 `cosmos-theme.tsx` 顶部 `PLANET_TEXTURES`/`PLANET_STYLES`/`PROJECT_STYLES`。真实星球照片存于 `public/planets/*.jpg`（earth/saturn/jupiter/mars/venus/neptune/mercury/moon），`Planet3D`/`PlanetSurface` 均有 `texture` prop 接入。`PlanetSurface` 是详情页「站在星球表面」的虚化立体背景。带 `ring` 的星有真实碎石环带动效。
- **SIM 小镇布局**：`sim-town.tsx` 顶部 WORLD_W/WORLD_H 与各 `pushLot`（房子坐标/类别/颜色/屋顶）；键盘/拖动镜头与小地图在同文件。小人形象在 `sim-cursor.tsx` 的 `SimGirl`（SVG），脚印 `Foot` + `simFootFade` 动画。
- **新增 / 调整主题**：在 `theme-context.tsx` 的 `THEMES` 注册，在 `theme-renderer.tsx` 加 case；主题样式写在 `globals.css` 的 `body[data-theme="xxx"]` 作用域，做到自包含、互不干扰。
- **SIM 主题的颜色/字体/果冻**：改 `globals.css` 顶部 `@theme` 的 SIM token 与 keyframes；果冻字采样/引力在 `jelly-name.tsx`，背景微粒在 `sim-field.tsx`。
- **宇宙/小人交互参数**：银河粒子密度与拨开半径在 `cosmos-canvas.tsx`（`R`/`sandCount`）；小人走跑阈值与脚印在 `sim-cursor.tsx`（`speed>7` 判定跑步）。宇宙主题自定义光标为企业号飞船（`enterprise-cursor.tsx`，缓动系数 0.24、尾焰 keyframes `warpFlame`）；经历行星 hover 放大 2.5 倍（globals.css 的 `.cosmos-planet-zoom` + `@media(pointer:fine)`，移动端触屏不放大）。
- **GitHub 项目页**：数据只改 `src/data/projects.ts`（`githubProjects[]`：slug/repo/nameZh/nameEn/tagline/status/hackathon/mission/features/highlights/accent）。列表页 `src/app/projects/page.tsx` 自动遍历；新增项目只需在数据数组追加一项，详情页 `[slug]/page.tsx` 经 `generateStaticParams` 自动生成路由。详情页「在线体验 / 源代码」是按需求预留的**空状态禁用按钮**（仓库暂无外链，无下载），将来补链接时去掉 `disabled` 换成 `<Link>/<a>` 即可。页面用自包含深色容器 `bg-[#0b1020]`，不依赖主题、不挂 ThemeSwitcher。
- canvas 一律用 `hsla()`；DOM/CSS 用 oklch/hex token。所有动效支持 `prefers-reduced-motion` 降级。

### 注意事项

- 静态站为主，唯一后端路由 `POST /api/advisor`（进出口合规专家 SSE 流式，入参 `{role:"buyer"|"supplier", messages:[{role,content}]}`）；`pnpm dev` 长驻 5000 端口，若探活失败多为空闲回收，重启 `pnpm run dev` 即可。
- 四套主题各自渲染（不并存），切主题时切换 `document.body.dataset.theme`；自定义光标主题（cosmos/sims）在详情 overlay 内恢复系统可点击光标。
- **移动端（安卓/iOS 通用）**：`layout.tsx` 的 `viewport` 已开启 `viewportFit:'cover'` 并配置 `themeColor`；`globals.css` 顶部定义安全区变量 `--sat/--sab/--sal/--sar`(env) 与工具类 `.safe-pt/.safe-pb/.safe-pl/.safe-pr`，页面高度用 `100dvh`，全局取消点击高亮、触屏 `touch-action:manipulation`。固定顶栏（business/navbar）加 `.safe-pt`；底部浮动入口（`projects-entry` 左下、`theme-switcher` 右下）用 `env(safe-area-inset-bottom)` 抬升。自定义光标（sim-cursor 按 `pointer:coarse` 触屏隐藏）、宇宙粒子/拨开触屏跟随、小镇触屏单指拖动均已适配。新增或调整固定/悬浮元素时记得套用对应 safe-area 工具类。

## 开发规范

### 编码规范

- 默认按 TypeScript `strict` 心智写代码；优先复用当前作用域已声明的变量、函数、类型和导入，禁止引用未声明标识符或拼错变量名。
- 禁止隐式 `any` 和 `as any`；函数参数、返回值、解构项、事件对象、`catch` 错误在使用前应有明确类型或先完成类型收窄，并清理未使用的变量和导入。

### next.config 配置规范

- 配置的路径不要写死绝对路径，必须使用 path.resolve(__dirname, ...)、import.meta.dirname 或 process.cwd() 动态拼接。

### Hydration 问题防范

1. 严禁在 JSX 渲染逻辑中直接使用 typeof window、Date.now()、Math.random() 等动态数据。**必须使用 'use client' 并配合 useEffect + useState 确保动态内容仅在客户端挂载后渲染**；同时严禁非法 HTML 嵌套（如 <p> 嵌套 <div>）。
2. **禁止使用 head 标签**，优先使用 metadata，详见文档：https://nextjs.org/docs/app/api-reference/functions/generate-metadata
   1. 三方 CSS、字体等资源可在 `globals.css` 中顶部通过 `@import` 引入或使用 next/font
   2. preload, preconnect, dns-prefetch 通过 ReactDOM 的 preload、preconnect、dns-prefetch 方法引入
   3. json-ld 可阅读 https://nextjs.org/docs/app/guides/json-ld

## UI 设计与组件规范 (UI & Styling Standards)

- 模板默认预装核心组件库 `shadcn/ui`，位于`src/components/ui/`目录下
- Next.js 项目**必须默认**采用 shadcn/ui 组件、风格和规范，**除非用户指定用其他的组件和规范。**
