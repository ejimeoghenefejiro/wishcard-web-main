// Subscription tier definitions and usage tracking utilities

export const SUBSCRIPTION_TIERS = {
    free: {
        name: "Free",
        emoji: "🆓",
        cardsPerMonth: 4,
        price: "£0",
        priceLabel: "Free forever",
        watermark: true,
        color: "gray",
        features: ["4 cards total (trial)", "Watermark on images", "Basic styles"],
    },
    starter: {
        name: "Starter",
        emoji: "🟢",
        cardsPerMonth: 25,
        price: "£3.50",
        priceLabel: "£3.50/month",
        watermark: false,
        color: "green",
        features: ["25 cards per month", "No watermarks", "All styles"],
        stripeParam: "starter",
    },
    plus: {
        name: "Plus",
        emoji: "🔵",
        cardsPerMonth: 60,
        price: "£6.99",
        priceLabel: "£6.99/month",
        watermark: false,
        color: "blue",
        features: ["60 cards per month", "No watermarks", "Priority generation", "All styles"],
        stripeParam: "plus",
        popular: true,
    },
    pro: {
        name: "Pro",
        emoji: "🔴",
        cardsPerMonth: 120,
        price: "£9.99",
        priceLabel: "£9.99/month",
        watermark: false,
        color: "red",
        features: ["120 cards per month", "No watermarks", "Fastest generation", "Priority support"],
        stripeParam: "pro",
    },
} as const;

export type SubscriptionTier = keyof typeof SUBSCRIPTION_TIERS;

// localStorage-based usage tracking (until backend DB is wired up)
export function getCardsUsedThisMonth(userId: string): number {
    if (typeof window === "undefined") return 0;
    const key = `cards_used_${userId}_${new Date().getFullYear()}_${new Date().getMonth()}`;
    return parseInt(localStorage.getItem(key) || "0", 10);
}

export function incrementCardsUsed(userId: string): void {
    if (typeof window === "undefined") return;
    const key = `cards_used_${userId}_${new Date().getFullYear()}_${new Date().getMonth()}`;
    const current = parseInt(localStorage.getItem(key) || "0", 10);
    localStorage.setItem(key, String(current + 1));
}

export function canGenerateCard(tier: SubscriptionTier, userId: string): boolean {
    const limit = SUBSCRIPTION_TIERS[tier].cardsPerMonth;
    const used = getCardsUsedThisMonth(userId);
    return used < limit;
}

export function getLocalSubscription(userId: string): SubscriptionTier | null {
    if (typeof window === "undefined") return null;
    const key = `subscription_${userId}`;
    return localStorage.getItem(key) as SubscriptionTier | null;
}

export function setLocalSubscription(userId: string, tier: SubscriptionTier): void {
    if (typeof window === "undefined") return;
    const key = `subscription_${userId}`;
    localStorage.setItem(key, tier);
}
