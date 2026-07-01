import "server-only";

import { notFound } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

// A user is an admin if EITHER Clerk marks them with publicMetadata.role =
// "admin", OR their verified email is listed in the ADMIN_EMAILS env var
// (comma-separated). The email allowlist is the easy path — sign in with a
// listed address and you're an admin, no Clerk dashboard step needed.
type ClerkPublicMetadata = { role?: string };
type ClerkUser = NonNullable<Awaited<ReturnType<typeof currentUser>>>;

/** Lower-cased admin emails from ADMIN_EMAILS (empty when unset). */
function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

function userIsAdmin(user: ClerkUser): boolean {
  const meta = user.publicMetadata as ClerkPublicMetadata | undefined;
  if (meta?.role === "admin") return true;

  const allow = adminEmails();
  if (allow.length === 0) return false;

  // Only verified emails count — otherwise someone could claim admin by adding
  // an allowlisted address to their account without proving they own it.
  return user.emailAddresses.some(
    (e) => e.verification?.status === "verified" && allow.includes(e.emailAddress.toLowerCase()),
  );
}

/** True when the signed-in Clerk user is an admin. */
export async function isAdmin(): Promise<boolean> {
  const user = await currentUser();
  return user ? userIsAdmin(user) : false;
}

/**
 * Gate a server context (admin layout, admin data query, admin action) to
 * admins only. This is the real security boundary — middleware only guarantees
 * a visitor is signed in, so every admin data read and every admin mutation
 * must call this independently (defense in depth).
 *
 * Non-admins never learn the admin area exists: a signed-in non-admin (or a
 * signed-out visitor that somehow reached here) gets a 404, not a redirect.
 */
export async function requireAdmin() {
  const user = await currentUser();
  if (!user || !userIsAdmin(user)) {
    notFound();
  }
  return user;
}
