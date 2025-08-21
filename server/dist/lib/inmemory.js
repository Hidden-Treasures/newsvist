"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hasRecentView = hasRecentView;
// --- In-memory fallback cache ---
const viewCache = new Map();
function hasRecentView(key, ttl = 300000) {
    const now = Date.now();
    if (viewCache.has(key)) {
        const last = viewCache.get(key);
        if (now - last < ttl)
            return true;
    }
    viewCache.set(key, now);
    return false;
}
