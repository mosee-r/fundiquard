import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

export const supabase = createClient(supabaseUrl, supabaseKey)

export async function requireAuth(req: Request) {
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    throw new Error('Missing Authorization header')
  }

  const token = authHeader.replace('Bearer ', '')
  
  const { data, error } = await supabase.auth.getUser(token)
  if (error) {
    throw new Error(`Invalid token: ${error.message}`)
  }

  return data.user
}

export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }
}

export function handleCors(req: Request) {
  if (req.method === 'OPTIONS') {
    return new Response('OK', { headers: corsHeaders() })
  }
}
