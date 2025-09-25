import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

// Demo mode - bypass database for development
const DEMO_MODE = process.env.NODE_ENV === "development";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET ? [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
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

        // Demo mode - allow any email/password combination
        if (DEMO_MODE) {
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

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
            emailVerified: user.emailVerified ? true : false,
          };
        } catch (error) {
          console.error('Database error in auth:', error);
          return null;
        }
      }
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        // Demo mode - return demo user data
        if (DEMO_MODE && token.sub === 'demo-user-id') {
          session.user.id = 'demo-user-id';
          session.user.role = token.role as string;
          session.user.emailVerified = true;
          return session;
        }

        try {
          const user = await prisma.user.findUnique({
            where: { id: token.sub },
          });

          if (user) {
            session.user.id = user.id;
            session.user.role = user.role;
            session.user.emailVerified = user.emailVerified ? true : false;
          }
        } catch (error) {
          console.error('Database error in session callback:', error);
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
  secret: process.env.NEXTAUTH_SECRET,
};
