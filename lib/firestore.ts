
import { db } from "./firebase";
import { doc, getDoc, setDoc, updateDoc, collection, addDoc, getDocs, deleteDoc, query, orderBy, Timestamp } from "firebase/firestore";
import { type SubscriptionTier, SUBSCRIPTION_TIERS } from "./subscriptions";

export type UserData = {
    email: string;
    subscription: SubscriptionTier;
    cardsUsed: number;
    cardsLimit: number;
    lastReset: Timestamp; // For monthly reset logic
};

export type GalleryItem = {
    id: string;
    url: string;
    prompt: string;
    createdAt: number;
};

// --- USER SUBSCRIPTION ---

export async function syncUserSubscription(email: string): Promise<UserData> {
    if (!db) throw new Error("Firebase not initialized");

    const userRef = doc(db, "users", email);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
        return snapshot.data() as UserData;
    } else {
        // Create new user with FREE tier default
        const newUser: UserData = {
            email,
            subscription: "free",
            cardsUsed: 0,
            cardsLimit: SUBSCRIPTION_TIERS.free.cardsPerMonth,
            lastReset: Timestamp.now(),
        };
        await setDoc(userRef, newUser);
        return newUser;
    }
}

export async function updateUserUsage(email: string, increment: number = 1) {
    if (!db) return;
    const userRef = doc(db, "users", email);
    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {
        const data = snapshot.data() as UserData;
        await updateDoc(userRef, {
            cardsUsed: data.cardsUsed + increment
        });
    }
}

export async function updateUserTier(email: string, tier: SubscriptionTier) {
    if (!db) return;
    const userRef = doc(db, "users", email);
    const tierInfo = SUBSCRIPTION_TIERS[tier];

    await updateDoc(userRef, {
        subscription: tier,
        cardsLimit: tierInfo.cardsPerMonth,
        // Note: We don't reset cardsUsed on upgrade, usually? Or maybe we DO?
        // For now keep usage, but increase limit.
    });
}

// --- GALLERY ---

export async function saveCardToFirestore(email: string, card: { url: string; prompt: string }) {
    if (!db) return;
    const galleryRef = collection(db, "users", email, "gallery");
    await addDoc(galleryRef, {
        url: card.url,
        prompt: card.prompt,
        createdAt: Date.now(),
    });
}

export async function getGalleryCardsFirestore(email: string): Promise<GalleryItem[]> {
    if (!db) return [];
    const galleryRef = collection(db, "users", email, "gallery");
    const q = query(galleryRef, orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    } as GalleryItem));
}

export async function deleteCardFromFirestore(email: string, cardId: string) {
    if (!db) return;
    const cardRef = doc(db, "users", email, "gallery", cardId);
    await deleteDoc(cardRef);
}
