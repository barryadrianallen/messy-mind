// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

console.log("Hello from Functions!")

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

// Generate a random password (minimum 8 characters)
function generateRandomPassword() {
  const length = 12
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let retVal = ''
  for (let i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n))
  }
  return retVal
}

serve(async (req: Request) => {
  console.log('Function invoked. Method:', req.method); // Log invocation

  if (req.method === 'OPTIONS') {
    console.log('Responding to OPTIONS request.');
    return new Response('ok', { headers: corsHeaders })
  }

  let requestBody;
  try {
    requestBody = await req.json();
    console.log('Request body parsed:', requestBody);
  } catch (e) {
    console.error('Error parsing request body:', e.message, e.stack);
    return new Response(JSON.stringify({ error: 'Invalid JSON in request body: ' + e.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }

  const { fullName, username, parentUserId } = requestBody;

  if (!fullName || !username || !parentUserId) {
    const errorMsg = 'Missing required fields. Received: ' + JSON.stringify(requestBody);
    console.error(errorMsg);
    return new Response(JSON.stringify({ error: errorMsg }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
  console.log(`Processing for: fullName=${fullName}, username=${username}, parentUserId=${parentUserId}`);

  // Log all available environment variables for debugging
  console.log('[DIAGNOSTIC] All Deno.env variables:', JSON.stringify(Deno.env.toObject(), null, 2));

  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'); // Corrected env var name

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set in environment variables.'); // Corrected error message
    return new Response(JSON.stringify({ error: 'Server configuration error: Missing environment variables.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
  console.log('Environment variables (URL/Key presence) checked.');

  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
  console.log('Supabase admin client initialized.');

  const tempPassword = generateRandomPassword(); // Assuming generateRandomPassword() is defined elsewhere in the file
  const email = `${username.replace(/\s+/g, '_').toLowerCase()}@child.messy-mind.local`;
  console.log(`Generated email: ${email} and temp password.`);

  let authUserResponse, authError, childUserId;
  try {
    console.log('Attempting to create auth user...');
    // Note: The on_auth_user_created trigger will use metadata from here if provided.
    // For child users, we'll update profile details explicitly later.
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: tempPassword,
      email_confirm: true, // Set to true, child won't log in directly initially.
                           // Or false if you handle confirmation differently for children.
      // user_metadata: { full_name: fullName, username: username } // Optionally pass here too
    });
    authUserResponse = data;
    authError = error;

    if (authError) {
      console.error('Auth user creation error:', JSON.stringify(authError, null, 2));
      return new Response(JSON.stringify({ error: `Auth error: ${authError.message}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: authError.status || 500,
      });
    }

    if (!authUserResponse || !authUserResponse.user) {
      console.error('Auth user creation failed, no user object returned. Response:', JSON.stringify(authUserResponse, null, 2));
      return new Response(JSON.stringify({ error: 'Auth user creation failed unexpectedly (no user object).' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    childUserId = authUserResponse.user.id;
    console.log('Auth user created successfully. ID:', childUserId);

  } catch (e) {
    console.error('Critical error during auth user creation step:', e.message, e.stack);
    return new Response(JSON.stringify({ error: 'Critical server error during auth user creation: ' + e.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }

  // The on_auth_user_created trigger has already created a basic profile.
  // Now, we UPDATE it with the child-specific details.
  const profileDataToUpdate = {
    full_name: fullName,
    username: username,
    role: 'child', // Explicitly set role to 'child'
    managed_by_user_id: parentUserId,
    avatar_url: null, // Set a default or allow update later
  };
  console.log('Profile data for update prepared:', profileDataToUpdate);

  let updatedProfile, profileUpdateError;
  try {
    console.log(`Attempting to update profile for ID: ${childUserId}...`);
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(profileDataToUpdate)
      .eq('id', childUserId) // Target the profile with the new auth user's ID
      .select()
      .single(); // We expect to update exactly one profile

    updatedProfile = data;
    profileUpdateError = error;

    if (profileUpdateError) {
      console.error('Profile update error:', JSON.stringify(profileUpdateError, null, 2));
      console.log(`Attempting to clean up auth user ${childUserId} after profile update failure.`);
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(childUserId);
      if (deleteError) {
        console.error(`Failed to clean up auth user ${childUserId}:`, JSON.stringify(deleteError, null, 2));
      } else {
        console.log(`Successfully cleaned up auth user ${childUserId}.`);
      }
      return new Response(JSON.stringify({ error: `Profile update error: ${profileUpdateError.message}` }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: profileUpdateError.status || 500,
      });
    }

    if (!updatedProfile) {
        console.error('Profile update apparently succeeded but no data was returned. This is unexpected.');
        // Potentially clean up auth user as this state is ambiguous
        console.log(`Attempting to clean up auth user ${childUserId} due to ambiguous profile update outcome.`);
        await supabaseAdmin.auth.admin.deleteUser(childUserId).catch(delErr => console.error(`Cleanup failed for ${childUserId}:`, delErr));
        return new Response(JSON.stringify({ error: 'Profile update did not return data.'}), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 500,
        });
    }
    console.log('Profile updated successfully:', updatedProfile);

  } catch (e) {
    console.error('Critical error during profile update step:', e.message, e.stack);
    if (childUserId) {
        console.log(`Attempting to clean up auth user ${childUserId} after critical profile update error.`);
        await supabaseAdmin.auth.admin.deleteUser(childUserId).catch(delErr => console.error(`Cleanup failed for ${childUserId}:`, delErr));
    }
    return new Response(JSON.stringify({ error: 'Critical server error during profile update: ' + e.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
  
  console.log('Function completed successfully. Returning user and profile.');
  // Return the original auth user object and the updated profile
  return new Response(JSON.stringify({ user: authUserResponse.user, profile: updatedProfile }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    status: 200,
  });
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/create-child-user' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
