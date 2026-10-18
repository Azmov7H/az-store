export interface SiteStats {
    products: number;
    customers: number;
    /** Number of brands actually displayed in the storefront carousel */
    brands: number;
    /**
     * Share of verified reviews rated 4+ stars (0-100).
     * `null` when there are no verified reviews yet — callers hide the card
     * instead of showing a placeholder number.
     */
    satisfaction: number | null;
}
