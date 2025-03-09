import { authOption } from "@/lib/auth";
import NextAuth from "next-auth";
import CredentailProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing Google OAuth environment variables");
}

const handler = NextAuth(authOption);

export { handler as GET, handler as POST };