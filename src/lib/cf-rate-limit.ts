import "server-only";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type RateLimiter = { limit: (o: { key: string }) => Promise<{ success: boolean }> };

/**
 * Ограничение на честотата чрез Cloudflare Rate Limiting (binding ENQUIRY_RATE_LIMITER в wrangler.jsonc).
 * Важи за всички сървъри на Cloudflare, не само за един процес. Ако binding липсва
 * (например при `next dev`), не блокира — тогава остава само локалното ограничение.
 */
export async function edgeRateLimit(key: string): Promise<boolean> {
  try {
    const env = getCloudflareContext().env as unknown as { ENQUIRY_RATE_LIMITER?: RateLimiter };
    if (!env.ENQUIRY_RATE_LIMITER) return true;
    const { success } = await env.ENQUIRY_RATE_LIMITER.limit({ key });
    return success;
  } catch {
    return true;
  }
}
