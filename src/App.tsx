import { useEffect } from "react";
import "./App.css";
import { ContextMenuProvider } from "./components/ContextMenu";
import { MainWindow } from "./components/MainWindow";
import { NotePad } from "./components/NotePad";
import { TileShowcase } from "./components/TileShowcase";
import { getConfig } from "./features/settings/api";
import { applyTheme, watchSystemTheme } from "./features/settings/theme";
import type { AppConfig, ThemeOption } from "./features/settings/types";
import { getInitialRoute } from "./features/windows/windowRoutes";
import { listen } from "@tauri-apps/api/event";

function App() {
  const route = getInitialRoute();
  const activeView = route.view;

  useEffect(() => {
    let cleanup = () => {};
    getConfig()
      .then((config) => {
        const theme = (config.theme || "system") as ThemeOption;
        applyTheme(theme);
        cleanup = watchSystemTheme(theme);
      })
      .catch(() => {});
    return () => cleanup();
  }, []);

  useEffect(() => {
    const unlisten = listen<AppConfig>("config-changed", (event) => {
      const theme = (event.payload.theme || "system") as ThemeOption;
      applyTheme(theme);
      watchSystemTheme(theme);
    });
    return () => {
      void unlisten.then((fn) => fn());
    };
  }, []);

  return (
    <ContextMenuProvider>
      <div className="h-screen font-body text-ink overflow-hidden">
        {activeView === "main" ? (
          <MainWindow />
        ) : activeView === "notepad" ? (
          <NotePad initialNoteId={route.noteId} />
        ) : (
          <TileShowcase noteId={route.noteId} />
        )}
      </div>
    </ContextMenuProvider>
  );
}

export default App;
