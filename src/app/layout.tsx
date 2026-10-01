import type { Metadata, Viewport } from 'next';
import { Inspector } from 'react-dev-inspector';
import './globals.css';

// 移动端(安卓/iOS)通用：适配刘海屏安全区 + 动态视口高度
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ebe9ff' },
    { media: '(prefers-color-scheme: dark)', color: '#0e1626' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: 'Claire 梁 — 跨境贸易 · 绿色技术 · ESG 顾问',
    template: '%s · Claire 梁',
  },
  description:
    'Claire 梁（Claire Liang）的个人主页 —— 市场贸易官员 / 跨境贸易与市场进入顾问，常驻广州。专注跨境贸易撮合、绿色技术转移与 ESG 合规对接、政府关系与商务网络。',
  keywords: ['Claire', 'Claire Liang', '跨境贸易', '市场进入', '绿色技术', 'ESG', '技术转移', 'Guangzhou'],
  authors: [{ name: 'Claire 梁' }],
  openGraph: {
    title: 'Claire 梁 — 跨境贸易 · 绿色技术 · ESG 顾问',
    description: '连接国际企业与华南市场 —— 跨境贸易撮合 · 绿色技术转移 · ESG 合规对接。',
    locale: 'zh_CN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isDev = process.env.COZE_PROJECT_ENV === 'DEV';

  return (
    <html lang="zh-CN">
      <body className={`antialiased`}>
        {isDev && <Inspector />}
        {children}
      </body>
    </html>
  );
}
