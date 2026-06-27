import { useCallback, useEffect, useRef, useState } from "react";
import { createNote, getNote, listNotes, updateNote } from "../features/notes/api";
import { showToast } from "../components/Toast";
import type { Note, NoteMetadata } from "../features/notes/types";
import { getErrorMessage } from "../features/notes/api";
import { metadataFromNote } from "../features/notes/noteUtils";
import { listen } from "@tauri-apps/api/event";

export type NotePadStatus = "empty" | "opened" | "saved" | "dirty" | "saveFailed" | "copied";

interface NoteEditorState {
  editingNoteId: string | null;
  title: string;
  content: string;
  notes: NoteMetadata[];
  status: NotePadStatus;
}

interface NoteEditorActions {
  setTitle: (title: string) => void;
  setContent: (content: string) => void;
  setStatus: (status: NotePadStatus) => void;
  saveNote: () => Promise<Note>;
  openNote: (noteId: string) => Promise<void>;
  resetDraft: () => void;
  refreshNotes: () => Promise<NoteMetadata[]>;
  applyNote: (note: Note) => void;
  hasDraftContent: () => boolean;
  ensureNoteSaved: () => Promise<string | null>;
}

export function useNoteEditor(initialNoteId?: string): {
  state: NoteEditorState;
  actions: NoteEditorActions;
} {
  const [state, setState] = useState<NoteEditorState>({
    editingNoteId: null,
    title: "",
    content: "",
    notes: [],
    status: "empty",
  });

  const stateRef = useRef(state);
  stateRef.current = state;

  const refreshNotes = useCallback(async () => {
    const loadedNotes = await listNotes();
    setState(prev => ({ ...prev, notes: loadedNotes }));
    return loadedNotes;
  }, []);

  const applyNote = useCallback((note: Note) => {
    setState(prev => ({
      ...prev,
      editingNoteId: note.id,
      title: note.title,
      content: note.content,
      status: "opened",
    }));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function initialize() {
      try {
        await refreshNotes();
        if (!cancelled && initialNoteId) {
          const note = await getNote(initialNoteId);
          if (!cancelled) applyNote(note);
        }
      } catch (error) {
        if (!cancelled) showToast(getErrorMessage(error));
      }
    }

    void initialize();
    return () => {
      cancelled = true;
    };
  }, [applyNote, initialNoteId, refreshNotes]);

  useEffect(() => {
    const unlisten = listen("notes-changed", () => {
      void refreshNotes().catch(() => undefined);
    });
    return () => {
      void unlisten.then((fn) => fn());
    };
  }, [refreshNotes]);

  const setTitle = useCallback((title: string) => {
    setState(prev => ({ ...prev, title }));
  }, []);

  const setContent = useCallback((content: string) => {
    setState(prev => ({ ...prev, content }));
  }, []);

  const setStatus = useCallback((status: NotePadStatus) => {
    setState(prev => ({ ...prev, status }));
  }, []);

  const saveNote = useCallback(async () => {
    const current = stateRef.current;
    const existingCategory = current.notes.find((n) => n.id === current.editingNoteId)?.category ?? "";
    const request = { title: current.title, content: current.content, category: existingCategory };
    const note = current.editingNoteId
      ? await updateNote(current.editingNoteId, request)
      : await createNote(request);

    setState(prev => {
      const metadata = metadataFromNote(note);
      const exists = prev.notes.some((item) => item.id === note.id);
      const next = exists
        ? prev.notes.map((item) => (item.id === note.id ? metadata : item))
        : [metadata, ...prev.notes];
      return {
        ...prev,
        editingNoteId: note.id,
        notes: [...next].sort((left, right) => right.updatedAt.localeCompare(left.updatedAt)),
        status: "saved",
      };
    });
    return note;
  }, []);

  const openNote = useCallback(async (noteId: string) => {
    const note = await getNote(noteId);
    applyNote(note);
  }, [applyNote]);

  const resetDraft = useCallback(() => {
    setState(prev => ({
      ...prev,
      editingNoteId: null,
      title: "",
      content: "",
      status: "empty",
    }));
  }, []);

  const hasDraftContent = useCallback(() => {
    const current = stateRef.current;
    return Boolean(current.editingNoteId || current.title.trim() || current.content.trim());
  }, []);

  const ensureNoteSaved = useCallback(async (): Promise<string | null> => {
    const current = stateRef.current;
    if (current.editingNoteId) return current.editingNoteId;
    try {
      const note = await saveNote();
      return note.id;
    } catch {
      return null;
    }
  }, [saveNote]);

  return {
    state,
    actions: {
      setTitle,
      setContent,
      setStatus,
      saveNote,
      openNote,
      resetDraft,
      refreshNotes,
      applyNote,
      hasDraftContent,
      ensureNoteSaved,
    },
  };
}
