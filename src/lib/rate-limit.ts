/**
 * Simple in-memory rate limiter
 * In production, use Redis or Vercel KV
 */

interface RateLimitOptions {
    uniqueTokenPerInterval: number;
    interval: number;
}

const options: RateLimitOptions = {
    uniqueTokenPerInterval: 500, // Max users per interval
    interval: 60000, // 1 minute
};

const tokenCache = new Map<string, number[]>();

interface RateLimitChecker {
    check: (res: Response, limit: number, token: string) => Promise<void>;
}

export function rateLimit(limit: number): RateLimitChecker {
    return {
        check: (res: Response, limit: number, token: string) =>
            new Promise((resolve, reject) => {
                const tokenCount = tokenCache.get(token) || [0];
                if (tokenCount[0] === 0) {
                    tokenCache.set(token, tokenCount);
                }
                tokenCount[0] += 1;

                const currentUsage = tokenCount[0];
                const isRateLimited = currentUsage >= limit;

                // Reset cache occasionally
                if (tokenCache.size > options.uniqueTokenPerInterval) {
                    tokenCache.clear();
                }

                if (isRateLimited) {
                    reject();
                } else {
                    resolve();
                }
            }),
    };
}

interface TokenData {
    count: number;
    lastReset: number;
}

export class RateLimiter {
    private limit: number;
    private interval: number;
    private tokens: Map<string, TokenData>;

    constructor(limit: number = 10, interval: number = 60000) {
        this.limit = limit;
        this.interval = interval;
        this.tokens = new Map();
    }

    check(ip: string): boolean {
        const now = Date.now();
        const windowStart = now - this.interval;

        const tokenData = this.tokens.get(ip) || { count: 0, lastReset: now };

        if (tokenData.lastReset < windowStart) {
            tokenData.count = 0;
            tokenData.lastReset = now;
        }

        tokenData.count++;
        this.tokens.set(ip, tokenData);

        // Cleanup old tokens periodically
        if (this.tokens.size > 1000) {
            this.cleanup();
        }

        return tokenData.count <= this.limit;
    }

    private cleanup(): void {
        const now = Date.now();
        const windowStart = now - this.interval;
        for (const [key, value] of this.tokens.entries()) {
            if (value.lastReset < windowStart) {
                this.tokens.delete(key);
            }
        }
    }
}

// Global instance for middleware
export const globalRateLimiter = new RateLimiter(50); // 50 req/min
