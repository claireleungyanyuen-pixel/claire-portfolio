"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemeId = "business" | "cosmos" | "sims" | "studio";

export interface ThemeOption {
  id: ThemeId;
  /** 编号 */
  index: string;
  /** 中文标签 */
  labelZh: string;
  /** 英文标签 */
  labelEn: string;
  /** 一句话描述 */
  desc: string;
  /** emoji-free 主色，用于切换器圆点 */
  dot: string;
}

export const THEMES: ThemeOption[] = [
  {
    id: "business",
    index: "01",
    labelZh: "商务精英",
    labelEn: "BUSINESS",
    desc: "深蓝金 · 高端严肃商务",
    dot: "#b8924a",
  },
  {
    id: "cosmos",
    index: "02",
    labelZh: "宇宙星图",
    labelEn: "COSMOS",
    desc: "星球经历 · 流星鼠标 · 可拨开的银河",
    dot: "#8ab4ff",
  },
  {
    id: "sims",
    index: "03",
    labelZh: "模拟人生",
    labelEn: "SIM LIFE",
    desc: "街区房子 · 小人鼠标带脚印",
    dot: "#a974e6",
  },
  {
    id: "studio",
    index: "04",
    labelZh: "艺术装置",
    labelEn: "STUDIO",
    desc: "参考 caliyang · 深色装置 HUD",
    dot: "#e7d3f5",
  },
];

const STORAGE_KEY = "claire-theme";

interface ThemeContextValue {
  theme: ThemeId;
  setTheme: (t: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "business",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  // 默认商务风；挂载后读取本地存档
  const [theme, setThemeState] = useState<ThemeId>("business");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY) as ThemeId | null;
      if (saved && THEMES.some((t) => t.id === saved)) {
        setThemeState(saved);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.body.dataset.theme = theme;
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeState }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
