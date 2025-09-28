import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createPlacementSchema = z.object({
  siteId: z.number().int().positive(),
  name: z.string().min(1, "Name is required"),
  size: z.string().min(1, "Size is required"),
  position: z.string().min(1, "Position is required"),
  description: z.string().optional(),
});

const updatePlacementSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  size: z.string().min(1, "Size is required").optional(),
  position: z.string().min(1, "Position is required").optional(),
  description: z.string().optional(),
});

// GET - List placements for the authenticated publisher
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "PUBLISHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const placements = await prisma.placement.findMany({
      where: {
        site: {
          publisherId: parseInt(session.user.id),
        },
      },
      include: {
        site: {
          select: {
            id: true,
            domain: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ placements });
  } catch (error) {
    console.error("Error fetching placements:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST - Create a new placement
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "PUBLISHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { siteId, name, size, position, description } = createPlacementSchema.parse(body);

    // Verify the site belongs to the publisher
    const site = await prisma.site.findFirst({
      where: {
        id: siteId,
        publisherId: parseInt(session.user.id),
      },
    });

    if (!site) {
      return NextResponse.json(
        { error: "Site not found or access denied" },
        { status: 404 }
      );
    }

    const placement = await prisma.placement.create({
      data: {
        siteId,
        name,
        size,
        position,
        description,
        approved: false, // Requires admin approval
      },
      include: {
        site: {
          select: {
            id: true,
            domain: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      placement,
      message: "Placement created successfully",
    });
  } catch (error) {
    console.error("Error creating placement:", error);
    
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
