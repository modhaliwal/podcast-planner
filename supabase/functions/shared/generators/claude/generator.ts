
import { AIGeneratorConfig, AIGeneratorResponse, processPromptWithParameters } from "../ai.ts";

export async function generateWithClaude(config: AIGeneratorConfig): Promise<AIGeneratorResponse> {
  // Get the API key from environment
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) {
    throw new Error("Anthropic API key not found in environment");
  }

  // Process the prompt with parameters
  const prompt = config.prompt || "";
  const systemPrompt = config.systemPrompt || "";
  
  try {
    console.log("Generating with Claude...");
    
    // Prepare the messages for Claude
    const messages = [];
    
    if (systemPrompt) {
      messages.push({
        role: "system",
        content: systemPrompt
      });
    }
    
    messages.push({
      role: "user",
      content: prompt
    });
    
    // Determine which Claude model to use
    const model = config.model_name || "claude-3-opus-20240229";
    
    // Make API request to Anthropic's Claude
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        max_tokens: 4000
      })
    });
    
    // Check for successful response
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Claude API error:", errorText);
      throw new Error(`Claude API error: ${response.status} ${errorText}`);
    }
    
    // Parse the response
    const data = await response.json();
    
    // Extract the content from Claude's response
    const content = data.content[0].text;
    
    return {
      content: content,
      markdown: content,
      metadata: {
        model: model,
        provider: "anthropic"
      }
    };
  } catch (error) {
    console.error("Error generating with Claude:", error);
    throw new Error(`Claude generation failed: ${error.message}`);
  }
}
