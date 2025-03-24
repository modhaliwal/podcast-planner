
-- This function will need to be added to Supabase via the SQL Editor
CREATE OR REPLACE FUNCTION public.delete_user(user_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Delete from the profiles table first (triggers cascade)
  DELETE FROM auth.users WHERE id = user_id;
END;
$$;
