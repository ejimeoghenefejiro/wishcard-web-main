
import { saveCardToFirestore, getGalleryCardsFirestore, deleteCardFromFirestore, type GalleryItem } from "./firestore";

export type SavedImage = GalleryItem;

export async function saveImageToGallery(userEmail: string, image: { url: string; prompt: string }) {
    await saveCardToFirestore(userEmail, image);
}

export async function getGalleryImages(userEmail: string): Promise<SavedImage[]> {
    const cards = await getGalleryCardsFirestore(userEmail);
    return cards;
}

export async function removeImageFromGallery(userEmail: string, imageId: string) {
    await deleteCardFromFirestore(userEmail, imageId);
}
