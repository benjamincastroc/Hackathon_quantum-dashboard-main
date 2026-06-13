export async function withRetry<T>(
  fn: () => Promise<T>,
  { retries = 3, baseDelay = 3000 } = {}
): Promise<T> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const msg = String(err);
      const isRateLimit =
        msg.includes("429") ||
        msg.includes("rate_limit") ||
        msg.includes("Rate limit") ||
        msg.includes("Too Many Requests") ||
        msg.includes("tokens per minute");

      if (!isRateLimit || attempt === retries) throw err;

      const delay = baseDelay * 2 ** attempt; // 3s → 6s → 12s
      console.log(`[Retry] Rate limit — esperando ${delay / 1000}s (intento ${attempt + 1}/${retries})`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("Max retries superados");
}
