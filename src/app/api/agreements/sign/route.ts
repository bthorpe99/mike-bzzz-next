import { NextRequest, NextResponse } from 'next/server'
import { getSiteUrl } from '@/lib/site-url'

export const runtime = 'nodejs'

type AgreementPayload = {
  fullName?: string
  email?: string
  phone?: string
  license?: string
  vehicle?: string
  pickupDate?: string
  returnDate?: string
  signatureDataUrl?: string
  agreed?: boolean
}

const clean = (value: unknown, max = 300) =>
  String(value || '')
    .replace(/[\u200B-\u200D\u2060\uFEFF]/g, '')
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '')
    .trim()
    .slice(0, max)

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)

function htmlEscape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

async function sendAgreementEmail(args: {
  to: string[]
  replyTo: string
  subject: string
  html: string
  signatureBase64: string
}) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.AGREEMENTS_FROM_EMAIL || 'Mike Bzzz Rentals <onboarding@resend.dev>'

  if (!apiKey) {
    throw new Error('Agreement email is not configured. Add RESEND_API_KEY in Vercel.')
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: args.to,
      reply_to: args.replyTo,
      subject: args.subject,
      html: args.html,
      attachments: [
        {
          filename: 'signature.png',
          content: args.signatureBase64,
        },
      ],
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`Email service failed: ${text}`)
  }
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as AgreementPayload
    const fullName = clean(payload.fullName, 120)
    const email = clean(payload.email, 160).toLowerCase()
    const phone = clean(payload.phone, 60)
    const license = clean(payload.license, 80)
    const vehicle = clean(payload.vehicle, 140)
    const pickupDate = clean(payload.pickupDate, 40)
    const returnDate = clean(payload.returnDate, 40)
    const signatureDataUrl = String(payload.signatureDataUrl || '')
    const mikeEmail = clean(process.env.MIKE_AGREEMENTS_TO_EMAIL, 160)

    if (!fullName || !email || !phone || !license || !vehicle || !pickupDate || !returnDate) {
      return NextResponse.json({ error: 'Please complete every required field.' }, { status: 400 })
    }
    if (!isEmail(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }
    if (!payload.agreed) {
      return NextResponse.json({ error: 'Please check the agreement box before signing.' }, { status: 400 })
    }
    if (!signatureDataUrl.startsWith('data:image/png;base64,') || signatureDataUrl.length < 1200) {
      return NextResponse.json({ error: 'Please sign inside the signature box.' }, { status: 400 })
    }
    if (!mikeEmail || !isEmail(mikeEmail)) {
      return NextResponse.json(
        { error: 'Agreement email is not configured yet. Add MIKE_AGREEMENTS_TO_EMAIL in Vercel.' },
        { status: 500 }
      )
    }

    const signatureBase64 = signatureDataUrl.replace(/^data:image\/png;base64,/, '')
    const signedAt = new Date().toLocaleString('en-US', {
      timeZone: 'America/New_York',
      dateStyle: 'medium',
      timeStyle: 'short',
    })
    const agreementUrl = `${getSiteUrl()}/mike-rental-agreement.pdf`
    const ip =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown'

    const rows = [
      ['Client', fullName],
      ['Email', email],
      ['Phone', phone],
      ['Driver license', license],
      ['Vehicle', vehicle],
      ['Pickup date', pickupDate],
      ['Return date', returnDate],
      ['Signed at', signedAt],
      ['IP record', ip],
      ['Agreement PDF', agreementUrl],
    ]

    const tableRows = rows
      .map(
        ([label, value]) =>
          `<tr><td style="padding:8px 10px;border-bottom:1px solid #eee;color:#666;">${htmlEscape(
            label
          )}</td><td style="padding:8px 10px;border-bottom:1px solid #eee;font-weight:700;">${htmlEscape(
            value
          )}</td></tr>`
      )
      .join('')

    const html = `
      <div style="font-family:Arial,sans-serif;color:#111;line-height:1.5;">
        <h2 style="margin:0 0 8px;">Mike Bzzz Rental Agreement Signed</h2>
        <p style="margin:0 0 16px;color:#555;">A client electronically signed the rental agreement.</p>
        <table style="border-collapse:collapse;width:100%;max-width:640px;border:1px solid #eee;">${tableRows}</table>
        <p style="margin:16px 0 8px;">Original agreement PDF: <a href="${agreementUrl}">${agreementUrl}</a></p>
        <p style="margin:8px 0;color:#555;">The signature image is attached to this email.</p>
      </div>
    `

    await sendAgreementEmail({
      to: [mikeEmail, email],
      replyTo: email,
      subject: `Signed rental agreement - ${fullName}`,
      html,
      signatureBase64,
    })

    return NextResponse.json({ ok: true, message: 'Agreement sent.' })
  } catch (error) {
    console.error('agreement-sign-error', error)
    const message = error instanceof Error ? error.message : 'Could not send agreement.'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
