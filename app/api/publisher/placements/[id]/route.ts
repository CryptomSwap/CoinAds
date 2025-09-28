import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updatePlacementSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  size: z.string().min(1, "Size is required").optional(),
  position: z.string().min(1, "Position is required").optional(),
  description: z.string().optional(),
});

// GET - Get a specific placement
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "PUBLISHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const placementId = parseInt(params.id);
    if (isNaN(placementId)) {
      return NextResponse.json({ error: "Invalid placement ID" }, { status: 400 });
    }

    const placement = await prisma.placement.findFirst({
      where: {
        id: placementId,
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
    });

    if (!placement) {
      return NextResponse.json({ error: "Placement not found" }, { status: 404 });
    }

    return NextResponse.json({ placement });
  } catch (error) {
    console.error("Error fetching placement:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PATCH - Update a placement
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "PUBLISHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const placementId = parseInt(params.id);
    if (isNaN(placementId)) {
      return NextResponse.json({ error: "Invalid placement ID" }, { status: 400 });
    }

    const body = await request.json();
    const updateData = updatePlacementSchema.parse(body);

    // Verify the placement belongs to the publisher
    const existingPlacement = await prisma.placement.findFirst({
      where: {
        id: placementId,
        site: {
          publisherId: parseInt(session.user.id),
        },
      },
    });

    if (!existingPlacement) {
      return NextResponse.json({ error: "Placement not found" }, { status: 404 });
    }

    const placement = await prisma.placement.update({
      where: { id: placementId },
      data: updateData,
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
      message: "Placement updated successfully",
    });
  } catch (error) {
    console.error("Error updating placement:", error);
    
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

// DELETE - Delete a placement
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "PUBLISHER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const placementId = parseInt(params.id);
    if (isNaN(placementId)) {
      return NextResponse.json({ error: "Invalid placement ID" }, { status: 400 });
    }

    // Verify the placement belongs to the publisher
    const existingPlacement = await prisma.placement.findFirst({
      where: {
        id: placementId,
        site: {
          publisherId: parseInt(session.user.id),
        },
      },
    });

    if (!existingPlacement) {
      return NextResponse.json({ error: "Placement not found" }, { status: 404 });
    }

    await prisma.placement.delete({
      where: { id: placementId },
    });

    return NextResponse.json({
      success: true,
      message: "Placement deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting placement:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
