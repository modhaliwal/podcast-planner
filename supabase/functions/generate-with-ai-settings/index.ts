
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { convertMarkdownToHtml } from "../shared/utils/markdownConverter.ts"
import { processPromptWithParameters } from "../shared/generators/ai.ts"

// CORS headers for browser requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the request body
    const { slug, parameters, responseFormat = 'markdown', preferredProvider } = await req.json()

    if (!slug) {
      throw new Error("Missing required parameter: slug")
    }

    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') as string
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Get the AI generator settings from the database
    const { data: generator, error: fetchError } = await supabase
      .from('ai_generators')
      .select('*')
      .eq('slug', slug)
      .single()

    if (fetchError) {
      throw new Error(`Failed to fetch AI generator: ${fetchError.message}`)
    }

    if (!generator) {
      throw new Error(`No AI generator found with slug: ${slug}`)
    }

    console.log(`Using AI generator: ${generator.title}`)
    console.log(`AI Model: ${generator.ai_model || 'not specified'}, Model Name: ${generator.model_name || 'default'}`)

    // Process the prompt with parameters if available
    let processedPrompt = ""
    if (generator.prompt_text && parameters) {
      processedPrompt = processPromptWithParameters(generator.prompt_text, parameters)
    } else {
      processedPrompt = generator.prompt_text || ""
    }

    // Create configuration for the AI generator
    const config = {
      type: generator.key || 'generic',
      name: parameters?.name || 'User',
      title: parameters?.title || '',
      company: parameters?.company || '',
      prompt: processedPrompt, // Use the processed prompt
      systemPrompt: generator.system_prompt,
      contextInstructions: generator.context_instructions,
      exampleOutput: generator.example_output,
      // Pass the AI model and model name to the generator
      ai_model: generator.ai_model,
      model_name: generator.model_name,
      // Add parameters to be used for prompt variable substitution
      parameters: parameters,
      ...parameters
    }

    // Import the AI generator factory to create the right generator
    const { generateContent } = await import("../shared/generators/ai.ts")

    // Generate content
    console.log("Generating content using AI...")
    
    try {
      // Pass along preferred provider if it was specified in the request
      const generatedResponse = await generateContent(config, preferredProvider)
      
      let finalContent = ''
      
      // Process response based on requested format
      if (responseFormat === 'html' && generatedResponse.markdown) {
        console.log("Converting markdown to HTML...")
        finalContent = await convertMarkdownToHtml(generatedResponse.markdown)
      } else if (responseFormat === 'html' && generatedResponse.content) {
        // If content is already HTML, use it directly
        finalContent = generatedResponse.content
      } else {
        // Return markdown or plain content as is
        finalContent = generatedResponse.markdown || generatedResponse.content
      }

      // Create or extend metadata to include the processed prompt
      const metadata = {
        ...(generatedResponse.metadata || {}),
        processedPrompt: processedPrompt
      }

      return new Response(
        JSON.stringify({
          content: finalContent,
          metadata: metadata,
          format: responseFormat
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    } catch (generationError) {
      console.error("Error generating content:", generationError)
      throw new Error(`Failed to generate content: ${generationError.message}`)
    }
  } catch (error) {
    console.error("Error in generate-with-ai-settings:", error)
    return new Response(
      JSON.stringify({ 
        error: error.message || "An unexpected error occurred",
        errorDetails: error.toString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
