"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendContactEmail(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const message = formData.get("message") as string;

  if (!name || !email || !message) {
    return { error: "All fields are required" };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: "CrowdShield Contact <onboarding@resend.dev>",
      to: "basudevmuna111@gmail.com",
      subject: `New Message from ${name}`,
      reply_to: email,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error: any) {
    return { error: error.message || "Failed to send email" };
  }
}
