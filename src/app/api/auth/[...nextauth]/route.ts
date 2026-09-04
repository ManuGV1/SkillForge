import { handlers } from "@/lib/auth";

// Force Node.js runtime: the auth stack uses pg (PostgreSQL driver),
// bcryptjs (needs Node crypto), and Prisma with driver adapters —
// none of which are compatible with the Vercel Edge runtime.
export const runtime = "nodejs";

export const { GET, POST } = handlers;
