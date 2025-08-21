// --- In-memory fallback cache ---
const viewCache = new Map<string, number>();
export function hasRecentView(key: string, ttl: number = 300000): boolean {
  const now = Date.now();
  if (viewCache.has(key)) {
    const last = viewCache.get(key)!;
    if (now - last < ttl) return true;
  }
  viewCache.set(key, now);
  return false;
}
