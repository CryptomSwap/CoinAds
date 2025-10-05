import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { orderStatusSchema } from "@/lib/validators/order";
import { NextResponse } from "next/server";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orderId = params.id;

  try {
    const json = await req.json();
    const parsed = orderStatusSchema.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const order = await prisma.order.update({
      where: { id: orderId },
      data: { 
        status: parsed.data.status,
        notes: parsed.data.adminReason ? 
          (await prisma.order.findUnique({ where: { id: orderId }, select: { notes: true } }))?.notes + 
          `\n\nAdmin Note (${new Date().toISOString()}): ${parsed.data.adminReason}` : 
          undefined
      },
      include: {
        advertiser: {
          select: {
            id: true,
            email: true,
            name: true,
          },
        },
        campaign: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error updating order status:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}