import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// The storefront is public; the account area and checkout require sign-in.
// Guests can browse and build a cart, but must authenticate to check out —
// their guest cart merges into their user cart on the first signed-in action.
// /admin also requires sign-in here, but the admin *role* is enforced
// server-side in app/admin/layout.tsx (and every admin query/action) — this
// matcher only ensures a visitor is authenticated, not that they're an admin.
const isProtectedRoute = createRouteMatcher(["/account(.*)", "/checkout(.*)", "/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
