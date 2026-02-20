
import { buildImagePrompt, requestSchema, type CardRequest } from "../lib/prompt-builder";

const testCases: Partial<CardRequest>[] = [
    { occasion: "Start", message: "Initial" }, // Warmup
    { occasion: "just sold", message: "123 Main St - Sold in 3 days!" },
    { occasion: "baby shower", message: "Welcome Baby James" },
    { occasion: "sympathy", message: "Thinking of you" },
    { occasion: "eid", message: "Eid Mubarak" },
];

console.log("--- Testing Prompt Generation ---");

testCases.forEach((tc) => {
    // Mock full params
    const fullParams: CardRequest = {
        occasion: tc.occasion || "birthday",
        message: tc.message || "Test",
        recipient: "Recipient",
        sender: "Sender",
        style: "modern",
        font: "elegant-script",
        color: "white",
        position: "centered",
        effects: [],
        addWatermark: false,
        ...tc
    };

    try {
        const prompt = buildImagePrompt(fullParams);
        console.log(`\n[${fullParams.occasion.toUpperCase()}]`);
        console.log(prompt);
    } catch (e) {
        console.error(`Error generating prompt for ${tc.occasion}:`, e);
    }
});

console.log("\n--- Verification Complete ---");
