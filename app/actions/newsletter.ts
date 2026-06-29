"use server";

import { z } from "zod";
import { addNewsletterContact } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

export type NewsletterState = {
  ok?: boolean;
  error?: string;
};

const emailSchema = z.email().max(200);

export async function subscribeNewsletterAction(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  if (!(await checkRateLimit("contact"))) {
    return { error: "Too many attempts. Please try again shortly." };
  }

  const parsed = emailSchema.safeParse(String(formData.get("email") ?? ""));
  if (!parsed.success) {
    return { error: "Please enter a valid email address." };
  }

  const added = await addNewsletterContact(parsed.data);
  if (!added) {
    return { error: "We couldn't add you right now. Please try again later." };
  }

  return { ok: true };
}
