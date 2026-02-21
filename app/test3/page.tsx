"use client";

import { useRouter } from "next/navigation";
// import { Sparkles, Heart, ... } from "lucide-react"; // REMOVED

export default function TestPage3() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white">
            <h1 className="text-3xl font-bold p-10">Test Page 3 - No Icons</h1>
            <p>If you can see this, Lucide is the problem.</p>
        </div>
    );
}
