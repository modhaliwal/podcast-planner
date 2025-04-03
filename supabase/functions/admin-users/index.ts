
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL') as string;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') as string;

    // Validate service key is available
    if (!supabaseServiceKey) {
      return new Response(
        JSON.stringify({ error: 'Service role key not found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    // Create Supabase client with admin privileges
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    
    // Get the requestor's JWT token from the Authorization header
    const authHeader = req.headers.get('Authorization');
    const jwt = authHeader?.replace('Bearer ', '') || '';

    // Verify the requestor's admin rights
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(jwt);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      );
    }

    // Parse request data
    const requestData = await req.json();
    const { action } = requestData;

    // For checkRole, we don't need to verify admin status
    if (action === 'checkRole') {
      const { userId, role } = requestData;
      
      // Validate required parameters
      if (!userId || !role) {
        return new Response(
          JSON.stringify({ error: 'User ID and role are required' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        );
      }
      
      // Check if user has the specified role
      const { data, error } = await supabaseAdmin
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', role)
        .single();
        
      return new Response(
        JSON.stringify({ hasRole: !!data && !error }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
      );
    }

    // Check if requestor is an admin for all other actions
    const { data: roleData } = await supabaseAdmin
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .single();

    if (!roleData) {
      return new Response(
        JSON.stringify({ error: 'Permission denied. Admin role required.' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 403 }
      );
    }

    let result;
    
    switch (action) {
      case 'listUsers':
        // Get list of users from Supabase Auth
        const { data: users, error: userError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (userError) {
          throw userError;
        }

        // Get user roles from our custom table
        const { data: allRoles } = await supabaseAdmin
          .from('user_roles')
          .select('*');

        // Combine users with their roles
        result = {
          users: users.users.map(authUser => {
            const userRoles = allRoles?.filter(role => role.user_id === authUser.id) || [];
            return {
              id: authUser.id,
              email: authUser.email,
              full_name: authUser.user_metadata?.full_name || '',
              avatar_url: authUser.user_metadata?.avatar_url || '',
              created_at: authUser.created_at,
              last_sign_in: authUser.last_sign_in_at,
              roles: userRoles
            };
          })
        };
        break;

      case 'createUser':
        const { userData } = requestData;
        
        if (!userData?.email || !userData?.password) {
          throw new Error('Email and password are required');
        }

        // Create the user in Supabase Auth
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true,
          user_metadata: { 
            full_name: userData.full_name || '' 
          }
        });

        if (createError) {
          throw createError;
        }

        // Add initial role
        if (userData.role) {
          await supabaseAdmin
            .from('user_roles')
            .insert({
              user_id: newUser.user.id,
              role: userData.role
            });
        }

        result = { user: newUser.user };
        break;

      case 'deleteUser':
        const { id } = requestData.userData || {};
        
        if (!id) {
          throw new Error('User ID is required');
        }

        // Delete the user in Supabase Auth
        const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(id);

        if (deleteError) {
          throw deleteError;
        }

        result = { success: true };
        break;

      case 'getUserRoles':
        const { userId } = requestData;
        
        if (!userId) {
          throw new Error('User ID is required');
        }
        
        // Fetch roles for the specified user
        const { data: roles, error: rolesError } = await supabaseAdmin
          .from('user_roles')
          .select('*')
          .eq('user_id', userId);
          
        if (rolesError) {
          throw rolesError;
        }
        
        result = { roles };
        break;

      case 'assignRole':
        if (!requestData.userData?.userId || !requestData.userData?.role) {
          throw new Error('User ID and role are required');
        }

        // Check if role already exists
        const { data: existingRole } = await supabaseAdmin
          .from('user_roles')
          .select('*')
          .eq('user_id', requestData.userData.userId)
          .eq('role', requestData.userData.role)
          .single();

        if (!existingRole) {
          // Add role if it doesn't exist
          const { data, error: roleError } = await supabaseAdmin
            .from('user_roles')
            .insert({
              user_id: requestData.userData.userId,
              role: requestData.userData.role
            })
            .select();

          if (roleError) {
            throw roleError;
          }

          result = { role: data[0] };
        } else {
          result = { role: existingRole, message: 'Role already assigned' };
        }
        break;

      case 'removeRole':
        if (!requestData.userData?.userId || !requestData.userData?.role) {
          throw new Error('User ID and role are required');
        }

        // Delete the role
        const { error: removeRoleError } = await supabaseAdmin
          .from('user_roles')
          .delete()
          .eq('user_id', requestData.userData.userId)
          .eq('role', requestData.userData.role);

        if (removeRoleError) {
          throw removeRoleError;
        }

        result = { success: true };
        break;

      default:
        throw new Error('Invalid action');
    }

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in admin-users function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'An unexpected error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
