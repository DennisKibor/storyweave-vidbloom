import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    const GOOGLE_AI_API_KEY = Deno.env.get("GOOGLE_AI_API_KEY");

    if (!GOOGLE_AI_API_KEY) {
      throw new Error("GOOGLE_AI_API_KEY is not configured");
    }

    if (!prompt) {
      throw new Error("Prompt is required");
    }

    console.log("Generating image with prompt:", prompt);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${GOOGLE_AI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ 
          parts: [{ text: `Generate a children's book illustration: ${prompt}` }] 
        }],
        generationConfig: {
          responseModalities: ["image", "text"],
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Gemini Image API error:", response.status, errorText);
      throw new Error(`Gemini Image API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Image generated successfully");

    // Extract the base64 image from response
    const parts = data.candidates?.[0]?.content?.parts;
    const imagePart = parts?.find((part: any) => part.inlineData?.mimeType?.startsWith("image/"));
    
    if (!imagePart?.inlineData?.data) {
      throw new Error("No image returned from Gemini");
    }

    const base64Image = imagePart.inlineData.data;
    const mimeType = imagePart.inlineData.mimeType || "image/png";
    const imageUrl = `data:${mimeType};base64,${base64Image}`;

    return new Response(
      JSON.stringify({ image: imageUrl }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate-image:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate image";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
