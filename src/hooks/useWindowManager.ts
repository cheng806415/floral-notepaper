import { useCallback, useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import type { NoteSurfaceMode } from "../features/windows/surfaceMode";
import {
  animateCurrentWindowBounds,
  closeCurrentWindow,
  getCurrentWindowBounds,
  recycleCurrentNotepad,
  setCurrentWindowAlwaysOnTop,
  startCurrentWindowDrag,
} from "../features/windows/controls";
import { getSurfaceTargetBounds, NOTE_SURFACE_MODE_EVENT, surfaceModeFromEvent } from "../features/windows/surfaceMode";
import { emitTileWindowUnpinned, tileSurfaceModeUnpinNoteId } from "../features/windows/tileWindowEvents";
import { showToast } from "../components/Toast";
import { getErrorMessage } from "../features/notes/api";

interface WindowManagerState {
  surfaceMode: NoteSurfaceMode;
  isExiting: boolean;
}

interface WindowManagerActions {
  switchSurfaceMode: (nextMode: NoteSurfaceMode, tileNoteId: string) => Promise<void>;
  handleDrag: (event: MouseEvent<HTMLElement>) => void;
  handleClose: () => void;
  setIsExiting: (value: boolean) => void;
}

export function useWindowManager(initialMode: NoteSurfaceMode = "pad"): {
  state: WindowManagerState;
  actions: WindowManagerActions;
} {
  const [state, setState] = useState<WindowManagerState>({
    surfaceMode: initialMode,
    isExiting: false,
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const switchSurfaceMode = useCallback(
    async (nextMode: NoteSurfaceMode, tileNoteId: string) => {
      const currentMode = stateRef.current.surfaceMode;
      const unpinnedNoteId = tileSurfaceModeUnpinNoteId(currentMode, nextMode, tileNoteId);
      setState(prev => ({ ...prev, surfaceMode: nextMode }));
      
      if (unpinnedNoteId) {
        void emitTileWindowUnpinned(unpinnedNoteId).catch(() => undefined);
      }

      try {
        if (nextMode === "tile") {
          await setCurrentWindowAlwaysOnTop(true);
        }

        const currentBounds = await getCurrentWindowBounds();
        await animateCurrentWindowBounds(getSurfaceTargetBounds(nextMode, currentBounds));
      } catch (error) {
        showToast(getErrorMessage(error));
      }
    },
    [],
  );

  const handleDrag = useCallback((event: MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("button,input,textarea")) return;
    void startCurrentWindowDrag().catch(() => undefined);
  }, []);

  const handleClose = useCallback(() => {
    const surfaceMode = stateRef.current.surfaceMode;
    setState(prev => ({ ...prev, isExiting: true }));
    const closeSurface = surfaceMode === "tile" ? closeCurrentWindow : recycleCurrentNotepad;
    void closeSurface().catch((error) => {
      setState(prev => ({ ...prev, isExiting: false }));
      showToast(getErrorMessage(error));
    });
  }, []);

  const setIsExiting = useCallback((value: boolean) => {
    setState(prev => ({ ...prev, isExiting: value }));
  }, []);

  useEffect(() => {
    function handleSurfaceModeRequest(event: Event) {
      const nextMode = surfaceModeFromEvent(event);
      if (!nextMode) return;
      void switchSurfaceMode(nextMode, "");
    }

    window.addEventListener(NOTE_SURFACE_MODE_EVENT, handleSurfaceModeRequest);
    return () => {
      window.removeEventListener(NOTE_SURFACE_MODE_EVENT, handleSurfaceModeRequest);
    };
  }, [switchSurfaceMode]);

  useEffect(() => {
    if (state.surfaceMode !== "tile") return;
    void setCurrentWindowAlwaysOnTop(true).catch(() => undefined);
  }, [state.surfaceMode]);

  return {
    state,
    actions: {
      switchSurfaceMode,
      handleDrag,
      handleClose,
      setIsExiting,
    },
  };
}
