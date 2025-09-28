import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import { serverEnv, isDevelopment, hasGoogleOAuthConfig, hasEmailConfig } from "./env/server";
import bcrypt from "bcryptjs";

// Demo mode removed for security - all authentication must go through database

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    ...(hasGoogleOAuthConfig ? [
      GoogleProvider({
        clientId: serverEnv.GOOGLE_CLIENT_ID!,
        clientSecret: serverEnv.GOOGLE_CLIENT_SECRET!,
      })
    ] : []),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // All authentication must go through database - no demo bypass

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            return null;
          }

          // Validate password - user must have a password for credentials login
          if (!user.password) {
            return null; // User exists but has no password (OAuth only)
          }
          
          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            return null;
          }

          // Check email verification
          if (!user.emailVerified) {
            throw new Error('Please verify your email address before signing in.');
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            image: null,
            role: user.role,
            emailVerified: !!user.emailVerified,
          };
        } catch (error) {
          const { log } = require('@/lib/logger');
          log.error('Database error in auth', error);
          return null;
        }
      }
    }),
    ...(hasEmailConfig ? [
      EmailProvider({
        server: {
          host: serverEnv.EMAIL_SERVER_HOST!,
          port: serverEnv.EMAIL_SERVER_PORT!,
          auth: {
            user: serverEnv.EMAIL_SERVER_USER!,
            pass: serverEnv.EMAIL_SERVER_PASSWORD!,
          },
        },
        from: serverEnv.EMAIL_FROM!,
      })
    ] : []),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        // All sessions must come from database - no demo bypass

        try {
          const user = await prisma.user.findUnique({
            where: { id: parseInt(token.sub) },
          });

          if (user) {
            session.user.id = user.id.toString();
            session.user.role = user.role;
            session.user.emailVerified = !!user.emailVerified;
          }
        } catch (error) {
          const { log } = require('@/lib/logger');
          log.error('Database error in session callback', error);
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
  },
  session: {
    strategy: "jwt",
  },
  secret: serverEnv.NEXTAUTH_SECRET,
};
