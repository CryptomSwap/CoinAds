import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
      emailVerified?: boolean | null
      createdAt?: Date | string
      currentOrgId?: string
      memberships?: Array<{
        id: string
        organizationId: string
        role: string
        organization: {
          id: string
          name: string
          type: string
        }
      }>
    }
  }

  interface User {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string
    emailVerified?: boolean | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role?: string
  }
}
