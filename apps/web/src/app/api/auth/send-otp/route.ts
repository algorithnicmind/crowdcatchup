import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_mock_key');

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.warn("No RESEND_API_KEY found, mocking email delivery", { email, otp });
      return NextResponse.json({ success: true, mocked: true });
    }

    const data = await resend.emails.send({
      from: 'CrowdShield <onboarding@resend.dev>', // Needs verified domain in production
      to: email,
      subject: 'Your CrowdShield Verification Code',
      html: `
        <div style="font-family: sans-serif; max-w-md; margin: auto; padding: 20px; border: 1px solid #333; background: #000; color: #fff;">
          <h1 style="color: #10b981;">CrowdShield</h1>
          <p>Your citizen verification code is:</p>
          <h2 style="font-size: 32px; letter-spacing: 5px; color: #fff;">${otp}</h2>
          <p style="color: #666; font-size: 12px;">This code will expire in 10 minutes.</p>
        </div>
      `
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}
