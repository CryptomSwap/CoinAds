import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import { serverEnv, isDevelopment, hasGoogleOAuthConfig, hasEmailConfig } from "./env/server";
import bcrypt from "bcryptjs";

// Demo mode - bypass database for development
const DEMO_MODE = isDevelopment;

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

        // Demo mode - only allow in development
        if (DEMO_MODE && process.env.NODE_ENV !== 'production') {
          const role = credentials.email.includes('admin') ? 'ADMIN' : 
                      credentials.email.includes('publisher') ? 'PUBLISHER' : 'ADVERTISER';
          
          return {
            id: 'demo-user-id',
            email: credentials.email,
            name: credentials.email.split('@')[0],
            image: null,
            role: role,
            emailVerified: true,
          };
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            return null;
          }

          // Validate password if user has one
          if (user.password) {
            const isValid = await bcrypt.compare(credentials.password, user.password);
            if (!isValid) {
              return null;
            }
          }

          return {
            id: user.id.toString(),
            email: user.email,
            name: user.name,
            image: null,
            role: user.role,
            emailVerified: true, // For MVP, assume all users are verified
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
        // Demo mode - only allow in development
        if (DEMO_MODE && process.env.NODE_ENV !== 'production' && token.sub === 'demo-user-id') {
          session.user.id = 'demo-user-id';
          session.user.role = token.role as string;
          session.user.emailVerified = true;
          return session;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { id: parseInt(token.sub) },
          });

          if (user) {
            session.user.id = user.id.toString();
            session.user.role = user.role;
            session.user.emailVerified = true; // For MVP, assume all users are verified
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
