import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  trustHost: true,

  secret:
    process.env.AUTH_SECRET ||
    process.env.NEXTAUTH_SECRET,

  callbacks: {
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const pathname = request.nextUrl.pathname;

      const isAuthPage =
        pathname === "/login" ||
        pathname.startsWith("/api/auth");

      // If user is logged in, don't let them go back to login
      if (isAuthPage) {
        if (isLoggedIn && pathname === "/login") {
          return Response.redirect(
            new URL("/dashboard", request.nextUrl)
          );
        }

        return true;
      }

      // Protect dashboard and onboarding
      const isProtectedPage =
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/onboarding");

      if (isProtectedPage) {
        return isLoggedIn;
      }

      return true;
    },
  },

  // IMPORTANT:
  // Google is NOT added here.
  // GoogleProvider is already configured in src/lib/auth.ts.
  providers: [],
} satisfies NextAuthConfig;