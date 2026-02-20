"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "@/lib/subscriptions";
import { updateUserTier } from "@/lib/firestore";
import { ArrowLeft, Crown, LogOut, Zap, Star, Rocket } from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout, refetchUser } = useAuth();
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const purchasedTier = searchParams.get("tier");
  const [cardsUsed, setCardsUsed] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  useEffect(() => {
    async function handleSuccess() {
      if (success && purchasedTier && user?.email) {
        try {
          // Persist upgrade to Firestore
          await updateUserTier(user.email, purchasedTier as SubscriptionTier);
          // Refresh user data in context to reflect new tier immediately
          await refetchUser();
          // Clean URL
          window.history.replaceState({}, "", "/profile");
        } catch (err) {
          console.error("Failed to upgrade tier:", err);
        }
      }
    }
    handleSuccess();
  }, [success, purchasedTier, user, refetchUser]);

  useEffect(() => {
    if (user?.cardsUsed !== undefined) {
      setCardsUsed(user.cardsUsed);
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleUpgrade = (tier: "starter" | "plus" | "pro") => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/payments/create-checkout-session?tier=${tier}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) return null;

  const tier = (user.subscription || "free") as SubscriptionTier;
  const tierInfo = SUBSCRIPTION_TIERS[tier];
  const limit = tierInfo.cardsPerMonth;
  const usagePercent = Math.min((cardsUsed / limit) * 100, 100);

  const tierIcons = { free: null, starter: <Zap className="w-4 h-4" />, plus: <Star className="w-4 h-4" />, pro: <Rocket className="w-4 h-4" /> };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Your Profile</h1>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
            <Crown className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold">Subscription Upgraded!</p>
              <p className="text-sm">Your account now has access to premium features.</p>
            </div>
          </div>
        )}

        {/* Account Info */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Account Information</h2>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-600">Email:</span>
              <p className="text-lg font-medium text-gray-900">{user.email}</p>
            </div>
            {user.name && (
              <div>
                <span className="text-sm text-gray-600">Name:</span>
                <p className="text-lg font-medium text-gray-900">{user.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Current Plan */}
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Current Plan</h2>
            <div className="flex items-center gap-2 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              {tierIcons[tier]}
              <span>{tierInfo.emoji} {tierInfo.name}</span>
            </div>
          </div>

          {/* Usage Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Cards used this month</span>
              <span className="font-medium">{cardsUsed} / {limit}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className={`h-2.5 rounded-full transition-all ${usagePercent >= 100 ? "bg-red-500" : usagePercent >= 75 ? "bg-orange-400" : "bg-green-500"}`}
                style={{ width: `${usagePercent}%` }}
              />
            </div>
            {usagePercent >= 100 && (
              <p className="text-red-600 text-sm mt-1 font-medium">⚠️ Limit reached — upgrade to generate more cards</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-500">Price</span>
              <p className="font-semibold text-gray-900">{tierInfo.price}/mo</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <span className="text-gray-500">Watermark</span>
              <p className="font-semibold text-gray-900">{tierInfo.watermark ? "✅ Yes (free tier)" : "🚫 None"}</p>
            </div>
          </div>
        </div>

        {/* Upgrade Plans (only shown if not Pro) */}
        {tier !== "pro" && (
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Upgrade Your Plan</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {(["starter", "plus", "pro"] as const).map((t) => {
                const info = SUBSCRIPTION_TIERS[t];
                const isCurrent = tier === t;
                const isPopular = (info as { popular?: boolean }).popular ?? false;
                return (
                  <div
                    key={t}
                    className={`relative rounded-xl border-2 p-4 flex flex-col gap-3 transition-all ${isCurrent ? "border-purple-400 bg-purple-50" :
                      isPopular ? "border-blue-400 shadow-lg" : "border-gray-200 hover:border-purple-300"
                      }`}
                  >
                    {isPopular && !isCurrent && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-500 text-white text-xs font-bold px-3 py-0.5 rounded-full">MOST POPULAR</div>
                    )}
                    <div className="text-2xl font-bold text-gray-900">{info.emoji} {info.name}</div>
                    <div className="text-3xl font-extrabold text-purple-700">{info.price}<span className="text-sm font-normal text-gray-500">/mo</span></div>
                    <ul className="space-y-1 flex-1">
                      {info.features.map((f) => (
                        <li key={f} className="text-sm text-gray-600 flex items-center gap-1.5">
                          <span className="text-green-500 font-bold">✓</span> {f}
                        </li>
                      ))}
                    </ul>
                    {!isCurrent && (
                      <button
                        onClick={() => handleUpgrade(t)}
                        className={`w-full py-2.5 rounded-lg font-semibold text-white transition-all ${t === "starter" ? "bg-green-500 hover:bg-green-600" :
                          t === "plus" ? "bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90" :
                            "bg-gradient-to-r from-red-500 to-orange-500 hover:opacity-90"
                          }`}
                      >
                        Upgrade to {info.name}
                      </button>
                    )}
                    {isCurrent && (
                      <div className="text-center text-sm font-medium text-purple-700 py-2">✓ Current Plan</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Sign Out */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-white text-red-600 border border-red-200 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </main>
    </div>
  );
}
