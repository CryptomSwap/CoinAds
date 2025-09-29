import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Removed demo mode - always use database

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

    // Always query database - no mock fallbacks

    // For MVP, get user's transactions directly
    const transactions = await prisma.transaction.findMany({
      where: { userId: parseInt(session.user.id) },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    // Calculate balance from transactions
    const balance = transactions.reduce((sum, transaction) => {
      return sum + (transaction.type === 'DEPOSIT' ? transaction.amount : -transaction.amount);
    }, 0);

    const wallet = {
      id: `wallet-${session.user.id}`,
      balanceCents: Math.round(balance * 100),
      currency: "USD",
      transactions: transactions,
    };

    return NextResponse.json({
      wallet: wallet,
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

    // Always create in database - no mock responses

    // Create transaction record directly for user
    const transaction = await prisma.transaction.create({
      data: {
        userId: parseInt(session.user.id),
        type: "DEPOSIT",
        amount: amountCents / 100, // Convert cents to dollars
        status: "PENDING",
      },
    });

    // For MVP, we'll simulate successful payment
    // In production, integrate with Stripe/Coinbase/etc.
    if (method === "STRIPE") {
      // Simulate Stripe payment - just update transaction status
      await prisma.transaction.update({
        where: { id: transaction.id },
        data: { status: "SUCCEEDED" },
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
