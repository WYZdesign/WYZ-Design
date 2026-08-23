import NextAuth from "next-auth";
import type { Session } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

interface ExtendedSession extends Session {
  user: Session["user"] & { provider?: string };
}

const loginAttempts = new Map<string, { count: number; resetAt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 300_000;

const providers = [
  Google({
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  }),
  Credentials({
    name: "Admin Sign In",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Admin Key", type: "password" },
    },
    async authorize(credentials) {
      const email = String(credentials?.email || "").trim().toLowerCase();
      const pw = String(credentials?.password || "");
      if (!email || !pw) return null;

      const now = Date.now();
      const attempt = loginAttempts.get(email);
      if (attempt && attempt.resetAt > now && attempt.count >= MAX_ATTEMPTS) {
        return null;
      }
      if (!attempt || now > attempt.resetAt) {
        loginAttempts.set(email, { count: 0, resetAt: now + LOCKOUT_MS });
      }

      const adminPass = process.env.ADMIN_PASSWORD;
      if (!adminPass || pw !== adminPass) {
        const a = loginAttempts.get(email)!;
        a.count++;
        return null;
      }

      loginAttempts.delete(email);

      const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map(e => e.trim().toLowerCase());
      if (!adminEmails.includes(email)) return null;

      return { id: email, email, name: email.split("@")[0] };
    },
  }),
];

// Facebook disabled — app ID invalid on Meta's side. Re-enable when app is recreated.
// To re-enable: uncomment below and set FACEBOOK_CLIENT_ID + FACEBOOK_CLIENT_SECRET
// import Facebook from "next-auth/providers/facebook";
// if (process.env.FACEBOOK_CLIENT_ID && process.env.FACEBOOK_CLIENT_SECRET) {
//   providers.unshift(Facebook({ clientId: process.env.FACEBOOK_CLIENT_ID, clientSecret: process.env.FACEBOOK_CLIENT_SECRET }));
// }

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  trustHost: true,
  providers,
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: { signIn: "/admin", error: "/admin?error=1" },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.email = user.email || "";
        token.name = user.name || undefined;
        token.image = user.image || undefined;
      }
      if (account) token.provider = account.provider;
      return token;
    },
    async session({ session, token }) {
      const extSession = session as ExtendedSession;
      if (extSession.user) {
        extSession.user.email = token.email as string;
        extSession.user.name = token.name as string | undefined;
        extSession.user.image = token.image as string | undefined;
        extSession.user.provider = token.provider as string | undefined;
      }
      return extSession;
    },
  },
});

/**
 * NextAuth.js catch-all route handler for authentication.
 * Supports Facebook, Google OAuth, and admin credential sign-in.
 * @method GET, POST
 * @request Varies by provider — OAuth callbacks or `{ email, password }` for credentials
 * @response Session object or redirect to sign-in page
 * @auth Required for authenticated routes; public for sign-in
 */
export const { GET, POST } = handlers;
