import api from "./api";

export type CardGenerationRequest = {
  occasion: string;
  message: string;
  recipientName?: string;
  senderName?: string;
  style: string;
  fontStyle: string;
  textColor: string;
  textPosition: string;
  textEffect: string;
  addWatermark?: boolean;
};

export async function generateCard(request: CardGenerationRequest): Promise<string> {
  try {
    const response = await api.post<{ imageUrl: string }>("/api/generate-card", {
      occasion: request.occasion,
      message: request.message,
      recipient: request.recipientName,
      sender: request.senderName,
      style: mapStyle(request.style),
      font: mapFontStyle(request.fontStyle),
      color: mapTextColor(request.textColor),
      position: mapTextPosition(request.textPosition),
      effects: mapTextEffects(request.textEffect),
      addWatermark: request.addWatermark ?? false,
    });

    return response.data.imageUrl;
  } catch (error: unknown) {
    console.error("Error generating card:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to generate card");
  }
}

function mapStyle(style: string): "modern" | "classic" | "playful" | "elegant" | "minimalist" {
  const mapping: Record<string, "modern" | "classic" | "playful" | "elegant" | "minimalist"> = {
    "Modern": "modern",
    "Classic": "classic",
    "Playful": "playful",
    "Elegant": "elegant",
    "Minimalist": "minimalist",
  };
  return mapping[style] || "modern";
}

function mapFontStyle(fontStyle: string): "elegant-script" | "bold-modern" | "playful" | "classic" {
  const mapping: Record<string, "elegant-script" | "bold-modern" | "playful" | "classic"> = {
    "Elegant Script": "elegant-script",
    "Bold Modern": "bold-modern",
    "Playful": "playful",
    "Classic": "classic",
  };
  return mapping[fontStyle] || "elegant-script";
}

function mapTextColor(color: string): "white" | "black" | "gold" | "pink" | "blue" | "green" {
  const mapping: Record<string, "white" | "black" | "gold" | "pink" | "blue" | "green"> = {
    "White": "white",
    "Black": "black",
    "Gold": "gold",
    "Pink": "pink",
    "Blue": "blue",
    "Green": "green",
  };
  return mapping[color] || "white";
}

function mapTextPosition(position: string): "centered" | "top" | "bottom" {
  const mapping: Record<string, "centered" | "top" | "bottom"> = {
    "Centered": "centered",
    "Top": "top",
    "Bottom": "bottom",
  };
  return mapping[position] || "centered";
}

function mapTextEffects(effect: string): ("glow" | "shadow" | "outline")[] {
  if (!effect || effect === "None") return [];
  const mapping: Record<string, "glow" | "shadow" | "outline"> = {
    "Glow": "glow",
    "Shadow": "shadow",
    "Outline": "outline",
  };
  return mapping[effect] ? [mapping[effect]] : [];
}
