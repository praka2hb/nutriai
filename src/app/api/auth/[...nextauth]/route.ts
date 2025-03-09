import { authOption } from "@/lib/auth";
import NextAuth from "next-auth";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth environment variables");
}

const handler = NextAuth(authOption);

export { handler as GET, handler as POST };