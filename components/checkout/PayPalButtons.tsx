"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createPayPalOrderAction, capturePayPalOrderAction } from "@/app/actions/payment";

const CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

// Load the PayPal JS SDK once, even if several button instances mount.
let sdkPromise: Promise<void> | null = null;
function loadPayPalSdk(clientId: string): Promise<void> {
  if (typeof window !== "undefined" && (window as { paypal?: unknown }).paypal) {
    return Promise.resolve();
  }
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(
      clientId,
    )}&currency=USD&components=buttons`;
    script.onload = () => resolve();
    script.onerror = () => {
      sdkPromise = null;
      reject(new Error("Failed to load PayPal SDK"));
    };
    document.body.appendChild(script);
  });
  return sdkPromise;
}

export default function PayPalButtons({ orderId }: { orderId: string }) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!CLIENT_ID || !containerRef.current) return;

    let cancelled = false;

    loadPayPalSdk(CLIENT_ID)
      .then(() => {
        if (cancelled || !containerRef.current) return;
        const paypal = (window as { paypal?: any }).paypal;
        if (!paypal) return;

        paypal
          .Buttons({
            createOrder: async () => {
              setError(null);
              const res = await createPayPalOrderAction(orderId);
              if (!res.ok) {
                setError(res.error);
                throw new Error(res.error);
              }
              return res.id;
            },
            onApprove: async (data: { orderID: string }) => {
              const res = await capturePayPalOrderAction(orderId, data.orderID);
              if (!res.ok) {
                setError(res.error);
                return;
              }
              router.refresh();
            },
            onError: () => {
              setError("Something went wrong with PayPal. Please try again.");
            },
          })
          .render(containerRef.current);
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load PayPal. Please refresh and try again.");
      });

    return () => {
      cancelled = true;
    };
  }, [orderId, router]);

  if (!CLIENT_ID) {
    return (
      <p className="text-sm leading-6 text-[#46555a]">
        Online payment is temporarily unavailable. Your order is reserved — please contact us to
        complete payment.
      </p>
    );
  }

  return (
    <div>
      <div ref={containerRef} />
      {error ? <p className="mt-3 text-sm text-[#16343d]">{error}</p> : null}
    </div>
  );
}
