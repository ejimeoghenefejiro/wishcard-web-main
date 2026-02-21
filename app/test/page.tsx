"use client";

import { useAuth } from "@/lib/auth-context";

export default function TestPage() {
    const { user, loading } = useAuth();
    return (
        <div>
            <h1>Test Page Working (Client)</h1>
            <p>Loading: {loading ? "Yes" : "No"}</p>
            <p>User: {user ? user.email : "Guest"}</p>
        </div>
    );
}
