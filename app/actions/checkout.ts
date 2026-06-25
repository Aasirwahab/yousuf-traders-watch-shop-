"use server";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { checkoutSchema, createOrderFromCart } from "@/lib/orders";
import { checkRateLimit } from "@/lib/rate-limit";

export type CheckoutState = {
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function placeOrderAction(
  _prev: CheckoutState,
  formData: FormData,
): Promise<CheckoutState> {
  if (!(await checkRateLimit("checkout"))) {
    return { error: "Too many attempts. Please wait a moment and try again." };
  }

  // Checkout is sign-in only (enforced in middleware too). Reject the action
  // directly in case it is ever invoked outside the protected page.
  const { userId } = await auth();
  if (!userId) {
    return { error: "Please sign in to complete checkout." };
  }

  const raw = {
    email: String(formData.get("email") ?? ""),
    shipName: String(formData.get("shipName") ?? ""),
    shipPhone: String(formData.get("shipPhone") ?? ""),
    shipLine1: String(formData.get("shipLine1") ?? ""),
    shipLine2: String(formData.get("shipLine2") ?? ""),
    shipCity: String(formData.get("shipCity") ?? ""),
    shipState: String(formData.get("shipState") ?? ""),
    shipPostal: String(formData.get("shipPostal") ?? ""),
    shipCountry: String(formData.get("shipCountry") ?? ""),
    shippingMethod: String(formData.get("shippingMethod") ?? ""),
  };

  const parsed = checkoutSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { error: "Please check the highlighted fields.", fieldErrors };
  }

  const result = await createOrderFromCart(parsed.data);
  if (!result.ok) {
    return { error: result.error };
  }

  redirect(`/checkout/${result.orderId}`);
}
