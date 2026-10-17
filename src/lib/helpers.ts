// Helper utility functions with TypeScript types

export function generateOrderId(): string {
    return `ORD-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
}
