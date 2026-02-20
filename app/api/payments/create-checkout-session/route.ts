
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { auth } from "@/auth";

export const dynamic = 'force-dynamic';

const PRICES = {
    starter: 350, // £3.50
    plus: 699,    // £6.99
    pro: 999,      // £9.99
};

export async function GET(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const tier = searchParams.get("tier");

        if (!tier || !Object.keys(PRICES).includes(tier)) {
            return NextResponse.json({ error: "Invalid tier" }, { status: 400 });
        }

        const priceAmount = PRICES[tier as keyof typeof PRICES];

        // Create Stripe Checkout Session
        const checkoutSession = await stripe.checkout.sessions.create({
            mode: "subscription",
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "gbp",
                        product_data: {
                            name: `WishCard ${tier.charAt(0).toUpperCase() + tier.slice(1)} Subscription`,
                            description: `Upgrade to ${tier} tier`,
                        },
                        unit_amount: priceAmount,
                        recurring: {
                            interval: "month",
                        },
                    },
                    quantity: 1,
                },
            ],
            client_reference_id: session.user.email || undefined, // Use email as ID since Google ID varies
            success_url: `${process.env.NEXTAUTH_URL}/profile?success=true&session_id={CHECKOUT_SESSION_ID}&tier=${tier}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/profile?canceled=true`,
            metadata: {
                userId: session.user.email || "",
                tier: tier,
            },
        });

        if (!checkoutSession.url) {
            throw new Error("Failed to create checkout session URL");
        }

        // Redirect to Stripe checkout
        return NextResponse.redirect(checkoutSession.url);
    } catch (error) {
        console.error("Stripe checkout error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
