import { forwardRef, useRef } from "react";
import { countNoteChars } from "../features/notes/noteUtils";
import type { NotePadStatus } from "../hooks/useNoteEditor";

interface NoteEditorProps {
  title: string;
  content: string;
  status: NotePadStatus;
  fontSize: number;
  statusLabel: Record<NotePadStatus, string>;
  wordCountLabel: string;
  titlePlaceholder: string;
  contentPlaceholder: string;
  clearLabel: string;
  saveLabel: string;
  aiGenerateTooltip?: string;
  showAiButton?: boolean;
  isAiGenerating?: boolean;
  onTitleChange: (title: string) => void;
  onContentChange: (content: string) => void;
  onTitleKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  onContentKeyDown?: (event: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  onSave: () => void;
  onReset: () => void;
  onAiGenerateTitle?: () => void;
  onPaste?: (event: React.ClipboardEvent<HTMLTextAreaElement>) => void;
  onDrop?: (event: React.DragEvent<HTMLTextAreaElement>) => void;
  onDragOver?: (event: React.DragEvent<HTMLTextAreaElement>) => void;
}

export const NoteEditor = forwardRef<HTMLTextAreaElement, NoteEditorProps>(
  function NoteEditor(
    {
      title,
      content,
      status,
      fontSize,
      statusLabel,
      wordCountLabel,
      titlePlaceholder,
      contentPlaceholder,
      clearLabel,
      saveLabel,
      aiGenerateTooltip,
      showAiButton,
      isAiGenerating,
      onTitleChange,
      onContentChange,
      onTitleKeyDown,
      onContentKeyDown,
      onSave,
      onReset,
      onAiGenerateTitle,
      onPaste,
      onDrop,
      onDragOver,
    },
    ref,
  ) {
    const titleRef = useRef<HTMLInputElement>(null);
    const contentRef = useRef<HTMLTextAreaElement>(null);

    const handleTitleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (onTitleKeyDown) {
        onTitleKeyDown(event);
        return;
      }
      if (event.key === "Enter" || event.key === "ArrowDown") {
        event.preventDefault();
        contentRef.current?.focus();
      }
    };

    const handleContentKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (onContentKeyDown) {
        onContentKeyDown(event);
        return;
      }
      if (event.key === "ArrowUp") {
        const ta = contentRef.current;
        if (ta && ta.selectionStart === ta.selectionEnd) {
          const textBeforeCursor = content.slice(0, ta.selectionStart);
          if (!textBeforeCursor.includes("\n")) {
            event.preventDefault();
            titleRef.current?.focus();
          }
        }
      }
    };

    return (
      <div
        data-pad-editor-body="true"
        className="px-4 pt-3 pb-2 flex flex-col flex-1 min-h-0"
      >
        <div className="flex items-center gap-1.5 shrink-0 mb-2">
          <input
            ref={titleRef}
            type="text"
            value={title}
            onChange={(event) => onTitleChange(event.target.value)}
            onKeyDown={handleTitleKeyDown}
            placeholder={titlePlaceholder}
            className="flex-1 min-w-0 font-display font-medium text-ink placeholder:text-ink-ghost/60 tracking-wide"
            style={{ fontSize: `${fontSize}px` }}
          />
          {showAiButton && onAiGenerateTitle && (
            <button
              type="button"
              onClick={onAiGenerateTitle}
              disabled={isAiGenerating}
              title={aiGenerateTooltip}
              className="shrink-0 flex items-center justify-center w-7 h-7 rounded-lg text-ink-ghost hover:text-bamboo hover:bg-bamboo-mist/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
            >
              {isAiGenerating ? (
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8z" />
                  <path d="M18 2v2M22 6h-2M6 2v2M2 6h2" />
                </svg>
              )}
            </button>
          )}
        </div>

        <textarea
          ref={(element) => {
            contentRef.current = element;
            if (typeof ref === "function") {
              ref(element);
            } else if (ref) {
              ref.current = element;
            }
          }}
          data-tab-indent="true"
          value={content}
          onChange={(event) => onContentChange(event.target.value)}
          onKeyDown={handleContentKeyDown}
          onPaste={onPaste}
          onDrop={onDrop}
          onDragOver={onDragOver}
          placeholder={contentPlaceholder}
          className="w-full flex-1 min-h-0 pb-2 leading-relaxed text-ink-soft font-body placeholder:text-ink-ghost/50"
          style={{ fontSize: `${fontSize}px`, tabSize: `var(--tab-indent-size, 2)` }}
        />

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-paper-deep/30 shrink-0">
          <span className="text-[11px] text-ink-ghost font-mono tabular-nums truncate max-w-[170px]">
            {`${countNoteChars(content)} ${wordCountLabel} · ${statusLabel[status]}`}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="px-4 py-1.5 text-[12px] text-ink-faint hover:text-ink-soft rounded-lg hover:bg-paper-warm transition-all duration-200 cursor-pointer"
            >
              {clearLabel}
            </button>
            <button
              onClick={onSave}
              className="px-4 py-1.5 text-[12px] text-cloud bg-bamboo hover:bg-bamboo-light rounded-lg transition-all duration-200 font-medium cursor-pointer"
            >
              {saveLabel}
            </button>
          </div>
        </div>
      </div>
    );
  },
);
