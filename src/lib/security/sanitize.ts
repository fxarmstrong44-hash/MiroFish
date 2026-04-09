import { z } from "zod";

const MAX_PAYLOAD_SIZE = 1024 * 100; // 100KB

export function sanitizeString(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim()
    .slice(0, 10000);
}

export function sanitizeObject(obj: Record<string, unknown>): Record<string, unknown> {
  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === "string") {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === "object" && value !== null && !Array.isArray(value)) {
      sanitized[key] = sanitizeObject(value as Record<string, unknown>);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

export function validatePayloadSize(body: string | Buffer): boolean {
  const size = typeof body === "string" ? Buffer.byteLength(body) : body.length;
  return size <= MAX_PAYLOAD_SIZE;
}

export const emailSchema = z.string().email().max(255);
export const passwordSchema = z.string().min(8).max(128);
export const symbolSchema = z.string().min(1).max(10).regex(/^[A-Z0-9./-]+$/i);
export const amountSchema = z.number().positive().max(1_000_000_000);
