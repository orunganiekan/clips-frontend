"use client";

import React, { useRef } from "react";
import { X } from "lucide-react";
import { sanitize } from "@/app/lib/sanitize";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ClipPreviewModalProps {
  clip: {
    id: string;
    title: string;
    videoUrl: string;
    duration: string;
    style: string;
    score: number;
  };
  onClose: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Fullscreen video preview modal.
 */
export default function ClipPreviewModal({ clip, onClose }: ClipPreviewModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const safeTitle = sanitize(clip.title);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="clip-preview-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm bg-black border border-white/10 rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-black/60 absolute top-0 left-0 right-0 z-10">
          <h2 id="clip-preview-title" className="text-xs font-bold text-white truncate pr-4">
            {safeTitle}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full bg-black/60 text-white hover:bg-white/20 transition-colors shrink-0"
            aria-label="Close preview"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video */}
        {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
        <video
          ref={videoRef}
          src={clip.videoUrl}
          className="w-full aspect-[9/16] object-contain bg-black"
          controls
          autoPlay
          playsInline
          loop
        />

        {/* Meta */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-surface border-t border-white/5">
          <span className="text-[10px] text-muted-foreground">{sanitize(clip.style)}</span>
          <span className="text-[10px] font-bold text-muted-foreground">{clip.duration}</span>
          <span className="text-[10px] font-bold text-brand">{clip.score}</span>
        </div>
      </div>
    </div>
  );
}
