"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTransformStore } from "@/app/store/transformStore";
import type { TransformJob } from "@/app/store/transformStore";
import { logger } from "@/app/lib/logger";

/** Shape returned by the job status endpoint (reusing the existing /api/jobs/[id] contract). */
interface JobStatusResponse {
  progress: number;
  status: TransformJob["status"];
  momentsFound?: number;
  estimatedSecondsRemaining?: number | null;
  errorMessage?: string;
  previewUrl?: string;
  resultUrl?: string;
}

const POLL_INTERVAL_MS = 3_000;
const TERMINAL_STATUSES: TransformJob["status"][] = ["complete", "error"];

/**
 * Poll /api/jobs/[jobId] for transform progress and keep the transformStore in sync.
 *
 * Returns a `stopPolling` function so the caller can cancel polling explicitly
 * (e.g. when the component unmounts or the user navigates away).
 *
 * @param jobId  - The transform job id to monitor.
 * @param enabled - Set to false to prevent polling (default: true).
 */
export function useTransformStatus(jobId: string | null, enabled = true) {
  const { updateJob } = useTransformStore();
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const destroyedRef = useRef(false);

  const stopPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    destroyedRef.current = false;
    if (!jobId || !enabled) return stopPolling;

    const poll = async () => {
      if (destroyedRef.current) return;
      try {
        const res = await fetch(`/api/jobs/${encodeURIComponent(jobId)}`);
        if (!res.ok) {
          logger.warn(`[useTransformStatus] Non-OK response for job ${jobId}: ${res.status}`);
          return;
        }
        const data = (await res.json()) as JobStatusResponse;

        updateJob(jobId, {
          progress: data.progress ?? 0,
          status: data.status,
          ...(data.previewUrl ? { previewUrl: data.previewUrl } : {}),
          ...(data.resultUrl ? { resultUrl: data.resultUrl } : {}),
          ...(data.errorMessage ? { errorMessage: data.errorMessage } : {}),
        });

        // Stop polling once a terminal state is reached
        if (TERMINAL_STATUSES.includes(data.status)) {
          stopPolling();
        }
      } catch (err) {
        logger.error(
          `[useTransformStatus] Poll error for job ${jobId}: ${err instanceof Error ? err.message : String(err)}`,
        );
      }
    };

    // Immediate first fetch
    poll();

    intervalRef.current = setInterval(poll, POLL_INTERVAL_MS);

    return () => {
      destroyedRef.current = true;
      stopPolling();
    };
  }, [jobId, enabled, updateJob, stopPolling]);

  return { stopPolling };
}
