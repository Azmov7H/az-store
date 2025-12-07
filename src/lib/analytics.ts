/**
 * Lightweight Analytics SDK
 * Sends events silently to the backend.
 */

const ANALYTICS_ENDPOINT = "/api/analytics/track";

interface DeviceInfo {
    userAgent: string;
    device: "mobile" | "desktop";
    screen: string;
    language: string;
}

interface AnalyticsEvent {
    sessionId: string | null;
    type: string;
    url: string;
    path: string;
    referrer: string;
    timestamp: string;
    metadata: Record<string, unknown>;
    deviceInfo: DeviceInfo | Record<string, never>;
}

interface ProductData {
    id: string;
    title: string;
    price: number;
    category?: string;
}

function getSessionId(): string | null {
    if (typeof window === "undefined") return null;
    let sid = localStorage.getItem("az_session_id");
    if (!sid) {
        sid = "sess_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
        localStorage.setItem("az_session_id", sid);
    }
    return sid;
}

function getDeviceInfo(): DeviceInfo | Record<string, never> {
    if (typeof window === "undefined") return {};
    const ua = navigator.userAgent;
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
    return {
        userAgent: ua,
        device: isMobile ? "mobile" : "desktop",
        screen: `${window.screen.width}x${window.screen.height}`,
        language: navigator.language,
    };
}

async function sendEvent(eventType: string, data: Record<string, unknown> = {}): Promise<void> {
    if (typeof window === "undefined") return;

    const payload: AnalyticsEvent = {
        sessionId: getSessionId(),
        type: eventType,
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer,
        timestamp: new Date().toISOString(),
        metadata: data,
        deviceInfo: getDeviceInfo(),
    };

    try {
        // Use sendBeacon for reliability on page unload, fallback to fetch
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        const success = navigator.sendBeacon(ANALYTICS_ENDPOINT, blob);

        if (!success) {
            // Fallback to fetch with keepalive
            await fetch(ANALYTICS_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                keepalive: true,
            });
        }
    } catch (err) {
        // Silent fail - analytics should not break the app
        if (process.env.NODE_ENV === "development") {
            console.error("[Analytics] Failed to send event:", err);
        }
    }
}

export const analytics = {
    pageView: (url: string): Promise<void> => sendEvent("page_view", { url }),

    productView: (product: ProductData): Promise<void> =>
        sendEvent("product_view", {
            productId: product.id,
            productName: product.title,
            price: product.price,
            category: product.category,
        }),

    addToCart: (product: ProductData, quantity: number, options?: { color?: string; size?: string }): Promise<void> =>
        sendEvent("add_to_cart", {
            productId: product.id,
            productName: product.title,
            price: product.price,
            quantity,
            details: options
        }),

    removeFromCart: (productId: string): Promise<void> =>
        sendEvent("remove_from_cart", { productId }),

    checkoutStart: (cartTotal: number, cartItemsCount: number): Promise<void> =>
        sendEvent("checkout_start", { value: cartTotal, itemsCount: cartItemsCount }),

    checkoutSuccess: (orderId: string, total: number): Promise<void> =>
        sendEvent("checkout_success", { orderId, value: total }),
};
