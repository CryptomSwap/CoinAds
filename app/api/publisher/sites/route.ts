import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { randomBytes } from "crypto";

// Demo mode - bypass database for development
import { isDevelopment } from "@/lib/env/server";

const DEMO_MODE = isDevelopment;

const createSiteSchema = z.object({
  domain: z.string().min(1, "Domain is required"),
});

const updateSiteSchema = createSiteSchema.partial();

// GET /api/publisher/sites - List sites
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // Demo mode - return mock data
    if (DEMO_MODE) {
      const mockSites = [
        {
          id: "demo-site-1",
          domain: "example.com",
          name: "Example News Site",
          description: "A popular news website",
          category: "News",
          status: "APPROVED",
          verificationToken: "demo-token-1",
          createdAt: new Date("2024-01-15"),
          updatedAt: new Date("2024-01-15"),
          organizationId: "demo-org",
          rejectedAt: null,
          rejectionReason: null,
          placements: [
            {
              id: "demo-placement-1",
              name: "Header Banner",
              type: "BANNER",
              width: 728,
              height: 90,
              status: "ACTIVE",
              floorCpmCents: 50,
              caps: null,
              siteId: "demo-site-1",
              createdAt: new Date("2024-01-15"),
              updatedAt: new Date("2024-01-15"),
              _count: {
                impressions: 1250
              }
            }
          ],
          _count: {
            placements: 1
          }
        },
        {
          id: "demo-site-2",
          domain: "techblog.com",
          name: "Tech Blog",
          description: "Technology news and reviews",
          category: "Technology",
          status: "PENDING",
          verificationToken: "demo-token-2",
          createdAt: new Date("2024-01-20"),
          updatedAt: new Date("2024-01-20"),
          organizationId: "demo-org",
          rejectedAt: null,
          rejectionReason: null,
          placements: [],
          _count: {
            placements: 0
          }
        }
      ];

      const filteredSites = status ? mockSites.filter(site => site.status === status) : mockSites;
      const total = filteredSites.length;
      const paginatedSites = filteredSites.slice((page - 1) * limit, page * limit);

      return NextResponse.json({
        sites: paginatedSites,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    }

    const where: any = {
      organization: {
        memberships: {
          some: {
            userId: session.user.id,
          },
        },
      },
    };

    if (status) {
      where.status = status;
    }

    const sites = await prisma.site.findMany({
      where,
      include: {
        placements: true,
        _count: {
          select: {
            placements: true,
          },
        },
      },
      orderBy: {
        id: "desc",
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.site.count({ where });

    return NextResponse.json({
      sites,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get sites error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/publisher/sites - Create site
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = createSiteSchema.parse(body);

    // Demo mode - return mock created site
    if (DEMO_MODE) {
      const mockSite = {
        id: `demo-site-${Date.now()}`,
        domain: data.domain,
        verified: false,
        approved: false,
        publisherId: parseInt(session.user.id),
        placements: [],
      };

      return NextResponse.json({ site: mockSite }, { status: 201 });
    }

    // Check if site already exists for this publisher
    const existingSite = await prisma.site.findFirst({
      where: {
        publisherId: parseInt(session.user.id),
        domain: data.domain,
      },
    });

    if (existingSite) {
      return NextResponse.json(
        { error: "Site with this domain already exists" },
        { status: 400 }
      );
    }

    const site = await prisma.site.create({
      data: {
        ...data,
        publisherId: parseInt(session.user.id),
      },
      include: {
        placements: true,
      },
    });

    return NextResponse.json({ site }, { status: 201 });
  } catch (error) {
    console.error("Create site error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
