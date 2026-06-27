import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useImagePaste } from "../features/images/useImagePaste";
import { useImageBaseDir } from "../features/images/useImageBaseDir";
import { showToast } from "./Toast";
import { getErrorMessage } from "../features/notes/api";
import { generateTitle } from "../features/ai/api";
import { listen } from "@tauri-apps/api/event";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { showCurrentWindow } from "../features/windows/controls";
import { shouldSaveBeforeSwitchingToTile } from "../features/windows/noteSurfaceSavePolicy";
import {
  NOTE_SURFACE_ACTION_EVENT,
  surfaceActionFromEvent,
} from "../features/windows/surfaceActions";
import { DEFAULT_TILE_COLOR } from "../features/settings/tileColor";
import { Tile } from "./Tile";
import { TrafficLights } from "./TrafficLights";
import { SurfaceResizeHandles } from "./SurfaceResizeHandles";
import { NoteEditor } from "./NoteEditor";
import { NoteList } from "./NoteList";
import { useNoteEditor, type NotePadStatus } from "../hooks/useNoteEditor";
import { useWindowManager } from "../hooks/useWindowManager";
import { useSurfaceConfig } from "../hooks/useSurfaceConfig";

type OpenMode = "new" | "open";

interface NotePadProps {
  initialNoteId?: string;
  initialSurfaceMode?: "pad" | "tile";
  initialAutoSave?: boolean;
  initialTileColor?: string;
}

export function NotePad({
  initialNoteId,
  initialSurfaceMode = "pad",
  initialAutoSave = true,
  initialTileColor = DEFAULT_TILE_COLOR,
}: NotePadProps) {
  const { t } = useTranslation();
  const [mode, setMode] = useState<OpenMode>("new");
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const hasEnteredOnce = useRef(false);
  const isStandby = useRef(
    typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("standby") === "1",
  );
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const windowLabelRef = useRef("");

  const { state: noteState, actions: noteActions } = useNoteEditor(initialNoteId);
  const { state: windowState, actions: windowActions } = useWindowManager(initialSurfaceMode);
  const { config } = useSurfaceConfig(initialAutoSave, initialTileColor);

  const imageBaseDir = useImageBaseDir();

  const {
    handlePaste: imagePasteHandler,
    handleDrop: imageDropHandler,
    handleDragOver: imageDragOverHandler,
  } = useImagePaste({
    noteId: noteState.editingNoteId,
    textareaRef: contentRef,
    setContent: noteActions.setContent,
    markDirty: () => noteActions.setStatus("dirty"),
    onEnsureNoteSaved: noteActions.ensureNoteSaved,
    onError: showToast,
    t,
  });

  const tileNoteId = noteState.editingNoteId ?? initialNoteId ?? "";

  const statusLabel = useMemo<Record<NotePadStatus, string>>(
    () => ({
      empty: t("notepad.status.empty", { defaultValue: "空" }),
      opened: t("notepad.status.opened", { defaultValue: "已打开" }),
      saved: t("notepad.status.saved", { defaultValue: "已保存" }),
      dirty: t("notepad.status.unsaved", { defaultValue: "未保存" }),
      saveFailed: t("notepad.status.saveFailed", { defaultValue: "保存失败" }),
      copied: t("notepad.status.copied", { defaultValue: "已复制" }),
    }),
    [t],
  );

  const tabLabels = useMemo(
    () => ({
      new: t("notepad.tab.new", { defaultValue: "新建" }),
      edit: t("notepad.tab.edit", { defaultValue: "编辑" }),
      open: t("notepad.tab.open", { defaultValue: "打开" }),
    }),
    [t],
  );

  useEffect(() => {
    if (isStandby.current) return;
    let cancelled = false;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!cancelled) {
          hasEnteredOnce.current = true;
          void showCurrentWindow()
            .then(() => contentRef.current?.focus())
            .catch(() => undefined);
        }
      });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let myLabel = "";
    try {
      myLabel = getCurrentWindow().label;
      windowLabelRef.current = myLabel;
    } catch {
      // not in Tauri environment (tests)
    }

    const unlisten = listen<string>("notepad:activate", (event) => {
      if (event.payload !== myLabel) return;

      isStandby.current = false;
      hasEnteredOnce.current = true;
      noteActions.resetDraft();
      setMode("new");
      windowActions.setIsExiting(false);
      void windowActions.switchSurfaceMode("pad", "");
      void noteActions.refreshNotes().catch(() => undefined);
      void showCurrentWindow()
        .then(() => contentRef.current?.focus())
        .catch(() => undefined);
    });
    return () => {
      void unlisten.then((fn) => fn());
    };
  }, [noteActions, windowActions]);

  const handleSave = useCallback(async () => {
    try {
      await noteActions.saveNote();
    } catch (error) {
      noteActions.setStatus("saveFailed");
      showToast(getErrorMessage(error));
    }
  }, [noteActions]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if ((event.ctrlKey || event.metaKey) && event.key === "s") {
        event.preventDefault();
        void handleSave();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  const handleOpenNote = async (noteId: string) => {
    try {
      await noteActions.openNote(noteId);
      await windowActions.switchSurfaceMode("pad", noteId);
      setMode("new");
    } catch (error) {
      showToast(getErrorMessage(error));
    }
  };

  const handlePin = async () => {
    try {
      if (shouldSaveBeforeSwitchingToTile(config.noteSurfaceAutoSave)) {
        await noteActions.saveNote();
      }
      await windowActions.switchSurfaceMode("tile", tileNoteId);
    } catch (error) {
      showToast(getErrorMessage(error));
    }
  };

  const copyTileContent = useCallback(async () => {
    try {
      const clipboard = navigator.clipboard;
      if (!clipboard?.writeText) {
        throw new Error(t("notepad.error.copyUnsupported", { defaultValue: "当前环境不支持复制" }));
      }
      await clipboard.writeText(noteState.content);
      noteActions.setStatus("copied");
    } catch (error) {
      showToast(getErrorMessage(error));
    }
  }, [noteActions, noteState.content, t]);

  useEffect(() => {
    function handleSurfaceActionRequest(event: Event) {
      const action = surfaceActionFromEvent(event);
      if (!action) return;

      if (action === "copy") {
        void copyTileContent();
        return;
      }

      if (action === "save") {
        void handleSave();
        return;
      }

      if (action === "close") {
        void windowActions.handleClose();
        return;
      }

      void windowActions.switchSurfaceMode("pad", tileNoteId);
    }

    window.addEventListener(NOTE_SURFACE_ACTION_EVENT, handleSurfaceActionRequest);
    return () => {
      window.removeEventListener(NOTE_SURFACE_ACTION_EVENT, handleSurfaceActionRequest);
    };
  }, [copyTileContent, handleSave, tileNoteId, windowActions]);

  useEffect(() => {
    if (!config.noteSurfaceAutoSave || mode !== "new" || noteState.status !== "dirty") {
      return undefined;
    }
    if (!noteActions.hasDraftContent()) return undefined;

    const timer = window.setTimeout(() => {
      void handleSave();
    }, 900);

    return () => window.clearTimeout(timer);
  }, [config.noteSurfaceAutoSave, handleSave, mode, noteActions, noteState.status]);

  const handleEditorTitleChange = useCallback((title: string) => {
    noteActions.setTitle(title);
    noteActions.setStatus("dirty");
  }, [noteActions]);

  const handleEditorContentChange = useCallback((content: string) => {
    noteActions.setContent(content);
    noteActions.setStatus("dirty");
  }, [noteActions]);

  const handleAiGenerateTitle = useCallback(async () => {
    if (!noteState.content.trim() || isAiGenerating) return;
    if (!config.aiProvider?.enabled || !config.aiProvider.apiEndpoint || !config.aiProvider.apiKey || !config.aiProvider.model) {
      showToast(t("settings.ai.notConfigured", { defaultValue: "请先在设置中配置 AI 提供商" }));
      return;
    }
    setIsAiGenerating(true);
    try {
      const newTitle = await generateTitle({
        config: config.aiProvider,
        content: noteState.content,
      });
      noteActions.setTitle(newTitle);
      noteActions.setStatus("dirty");
    } catch (error) {
      showToast(getErrorMessage(error));
    } finally {
      setIsAiGenerating(false);
    }
  }, [config.aiProvider, isAiGenerating, noteActions, noteState.content, t]);

  const isTile = windowState.surfaceMode === "tile";
  const tileTitle = noteState.title.trim();
  const enterClass = hasEnteredOnce.current ? "" : "animate-window-enter";
  const surfaceWrapperClassName = `w-full h-screen flex flex-col bg-transparent p-0 ${windowState.isExiting ? "animate-window-exit" : enterClass}`;
  const padSurfaceClassName =
    "app-surface-frame relative noise-bg w-full h-full min-h-0 bg-cloud overflow-hidden flex flex-col flex-1 border border-paper-deep/70 shadow-[0_1px_10px_rgba(26,26,24,0.06)] transition-all duration-200 ease-out";

  return (
    <div className={surfaceWrapperClassName}>
      {isTile ? (
        <Tile
          title={tileTitle || undefined}
          content={noteState.content}
          color={config.tileColor}
          fontSize={config.surfaceFontSize}
          renderMarkdown={config.tileRenderMarkdown}
          imageBaseDir={imageBaseDir ?? undefined}
          width="100%"
          className="h-full cursor-default"
          data-surface-mode={windowState.surfaceMode}
          data-context-menu="tile"
          data-note-id={tileNoteId}
          onMouseDown={windowActions.handleDrag}
        >
          <button
            type="button"
            aria-label={t("notepad.button.unpin", { defaultValue: "取消钉屏" })}
            title={t("notepad.button.unpin", { defaultValue: "取消钉屏" })}
            onMouseDown={(event) => event.stopPropagation()}
            onClick={() => void windowActions.handleClose()}
            className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center rounded-full text-ink-ghost/70 hover:text-red-400 hover:bg-danger-bg/80 transition-colors cursor-pointer"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <SurfaceResizeHandles />
        </Tile>
      ) : (
        <div className={padSurfaceClassName} data-surface-mode={windowState.surfaceMode}>
          <>
            <div
              className="flex items-center justify-between pl-2 pr-3 pt-2 pb-0 cursor-default"
              onMouseDown={windowActions.handleDrag}
            >
              <div className="flex items-center gap-2">
                <TrafficLights size={11} withTooltips={false} onClose={() => void windowActions.handleClose()} />
                <div className="w-px h-4 bg-paper-deep/30 mx-0.5" />
                <button
                  onClick={noteActions.resetDraft}
                  className={`relative px-3.5 py-1.5 text-[13px] rounded-t-lg transition-all duration-200 cursor-pointer ${
                    mode === "new"
                      ? "text-bamboo font-medium"
                      : "text-ink-ghost hover:text-ink-faint"
                  }`}
                >
                  {noteState.editingNoteId ? tabLabels.edit : tabLabels.new}
                  {mode === "new" && (
                    <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-bamboo rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setMode("open")}
                  className={`relative px-3.5 py-1.5 text-[13px] rounded-t-lg transition-all duration-200 cursor-pointer ${
                    mode === "open"
                      ? "text-bamboo font-medium"
                      : "text-ink-ghost hover:text-ink-faint"
                  }`}
                >
                  {tabLabels.open}
                  {mode === "open" && (
                    <div className="absolute bottom-0 left-3 right-3 h-[2px] bg-bamboo rounded-full" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => void handlePin()}
                  className="group w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-200 cursor-pointer text-ink-ghost hover:text-ink-faint hover:bg-paper-warm"
                  title={t("notepad.tooltip.pinToTile", { defaultValue: "转为磁贴" })}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 17v5" />
                    <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1 1 1 0 0 1 1 1z" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="mx-4 mt-1 h-px bg-paper-deep/50" />

            {mode === "new" ? (
              <NoteEditor
                ref={contentRef}
                title={noteState.title}
                content={noteState.content}
                status={noteState.status}
                fontSize={config.surfaceFontSize}
                statusLabel={statusLabel}
                wordCountLabel={t("common.wordCountUnit", { defaultValue: "字" })}
                titlePlaceholder={t("notepad.placeholder.title", { defaultValue: "标题（可选）" })}
                contentPlaceholder={t("notepad.placeholder.content", { defaultValue: "写点什么……" })}
                clearLabel={t("notepad.button.clear", { defaultValue: "清空" })}
                saveLabel={t("common.save", { defaultValue: "保存" })}
                aiGenerateTooltip={t("settings.ai.generateTitle", { defaultValue: "AI 生成标题" })}
                showAiButton={config.aiProvider?.enabled === true}
                isAiGenerating={isAiGenerating}
                onTitleChange={handleEditorTitleChange}
                onContentChange={handleEditorContentChange}
                onSave={() => void handleSave()}
                onReset={noteActions.resetDraft}
                onAiGenerateTitle={() => void handleAiGenerateTitle()}
                onPaste={imagePasteHandler}
                onDrop={imageDropHandler}
                onDragOver={imageDragOverHandler}
              />
            ) : (
              <NoteList
                notes={noteState.notes}
                t={t}
                emptyStateText={t("notepad.emptyState", { defaultValue: "还没有可打开的笔记" })}
                openInEditorTooltip={t("notepad.tooltip.openInEditor", { defaultValue: "在编辑器中打开" })}
                blankNoteText={t("common.blankNote", { defaultValue: "空白笔记" })}
                onOpenNote={handleOpenNote}
              />
            )}
          </>
          <SurfaceResizeHandles />
        </div>
      )}
    </div>
  );
}
