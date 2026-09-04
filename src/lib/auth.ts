import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import * as bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  // PrismaAdapter expects the generated Prisma client type; the generated client
  // in this project is compatible at runtime, but TypeScript requires a precise cast.
  adapter: PrismaAdapter(db as Parameters<typeof PrismaAdapter>[0]),

  session: {
    strategy: "jwt",
  },

  providers: [
    // =====================================================
    // 1. EMAIL + PASSWORD LOGIN
    // =====================================================
    CredentialsProvider({
      name: "credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
          })
          .safeParse(credentials);

        if (!parsedCredentials.success) {
          return null;
        }

        const { email, password } = parsedCredentials.data;

        const user = await db.user.findUnique({
          where: {
            email,
          },
          include: {
            role: true,
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          password,
          user.passwordHash
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role?.name || "STUDENT",
        };
      },
    }),

    // =====================================================
    // 2. GOOGLE LOGIN
    // =====================================================
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  events: {
    async createUser({ user }) {
      try {
        const studentRole = await db.role.findUnique({
          where: { name: "STUDENT" },
        });

        if (studentRole && user.id) {
          await db.user.update({
            where: { id: user.id },
            data: { roleId: studentRole.id },
          });
        }

        if (user.id) {
          await db.profile.upsert({
            where: { userId: user.id },
            update: {},
            create: { userId: user.id },
          });
        }
      } catch (err) {
        console.error("[auth] createUser event error:", err);
      }
    },
  },

  callbacks: {
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      try {
        if (new URL(url).origin === new URL(baseUrl).origin) return url;
      } catch {
        // url parsing error fallback
      }
      return `${baseUrl}/dashboard`;
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      if (token.id && !token.role) {
        try {
          const dbUser = await db.user.findUnique({
            where: { id: token.id as string },
            include: { role: true },
          });
          if (dbUser?.role) {
            token.role = dbUser.role.name;
          }
        } catch (err) {
          console.error("[auth] jwt role lookup error:", err);
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }

      return session;
    },
  },
});