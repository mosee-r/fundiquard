import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'
import { corsHeaders, handleCors, requireAuth, supabase } from '../_shared/auth.ts'

Deno.serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  const { pathname } = new URL(req.url)
  const segments = pathname.split('/').filter(Boolean)
  const jobId = segments[segments.length - 1]

  try {
    if (req.method === 'GET') {
      if (jobId && jobId !== 'jobs') {
        // Get specific job
        return await getJob(jobId)
      } else {
        // List jobs with filters
        const url = new URL(req.url)
        const category = url.searchParams.get('category')
        const location = url.searchParams.get('location')
        const status = url.searchParams.get('status')
        const page = parseInt(url.searchParams.get('page') || '1')
        const limit = parseInt(url.searchParams.get('limit') || '10')

        return await listJobs({ category, location, status, page, limit })
      }
    } else if (req.method === 'POST') {
      // Create job
      const user = await requireAuth(req)
      const body = await req.json()
      return await createJob(user.id, body)
    } else if (req.method === 'PUT' || req.method === 'PATCH') {
      // Update job
      const user = await requireAuth(req)
      const body = await req.json()
      return await updateJob(jobId, user.id, body)
    } else {
      return new Response('Method not allowed', { status: 405 })
    }
  } catch (error) {
    console.error('Job error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
    )
  }
})

async function listJobs(filters: any) {
  let query = supabase.from('jobs').select('*', { count: 'exact' })

  if (filters.category) {
    query = query.eq('category', filters.category)
  }
  if (filters.location) {
    query = query.ilike('location', `%${filters.location}%`)
  }
  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  const from = (filters.page - 1) * filters.limit
  const to = from + filters.limit - 1

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    throw new Error(error.message)
  }

  return new Response(
    JSON.stringify({
      jobs: data,
      total: count,
      page: filters.page,
      limit: filters.limit,
      pages: Math.ceil((count || 0) / filters.limit),
    }),
    { headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
  )
}

async function getJob(jobId: string) {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .single()

  if (error) {
    throw new Error('Job not found')
  }

  return new Response(
    JSON.stringify(data),
    { headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
  )
}

async function createJob(userId: string, jobData: any) {
  const { title, description, category, budget, location, urgency, photos } = jobData

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      client_id: userId,
      title,
      description,
      category,
      budget,
      location,
      urgency: urgency || 'normal',
      status: 'open',
      photos: photos || [],
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return new Response(
    JSON.stringify(data),
    { status: 201, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
  )
}

async function updateJob(jobId: string, userId: string, updates: any) {
  // Verify user owns the job
  const { data: job, error: fetchError } = await supabase
    .from('jobs')
    .select('client_id')
    .eq('id', jobId)
    .single()

  if (fetchError || job.client_id !== userId) {
    throw new Error('Unauthorized')
  }

  const { data, error } = await supabase
    .from('jobs')
    .update(updates)
    .eq('id', jobId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return new Response(
    JSON.stringify(data),
    { headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
  )
}
