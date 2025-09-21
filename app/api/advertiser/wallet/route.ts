import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Demo mode - bypass database for development
const DEMO_MODE = process.env.NODE_ENV === "development";

const addFundsSchema = z.object({
  amountCents: z.number().min(100, "Minimum amount is $1.00"),
  method: z.enum(["STRIPE", "COINBASE", "WIRE"]),
});

// GET /api/advertiser/wallet - Get wallet info
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Demo mode - return mock wallet data
    if (DEMO_MODE) {
      const mockWallet = {
        id: "demo-wallet-1",
        organizationId: "demo-org",
        balanceCents: 250000, // $2,500
        currency: "USD",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-15"),
        transactions: [
          {
            id: "demo-transaction-1",
            walletId: "demo-wallet-1",
            type: "TOP_UP",
            method: "STRIPE",
            amountCents: 100000,
            status: "SUCCEEDED",
            meta: { userId: "demo-user-id", timestamp: "2024-01-01T00:00:00Z" },
            createdAt: new Date("2024-01-01"),
            updatedAt: new Date("2024-01-01")
          },
          {
            id: "demo-transaction-2",
            walletId: "demo-wallet-1",
            type: "SPEND",
            method: "SYSTEM",
            amountCents: -25000,
            status: "SUCCEEDED",
            meta: { campaignId: "demo-campaign-1", timestamp: "2024-01-15T00:00:00Z" },
            createdAt: new Date("2024-01-15"),
            updatedAt: new Date("2024-01-15")
          }
        ]
      };

      const mockOrganization = {
        id: "demo-org",
        name: "Demo Organization",
        slug: "demo-org",
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-01"),
        wallet: mockWallet
      };

      return NextResponse.json({
        wallet: mockWallet,
        organization: mockOrganization,
      });
    }

    // Get user's organization and wallet
    const membership = await prisma.membership.findFirst({
      where: { userId: session.user.id },
      include: {
        organization: {
          include: {
            wallet: {
              include: {
                transactions: {
                  orderBy: { createdAt: "desc" },
                  take: 10,
                },
              },
            },
          },
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "User not associated with any organization" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      wallet: membership.organization.wallet,
      organization: membership.organization,
    });
  } catch (error) {
    console.error("Get wallet error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/advertiser/wallet/add-funds - Add funds to wallet
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { amountCents, method } = addFundsSchema.parse(body);

    // Demo mode - return mock transaction
    if (DEMO_MODE) {
      const mockTransaction = {
        id: `demo-transaction-${Date.now()}`,
        walletId: "demo-wallet-1",
        type: "TOP_UP",
        method: method,
        amountCents: amountCents,
        status: method === "STRIPE" ? "SUCCEEDED" : "PENDING",
        meta: JSON.stringify({
          userId: session.user.id,
          timestamp: new Date().toISOString(),
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (method === "STRIPE") {
        return NextResponse.json({
          message: "Funds added successfully",
          transaction: {
            id: mockTransaction.id,
            amountCents,
            status: "SUCCEEDED",
          },
        });
      } else if (method === "COINBASE") {
        return NextResponse.json({
          message: "Payment instructions generated",
          transaction: {
            id: mockTransaction.id,
            amountCents,
            status: "PENDING",
            paymentAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
            qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==",
          },
        });
      } else {
        return NextResponse.json({
          message: "Wire transfer instructions sent",
          transaction: {
            id: mockTransaction.id,
            amountCents,
            status: "PENDING",
            instructions: "Please transfer funds to the following account...",
          },
        });
      }
    }

    // Get user's organization and wallet
    const membership = await prisma.membership.findFirst({
      where: { userId: session.user.id },
      include: {
        organization: {
          include: { wallet: true },
        },
      },
    });

    if (!membership) {
      return NextResponse.json(
        { error: "User not associated with any organization" },
        { status: 400 }
      );
    }

    // Create transaction record
    const transaction = await prisma.transaction.create({
      data: {
        userId: session.user.id,
        walletId: membership.organization.wallet!.id,
        type: "TOP_UP",
        method: method as any,
        amountCents,
        status: "PENDING",
        meta: JSON.stringify({
          userId: session.user.id,
          timestamp: new Date().toISOString(),
        }),
      },
    });

    // For MVP, we'll simulate successful payment
    // In production, integrate with Stripe/Coinbase/etc.
    if (method === "STRIPE") {
      // Simulate Stripe payment
      await prisma.$transaction(async (tx) => {
        // Update transaction status
        await tx.transaction.update({
          where: { id: transaction.id },
          data: { status: "SUCCEEDED" },
        });

        // Update wallet balance
        await tx.wallet.update({
          where: { id: membership.organization.wallet!.id },
          data: {
            balanceCents: {
              increment: amountCents,
            },
          },
        });
      });

      return NextResponse.json({
        message: "Funds added successfully",
        transaction: {
          id: transaction.id,
          amountCents,
          status: "SUCCEEDED",
        },
      });
    } else if (method === "COINBASE") {
      // For crypto payments, return payment instructions
      return NextResponse.json({
        message: "Payment instructions generated",
        transaction: {
          id: transaction.id,
          amountCents,
          status: "PENDING",
          paymentAddress: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh", // Example Bitcoin address
          qrCode: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", // Placeholder QR code
        },
      });
    } else {
      // Wire transfer - manual processing
      return NextResponse.json({
        message: "Wire transfer instructions sent",
        transaction: {
          id: transaction.id,
          amountCents,
          status: "PENDING",
          instructions: "Please transfer funds to the following account...",
        },
      });
    }
  } catch (error) {
    console.error("Add funds error:", error);
    
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
