import { GoogleGenAI } from "@google/genai";
import { GeneratedImage } from "../types";

/**
 * Generates a single image based on the prompt.
 * Uses gemini-2.5-flash-image for fast, high-quality generation.
 */
async function generateSingleImage(prompt: string): Promise<GeneratedImage | null> {
  try {
    // Initialize the client inside the function to ensure we use the latest API Key
    // provided by the external selection mechanism.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: prompt }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "9:16",
        }
      }
    });

    // Extract image data
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || "image/png";
          const url = `data:${mimeType};base64,${base64Data}`;
          
          return {
            id: Math.random().toString(36).substring(2, 15),
            url: url,
            prompt: prompt,
            createdAt: Date.now()
          };
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error generating image:", error);
    // Re-throw error so the caller can handle specific API key errors
    throw error;
  }
}

/**
 * Generates 4 variations of wallpapers in parallel.
 */
export const generateWallpapers = async (prompt: string): Promise<GeneratedImage[]> => {
  // Enhance prompt for wallpaper specifically
  const enhancedPrompt = `A high-quality, aesthetic smartphone wallpaper (vertical 9:16 aspect ratio). Style: ${prompt}. No text, minimal UI elements, highly detailed, atmospheric.`;

  // Run 4 requests in parallel
  const promises = [1, 2, 3, 4].map(async () => {
    try {
      return await generateSingleImage(enhancedPrompt);
    } catch (e: any) {
      // Check for the specific "Requested entity was not found" error (Project/Key issue)
      // and bubble it up to trigger the re-auth flow in the UI
      if (e.toString().includes("Requested entity was not found") || e.message?.includes("Requested entity was not found")) {
        throw e;
      }
      // For other errors (e.g. safety filters), just return null so other images can still succeed
      return null;
    }
  });
  
  const results = await Promise.all(promises);
  
  // Filter out failed requests (nulls)
  return results.filter((img): img is GeneratedImage => img !== null);
};