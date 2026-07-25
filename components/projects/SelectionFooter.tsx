"use client";

import React from "react";
import { Gem, Wand2, Send, Undo2, Redo2 } from "lucide-react";

// ─── Props ────────────────────────────────────────────────────────────────────

export interface SelectionFooterProps {
  /** Number of currently selected clips. */
  count: number;
  /** Ids of the selected clips. */
  selectedIds: string[];
  /** Called when the user clicks "Mint". */
  onMint: () => void;
  /** Whether a mint operation is currently in-flight. */
  isMinting: boolean;
  /** Revert the selection to the previous state. */
  undo: () => void;
  /** Reapply the next selection state. */
  redo: () => void;
  /** True when there is at least one step to undo. */
  canUndo: boolean;
  /** True when there is at least one step to redo. */
  canRedo: boolean;
  /** Called when the user clicks "Transform". */
  onTransform?: () => void;
  /** Whether a batch transform is currently in-flight. */
  isTransforming?: boolean;
  /** Called when the user clicks "Post". */
  onPost?: () => void;
  /** Whether a post operation is in-flight. */
  isPosting?: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Docked multi-select action footer.
 *
 * Appears (slides in) when at least one clip is selected.
 * Provides Mint, Transform, Post actions, plus Undo/Redo.
 */
export default function SelectionFooter({
  count,
  onMint,
  isMinting,
  undo,
  redo,
  canUndo,
  canRedo,
  onTransform,
  isTransforming = false,
  onPost,
  isPosting = false,
}: SelectionFooterProps) {
  if (count === 0) return null;

  return (
    <div
      className={[
        "sticky bottom-0 left-0 right-0 z-30",
        "flex items-center justify-between gap-3",
        "px-4 py-3 sm:px-6",
        "bg-surface/95 backdrop-blur-xl border-t border-white/10",
        "animate-in slide-in-from-bottom-2 duration-200",
      ].join(" ")}
      role="toolbar"
      aria-label="Clip selection actions"
    >
      {/* Selection count + undo/redo */}
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-bold text-white">
          {count} selected
        </span>

        {/* Undo */}
        <button
          onClick={undo}
          disabled={!canUndo}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Undo selection"
          title="Undo"
        >
          <Undo2 className="w-4 h-4" />
        </button>

        {/* Redo */}
        <button
          onClick={redo}
          disabled={!canRedo}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-white hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Redo selection"
          title="Redo"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {/* Post */}
        {onPost && (
          <button
            onClick={onPost}
            disabled={isPosting || isMinting || isTransforming}
            className={[
              "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all",
              "border border-white/10 bg-input hover:bg-white/10 text-white",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            ].join(" ")}
            aria-label={`Post ${count} clip${count !== 1 ? "s" : ""}`}
          >
            <Send className="w-3.5 h-3.5" />
            Post
          </button>
        )}

        {/* Transform */}
        {onTransform && (
          <button
            onClick={onTransform}
            disabled={isTransforming || isMinting}
            className={[
              "flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all",
              "border border-brand/30 bg-brand/10 hover:bg-brand/20 text-brand",
              "disabled:opacity-50 disabled:cursor-not-allowed",
            ].join(" ")}
            aria-label={`Transform ${count} clip${count !== 1 ? "s" : ""} with AI`}
            title="Apply AI style transformation to selected clips"
          >
            <Wand2 className="w-3.5 h-3.5" />
            Transform
            {isTransforming && (
              <span className="ml-0.5 w-2 h-2 rounded-full bg-brand/60 animate-pulse" />
            )}
          </button>
        )}

        {/* Mint */}
        <button
          onClick={onMint}
          disabled={isMinting || isTransforming}
          className={[
            "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all",
            "bg-brand text-black hover:bg-brand/90",
            "disabled:opacity-50 disabled:cursor-not-allowed",
          ].join(" ")}
          aria-label={`Mint ${count} clip${count !== 1 ? "s" : ""} as NFT${count !== 1 ? "s" : ""}`}
        >
          <Gem className="w-3.5 h-3.5" />
          {isMinting ? "Minting…" : "Mint"}
        </button>
      </div>
    </div>
  );
}
