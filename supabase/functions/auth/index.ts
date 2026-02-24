import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'
import { corsHeaders, handleCors } from '../_shared/auth.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

Deno.serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  try {
    const { action, phone_number, password, email, full_name, role } = await req.json()

    if (action === 'login') {
      return await handleLogin(phone_number, password)
    } else if (action === 'register') {
      return await handleRegister(phone_number, password, email, full_name, role)
    } else {
      return new Response(
        JSON.stringify({ error: 'Unknown action' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
  } catch (error) {
    console.error('Auth error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
    )
  }
})

async function handleLogin(phone_number: string, password: string) {
  try {
    // Get user by phone number and verify password
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('phone_number', phone_number)
      .single()

    if (userError || !userData) {
      return new Response(
        JSON.stringify({ error: 'Invalid phone number or password' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
      )
    }

    // Use Supabase auth for password verification
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userData.email || `${phone_number}@fundiguard.internal`,
      password,
    })

    if (error) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }),
        { status: 401, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
      )
    }

    return new Response(
      JSON.stringify({
        user: userData,
        token: data.session?.access_token,
        expires_in: 86400,
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
    )
  } catch (error) {
    throw error
  }
}

async function handleRegister(
  phone_number: string,
  password: string,
  email: string,
  full_name: string,
  role: 'client' | 'pro'
) {
  try {
    // Check if user exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('phone_number', phone_number)
      .single()

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Phone number already registered' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
      )
    }

    // Create auth user
    const authEmail = email || `${phone_number}@fundiguard.internal`
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: authEmail,
      password,
    })

    if (authError) {
      return new Response(
        JSON.stringify({ error: authError.message }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
      )
    }

    // Create user record
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user?.id,
        phone_number,
        email: authEmail,
        full_name,
        role,
        verified: false,
        id_verified: false,
        dci_verified: false,
      })
      .select()
      .single()

    if (userError) {
      return new Response(
        JSON.stringify({ error: userError.message }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
      )
    }

    // If registering as pro, create professional profile
    if (role === 'pro') {
      await supabase.from('professionals').insert({
        user_id: userData.id,
        is_available: true,
        online_status: false,
        subscription_type: 'free',
        total_jobs_completed: 0,
        total_earnings: 0,
        average_rating: 0,
        rating_count: 0,
      })
    }

    return new Response(
      JSON.stringify({
        user: userData,
        token: authData.session?.access_token,
        expires_in: 86400,
      }),
      { headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
    )
  } catch (error) {
    throw error
  }
}
