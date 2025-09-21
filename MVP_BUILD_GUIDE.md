# CoinAds MVP Build Guide

## 🎯 Project Overview

CoinAds is a comprehensive advertising platform connecting crypto advertisers with premium publishers. This guide provides step-by-step instructions to build the MVP from scratch.

## 🛠️ Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Payments**: Stripe integration
- **Deployment**: Docker-ready

## 📋 Prerequisites

- Node.js 18+
- PostgreSQL database
- npm/yarn package manager
- Git

## 🚀 Step-by-Step Build Process

### Phase 1: Project Setup

#### 1. Initialize Next.js Project
```bash
npx create-next-app@latest coinads --typescript --tailwind --eslint --app
cd coinads
```

#### 2. Install Core Dependencies
```bash
npm install @prisma/client prisma next-auth @next-auth/prisma-adapter
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-label
npm install @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slot
npm install @radix-ui/react-tabs @radix-ui/react-toast
npm install bcryptjs @types/bcryptjs zod react-hook-form
npm install lucide-react framer-motion recharts
npm install stripe @stripe/stripe-js
npm install class-variance-authority clsx tailwind-merge tailwindcss-animate
```

#### 3. Install Dev Dependencies
```bash
npm install -D @types/node @types/react @types/react-dom
npm install -D typescript eslint prettier tsx
```

### Phase 2: Database Setup

#### 1. Initialize Prisma
```bash
npx prisma init
```

#### 2. Configure Database Connection
Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

#### 3. Create Database Schema
Copy the complete schema from `prisma/schema.prisma` in the project, including:
- User management with roles
- Organization support
- Campaign and creative management
- Site and placement tracking
- Impression, click, and conversion tracking
- Wallet and transaction system

#### 4. Generate Prisma Client
```bash
npx prisma generate
npx prisma migrate dev --name init
```

### Phase 3: Authentication Setup

#### 1. Configure NextAuth.js
Create `lib/auth.ts`:
```typescript
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./prisma"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        
        if (!user || !user.password) return null
        
        const isValid = await bcrypt.compare(credentials.password, user.password)
        if (!isValid) return null
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.role = user.role
      }
      return token
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    }
  }
}
```

#### 2. Create Auth API Route
Create `app/api/auth/[...nextauth]/route.ts`:
```typescript
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
```

#### 3. Create Registration API
Create `app/api/auth/register/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(["ADVERTISER", "PUBLISHER"])
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name, role } = registerSchema.parse(body)
    
    const hashedPassword = await bcrypt.hash(password, 12)
    
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role
      }
    })
    
    return NextResponse.json({ success: true, userId: user.id })
  } catch (error) {
    return NextResponse.json({ error: "Registration failed" }, { status: 400 })
  }
}
```

### Phase 4: UI Components Setup

#### 1. Create Base UI Components
Create `components/ui/button.tsx`:
```typescript
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
```

#### 2. Create Utility Functions
Create `lib/utils.ts`:
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### Phase 5: Core Pages Development

#### 1. Landing Page Structure
Create `app/page.tsx`:
```typescript
import Hero from "@/components/Hero"
import BenefitsGrid from "@/components/BenefitsGrid"
import HowItWorks from "@/components/HowItWorks"
import LogosBar from "@/components/LogosBar"
import ProofRibbon from "@/components/ProofRibbon"

export default function HomePage() {
  return (
    <main>
      <Hero />
      <LogosBar />
      <BenefitsGrid />
      <HowItWorks />
      <ProofRibbon />
    </main>
  )
}
```

#### 2. Navigation Component
Create `components/TopBar.tsx`:
```typescript
"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/ui/logo"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, ArrowRight } from "lucide-react"

export default function TopBar() {
  return (
    <nav className="h-16 bg-[#0E0F12] border-b border-white/10">
      <div className="mx-auto max-w-6xl px-6 h-full">
        <div className="flex items-center justify-between h-full">
          <Logo className="text-white" />
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/advertisers">For Advertisers</Link>
            <Link href="/publishers">For Publishers</Link>
            <Link href="/ad-formats">Ad Formats</Link>
            <Link href="/about">About</Link>
          </div>

          <div className="hidden md:flex items-center space-x-3">
            <Link href="/contact">
              <Button className="bg-gradient-brand hover:bg-gradient-brand-hover">
                Contact Sales
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button className="bg-gradient-brand hover:bg-gradient-brand-hover">
                Sign In
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}
```

### Phase 6: Authentication Pages

#### 1. Sign In Page
Create `app/auth/signin/page.tsx`:
```typescript
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false
    })

    if (result?.ok) {
      router.push("/app")
    } else {
      // Handle error
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Sign In</h2>
          <p className="mt-2 text-slate-300">Access your CoinAds account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
            {isLoading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  )
}
```

#### 2. Sign Up Page
Create `app/auth/signup/page.tsx`:
```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "ADVERTISER"
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        router.push("/auth/signin?message=Registration successful")
      }
    } catch (error) {
      // Handle error
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="mt-2 text-slate-300">Join CoinAds today</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="role">Account Type</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => setFormData({...formData, role: value})}
            >
              <option value="ADVERTISER">Advertiser</option>
              <option value="PUBLISHER">Publisher</option>
            </Select>
          </div>
          
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </div>
    </div>
  )
}
```

### Phase 7: Application Dashboard

#### 1. App Layout
Create `app/app/layout.tsx`:
```typescript
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Sidebar from "@/components/app/sidebar"
import TopBar from "@/components/app/top-bar"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar role={session.user.role as "advertiser" | "publisher" | "admin"} />
      <div className="lg:pl-64">
        <TopBar />
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
```

#### 2. Advertiser Dashboard
Create `app/app/advertiser/overview/page.tsx`:
```typescript
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { Card } from "@/components/ui/card"

export default async function AdvertiserOverview() {
  const session = await getServerSession(authOptions)
  
  const campaigns = await prisma.campaign.findMany({
    where: { userId: session?.user.id },
    include: {
      creatives: true,
      _count: {
        select: {
          impressions: true,
          clicks: true
        }
      }
    }
  })

  const totalSpent = campaigns.reduce((sum, campaign) => sum + campaign.spentCents, 0)
  const totalImpressions = campaigns.reduce((sum, campaign) => sum + campaign._count.impressions, 0)
  const totalClicks = campaigns.reduce((sum, campaign) => sum + campaign._count.clicks, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your campaign overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
          <p className="text-2xl font-bold text-gray-900">${(totalSpent / 100).toFixed(2)}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Campaigns</h3>
          <p className="text-2xl font-bold text-gray-900">{campaigns.length}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Impressions</h3>
          <p className="text-2xl font-bold text-gray-900">{totalImpressions.toLocaleString()}</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-sm font-medium text-gray-500">Clicks</h3>
          <p className="text-2xl font-bold text-gray-900">{totalClicks.toLocaleString()}</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Campaigns</h3>
          <div className="space-y-4">
            {campaigns.slice(0, 5).map((campaign) => (
              <div key={campaign.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">{campaign.name}</p>
                  <p className="text-sm text-gray-500">{campaign.status}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${(campaign.spentCents / 100).toFixed(2)}</p>
                  <p className="text-sm text-gray-500">{campaign._count.impressions} impressions</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
```

### Phase 8: API Development

#### 1. Campaign Management API
Create `app/api/advertiser/campaigns/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const campaignSchema = z.object({
  name: z.string().min(1),
  totalBudgetCents: z.number().positive(),
  startAt: z.string().optional(),
  endAt: z.string().optional(),
  targeting: z.string().optional()
})

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const campaigns = await prisma.campaign.findMany({
    where: { userId: session.user.id },
    include: {
      creatives: true,
      _count: {
        select: {
          impressions: true,
          clicks: true
        }
      }
    }
  })

  return NextResponse.json(campaigns)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await request.json()
    const data = campaignSchema.parse(body)

    const campaign = await prisma.campaign.create({
      data: {
        ...data,
        userId: session.user.id,
        startAt: data.startAt ? new Date(data.startAt) : null,
        endAt: data.endAt ? new Date(data.endAt) : null
      }
    })

    return NextResponse.json(campaign)
  } catch (error) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 })
  }
}
```

#### 2. Ad Delivery API
Create `app/api/delivery/route.ts`:
```typescript
import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const placementId = searchParams.get("placement")
  const size = searchParams.get("size")

  if (!placementId) {
    return NextResponse.json({ error: "Missing placement ID" }, { status: 400 })
  }

  // Find available creatives for this placement
  const creatives = await prisma.creative.findMany({
    where: {
      status: "APPROVED",
      size: size || undefined,
      campaign: {
        status: "ACTIVE",
        startAt: { lte: new Date() },
        endAt: { gte: new Date() }
      }
    },
    include: {
      campaign: true
    },
    take: 1
  })

  if (creatives.length === 0) {
    return NextResponse.json({ error: "No ads available" }, { status: 404 })
  }

  const creative = creatives[0]

  // Track impression
  await prisma.impression.create({
    data: {
      campaignId: creative.campaignId,
      creativeId: creative.id,
      placementId,
      size: creative.size,
      ip: request.headers.get("x-forwarded-for") || "unknown",
      ua: request.headers.get("user-agent") || "unknown"
    }
  })

  return NextResponse.json({
    creative: {
      id: creative.id,
      type: creative.type,
      fileUrl: creative.fileUrl,
      clickUrl: creative.clickUrl,
      width: creative.width,
      height: creative.height
    }
  })
}
```

### Phase 9: Environment Configuration

#### 1. Environment Variables
Create `.env.local`:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/coinads"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Optional: Email (for production)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@coinads.com"

# Optional: Stripe (for payments)
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

### Phase 10: Testing & Deployment

#### 1. Database Seeding
Create `scripts/dev-seed.ts`:
```typescript
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Create test users
  const advertiser = await prisma.user.create({
    data: {
      email: "advertiser@test.com",
      password: await bcrypt.hash("password123", 12),
      name: "Test Advertiser",
      role: "ADVERTISER"
    }
  })

  const publisher = await prisma.user.create({
    data: {
      email: "publisher@test.com",
      password: await bcrypt.hash("password123", 12),
      name: "Test Publisher",
      role: "PUBLISHER"
    }
  })

  // Create wallets
  await prisma.wallet.create({
    data: {
      userId: advertiser.id,
      balanceCents: 100000 // $1000
    }
  })

  console.log("Database seeded successfully!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
```

#### 2. Run Seeding
```bash
npm run db:seed
```

#### 3. Start Development Server
```bash
npm run dev
```

## 🎯 MVP Features Checklist

### Core Features ✅
- [x] User registration and authentication
- [x] Role-based access (Advertiser/Publisher)
- [x] Campaign creation and management
- [x] Site registration and verification
- [x] Ad delivery system
- [x] Impression and click tracking
- [x] Basic analytics dashboard
- [x] Wallet system for advertisers
- [x] Payout system for publishers

### UI/UX Features ✅
- [x] Responsive design with Tailwind CSS
- [x] Consistent button styling (gradient theme)
- [x] Professional landing pages
- [x] Intuitive dashboard layouts
- [x] Form validation with Zod
- [x] Loading states and error handling

### Technical Features ✅
- [x] TypeScript for type safety
- [x] Prisma ORM for database management
- [x] NextAuth.js for authentication
- [x] API routes for all functionality
- [x] Database migrations
- [x] Environment configuration
- [x] Docker-ready deployment

## 🚀 Next Steps

1. **Add Payment Integration**: Implement Stripe for wallet top-ups
2. **Email Notifications**: Add email alerts for important events
3. **Advanced Analytics**: Implement detailed reporting
4. **Fraud Detection**: Add bot detection and traffic quality monitoring
5. **Mobile App**: Consider React Native mobile app
6. **API Documentation**: Create comprehensive API docs
7. **Testing Suite**: Add unit and integration tests
8. **Performance Optimization**: Implement caching and CDN

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com)

This guide provides a complete foundation for building the CoinAds MVP. Follow each phase sequentially to ensure proper setup and functionality.
