"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { Sparkles, Heart, Gift, Cake, Star, Snowflake, Flower2, Briefcase, Baby, HandHeart, Moon, Home } from "lucide-react";

const occasions = [
    { id: "birthday", label: "Birthday", icon: Cake, color: "bg-pink-500" },
    { id: "love", label: "Love", icon: Heart, color: "bg-red-500" },
    { id: "christmas", label: "Christmas", icon: Snowflake, color: "bg-green-600" },
    { id: "easter", label: "Easter", icon: Flower2, color: "bg-yellow-400" },
    { id: "mother's day", label: "Mother's Day", icon: Heart, color: "bg-pink-400" },
    { id: "business thank you", label: "Business", icon: Briefcase, color: "bg-blue-600" },
    { id: "baby shower", label: "Baby", icon: Baby, color: "bg-blue-400" },
    { id: "sympathy", label: "Sympathy", icon: HandHeart, color: "bg-teal-600" },
    { id: "eid", label: "Religious", icon: Moon, color: "bg-emerald-600" },
    { id: "just sold", label: "Real Estate", icon: Home, color: "bg-indigo-600" },
    { id: "thank-you", label: "Thank You", icon: Star, color: "bg-yellow-500" },
    { id: "celebration", label: "Celebration", icon: Gift, color: "bg-purple-500" },
];

export default function HomePage() {
    const { user, loading, login } = useAuth();
    const router = useRouter();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    const handleOccasionSelect = (occasionId: string) => {
        // Allow users to browse and customize without login
        // They'll be prompted to sign in when they try to generate
        router.push(`/design?occasion=${occasionId}`);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 overflow-hidden">
            {/* Background decorations */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-300/30 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-300/30 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }}></div>
            </div>

            {/* Header */}
            <header className="bg-white/70 backdrop-blur-md border-b border-white/50 sticky top-0 z-50 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="bg-gradient-to-br from-purple-600 to-pink-600 p-2 rounded-lg shadow-lg">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                WishCard
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            {user ? (
                                <>
                                    <button
                                        onClick={() => router.push("/gallery")}
                                        className="text-gray-700 hover:text-purple-600 transition-colors hidden sm:block font-medium"
                                    >
                                        My Cards
                                    </button>
                                    <button
                                        onClick={() => router.push("/profile")}
                                        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm sm:text-base font-medium shadow-purple-200"
                                    >
                                        Profile
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => login()}
                                    className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full hover:shadow-lg hover:from-purple-700 hover:to-pink-700 transition-all text-sm sm:text-base font-medium shadow-purple-200"
                                >
                                    Sign In
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
                <div className="text-center mb-16 md:mb-24 animate-fade-in">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm border border-purple-100 rounded-full text-purple-700 text-sm font-medium mb-6 shadow-sm">
                        <Star className="w-4 h-4 fill-current" />
                        <span>3 Free Cards — No Card Needed</span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight leading-tight">
                        Luxury Personalised Cards
                        <br className="hidden sm:block" />
                        <span className="text-gradient"> In Seconds</span>
                    </h2>
                    <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4 mb-10 leading-relaxed">
                        Create a premium-looking card for birthdays, love, and every special moment — instantly.
                        No design skills. Just type your message.
                    </p>
                </div>

                {/* Occasion Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-20 animate-slide-up" style={{ animationDelay: "0.2s" }}>
                    {occasions.map((occasion) => {
                        const Icon = occasion.icon;
                        return (
                            <button
                                key={occasion.id}
                                onClick={() => handleOccasionSelect(occasion.id)}
                                className="group relative bg-white/60 backdrop-blur-sm border border-white/60 rounded-3xl p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-white/0 via-white/0 to-white/40 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div className={`${occasion.color} w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center mb-4 md:mb-6 mx-auto group-hover:scale-110 group-hover:rotate-3 transition-transform shadow-lg`}>
                                    <Icon className="w-7 h-7 md:w-8 md:h-8 text-white" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{occasion.label}</h3>
                            </button>
                        );
                    })}
                </div>

                {/* Features Section */}
                <div className="glass-card rounded-[2.5rem] p-8 md:p-16 shadow-2xl animate-slide-up" style={{ animationDelay: "0.4s" }}>
                    <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">Why Choose WishCard?</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Sparkles className="w-8 h-8 text-purple-600" />
                            </div>
                            <h4 className="font-bold text-xl mb-3">Looks Store-Bought</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Premium designs that feel like a real greeting card — without the trip to the shop.
                            </p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Heart className="w-8 h-8 text-pink-600" />
                            </div>
                            <h4 className="font-bold text-xl mb-3">Make It Personal</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Edit the text, choose a style, and keep your message while switching designs.
                            </p>
                        </div>
                        <div className="text-center group">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Gift className="w-8 h-8 text-blue-600" />
                            </div>
                            <h4 className="font-bold text-xl mb-3">Ready to Share</h4>
                            <p className="text-gray-600 leading-relaxed">
                                Download or share instantly — perfect for last-minute moments that still feel thoughtful.
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white/50 backdrop-blur-sm border-t border-purple-100 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                    <p className="text-center text-gray-600 font-medium">
                        © 2026 WishCard. Crafted with <Heart className="w-4 h-4 inline text-red-500 fill-current mx-1" /> and AI.
                    </p>
                </div>
            </footer>
        </div>
    );
}
