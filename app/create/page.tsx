"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { generateCard } from "@/lib/card-generator";
import { SUBSCRIPTION_TIERS, type SubscriptionTier } from "@/lib/subscriptions";
import { saveImageToGallery } from "@/lib/gallery";
import { ArrowLeft, Sparkles, Download, Share2, AlertTriangle, Save, Trash2, Facebook, MessageCircle, Instagram } from "lucide-react";
import Image from "next/image";

const styles = ["Modern", "Classic", "Playful", "Elegant", "Minimalist"];
const fonts = ["Elegant Script", "Bold Modern", "Playful", "Classic"];
const colors = ["White", "Black", "Gold", "Pink", "Blue", "Green"];
const positions = ["Centered", "Top", "Bottom"];
const effects = ["None", "Glow", "Shadow", "Outline"];

export default function CreateCardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, incrementUsage } = useAuth();

  const [occasion, setOccasion] = useState(searchParams.get("occasion") || "birthday");
  const [message, setMessage] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [style, setStyle] = useState("Modern");
  const [fontStyle, setFontStyle] = useState("Elegant Script");
  const [textColor, setTextColor] = useState("White");
  const [textPosition, setTextPosition] = useState("Centered");
  const [textEffect, setTextEffect] = useState("Glow");

  const [generating, setGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cardsUsed, setCardsUsed] = useState(0);

  const tier = (user?.subscription || "free") as SubscriptionTier;
  const tierInfo = SUBSCRIPTION_TIERS[tier];
  const cardsRemaining = Math.max(0, tierInfo.cardsPerMonth - cardsUsed);
  const isFreeTier = tierInfo.watermark;

  useEffect(() => {
    if (user?.cardsUsed !== undefined) setCardsUsed(user.cardsUsed);
  }, [user]);

  // Allow users to customize without login
  // They'll be prompted to sign in when they click Generate

  const handleGenerate = async () => {
    if (!message.trim()) { setError("Please enter a message"); return; }
    if (!user) { setError("Please sign in to generate cards"); setTimeout(() => router.push("/"), 2000); return; }

    // Check usage limit
    if (user.cardsUsed >= tierInfo.cardsPerMonth) {
      setError(`You've reached your ${tierInfo.cardsPerMonth}-card limit. Upgrade to generate more!`);
      return;
    }

    setGenerating(true);
    setError(null);
    try {
      const imageUrl = await generateCard({
        occasion,
        message,
        recipientName,
        senderName,
        style,
        fontStyle,
        textColor,
        textPosition,
        textEffect,
        addWatermark: isFreeTier
      });
      setGeneratedImage(imageUrl);
      // Increment usage counter
      // Increment usage counter
      await incrementUsage();
      setCardsUsed(prev => prev + 1);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate card");
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `wishcard-${Date.now()}.png`;
    link.click();
  };



  const handleSave = async () => {
    if (!generatedImage || !user?.email) return;
    try {
      await saveImageToGallery(user.email, {
        url: generatedImage,
        prompt: message || "Card for " + occasion,
      });
      alert("Saved to Gallery!");
      router.push("/gallery");
    } catch (error) {
      console.error("Failed to save:", error);
      alert("Failed to save to gallery.");
    }
  };

  const handleDiscard = () => {
    if (confirm("Are you sure you want to discard this card? It won't be saved.")) {
      setGeneratedImage(null);
    }
  };

  const handleShare = async (platform?: "whatsapp" | "facebook") => {
    if (!generatedImage) return;
    const text = "Check out this card I made with WishCard.ai!";
    const url = window.location.origin + generatedImage;

    if (platform === "whatsapp") {
      window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
    } else if (platform === "facebook") {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
    } else {
      // Generic share
      if (navigator.share) {
        try {
          await navigator.share({ title: "My WishCard", text, url: generatedImage });
        } catch (err: unknown) { console.error("Share failed:", err); }
      } else {
        alert("Link copied!");
        navigator.clipboard.writeText(url);
      }
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 overflow-hidden relative">
      {/* Background decorations */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[10%] right-[10%] w-[30%] h-[30%] bg-purple-300/20 rounded-full blur-[80px] animate-pulse"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[30%] h-[30%] bg-pink-300/20 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: "1.5s" }}></div>
      </div>

      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-white/50 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors group font-medium"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Form */}
          <div className="glass-card rounded-[2rem] p-6 md:p-8 shadow-xl animate-slide-up">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Customize Your Card</h2>

            {/* Occasion Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Occasion</label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {[
                  "Birthday", "Love", "Christmas", "Easter", "Mother's Day",
                  "Baby Shower", "New Baby", "First Birthday",
                  "Sympathy", "Pet Sympathy", "Get Well",
                  "Baptism", "Bar Mitzvah", "Eid", "Diwali", "Hanukkah",
                  "Just Sold", "Business Thank You", "Work Anniversary", "New Job", "Open House"
                ].map((o) => (
                  <button
                    key={o}
                    onClick={() => setOccasion(o)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${occasion === o
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-200 scale-105"
                      : "bg-white/50 text-gray-700 hover:bg-white border border-transparent hover:border-purple-100"
                      }`}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Message *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your heartfelt message..."
                className="w-full px-4 py-3 bg-white/50 border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none transition-all placeholder:text-gray-400"
                rows={4}
                maxLength={200}
              />
              <p className="text-sm text-gray-500 mt-1 text-right">{message.length}/200</p>
            </div>

            {/* Recipient & Sender */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Name (Optional)
                </label>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="To: Sarah"
                  className="w-full px-4 py-2.5 bg-white/50 border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="From: John"
                  className="w-full px-4 py-2.5 bg-white/50 border border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Style */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Card Style</label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                {styles.map((s) => (
                  <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${style === s
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-200 scale-105"
                      : "bg-white/50 text-gray-700 hover:bg-white border border-transparent hover:border-purple-100"
                      }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Font */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Font Style</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {fonts.map((f) => (
                  <button
                    key={f}
                    onClick={() => setFontStyle(f)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${fontStyle === f
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-200 scale-105"
                      : "bg-white/50 text-gray-700 hover:bg-white border border-transparent hover:border-purple-100"
                      }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Color */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Text Color</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setTextColor(c)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${textColor === c
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-200 scale-105"
                      : "bg-white/50 text-gray-700 hover:bg-white border border-transparent hover:border-purple-100"
                      }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Position */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Text Position</label>
              <div className="grid grid-cols-3 gap-2">
                {positions.map((p) => (
                  <button
                    key={p}
                    onClick={() => setTextPosition(p)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${textPosition === p
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-200 scale-105"
                      : "bg-white/50 text-gray-700 hover:bg-white border border-transparent hover:border-purple-100"
                      }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Effect */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Text Effect</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {effects.map((e) => (
                  <button
                    key={e}
                    onClick={() => setTextEffect(e)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${textEffect === e
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-200 scale-105"
                      : "bg-white/50 text-gray-700 hover:bg-white border border-transparent hover:border-purple-100"
                      }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm animate-fade-in flex items-center gap-2">
                <span className="text-xl">⚠️</span> {error}
              </div>
            )}

            {/* Usage indicator for free tier */}
            {user && (
              <div className={`mb-4 px-4 py-3 rounded-xl flex items-center justify-between text-sm font-medium ${cardsRemaining === 0 ? "bg-red-50 border border-red-200 text-red-700" :
                cardsRemaining <= 1 ? "bg-orange-50 border border-orange-200 text-orange-700" :
                  "bg-purple-50 border border-purple-100 text-purple-700"
                }`}>
                <span>{isFreeTier ? "🆓 Free Trial" : tierInfo.emoji + " " + tierInfo.name}</span>
                <span>{cardsRemaining === 0 ? "⚠️ Limit reached" : `${cardsRemaining} card${cardsRemaining === 1 ? "" : "s"} remaining`}</span>
              </div>
            )}

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={generating || cardsRemaining === 0}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-purple-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            >
              {generating ? (
                <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>Creating Magic...</>
              ) : cardsRemaining === 0 ? (
                <><AlertTriangle className="w-5 h-5" />Upgrade to Generate More</>
              ) : (
                <><Sparkles className="w-5 h-5" />Generate Card {isFreeTier && `(${cardsRemaining} left)`}</>
              )}
            </button>
            {cardsRemaining === 0 && (
              <button onClick={() => router.push("/profile")} className="w-full mt-2 py-3 rounded-xl border-2 border-purple-300 text-purple-700 font-semibold hover:bg-purple-50 transition-colors">
                View Upgrade Plans →
              </button>
            )}
          </div>

          {/* Right: Preview */}
          <div className="glass-card rounded-[2rem] p-6 md:p-8 shadow-xl h-fit sticky top-24 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              Preview <span className="text-sm font-normal text-gray-500 bg-white/50 px-2 py-1 rounded-full border border-gray-100">Live</span>
            </h2>

            {generatedImage ? (
              <div className="space-y-6 animate-fade-in">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-inner group">
                  <Image
                    src={generatedImage}
                    alt="Generated card"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none"></div>
                  {/* Visible watermark for free tier */}
                  {isFreeTier && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center" style={{ background: "rgba(0,0,0,0)" }}>
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-center py-2 px-3 flex items-center justify-center gap-2">
                        <span className="text-xs font-bold tracking-widest opacity-80">✦ WishCard.ai — Free Trial ✦</span>
                        <button onClick={() => router.push("/profile")} className="text-xs text-yellow-300 underline font-semibold hover:text-yellow-200">Remove watermark</button>
                      </div>
                      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/20 font-black text-3xl rotate-[-35deg] whitespace-nowrap select-none pointer-events-none" style={{ letterSpacing: "0.2em" }}>WishCard.ai</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {["Birthday", "Love", "Christmas", "Easter", "Mother's Day", "Business Thank You", "Just Sold", "Work Anniversary", "Thank You", "Celebration", "Get Well", "New Year"].map((o) => (
                    <button
                      key={o}
                      onClick={() => setOccasion(o)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${occasion === o
                        ? "bg-purple-600 text-white shadow-lg shadow-purple-200 scale-105"
                        : "bg-white/50 text-gray-700 hover:bg-white border border-transparent hover:border-purple-100"
                        }`}
                    >
                      {o}
                    </button>
                  ))}
                </div>
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={handleSave} className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold shadow-md">
                      <Save className="w-4 h-4" /> Save
                    </button>
                    <button onClick={handleDiscard} className="flex items-center justify-center gap-2 px-4 py-3 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors font-semibold">
                      <Trash2 className="w-4 h-4" /> Discard
                    </button>
                  </div>

                  <div className="flex items-center gap-2 justify-center bg-gray-50 p-2 rounded-xl">
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Share via:</span>
                    <button onClick={() => handleShare("whatsapp")} className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                      <MessageCircle className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleShare("facebook")} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200">
                      <Facebook className="w-5 h-5" />
                    </button>
                    <button onClick={() => handleShare()} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200">
                      <Share2 className="w-5 h-5" />
                    </button>
                    <button onClick={handleDownload} className="ml-auto flex items-center gap-1 text-sm text-purple-600 font-medium px-2 py-1 rounded hover:bg-purple-50">
                      <Download className="w-4 h-4" /> DL
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-square rounded-2xl bg-white/50 border-2 border-dashed border-purple-100 flex items-center justify-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-pink-50/50 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-center text-gray-400 relative z-10 transition-transform duration-300 group-hover:scale-110">
                  <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium">Your masterpiece will appear here</p>
                  <p className="text-sm opacity-75 mt-2">Fill the details and click Generate</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
