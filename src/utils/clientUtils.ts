'use client'
import * as sigUtil from '@metamask/eth-sig-util'
import { hexlify } from 'ethers'

export function base64ToHex(base64: string) {
  // Decode the base64 string to a binary string
  const binaryString = atob(base64)

  // Convert the binary string to a Uint8Array
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  // Convert the Uint8Array to a hex string
  const hexString = Array.from(bytes, byte =>
    byte.toString(16).padStart(2, '0'),
  ).join('')

  return hexString
}

export function hexToBase64(hex: string) {
  if (hex.length <= 2) return
  // Ensure the hex string does not have the '0x' prefix
  if (hex.startsWith('0x')) {
    hex = hex.slice(2)
  }

  // Convert hex string to Uint8Array
  const bytes = new Uint8Array(
    hex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)),
  )

  // Convert Uint8Array to binary string
  const binaryString = String.fromCharCode.apply(null, Array.from(bytes))

  // Encode binary string to Base64
  const base64String = btoa(binaryString)

  return base64String
}

export const encryptText = (publicKey: string, text: string) => {
  const b64 = hexToBase64(publicKey)

  if (!b64) {
    throw new Error('Failed to convert pubkey to base64 format.')
  }

  const encryptedText = sigUtil.encrypt({
    publicKey: b64,
    data: text,
    // https://github.com/MetaMask/eth-sig-util/blob/v4.0.0/src/encryption.ts#L40
    version: 'x25519-xsalsa20-poly1305',
  })
  console.log({ encryptedText })

  return hexlify(Buffer.from(JSON.stringify(encryptedText), 'utf8'))
}

export const encryptParam = (publicKey: string, text: string) => {
  const b64 = hexToBase64(publicKey)

  if (!b64) {
    throw new Error('Failed to convert pubkey to base64 format.')
  }

  const encrypted = sigUtil.encrypt({
    publicKey: b64,
    data: text,
    // https://github.com/MetaMask/eth-sig-util/blob/v4.0.0/src/encryption.ts#L40
    version: 'x25519-xsalsa20-poly1305',
  })
  console.log('encrypted', encrypted)

  return hexlify(Buffer.from(encrypted.ciphertext, 'utf8'))
}
