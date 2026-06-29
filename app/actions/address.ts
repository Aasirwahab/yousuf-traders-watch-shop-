"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import {
  createAddress,
  deleteAddress,
  setDefaultAddress,
  updateAddress,
  type AddressView,
} from "@/lib/address";
import { checkRateLimit } from "@/lib/rate-limit";

const MAX_ID_LENGTH = 64;

// Mirrors the shipping fields validated at checkout (lib/orders checkoutSchema).
const addressSchema = z.object({
  name: z.string().trim().min(1, "Full name is required").max(120),
  phone: z.string().trim().max(40).optional(),
  line1: z.string().trim().min(1, "Address is required").max(200),
  line2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(1, "City is required").max(120),
  state: z.string().trim().max(120).optional(),
  postal: z.string().trim().min(1, "Postal code is required").max(40),
  country: z.string().trim().min(1, "Country is required").max(120),
  isDefault: z.boolean().optional(),
});

export type AddressActionResult =
  | { ok: true; addresses: AddressView[] }
  | { ok: false; error?: string; fieldErrors?: Record<string, string> };

async function requireUser(): Promise<string | null> {
  const { userId } = await auth();
  return userId ?? null;
}

/** Create (no id) or update (id present) an address from the form payload. */
export async function saveAddressAction(formData: FormData): Promise<AddressActionResult> {
  if (!(await requireUser())) return { ok: false, error: "Please sign in to manage addresses." };
  if (!(await checkRateLimit("contact"))) {
    return { ok: false, error: "Too many attempts. Please wait a moment and try again." };
  }

  const raw = {
    name: String(formData.get("name") ?? ""),
    phone: String(formData.get("phone") ?? ""),
    line1: String(formData.get("line1") ?? ""),
    line2: String(formData.get("line2") ?? ""),
    city: String(formData.get("city") ?? ""),
    state: String(formData.get("state") ?? ""),
    postal: String(formData.get("postal") ?? ""),
    country: String(formData.get("country") ?? ""),
    isDefault: formData.get("isDefault") === "on" || formData.get("isDefault") === "true",
  };

  const parsed = addressSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { ok: false, error: "Please check the highlighted fields.", fieldErrors };
  }

  const id = String(formData.get("id") ?? "").trim();
  const addresses =
    id && id.length <= MAX_ID_LENGTH
      ? await updateAddress(id, parsed.data)
      : await createAddress(parsed.data);

  return { ok: true, addresses };
}

export async function deleteAddressAction(id: string): Promise<AddressActionResult> {
  if (!(await requireUser())) return { ok: false, error: "Please sign in to manage addresses." };
  if (typeof id !== "string" || id.length > MAX_ID_LENGTH) {
    return { ok: false, error: "Invalid address." };
  }
  return { ok: true, addresses: await deleteAddress(id) };
}

export async function setDefaultAddressAction(id: string): Promise<AddressActionResult> {
  if (!(await requireUser())) return { ok: false, error: "Please sign in to manage addresses." };
  if (typeof id !== "string" || id.length > MAX_ID_LENGTH) {
    return { ok: false, error: "Invalid address." };
  }
  return { ok: true, addresses: await setDefaultAddress(id) };
}
