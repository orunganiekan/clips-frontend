"use client";

import React from "react";
import { Clock, CheckCircle2 } from "lucide-react";
import { sanitize } from "@/app/lib/sanitize";
import type { TransformStyle } from "@/app/api/transform/styles/route";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDuration(seconds: number): string {
  if (seconds < 60) return `~${seconds}s`;
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return s > 0 ? `~${m}m ${s}s` : `~${m}m`;
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface StyleCardProps {
  style: TransformStyle;
  /** Whether this card is the currently selected style */
  isSelected?: boolean;
  /** When true the card cannot be interacted with (e.g. during active processing) */
  isDisabled?: boolean;
  /** Called when the user selects this style */
  onSelect?: (name: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function StyleCard({
  style,
  isSelected = false,
  isDisabled = false,
  onSelect,
}: StyleCardProps) {
  const handleClick = () => {
    if (!isDisabled) {
      onSelect?.(style.name);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      disabled={isDisabled}
      aria-pressed={isSelected}
      aria-label={`Select ${sanitize(style.label)} style`}
      className={[
        "group relative flex flex-col text-left rounded-2xl overflow-hidden border transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isDisabled
          ? "opacity-40 cursor-not-allowed border-white/5 bg-input"
          : isSelected
            ? "border-brand/60 bg-surface shadow-[0_0_0_1px_var(--color-brand)] cursor-default"
            : "border-white/10 bg-input hover:border-brand/40 hover:bg-surface cursor-pointer",
      ].join(" ")}
    >
      {/* ── Thumbnail ── */}
      <div className="relative w-full aspect-video overflow-hidden bg-background">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={style.thumbnail}
          alt={`${sanitize(style.label)} style preview`}
          className={[
            "w-full h-full object-cover transition-transform duration-300",
            !isDisabled && !isSelected ? "group-hover:scale-105" : "",
          ].join(" ")}
          loading="lazy"
        />

        {/* Selected overlay checkmark */}
        {isSelected && (
          <div className="absolute inset-0 bg-brand/10 flex items-center justify-center">
            <div className="w-9 h-9 rounded-full bg-brand flex items-center justify-center shadow-lg">
              <CheckCircle2 className="w-5 h-5 text-black" aria-hidden="true" />
            </div>
          </div>
        )}

        {/* Selected ring accent on top of image */}
        {isSelected && (
          <div className="absolute inset-0 ring-2 ring-inset ring-brand/50 rounded-t-2xl pointer-events-none" />
        )}
      </div>

      {/* ── Card body ── */}
      <div className="flex flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <span
            className={[
              "text-[13px] font-bold leading-tight",
              isSelected ? "text-brand" : "text-white",
            ].join(" ")}
          >
            {sanitize(style.label)}
          </span>

          {/* Processing time badge */}
          <span className="flex items-center gap-1 shrink-0 text-[11px] font-semibold text-muted-foreground bg-white/5 border border-white/5 px-2 py-0.5 rounded-full">
            <Clock className="w-3 h-3" aria-hidden="true" />
            {formatDuration(style.avgDurationSeconds)}
          </span>
        </div>

        <p className="text-[12px] text-muted-foreground leading-relaxed line-clamp-2">
          {sanitize(style.description)}
        </p>
      </div>
    </button>
  );
}
