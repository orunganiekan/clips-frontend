import { NextRequest, NextResponse } from "next/server";
import { checkCsrf } from "@/app/lib/csrf";
import { applyRateLimit } from "@/app/lib/serverRateLimit";
import { requireAuth } from "@/app/api/jobs/shared/authGuard";
import { dispatchJob } from "@/app/lib/aiBackend";
import { logger } from "@/app/lib/logger";
import { randomUUID } from "crypto";

// ─── Validation ───────────────────────────────────────────────────────────────

/** Allowed transform styles sourced from env at startup, with a safe fallback. */
const ALLOWED_STYLES: string[] = (() => {
  const raw = process.env.NEXT_PUBLIC_TRANSFORM_STYLES ?? "anime,cinematic,sketch,watercolor";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
})();

interface TransformRequestBody {
  clipId: string;
  style: string;
  userId?: string;
}

function validateBody(
  body: unknown,
): { valid: true; data: TransformRequestBody } | { valid: false; error: string } {
  if (!body || typeof body !== "object") {
    return { valid: false, error: "Request body must be a JSON object." };
  }
  const b = body as Record<string, unknown>;

  if (typeof b.clipId !== "string" || !b.clipId.trim()) {
    return { valid: false, error: "clipId is required and must be a non-empty string." };
  }
  if (typeof b.style !== "string" || !ALLOWED_STYLES.includes(b.style.toLowerCase())) {
    return {
      valid: false,
      error: `style must be one of: ${ALLOWED_STYLES.join(", ")}.`,
    };
  }

  return {
    valid: true,
    data: {
      clipId: b.clipId.trim(),
      style: b.style.toLowerCase(),
      userId: typeof b.userId === "string" ? b.userId : undefined,
    },
  };
}

// ─── POST /api/transform ──────────────────────────────────────────────────────

/**
 * Create a new AI video transformation job.
 *
 * Request body:
 *   { clipId: string, style: string, userId?: string }
 *
 * Response:
 *   201 { jobId, clipId, style, status: "queued" }
 *
 * The job is dispatched to the AI backend immediately. The backend reports
 * progress via callbacks to /api/jobs/[id]/callback (same flow as clip jobs).
 */
export async function POST(request: NextRequest) {
  // Rate-limit to 20 transform requests per minute per client
  const rateLimited = await applyRateLimit(request, { limit: 20, windowMs: 60_000 });
  if (rateLimited) return rateLimited;

  const csrfError = checkCsrf(request);
  if (csrfError) return csrfError;

  const authResult = await requireAuth();
  if (authResult instanceof NextResponse) return authResult;
  const { userId: authenticatedUserId } = authResult;

  // Parse body
  let rawBody: unknown;
  try {
    rawBody = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const validation = validateBody(rawBody);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 });
  }

  const { clipId, style } = validation.data;
  const userId = authenticatedUserId;

  // Build job id and derive the source clip's storage key
  const jobId = `transform_${randomUUID().replace(/-/g, "")}`;
  // The source clip key follows the same convention used by uploadFile:
  // KEY_PREFIX + clipId + extension. We pass the clipId as sourceClipKey
  // and let the AI backend resolve the full path using its own storage config.
  const sourceClipKey = `uploads/${clipId}`;

  // Derive callback URL from NEXTAUTH_URL (same approach as jobs/[id]/route.ts)
  const base =
    process.env.NEXTAUTH_URL?.replace(/\/$/, "") ??
    `${request.nextUrl.protocol}//${request.nextUrl.host}`;
  const callbackUrl = `${base}/api/jobs/${jobId}/callback`;

  const dispatchResult = await dispatchJob({
    jobId,
    userId,
    objectKey: sourceClipKey,
    contentType: "video/mp4",
    filename: `${clipId}.mp4`,
    callbackUrl,
    transformStyle: style,
    sourceClipKey,
  });

  if (!dispatchResult.dispatched) {
    logger.warn(
      `[transform] Dispatch failed for job ${jobId}: ${dispatchResult.reason}. ` +
        "Job will remain in queued status.",
    );
  }

  return NextResponse.json(
    {
      jobId,
      clipId,
      style,
      status: "queued",
      dispatched: dispatchResult.dispatched,
    },
    { status: 201 },
  );
}
