
// CORS headers for all Edge Functions
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Validate request data for content generation functions
export function validateRequestData(data: any) {
  const { 
    type, 
    name, 
    title, 
  } = data;

  if (!type) {
    throw new Error("Type is required ('bio' or 'research')");
  }
  
  if (!name) {
    throw new Error("Name is required");
  }
  
  if (!title) {
    throw new Error("Title is required");
  }
  
  return data;
}
