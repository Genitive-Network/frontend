import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { user_addr, token_addr, public_key, signature } = await request.json()

  console.log(process.env.GENITIVE_SERVER + '/api/decrypt')
  console.log(request.body, {
    token_addr,
    user_addr,
    public_key,
    signature,
  })

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
      'response:',
      await response.text(),
      JSON.stringify({ user_addr, public_key }),
    )
    return new NextResponse(JSON.stringify([]), { status: 200 })
  }

  const data: { balance: `0x${string}` } = await response.json()
  console.log('history data from genitive server:', data)
  return new NextResponse(JSON.stringify(data), { status: 200 })
}
