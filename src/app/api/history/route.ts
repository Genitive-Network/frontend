// pages/api/history.ts
import { HistoryItem } from '@/types'
import type { NextApiRequest } from 'next'

export async function POST(req: NextApiRequest) {
  const { user_addr } = req.body

  console.log(process.env.GENITIVE_SERVER + '/api/history')
  const response = await fetch(process.env.GENITIVE_SERVER + '/api/history', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store', // 确保数据不被缓存
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
