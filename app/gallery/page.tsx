"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { getGalleryImages, removeImageFromGallery, type SavedImage } from "@/lib/gallery";
import { ArrowLeft, Trash2, Download, Share2, Facebook, Instagram, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function GalleryPage() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const [images, setImages] = useState<SavedImage[]>([]);

    useEffect(() => {
        if (!loading && !user) router.push("/");
    }, [user, loading, router]);

    useEffect(() => {
        async function loadGallery() {
            if (user?.email) {
                try {
                    const imgs = await getGalleryImages(user.email);
                    setImages(imgs);
                } catch (error) {
                    console.error("Failed to load gallery:", error);
                }
            }
        }
        loadGallery();
    }, [user]);

    const handleDelete = async (imageId: string) => {
        if (!user?.email) return;
        if (confirm("Are you sure you want to delete this card?")) {
            try {
                await removeImageFromGallery(user.email, imageId);
                setImages(prev => prev.filter(img => img.id !== imageId));
            } catch (error) {
                console.error("Failed to delete image:", error);
                alert("Could not delete image. Please try again.");
            }
        }
    };

    const handleDownload = (imageUrl: string) => {
        const link = document.createElement("a");
        link.href = imageUrl;
        link.download = `wishcard-${Date.now()}.png`;
        link.click();
    };

    const handleShare = async (imageUrl: string, platform?: "whatsapp" | "facebook") => {
        const text = "Check out this card I made with WishCard.ai!";
        const url = window.location.origin + imageUrl; // Local URL - in prod this needs to be a public URL

        // Note: Since we are using local file storage in public/, the URL is relative. 
        // For social sharing to work properly with image previews, this needs to be a hosted public URL.
        // For now, we share the link.

        if (platform === "whatsapp") {
            window.open(`https://wa.me/?text=${encodeURIComponent(text + " " + url)}`, "_blank");
        } else if (platform === "facebook") {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
        } else {
            // Generic share
            if (navigator.share) {
                await navigator.share({ title: "WishCard", text, url });
            } else {
                alert("Link copied to clipboard!");
                navigator.clipboard.writeText(url);
            }
        }
    };

    if (loading) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
            <header className="bg-white/80 backdrop-blur-sm border-b border-purple-100 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <button onClick={() => router.push("/")} className="flex items-center gap-2 text-gray-700 hover:text-purple-600 transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                        <span>Back to Home</span>
                    </button>
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.push("/create")} className="text-purple-600 font-medium hover:text-purple-700">Create New</button>
                        <button onClick={() => router.push("/profile")} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">Profile</button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Gallery</h1>

                {images.length === 0 ? (
                    <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
                        <p className="text-gray-500 text-lg mb-4">You haven't saved any cards yet.</p>
                        <button onClick={() => router.push("/create")} className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition-colors">
                            Create Your First Card
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {images.map((img) => (
                            <div key={img.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow group">
                                <div className="relative aspect-square">
                                    <Image src={img.url} alt={img.prompt} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors pointer-events-none" />
                                </div>
                                <div className="p-4">
                                    <p className="text-sm text-gray-500 mb-3 truncate">{new Date(img.createdAt).toLocaleDateString()}</p>
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex gap-1">
                                            <button onClick={() => handleShare(img.url, "whatsapp")} className="p-2 text-green-600 hover:bg-green-50 rounded-full" title="Share on WhatsApp">
                                                <MessageCircle className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleShare(img.url, "facebook")} className="p-2 text-blue-600 hover:bg-blue-50 rounded-full" title="Share on Facebook">
                                                <Facebook className="w-4 h-4" />
                                            </button>
                                            <button onClick={() => handleDownload(img.url)} className="p-2 text-gray-600 hover:bg-gray-50 rounded-full" title="Download">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <button onClick={() => handleDelete(img.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-full" title="Delete">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
