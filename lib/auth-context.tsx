"use client";

import React, { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { syncUserSubscription, updateUserUsage, type UserData } from "./firestore";
import { type SubscriptionTier, SUBSCRIPTION_TIERS } from "./subscriptions";

// Extend NextAuth user with our custom fields
export type User = {
  id: string;
  email: string;
  name?: string;
  image?: string;
  subscription: SubscriptionTier;
  cardsUsed: number;
  cardsLimit: number;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refetchUser: () => Promise<void>;
  incrementUsage: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const loadingSession = status === "loading";

  const [userData, setUserData] = useState<UserData | null>(null);
  const [loadingUser, setLoadingUser] = useState(false);

  // Sync user data from Firestore when session changes
  useEffect(() => {
    async function loadUser() {
      if (session?.user?.email) {
        setLoadingUser(true);
        try {
          const data = await syncUserSubscription(session.user.email);
          setUserData(data);
        } catch (error) {
          console.error("Failed to sync user data:", error);
        } finally {
          setLoadingUser(false);
        }
      } else {
        setUserData(null);
      }
    }
    loadUser();
  }, [session]);

  const user: User | null = (session?.user && userData)
    ? {
      id: session.user.email || "",
      email: session.user.email || "",
      name: session.user.name || "",
      image: session.user.image || "",
      subscription: userData.subscription,
      cardsUsed: userData.cardsUsed,
      cardsLimit: userData.cardsLimit || SUBSCRIPTION_TIERS[userData.subscription].cardsPerMonth,
    }
    : null;

  const login = () => {
    signIn("google", { callbackUrl: "/profile" });
  };

  const logout = async () => {
    await signOut({ callbackUrl: "/" });
    setUserData(null);
  };

  const refetchUser = async () => {
    if (session?.user?.email) {
      const data = await syncUserSubscription(session.user.email);
      setUserData(data);
    }
  };

  const incrementUsage = async () => {
    if (!user) return;

    // Optimistic update
    setUserData(prev => prev ? { ...prev, cardsUsed: prev.cardsUsed + 1 } : null);

    // Db update
    try {
      await updateUserUsage(user.email);
    } catch (err) {
      console.error("Failed to update usage", err);
      // Revert if failed? For MVP, maybe not critical to revert UI immediately
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading: loadingSession || (!!session && !userData && loadingUser), // Loading if session exists but user data fetching
      login,
      logout,
      refetchUser,
      incrementUsage
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
