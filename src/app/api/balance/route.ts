import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const user_addr = searchParams.get('user_addr')
  const token_addr = searchParams.get('token_addr')
  const public_key = searchParams.get('public_key')
  const signature = searchParams.get('signature')

  console.log(process.env.GENITIVE_SERVER + '/api/decrypt')
  console.log(searchParams, { signature, public_key })

  const response = await fetch(process.env.GENITIVE_SERVER + '/api/decrypt', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Cache-Control': 'no-store',
    },
    body: JSON.stringify({
      token_addr,
      user_addr,
      public_key,
      signature,
    }),
  })

  if (!response.ok) {
    console.error(
      response.status,
      JSON.stringify({ user_addr: `'${user_addr}'` }),
    )
    return new NextResponse(JSON.stringify([]), { status: 200 })
  }

  const data: { balance: `0x${string}` } = await response.json()
  console.log('history data from genitive server:', data)
  return new NextResponse(JSON.stringify(data), { status: 200 })
}
