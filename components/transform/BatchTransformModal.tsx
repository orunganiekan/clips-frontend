"use client";

import React, { useState } from "react";
import { X, Wand2, Loader2 } from "lucide-react";
import { StylePicker } from "@/components/transform/StylePicker";
import { sanitize } from "@/app/lib/sanitize";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface BatchTransformModalProps {
  /** Number of clips selected. */
  clipCount: number;
  /** Whether the submission is currently in-flight. */
  isSubmitting: boolean;
  /** An error message from the last failed submission, if any. */
  submitError: string | null;
  /** Called when the user confirms their style selection. */
  onConfirm: (style: string) => void;
  /** Called when the user closes the modal. */
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Modal dialog for initiating a batch AI video transformation.
 *
 * Shows a style picker, a summary of how many clips will be transformed,
 * and a confirm button that triggers the batch submit.
 */
export function BatchTransformModal({
  clipCount,
  isSubmitting,
  submitError,
  onConfirm,
  onClose,
}: BatchTransformModalProps) {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  const handleConfirm = () => {
    if (!selectedStyle || isSubmitting) return;
    onConfirm(selectedStyle);
  };

  const safeError = submitError ? sanitize(submitError) : null;
  const safeCount = Math.max(0, Math.floor(clipCount));

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="batch-transform-modal-title"
    >
      {/* Panel */}
      <div
        className={[
          "relative w-full max-w-2xl bg-surface border border-white/10 rounded-3xl",
          "shadow-2xl flex flex-col overflow-hidden",
          "animate-in zoom-in-95 fade-in duration-200",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand/15 border border-brand/20 flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-brand" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="batch-transform-modal-title"
                className="text-base font-extrabold text-white"
              >
                Batch Transform
              </h2>
              <p className="text-xs text-muted-foreground">
                Applying AI style to{" "}
                <span className="text-white font-bold">{safeCount}</span> clip
                {safeCount !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-xl text-muted-foreground hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Close batch transform dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Style picker */}
        <div className="px-6 py-5 overflow-y-auto max-h-[60vh]">
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
            Choose a style
          </p>
          <StylePicker
            selectedStyle={selectedStyle}
            disabled={isSubmitting}
            onStyleSelect={setSelectedStyle}
          />
        </div>

        {/* Error */}
        {safeError && (
          <div className="mx-6 mb-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
            {safeError}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-white/5">
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl border border-white/10 text-sm font-bold text-gray-300 hover:bg-white/5 hover:border-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={!selectedStyle || isSubmitting}
            className={[
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
              selectedStyle && !isSubmitting
                ? "bg-brand text-black hover:bg-brand/90"
                : "bg-brand/30 text-black/50 cursor-not-allowed",
            ].join(" ")}
            aria-disabled={!selectedStyle || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                Starting…
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" aria-hidden="true" />
                Transform {safeCount} clip{safeCount !== 1 ? "s" : ""}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
