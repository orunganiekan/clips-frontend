"use client";

import React from "react";
import { RotateCcw } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProjectFiltersProps {
  captionsStyle: string;
  onCaptionsStyleChange: (style: string) => void;
  viralityLevels: string[];
  onViralityLevelToggle: (level: string) => void;
  activeFilterCount: number;
  onResetFilters: () => void;
  vaultFilter: string;
  onVaultFilterChange: (vault: string) => void;
  mobile?: boolean;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const STYLE_OPTIONS = ["All Styles", "Bold & Dynamic", "Minimalist", "Emoji-Rich", "Subtitles Only"];
const VIRALITY_LEVELS = [
  { key: "high", label: "High", colour: "text-green-400" },
  { key: "medium", label: "Medium", colour: "text-yellow-400" },
  { key: "low", label: "Low", colour: "text-red-400" },
];
const VAULT_FILTERS = [
  { key: "pending", label: "Pending" },
  { key: "listed", label: "Listed" },
  { key: "history", label: "History" },
];

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Project sidebar filters for clip style, virality, and vault status.
 */
export default function ProjectFilters({
  captionsStyle,
  onCaptionsStyleChange,
  viralityLevels,
  onViralityLevelToggle,
  activeFilterCount,
  onResetFilters,
  vaultFilter,
  onVaultFilterChange,
}: ProjectFiltersProps) {
  return (
    <nav
      className="w-52 space-y-6"
      aria-label="Clip filters"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-extrabold text-white uppercase tracking-wider">Filters</span>
        {activeFilterCount > 0 && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-[10px] font-bold text-brand hover:underline"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            Reset {activeFilterCount}
          </button>
        )}
      </div>

      {/* Vault status */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Status
        </p>
        {VAULT_FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onVaultFilterChange(key)}
            className={[
              "w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors",
              vaultFilter === key
                ? "bg-brand/10 text-brand border border-brand/20"
                : "text-muted-foreground hover:text-white hover:bg-white/5",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Caption style */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Caption Style
        </p>
        <select
          value={captionsStyle}
          onChange={(e) => onCaptionsStyleChange(e.target.value)}
          className={[
            "w-full px-3 py-2 rounded-lg text-xs font-semibold",
            "bg-input border border-white/10 text-white",
            "focus:outline-none focus:ring-1 focus:ring-brand/40",
          ].join(" ")}
          aria-label="Filter by caption style"
        >
          {STYLE_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Virality */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
          Virality Score
        </p>
        {VIRALITY_LEVELS.map(({ key, label, colour }) => (
          <label
            key={key}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <input
              type="checkbox"
              checked={viralityLevels.includes(key)}
              onChange={() => onViralityLevelToggle(key)}
              className="w-3.5 h-3.5 rounded accent-brand"
              aria-label={`Include ${label} virality clips`}
            />
            <span className={`text-xs font-semibold ${colour} group-hover:opacity-100 opacity-80`}>
              {label}
            </span>
          </label>
        ))}
      </div>
    </nav>
  );
}
