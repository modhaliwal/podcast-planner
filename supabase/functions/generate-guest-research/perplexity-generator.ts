
import { validateApiKey } from "../generate-bio/utils.ts";

export async function generateResearchWithPerplexity(
  name: string, 
  title: string, 
  company: string | undefined,
  extractedContent: string
) {
  const perplexityApiKey = Deno.env.get('PERPLEXITY_API_KEY');
  if (!perplexityApiKey) {
    throw new Error("Perplexity API key is not configured");
  }
  
  const companyInfo = company ? `at ${company}` : "";
  
  try {
    console.log("Calling Perplexity API to generate research");
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${perplexityApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: "system",
            content: "You are a skilled researcher specializing in preparing background information for podcast hosts. Your research is thorough, well-organized, and helps hosts conduct great interviews. Format your response in clean markdown using ## for section headings, bullet points with *, and proper markdown syntax for emphasis like **bold** and *italic*. Ensure your markdown is correctly formatted with proper spacing between sections."
          },
          {
            role: "user",
            content: `Create detailed background research on ${name}, who is a ${title} ${companyInfo}, for a podcast interview.
            
            Format the output as well-structured markdown with proper headings (##), lists (*, -), and sections.
            
            Include the following sections:
            - Educational background and career journey
            - Notable accomplishments and expertise areas
            - Previous media appearances and speaking style
            - Recent projects or publications
            - Social media presence and online engagement
            - Recommended topics to explore in the interview
            
            Here's information extracted from their online presence to help you:
            
            ${extractedContent}
            
            Create a comprehensive but scannable research document that will help the podcast host prepare for a great interview.`
          }
        ],
        temperature: 0.2,
        max_tokens: 2000,
        return_images: true,
        return_related_questions: false,
        web_search_options: {
          search_context_size: "high"
        },
        response_format: { type: "json_object" },
      }),
    });

    const data = await response.json();
    
    if (data.error) {
      console.error("Perplexity API error:", data.error);
      throw new Error(`Perplexity API error: ${data.error.message || data.error}`);
    }
    
    // Extract the generated research from the completion
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Unexpected response format from Perplexity:", data);
      throw new Error("Unexpected response format from Perplexity");
    }
    
    // Parse the JSON content if it's in JSON format
    let generatedResearch = "";
    const content = data.choices[0].message.content.trim();
    
    try {
      // Try to parse as JSON
      const jsonContent = JSON.parse(content);
      
      // Look for the research content in common JSON structures
      if (jsonContent.research) {
        generatedResearch = jsonContent.research;
      } else if (jsonContent.content) {
        generatedResearch = jsonContent.content;
      } else if (jsonContent.markdown) {
        generatedResearch = jsonContent.markdown;
      } else if (jsonContent.text) {
        generatedResearch = jsonContent.text;
      } else {
        // If we can't find a standard field, use the first string property we find
        for (const key in jsonContent) {
          if (typeof jsonContent[key] === 'string' && jsonContent[key].length > 100) {
            generatedResearch = jsonContent[key];
            break;
          }
        }
      }
    } catch (e) {
      // If JSON parsing fails, use the content directly
      console.log("Not valid JSON format, using text directly");
      generatedResearch = content;
    }
    
    console.log("Successfully generated research with Perplexity");
    
    // Log a preview of the generated markdown
    console.log("Preview of generated markdown:", generatedResearch.substring(0, 200) + "...");
    
    return generatedResearch;
  } catch (error) {
    console.error("Error calling Perplexity for research:", error);
    throw new Error(`Failed to generate research with Perplexity: ${error.message}`);
  }
}
