import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.0'
import { corsHeaders, handleCors, requireAuth, supabase } from '../_shared/auth.ts'

Deno.serve(async (req) => {
  // Handle CORS
  const corsResponse = handleCors(req)
  if (corsResponse) return corsResponse

  const { pathname } = new URL(req.url)
  const segments = pathname.split('/').filter(Boolean)
  const bidId = segments[segments.length - 1]

  try {
    if (req.method === 'GET') {
      const url = new URL(req.url)
      const jobId = url.searchParams.get('job_id')
      const proId = url.searchParams.get('pro_id')

      if (jobId) {
        return await getBidsForJob(jobId)
      } else if (proId) {
        return await getBidsFromProfessional(proId)
      } else {
        return new Response(
          JSON.stringify({ error: 'job_id or pro_id required' }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
        )
      }
    } else if (req.method === 'POST') {
      // Submit bid
      const user = await requireAuth(req)
      const body = await req.json()
      return await submitBid(user.id, body)
    } else if (req.method === 'PATCH') {
      // Accept/reject/withdraw bid
      const user = await requireAuth(req)
      const body = await req.json()
      const action = body.action
      return await updateBidStatus(bidId, user.id, action)
    } else {
      return new Response('Method not allowed', { status: 405 })
    }
  } catch (error) {
    console.error('Bid error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
    )
  }
})

async function getBidsForJob(jobId: string) {
  const { data, error } = await supabase
    .from('bids')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return new Response(
    JSON.stringify({ bids: data }),
    { headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
  )
}

async function getBidsFromProfessional(proId: string) {
  const { data, error } = await supabase
    .from('bids')
    .select('*')
    .eq('professional_id', proId)
    .order('created_at', { ascending: false })

  if (error) {
    throw new Error(error.message)
  }

  return new Response(
    JSON.stringify({ bids: data }),
    { headers: { 'Content-Type': 'application/json', ...corsHeaders() } }
  )
}

async function submitBid(userId: string, bidData: any) {
  const { job_id, proposed_price, estimated_duration_hours, bid_message } = bidData

  // Check if professional exists
  const { data: pro } = await supabase
    .from('professionals')
    .select('id')
    .eq('user_id', userId)
    .single()

  if (!pro) {
    throw new Error('Professional profile not found')
  }

  // Check for duplicate bid
  const { data: existingBid } = await supabase
    .from('bids')
    .select('id')
    .eq('job_id', job_id)
    .eq('professional_id', userId)
    .eq('status', 'pending')
    .single()

  if (existingBid) {
    throw new Error('You have already bid on this job')
  }

  const { data, error } = await supabase
    .from('bids')
    .insert({
      job_id,
      professional_id: userId,
      proposed_price,
      estimated_duration_hours,
      bid_message,
      status: 'pending',
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

async function updateBidStatus(bidId: string, userId: string, action: string) {
  // Verify ownership
  const { data: bid, error: fetchError } = await supabase
    .from('bids')
    .select('professional_id, job_id')
    .eq('id', bidId)
    .single()

  if (fetchError) {
    throw new Error('Bid not found')
  }

  if (action === 'accept') {
    // Only job client can accept
    const { data: job } = await supabase
      .from('jobs')
      .select('client_id')
      .eq('id', bid.job_id)
      .single()

    if (job.client_id !== userId) {
      throw new Error('Only job poster can accept bids')
    }

    // Reject other bids and update job status
    await supabase
      .from('bids')
      .update({ status: 'rejected' })
      .eq('job_id', bid.job_id)
      .neq('id', bidId)

    const { data, error } = await supabase
      .from('bids')
      .update({ status: 'accepted', accepted_at: new Date() })
      .eq('id', bidId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return new Response(JSON.stringify(data), { headers: { ...corsHeaders(), 'Content-Type': 'application/json' } })
  } else if (action === 'reject') {
    const { data: job } = await supabase
      .from('jobs')
      .select('client_id')
      .eq('id', bid.job_id)
      .single()

    if (job.client_id !== userId) {
      throw new Error('Only job poster can reject bids')
    }

    const { data, error } = await supabase
      .from('bids')
      .update({ status: 'rejected' })
      .eq('id', bidId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return new Response(JSON.stringify(data), { headers: { ...corsHeaders(), 'Content-Type': 'application/json' } })
  } else if (action === 'withdraw') {
    if (bid.professional_id !== userId) {
      throw new Error('Only bidder can withdraw')
    }

    const { data, error } = await supabase
      .from('bids')
      .update({ status: 'withdrawn' })
      .eq('id', bidId)
      .select()
      .single()

    if (error) throw new Error(error.message)
    return new Response(JSON.stringify(data), { headers: { ...corsHeaders(), 'Content-Type': 'application/json' } })
  } else {
    throw new Error('Invalid action')
  }
}
