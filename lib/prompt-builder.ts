
import { z } from "zod";

export const requestSchema = z.object({
    occasion: z.string(),
    message: z.string(),
    recipient: z.string().optional(),
    sender: z.string().optional(),
    style: z.enum(["modern", "classic", "playful", "elegant", "minimalist"]).optional().default("modern"),
    font: z.enum(["elegant-script", "bold-modern", "playful", "classic"]).optional().default("elegant-script"),
    color: z.enum(["white", "black", "gold", "pink", "blue", "green"]).optional().default("white"),
    position: z.enum(["centered", "top", "bottom"]).optional().default("centered"),
    effects: z.array(z.enum(["glow", "shadow", "gradient", "sparkle"])).optional().default([]),
    addWatermark: z.boolean().optional().default(false),
});

export type CardRequest = z.infer<typeof requestSchema>;

export function buildImagePrompt(params: CardRequest): string {
    const { occasion, message, recipient, sender, style, color, effects } = params;

    // Occasion-specific background themes
    const occasionThemes: Record<string, string> = {
        birthday: "soft pastel rainbow watercolor background with delicate bokeh light orbs, colorful balloons, gold star confetti, curling ribbons and streamers, small hearts, magical celebration atmosphere",
        wedding: "elegant ivory and blush rose petal background with soft golden bokeh, white roses, pearl accents, romantic candlelight glow, luxurious satin texture",
        anniversary: "deep romantic burgundy and rose gold background with soft bokeh, red roses, golden sparkles, elegant lace pattern, warm candlelight atmosphere",
        christmas: "rich deep green and red background with golden bokeh lights, Christmas ornaments, pine branches, snowflakes, warm festive glow, holly berries",
        graduation: "navy blue and gold academic background with subtle bokeh, laurel wreath, stars, diploma scroll accents, celebratory confetti",
        "thank you": "warm peach and cream watercolor background with soft floral accents, small flowers, gentle bokeh, gratitude and warmth atmosphere",
        "get well": "soft mint and lavender watercolor background with daisies, gentle bokeh light, warm healing sunshine rays, delicate flower petals",
        "new year": "deep midnight blue background with gold and silver fireworks, bokeh sparkles, champagne bubbles, confetti, celebratory atmosphere",
        valentine: "deep romantic red and pink background with golden bokeh, red and pink roses, heart shapes, velvet texture, passion and love atmosphere",
        easter: "bright pastel spring background with colorful easter eggs, bunnies, spring flowers, soft sunshine, joyful atmosphere",
        "mother's day": "soft pink and lilac floral background with carnations, roses, gentle bokeh, warm loving atmosphere, elegant script",
        "just sold": "professional real estate background with blurred modern luxury home key in hand, sold sign, bokeh city lights, success and celebration atmosphere",
        "business thank you": "clean professional corporate background with geometric patterns, navy blue and gold accents, premium stationery feel",
        "work anniversary": "professional office celebration background with balloons, confetti, clean modern desk setting, success atmosphere",
        "new job": "dynamic modern background with upward momentum arrows, bright future lighting, clean professional desk, success atmosphere",

        // Baby & Kids (High Volume)
        "baby shower": "soft pastel blue and pink watercolor background with clouds, stars, cute animals, gentle bokeh, sweet atmosphere",
        "new baby": "soft dreamy clouds and moon background, gentle lullaby atmosphere, pastel yellow and mint green, baby rattle accents",
        "first birthday": "bright colorful fun background with number one balloon, confetti, cake, primary colors, joyful atmosphere",

        // Sympathy (High Emotional Value)
        "sympathy": "peaceful serene nature background with still water, white lilies, soft misty light, gentle comfort atmosphere, muted calming colors",
        "pet sympathy": "soft rainbow bridge background with clouds, paw prints in sand, gentle golden hour light, peaceful memory atmosphere",

        // Religious & Cultural (Global Market)
        "baptism": "pure white and gold background with dove, cross, water droplets, soft heavenly light, sacred atmosphere",
        "bar mitzvah": "deep royal blue and silver background with star of david, torah scroll, celebratory bokeh, elegant tradition",
        "eid": "deep emerald green and gold background with crescent moon, intricate geometric patterns, lanterns, festive night atmosphere",
        "diwali": "vibrant orange and purple background with diya oil lamps, rangoli patterns, golden sparkles, festival of lights atmosphere",
        "hanukkah": "classic blue and silver background with menorah, dreidel, gelt coins, warm candlelight, family celebration",

        // Realtor / Business Power Pack (Recurring Revenue)
        "open house": "modern bright real estate background with 'welcome' sign, front door key, sunlight, inviting atmosphere",
        "referral thank you": "premium gold and black professional background with handshake icon, success, gratitude, corporate luxury",
        "market update": "modern infographic style background with upward trend line, city skyline, professional blue tones, business data",
    };

    // Style visual quality descriptors
    const styleDescriptors: Record<string, string> = {
        modern: "clean contemporary design, vibrant gradient tones, sharp modern aesthetic",
        classic: "timeless elegant design, ornate decorative borders, refined classical aesthetic",
        playful: "whimsical fun design, bright cheerful saturated colors, illustrated charm",
        elegant: "sophisticated luxury design, rich deep tones, gold foil accents, premium feel",
        minimalist: "clean minimal design, generous white space, single refined accent color",
    };

    // Text color with metallic/material quality
    const colorStyle: Record<string, string> = {
        gold: "shimmering 24k gold metallic foil, embossed gold script with warm light reflection",
        white: "crisp bright white text with subtle inner glow and soft shadow",
        black: "deep charcoal black text with sharp precision and subtle shadow",
        pink: "rose gold metallic pink text with warm shimmer",
        blue: "deep sapphire blue text with subtle metallic sheen",
        green: "rich emerald green text with natural depth and subtle glow",
    };

    const effectsDesc = effects.map(e => (
        e === "glow" ? "with radiant soft glow halo around letters" :
            e === "shadow" ? "with elegant long drop shadow" :
                e === "gradient" ? "with beautiful gradient color sweep across letters" :
                    "surrounded by tiny sparkle stars and glitter accents"
    )).join(", ");

    // Get the theme, fallback to a beautiful generic celebration
    const bgTheme = occasionThemes[occasion.toLowerCase()] ||
        `beautiful ${occasion} themed watercolor background with soft bokeh light orbs, flowers, and celebratory decorations`;

    // The scene — physical card on a table, like a professional product photo
    const scene = "professional greeting card photography, beautiful physical greeting card standing propped up on a light wooden table, depth-of-field bokeh background with soft blurred celebration elements, dramatic soft studio lighting, high-end stationery product photography";

    // Build main text block
    const mainTextStyle = `${colorStyle[color] || colorStyle.gold}, flowing elegant calligraphic script font, large and prominent`;
    let textBlock = `The card features the text "${message}" in ${mainTextStyle}${effectsDesc ? `, ${effectsDesc}` : ""}`;
    if (recipient) textBlock += `. Above it in smaller elegant italic script: "To ${recipient}"`;
    if (sender) textBlock += `. Below in smaller delicate script: "From: ${sender}"`;

    const qualityTags = "ultra-detailed, photorealistic, 8K quality, professional photography, perfect composition, beautiful color harmony, premium greeting card, award-winning design, highly detailed illustration, crisp sharp focus on card text";

    let prompt = `${scene}. The card has a ${bgTheme}. ${styleDescriptors[style]}. ${textBlock}. All text must be beautifully legible, perfectly centered, harmoniously integrated. ${qualityTags}.`;

    if (params.addWatermark) {
        prompt += ` Include a small subtle "WishCard" watermark in the bottom-right corner.`;
    }

    return prompt;
}
