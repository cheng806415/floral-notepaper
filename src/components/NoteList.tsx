import { useState } from "react";
import type { TFunction } from "i18next";
import type { NoteMetadata } from "../features/notes/types";
import { formatShortDate, getDisplayTitle } from "../features/notes/noteUtils";
import { openNoteInEditor } from "../features/windows/api";

interface NoteListProps {
  notes: NoteMetadata[];
  t: TFunction;
  emptyStateText: string;
  openInEditorTooltip: string;
  blankNoteText: string;
  onOpenNote: (noteId: string) => void;
}

export function NoteList({
  notes,
  t,
  emptyStateText,
  openInEditorTooltip,
  blankNoteText,
  onOpenNote,
}: NoteListProps) {
  const [hoveredNote, setHoveredNote] = useState<string | null>(null);

  return (
    <div className="p-2 flex-1 min-h-0 overflow-y-auto">
      <div className="space-y-0.5">
        {notes.map((note) => (
          <button
            key={note.id}
            onClick={() => onOpenNote(note.id)}
            onMouseEnter={() => setHoveredNote(note.id)}
            onMouseLeave={() => setHoveredNote(null)}
            className="w-full text-left px-3.5 py-3 rounded-xl transition-all duration-200 cursor-pointer group hover:bg-paper-warm/70"
          >
            <div className="flex items-center justify-between mb-0.5">
              <span className="text-[13px] font-display font-medium text-ink-soft group-hover:text-ink transition-colors truncate pr-2">
                {getDisplayTitle(note, t)}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    void openNoteInEditor(note.id);
                  }}
                  className="w-6 h-6 flex items-center justify-center rounded-md text-ink-ghost hover:text-bamboo hover:bg-bamboo-mist/50 transition-all duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
                  title={openInEditorTooltip}
                >
                  <svg
                    width="13"
                    height="13"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </button>
                <span className="text-[11px] text-ink-ghost font-mono tabular-nums">
                  {formatShortDate(note.updatedAt)}
                </span>
              </div>
            </div>
            <p className="text-[12px] text-ink-ghost leading-relaxed line-clamp-1 group-hover:text-ink-faint transition-colors">
              {note.preview || blankNoteText}
            </p>
            {hoveredNote === note.id && (
              <div className="mt-1.5 h-px bg-bamboo/10 transition-all duration-300" />
            )}
          </button>
        ))}
        {notes.length === 0 && (
          <div className="px-4 py-8 text-center text-[12px] text-ink-ghost">
            {emptyStateText}
          </div>
        )}
      </div>
    </div>
  );
}
