/**
 * jobStore — persistent job state adapter.
 *
 * The exported `jobStore` object is a thin interface that today is backed by
 * an in-process Map (suitable for a single-instance dev server). In production
 * swap the backing implementation for a Redis or database adapter without
 * changing any route code.
 *
 * The AI backend writes updates by calling POST /api/jobs/[id]/callback with
 * a shared secret. Routes only _read_ from this store; they never synthesise
 * fake progress values.
 */

export type JobStatus = "queued" | "processing" | "complete" | "error";

export interface Job {
  id: string;
  /** Owner's session user id — used for authorisation. */
  userId: string;
  status: JobStatus;
  progress: number;
  momentsFound: number;
  estimatedSecondsRemaining: number;
  createdAt: number;
  /** Human-readable error message set by the AI backend on failure. */
  errorCode?: AiErrorCode;
  errorMessage?: string;
}

/**
 * Structured error codes returned by the AI backend so the UI can display
 * actionable messages rather than generic "something went wrong" copy.
 */
export type AiErrorCode =
  | "UNSUPPORTED_CODEC"
  | "VIDEO_TOO_SHORT"
  | "VIDEO_TOO_LONG"
  | "PROCESSING_TIMEOUT"
  | "INTERNAL_ERROR";

export interface JobStore {
  get(id: string): Promise<Job | undefined>;
  set(id: string, job: Job): Promise<void>;
  delete(id: string): Promise<void>;
  clear(): Promise<void>;
  getAll(): Promise<Job[]>;
}

import { JobRepository, createJobRepository } from "./jobRepository";
import { logger } from "@/app/lib/logger";

class JobRepositoryAdapter implements JobStore {
  private readonly repo: JobRepository;

  constructor() {
    this.repo = createJobRepository();
    
    // Startup health check for Redis configuration
    if (process.env.NODE_ENV === "production" && !process.env.REDIS_URL) {
      logger.warn(
        "[jobStore] Running in production without REDIS_URL. Job state will not persist across serverless instances. " +
        "Set REDIS_URL in your environment variables to enable Redis-backed job storage."
      );
    }
  }

  async get(id: string): Promise<Job | undefined> {
    const job = await this.repo.get(id);
    return job || undefined;
  }

  async set(id: string, job: Job): Promise<void> {
    await this.repo.set(id, job);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  async clear(): Promise<void> {
    await this.repo.clear();
  }

  async getAll(): Promise<Job[]> {
    // JobRepository doesn't have getAll(), so we need to track IDs separately
    // For now, return empty array - this is a limitation of the current implementation
    // In production, you'd want to maintain a Redis set of all job IDs
    logger.warn("[jobStore] getAll() is not supported with JobRepository. Returns empty array.");
    return [];
  }
}

export const jobStore: JobStore = new JobRepositoryAdapter();
