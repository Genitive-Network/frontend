// pages/api/history.ts
import { HistoryItem } from '@/types'
import { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const user_addr = searchParams.get('user_addr')

  console.log(process.env.GENITIVE_SERVER + '/api/history')
  console.log(searchParams, { user_addr })

  const response = await fetch(process.env.GENITIVE_SERVER + '/api/history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Cache-Control': 'no-store',
    },
    body: JSON.stringify({ user_addr: `'${user_addr}'` }),
  })

  if (!response.ok) {
    console.error(
      response.status,
      JSON.stringify({ user_addr: `'${user_addr}'` }),
    )
    return Response.json([])
  }

  const data: HistoryItem[] = await response.json()
  return Response.json(data)
}
