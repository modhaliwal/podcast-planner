
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
        model: 'sonar',
        messages: [
          {
            role: "system",
            content: "You are a skilled researcher specializing in preparing background information for podcast hosts. Your research is thorough, well-organized, and helps hosts conduct great interviews. Format your response in clean markdown using ## for section headings, bullet points with *, and proper markdown syntax for emphasis like **bold** and *italic*. Include relevant images when appropriate, embedding them directly in markdown. End your document with a table of reference links used in your research. Ensure your markdown is correctly formatted with proper spacing between sections."
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
            
            Where appropriate, include relevant images directly embedded in markdown. End the document with a table of references used.
            
            Here's information extracted from their online presence to help you:
            
            ${extractedContent}
            
            Create a comprehensive but scannable research document that will help the podcast host prepare for a great interview.`
          }
        ],
        temperature: 0.2,
        max_tokens: 2000,
        return_images: true,
        return_related_questions: false,
        response_format: {
          "type": "json_schema",
          "json_schema": {
            "schema": {
              "type": "object",
              "properties": {
                "Body": {
                  "type": "string",
                  "description": "The full response in Markdown format."
                },
                "References": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "format": "uri"
                  },
                  "description": "List of numbered source URLs referenced in the response."
                },
                "Images": {
                  "type": "array",
                  "items": {
                    "type": "string",
                    "format": "uri"
                  },
                  "description": "List of image URLs referenced in the response."
                }
              },
              "required": ["Body", "References", "Images"]
            }
          }
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Perplexity API error status:", response.status, errorText);
      throw new Error(`Perplexity API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      console.error("Perplexity API error:", data.error);
      throw new Error(`Perplexity API error: ${data.error.message || data.error}`);
    }
    
    // Parse the response content according to the JSON format
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error("Unexpected response format from Perplexity:", data);
      throw new Error("Unexpected response format from Perplexity");
    }
    
    // Extract content from the JSON response and combine with images and references
    let generatedResearch;
    
    try {
      // Check if the content is already JSON or needs to be parsed
      const messageContent = data.choices[0].message.content;
      console.log("Raw message content type:", typeof messageContent);
      
      let bodyContent = "";
      let references = [];
      let images = [];
      
      if (typeof messageContent === 'string') {
        try {
          // Try to parse as JSON if it looks like JSON
          if (messageContent.trim().startsWith('{')) {
            const parsedContent = JSON.parse(messageContent);
            bodyContent = parsedContent.Body || messageContent;
            references = parsedContent.References || [];
            images = parsedContent.Images || [];
            console.log("Successfully parsed JSON string from content");
          } else {
            // Not JSON format, use as is
            bodyContent = messageContent;
            console.log("Using content as plain text (not JSON)");
          }
        } catch (e) {
          console.log("Failed to parse as JSON, using as plain text:", e);
          bodyContent = messageContent;
        }
      } else if (typeof messageContent === 'object') {
        // It's already a parsed object
        bodyContent = messageContent.Body || JSON.stringify(messageContent);
        references = messageContent.References || [];
        images = messageContent.Images || [];
        console.log("Using pre-parsed object content");
      } else {
        throw new Error("Unexpected content format");
      }
      
      // Process images - embed directly in the markdown at the appropriate sections
      console.log(`Found ${images.length} images to embed`);
      for (let i = 0; i < images.length; i++) {
        const imageUrl = images[i];
        const imageMarkdown = `\n\n![Image ${i+1}](${imageUrl})\n\n`;
        
        // For simplicity, we'll add the images before the reference section
        // In a more advanced version, we could parse the markdown and insert at appropriate points
        if (!bodyContent.includes(imageMarkdown)) {
          if (bodyContent.includes("## References") || bodyContent.includes("# References")) {
            // Insert before references section
            bodyContent = bodyContent.replace(/(#{1,2} References)/g, `${imageMarkdown}$1`);
          } else {
            // Add at the end if no references section
            bodyContent += imageMarkdown;
          }
        }
      }
      
      // Add references as a table if they don't already exist in the content
      if (references.length > 0 && 
          !bodyContent.includes("## References") && 
          !bodyContent.includes("# References")) {
        
        bodyContent += "\n\n## References\n\n";
        bodyContent += "| # | Source |\n";
        bodyContent += "|---|--------|\n";
        
        references.forEach((reference, index) => {
          bodyContent += `| ${index + 1} | [${reference}](${reference}) |\n`;
        });
      }
      
      generatedResearch = bodyContent;
    } catch (error) {
      console.error("Error parsing Perplexity response content:", error);
      throw new Error(`Failed to parse Perplexity response: ${error.message}`);
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
