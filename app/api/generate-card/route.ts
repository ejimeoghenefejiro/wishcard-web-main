import { NextRequest, NextResponse } from "next/server";
import { createFalClient } from "@fal-ai/client";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { z } from "zod";
import { requestSchema, buildImagePrompt } from "@/lib/prompt-builder";

export const maxDuration = 60; // 60 seconds is plenty for fal.ai

async function downloadAndSaveImage(imageUrl: string, occasion: string): Promise<string> {
  const response = await fetch(imageUrl);
  if (!response.ok) throw new Error(`Failed to download image: ${response.status}`);

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const contentType = response.headers.get("content-type") || "image/jpeg";
  const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const fileName = `wishcard-${occasion.replace(/\s+/g, "-")}-${Date.now()}.${ext}`;

  const dir = join(process.cwd(), "public", "generated");
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, fileName), buffer);

  return `/generated/${fileName}`;
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.FAL_KEY;
    if (!apiKey) {
      return NextResponse.json({
        error: "FAL_KEY not configured",
        message: "Please add your fal.ai API key to .env.local",
      }, { status: 500 });
    }

    // Configure fal client with API key
    const falClient = createFalClient({ credentials: apiKey });

    const body = await request.json();
    const params = requestSchema.parse(body);

    let imagePrompt = buildImagePrompt(params);

    if (params.addWatermark) {
      imagePrompt += ` Include a small subtle "WishCard" watermark in the bottom-right corner.`;
    }

    // Select model based on tier (Free/Starter = Schnell, Plus/Pro = Pro)
    // Note: addWatermark is true for Free tier
    const model = params.addWatermark ? "fal-ai/flux/schnell" : "fal-ai/flux-pro/v1.1";

    console.log(`Generating card with model: ${model} (Watermark: ${params.addWatermark})`);

    // Generate image with Flux via fal.ai
    // Type cast needed because fal's TS types are incomplete for all valid API fields
    const result = await falClient.subscribe(model, {
      input: {
        prompt: imagePrompt,
        image_size: "square_hd",    // 1024x1024
        num_images: 1,
        enable_safety_checker: true,
        safety_tolerance: "2",      // Allow artistic greeting card content
      } as never,
    });

    // Extract the image URL from fal response
    // fal.subscribe() wraps output in {data: {...}} 
    type FalImage = { url: string; content_type?: string };
    type FalOutput = { images?: FalImage[] };
    const falData = ((result as { data?: FalOutput }).data ?? (result as FalOutput)) as FalOutput;
    const imageUrl = falData?.images?.[0]?.url;

    console.log("fal.ai result keys:", Object.keys(result as object));
    console.log("imageUrl:", imageUrl?.substring(0, 80));

    if (!imageUrl) {
      console.error("Full fal result:", JSON.stringify(result).substring(0, 500));
      throw new Error("No image returned from fal.ai");
    }

    // Download and save locally to public/generated/
    let localUrl: string | null = null;
    try {
      localUrl = await downloadAndSaveImage(imageUrl, params.occasion);
    } catch (saveErr) {
      console.warn("Could not save image locally:", saveErr);
    }

    return NextResponse.json({
      imageUrl: localUrl || imageUrl,
      remoteImageUrl: imageUrl,
      occasion: params.occasion,
    });

  } catch (error) {
    console.error("Card generation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json({
        error: "Invalid request",
        code: "VALIDATION_ERROR",
        message: "Please check your card details and try again.",
      }, { status: 400 });
    }

    const message = error instanceof Error ? error.message : "Unknown error";

    if (message.includes("rate limit") || message.includes("quota")) {
      return NextResponse.json({
        error: "Service temporarily busy",
        code: "RATE_LIMIT",
        message: "Our image generation service is experiencing high demand. Please try again in a moment.",
      }, { status: 429 });
    }

    return NextResponse.json({
      error: "Failed to generate card",
      code: "GENERATION_ERROR",
      message: "We're having trouble generating your card right now. Please try again.",
    }, { status: 500 });
  }
}
