"use client";

import React, { useState } from "react";
import { X, Save } from "lucide-react";
import { sanitize } from "@/app/lib/sanitize";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ClipEdits {
  title: string;
  style: string;
  notes: string;
}

export interface ClipEditorModalProps {
  clip: {
    id: string;
    title: string;
    style: string;
  };
  onClose: () => void;
  onSave: (id: string, edits: ClipEdits) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Simple inline editor modal for clip metadata.
 */
export default function ClipEditorModal({ clip, onClose, onSave }: ClipEditorModalProps) {
  const [title, setTitle] = useState(clip.title);
  const [style, setStyle] = useState(clip.style);
  const [notes, setNotes] = useState("");

  const handleSave = () => {
    onSave(clip.id, {
      title: sanitize(title),
      style: sanitize(style),
      notes: sanitize(notes),
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="clip-editor-title"
    >
      <div className="w-full max-w-md bg-surface border border-white/10 rounded-2xl shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
          <h2 id="clip-editor-title" className="text-sm font-bold text-white">
            Edit Clip
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close editor"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Fields */}
        <div className="p-5 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="clip-title" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Title
            </label>
            <input
              id="clip-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-input border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand/40"
              maxLength={120}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="clip-style" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Style
            </label>
            <input
              id="clip-style"
              type="text"
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-input border border-white/10 text-sm text-white focus:outline-none focus:ring-1 focus:ring-brand/40"
              maxLength={60}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="clip-notes" className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Notes
            </label>
            <textarea
              id="clip-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Optional notes…"
              className="w-full px-3 py-2 rounded-lg bg-input border border-white/10 text-sm text-white placeholder-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-brand/40"
              maxLength={500}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 px-5 py-4 border-t border-white/5">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-white/10 text-xs font-bold text-gray-300 hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand text-black text-xs font-bold hover:bg-brand/90 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
