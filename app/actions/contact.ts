"use server";

import { z } from "zod";
import { sendContactEmail } from "@/lib/email";
import { checkRateLimit } from "@/lib/rate-limit";

export type ContactState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

const contactSchema = z.object({
  name: z.string().trim().min(1, "Your name is required").max(120),
  email: z.email("Enter a valid email").max(200),
  subject: z.string().trim().max(160).optional(),
  message: z.string().trim().min(10, "Please add a little more detail").max(4000),
});

export async function sendContactAction(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  if (!(await checkRateLimit("contact"))) {
    return { error: "Too many messages. Please wait a few minutes and try again." };
  }

  const parsed = contactSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    message: String(formData.get("message") ?? ""),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { error: "Please check the highlighted fields.", fieldErrors };
  }

  const sent = await sendContactEmail(parsed.data);
  if (!sent) {
    return { error: "We couldn't send your message right now. Please email us directly." };
  }

  return { ok: true };
}
