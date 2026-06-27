import { useEffect, useState } from "react";
import { getConfig } from "../features/settings/api";
import { listen } from "@tauri-apps/api/event";
import {
  DEFAULT_TILE_COLOR,
  normalizeTileColor,
  resolveTileColor,
} from "../features/settings/tileColor";
import type { AiProviderConfig, TileColorMode } from "../features/settings/types";
import { showToast } from "../components/Toast";
import { getErrorMessage } from "../features/notes/api";

interface SurfaceConfigState {
  noteSurfaceAutoSave: boolean;
  surfaceFontSize: number;
  tileRenderMarkdown: boolean;
  tileColorRaw: string;
  tileColorMode: TileColorMode;
  tileColor: string;
  aiProvider?: AiProviderConfig;
}

export function useSurfaceConfig(
  initialAutoSave: boolean = true,
  initialTileColor: string = DEFAULT_TILE_COLOR,
): {
  config: SurfaceConfigState;
} {
  const [config, setConfig] = useState<SurfaceConfigState>({
    noteSurfaceAutoSave: initialAutoSave,
    surfaceFontSize: 14,
    tileRenderMarkdown: false,
    tileColorRaw: normalizeTileColor(initialTileColor),
    tileColorMode: "system",
    tileColor: resolveTileColor("system", normalizeTileColor(initialTileColor)),
  });

  useEffect(() => {
    let cancelled = false;

    async function loadConfig() {
      try {
        const loadedConfig = await getConfig();
        if (!cancelled) {
          setConfig({
            noteSurfaceAutoSave: loadedConfig.noteSurfaceAutoSave,
            surfaceFontSize: loadedConfig.surfaceFontSize ?? 14,
            tileRenderMarkdown: loadedConfig.tileRenderMarkdown ?? false,
            tileColorRaw: normalizeTileColor(loadedConfig.tileColor),
            tileColorMode: loadedConfig.tileColorMode ?? "system",
            tileColor: resolveTileColor(
              loadedConfig.tileColorMode ?? "system",
              loadedConfig.tileColor,
            ),
            aiProvider: loadedConfig.aiProvider,
          });
        }
      } catch (error) {
        if (!cancelled) showToast(getErrorMessage(error));
      }
    }

    void loadConfig();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const unlisten = listen<{
      tileColor?: string;
      tileColorMode?: TileColorMode;
      surfaceFontSize?: number;
      tileRenderMarkdown?: boolean;
      noteSurfaceAutoSave?: boolean;
      aiProvider?: AiProviderConfig;
    }>("config-changed", (event) => {
      const mode = event.payload.tileColorMode ?? config.tileColorMode;
      const raw = event.payload.tileColor ?? config.tileColorRaw;
      
      setConfig(prev => ({
        ...prev,
        tileColorMode: mode,
        tileColorRaw: normalizeTileColor(raw),
        tileColor: resolveTileColor(mode, raw),
        surfaceFontSize: event.payload.surfaceFontSize ?? prev.surfaceFontSize,
        tileRenderMarkdown: event.payload.tileRenderMarkdown ?? prev.tileRenderMarkdown,
        noteSurfaceAutoSave: event.payload.noteSurfaceAutoSave ?? prev.noteSurfaceAutoSave,
        aiProvider: event.payload.aiProvider ?? prev.aiProvider,
      }));
    });
    return () => {
      void unlisten.then((fn) => fn());
    };
  }, [config.tileColorMode, config.tileColorRaw]);

  useEffect(() => {
    if (config.tileColorMode !== "system") return;
    const observer = new MutationObserver(() => {
      setConfig(prev => ({
        ...prev,
        tileColor: resolveTileColor("system", prev.tileColorRaw),
      }));
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, [config.tileColorMode, config.tileColorRaw]);

  return { config };
}
