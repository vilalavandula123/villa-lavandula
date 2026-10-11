import "server-only";

// Прост лимит в паметта на сървъра (един процес). При хостинг с много инстанции — заменете с общо хранилище.
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;

export function rateLimit(key: string, limit = Number(process.env.ENQUIRY_RATE_LIMIT || 5)): boolean {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= limit) {
    hits.set(key, list);
    return false;
  }
  list.push(now);
  hits.set(key, list);
  if (hits.size > 5000) for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  return true;
}

// Запомня успешно изпратени запитвания, за да не се дублират при повторно натискане.
const sent = new Map<string, number>();
export function wasSent(id: string): boolean {
  const t = sent.get(id);
  return t !== undefined && Date.now() - t < 30 * 60 * 1000;
}
export function markSent(id: string) {
  sent.set(id, Date.now());
  if (sent.size > 5000) for (const [k, t] of sent) if (Date.now() - t > 30 * 60 * 1000) sent.delete(k);
}
