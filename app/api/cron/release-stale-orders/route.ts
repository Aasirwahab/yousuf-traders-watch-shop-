import { NextResponse } from "next/server";
import { releaseStaleOrders } from "@/lib/orders";

// Invoked on a schedule by Vercel Cron (see vercel.json). When CRON_SECRET is
// set, Vercel sends it as a Bearer token — we reject anything else so the
// endpoint can't be triggered by the public. If it's unset (e.g. local dev) the
// route runs open, matching the fail-open posture used elsewhere.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  try {
    const result = await releaseStaleOrders();
    console.log(`[cron] release-stale-orders: released ${result.released} order(s)`);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    console.error("[cron] release-stale-orders failed", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
