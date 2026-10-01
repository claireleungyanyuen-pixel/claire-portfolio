"use client";

import { useTheme } from "./theme-context";
import { BusinessTheme } from "./business-theme";
import { CosmosTheme } from "./cosmos-theme";
import { SimsTheme } from "./sims-theme";
import { StudioTheme } from "./studio-theme";

export function ThemeRenderer() {
  const { theme } = useTheme();
  switch (theme) {
    case "cosmos":
      return <CosmosTheme />;
    case "sims":
      return <SimsTheme />;
    case "studio":
      return <StudioTheme />;
    case "business":
    default:
      return <BusinessTheme />;
  }
}
