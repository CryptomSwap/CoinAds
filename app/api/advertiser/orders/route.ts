import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { orderCreateSchema } from "@/lib/validators/order";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADVERTISER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const orders = await prisma.order.findMany({
    where: { advertiserId: parseInt(session.user.id) },
    orderBy: { createdAt: "desc" },
    include: {
      campaign: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADVERTISER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const json = await req.json();
    const parsed = orderCreateSchema.safeParse(json);
    
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const data = parsed.data;
    const order = await prisma.order.create({
      data: {
        advertiserId: parseInt(session.user.id),
        title: data.title,
        notes: data.notes,
        campaignId: data.campaignId ?? null,
        totalAmountMicros: data.totalAmountMicros,
        currency: data.currency,
        status: "PENDING",
      },
      include: {
        campaign: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ order }, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
