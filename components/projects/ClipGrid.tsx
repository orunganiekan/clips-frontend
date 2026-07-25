"use client";

import React from "react";
import { Eye, PenLine, Check, Star } from "lucide-react";
import { sanitize } from "@/app/lib/sanitize";
import Skeleton from "@/components/ui/Skeleton";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Clip {
  id: string;
  title: string;
  thumbnail: string;
  score: number;
  scoreKey: string;
  duration: string;
  style: string;
  status: string;
  resolution: string;
  videoUrl: string;
}

export interface ClipGridProps {
  clips: Clip[];
  selectedIds: string[];
  onSelect: (id: string) => void;
  onSelectAll: () => void;
  onSelectNone: () => void;
  onSelectByScore: (minScore: number) => void;
  aiRecommendations: boolean;
  recommendedIds: string[];
  recommendationThreshold: number;
  onToggleRecommendations: () => void;
  onAutoSelect: () => void;
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
  loading: boolean;
  totalClips: number;
  loadingNextPage: boolean;
  onLoadMore: () => void;
  hasMore: boolean;
}

// ─── Score colour ─────────────────────────────────────────────────────────────

function scoreColour(key: string): string {
  switch (key) {
    case "high":
      return "text-green-400 bg-green-400/10";
    case "medium":
      return "text-yellow-400 bg-yellow-400/10";
    case "low":
    default:
      return "text-red-400 bg-red-400/10";
  }
}

// ─── Clip card ────────────────────────────────────────────────────────────────

function ClipCard({
  clip,
  isSelected,
  isRecommended,
  showRecommendation,
  onSelect,
  onEdit,
  onPreview,
}: {
  clip: Clip;
  isSelected: boolean;
  isRecommended: boolean;
  showRecommendation: boolean;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onPreview: (id: string) => void;
}) {
  const safeTitle = sanitize(clip.title);

  return (
    <article
      className={[
        "relative group rounded-2xl border overflow-hidden cursor-pointer",
        "bg-surface transition-all duration-200",
        isSelected
          ? "border-brand ring-1 ring-brand/30 shadow-[0_0_16px_rgba(0,255,133,0.08)]"
          : "border-white/5 hover:border-white/15",
        showRecommendation && isRecommended && !isSelected
          ? "border-brand/30"
          : "",
      ].join(" ")}
      onClick={() => onSelect(clip.id)}
      aria-pressed={isSelected}
      aria-label={`${safeTitle}${isSelected ? ", selected" : ""}`}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") onSelect(clip.id);
      }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-[9/16] bg-input overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={clip.thumbnail}
          alt={safeTitle}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Selection overlay */}
        {isSelected && (
          <div className="absolute inset-0 bg-brand/10 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center shadow-lg">
              <Check className="w-4 h-4 text-black" aria-hidden="true" />
            </div>
          </div>
        )}

        {/* Recommendation badge */}
        {showRecommendation && isRecommended && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-brand/20 border border-brand/30 backdrop-blur-sm">
            <Star className="w-2.5 h-2.5 text-brand" aria-hidden="true" />
            <span className="text-[9px] font-bold text-brand">AI Pick</span>
          </div>
        )}

        {/* Duration */}
        <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-black/70 text-[10px] font-bold text-white">
          {clip.duration}
        </div>

        {/* Hover actions */}
        <div className="absolute inset-0 flex items-end justify-center pb-3 gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onPreview(clip.id); }}
            className="p-2 rounded-full bg-black/70 text-white hover:bg-brand hover:text-black transition-colors"
            aria-label={`Preview ${safeTitle}`}
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(clip.id); }}
            className="p-2 rounded-full bg-black/70 text-white hover:bg-brand hover:text-black transition-colors"
            aria-label={`Edit ${safeTitle}`}
          >
            <PenLine className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="px-3 py-2.5">
        <p className="text-xs font-semibold text-white truncate">{safeTitle}</p>
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-muted-foreground">{sanitize(clip.style)}</span>
          <span
            className={[
              "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
              scoreColour(clip.scoreKey),
            ].join(" ")}
          >
            {clip.score}
          </span>
        </div>
      </div>
    </article>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

/**
 * Grid of clip cards with selection, AI recommendations, and pagination.
 */
export default function ClipGrid({
  clips,
  selectedIds,
  onSelect,
  onSelectAll,
  onSelectNone,
  aiRecommendations,
  recommendedIds,
  recommendationThreshold,
  onToggleRecommendations,
  onAutoSelect,
  onEdit,
  onPreview,
  loading,
  totalClips,
  loadingNextPage,
  onLoadMore,
  hasMore,
}: ClipGridProps) {
  const selectedSet = new Set(selectedIds);
  const allSelected = clips.length > 0 && clips.every((c) => selectedSet.has(c.id));

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-white/5">
            <Skeleton className="aspect-[9/16] w-full" />
            <div className="p-3 space-y-2">
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2.5 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (clips.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
        <p className="text-muted-foreground text-sm">No clips match your filters.</p>
        <button
          onClick={onSelectNone}
          className="text-xs text-brand hover:underline"
        >
          Reset filters
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={allSelected ? onSelectNone : onSelectAll}
            className="text-xs font-bold text-brand hover:underline"
          >
            {allSelected ? "Deselect all" : "Select all"}
          </button>
          <span className="text-muted-foreground text-xs">·</span>
          <span className="text-xs text-muted-foreground">
            {totalClips} clip{totalClips !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onToggleRecommendations}
            className={[
              "flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border transition-colors",
              aiRecommendations
                ? "bg-brand/10 border-brand/30 text-brand"
                : "border-white/10 text-muted-foreground hover:border-white/20 hover:text-white",
            ].join(" ")}
          >
            <Star className="w-3 h-3" aria-hidden="true" />
            AI Picks
          </button>
          {aiRecommendations && recommendedIds.length > 0 && (
            <button
              onClick={onAutoSelect}
              className="text-xs text-brand hover:underline"
            >
              Auto-select {recommendedIds.length} ≥ {recommendationThreshold}
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {clips.map((clip) => (
          <ClipCard
            key={clip.id}
            clip={clip}
            isSelected={selectedSet.has(clip.id)}
            isRecommended={recommendedIds.includes(clip.id)}
            showRecommendation={aiRecommendations}
            onSelect={onSelect}
            onEdit={onEdit}
            onPreview={onPreview}
          />
        ))}
        {/* Loading skeleton cards for next page */}
        {loadingNextPage &&
          Array.from({ length: 4 }).map((_, i) => (
            <div key={`loading-${i}`} className="rounded-2xl overflow-hidden border border-white/5">
              <Skeleton className="aspect-[9/16] w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-2.5 w-1/2" />
              </div>
            </div>
          ))}
      </div>

      {/* Load more */}
      {hasMore && !loadingNextPage && (
        <div className="flex justify-center pt-4">
          <button
            onClick={onLoadMore}
            className="px-6 py-2.5 rounded-xl border border-white/10 text-sm font-bold text-white hover:bg-white/5 transition-colors"
          >
            Load more
          </button>
        </div>
      )}
    </div>
  );
}
