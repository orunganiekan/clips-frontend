import { NextResponse } from "next/server";
import type { ApiResponse } from "@/app/api/types";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TransformStyle {
  /** Stable machine identifier, e.g. "anime" */
  name: string;
  /** Human-readable label, e.g. "Anime" */
  label: string;
  /** Short description shown beneath the style name */
  description: string;
  /** URL to a representative before/after thumbnail image */
  thumbnail: string;
  /** Estimated processing time in seconds */
  avgDurationSeconds: number;
}

// ─── Style catalogue ──────────────────────────────────────────────────────────

/**
 * Static style catalogue for V1.
 *
 * In a future iteration this can be sourced from a CMS or database.
 * Thumbnails point to public assets served from /public/styles/.
 */
const STYLES: TransformStyle[] = [
  {
    name: "anime",
    label: "Anime",
    description: "Bold outlines, vivid colours, cel-shaded look",
    thumbnail: "/styles/anime.jpg",
    avgDurationSeconds: 45,
  },
  {
    name: "cinematic",
    label: "Cinematic",
    description: "Film grain, colour grading, anamorphic lens flares",
    thumbnail: "/styles/cinematic.jpg",
    avgDurationSeconds: 55,
  },
  {
    name: "sketch",
    label: "Sketch",
    description: "Pencil-drawn outlines with subtle paper texture",
    thumbnail: "/styles/sketch.jpg",
    avgDurationSeconds: 38,
  },
  {
    name: "watercolor",
    label: "Watercolour",
    description: "Soft washes, blurred edges, painterly brush strokes",
    thumbnail: "/styles/watercolor.jpg",
    avgDurationSeconds: 50,
  },
  {
    name: "retro-vhs",
    label: "Retro VHS",
    description: "Scan lines, colour bleed, 80s tape-deck artefacts",
    thumbnail: "/styles/retro-vhs.jpg",
    avgDurationSeconds: 35,
  },
  {
    name: "neon-noir",
    label: "Neon Noir",
    description: "High-contrast shadows with vivid neon accent lighting",
    thumbnail: "/styles/neon-noir.jpg",
    avgDurationSeconds: 60,
  },
];

// ─── GET /api/transform/styles ────────────────────────────────────────────────

/**
 * Returns the list of available AI transformation style presets.
 *
 * Response: 200 { data: TransformStyle[], error: null }
 *
 * This endpoint is intentionally unauthenticated — style metadata is
 * public information and safe to expose without a session.
 */
export async function GET(): Promise<NextResponse<ApiResponse<TransformStyle[]>>> {
  return NextResponse.json({ data: STYLES, error: null });
}
