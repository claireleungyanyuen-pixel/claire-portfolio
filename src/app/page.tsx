import { ThemeProvider } from "@/components/theme/theme-context";
import { ThemeSwitcher } from "@/components/theme/theme-switcher";
import { ThemeRenderer } from "@/components/theme/theme-renderer";
import { ProjectsEntry } from "@/components/theme/projects-entry";

export default function Home() {
  return (
    <ThemeProvider>
      <ThemeRenderer />
      <ThemeSwitcher />
      <ProjectsEntry />
    </ThemeProvider>
  );
}
