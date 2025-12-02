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
    const { character, theme, setting, mood, plot = "", pageCount = 5, storyLength = "medium" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating story with:", { character, theme, setting, mood, plot, pageCount, storyLength });

    const lengthDescriptions: Record<string, string> = {
      short: "1-2 sentences",
      medium: "2-3 sentences",
      long: "3-4 sentences",
    };
    const textLength = lengthDescriptions[storyLength] || "2-3 sentences";

    const plotInstruction = plot ? `\nPlot: ${plot}` : "";

    const systemPrompt = `You are a creative children's storybook writer. Create engaging, age-appropriate stories with vivid descriptions and positive messages. 

Your response must be valid JSON in this exact format:
{
  "title": "Story Title",
  "pages": [
    {
      "text": "The text for this page (${textLength})",
      "imagePrompt": "Detailed visual description for illustration (describe the scene, characters, colors, mood)"
    }
  ]
}

Create exactly ${pageCount} pages. Each page should advance the story naturally. Image prompts should be detailed and vivid.`;

    const userPrompt = `Create a ${mood} children's story about ${character}. 
Theme: ${theme}
Setting: ${setting}${plotInstruction}

Make it engaging, with a clear beginning, middle, and end. Each page should have ${textLength} of story text and a detailed image prompt describing what should be illustrated.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    const content = data.choices[0].message.content;
    
    // Parse the JSON response
    let storyData;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/```\n?([\s\S]*?)\n?```/);
      const jsonString = jsonMatch ? jsonMatch[1] : content;
      storyData = JSON.parse(jsonString.trim());
    } catch (parseError) {
      console.error("Failed to parse JSON:", content);
      throw new Error("Failed to parse story data from AI response");
    }

    console.log("Story generated successfully:", storyData.title);

    return new Response(JSON.stringify(storyData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in generate-story:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate story";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
