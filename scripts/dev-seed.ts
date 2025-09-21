import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create demo users
  const alice = await prisma.user.upsert({
    where: { email: "alice@demo.com" },
    update: {},
    create: {
      email: "alice@demo.com",
      name: "Alice Johnson",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@demo.com" },
    update: {},
    create: {
      email: "bob@demo.com",
      name: "Bob Smith",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
  });

  console.log("✅ Created users:", { alice: alice.email, bob: bob.email });

  // Create demo organization
  const org = await prisma.organization.upsert({
    where: { id: "demo-org-1" },
    update: {},
    create: {
      id: "demo-org-1",
      name: "CoinAds Demo",
    },
  });

  console.log("✅ Created organization:", org.name);

  // Create memberships
  await prisma.membership.upsert({
    where: { userId_organizationId: { userId: alice.id, organizationId: org.id } },
    update: {},
    create: {
      userId: alice.id,
      organizationId: org.id,
      role: "OWNER",
    },
  });

  await prisma.membership.upsert({
    where: { userId_organizationId: { userId: bob.id, organizationId: org.id } },
    update: {},
    create: {
      userId: bob.id,
      organizationId: org.id,
      role: "PUBLISHER_ADMIN",
    },
  });

  console.log("✅ Created memberships");

  // Create wallet
  await prisma.wallet.upsert({
    where: { organizationId: org.id },
    update: {},
    create: {
      userId: bob.id,
      balanceCents: 150000, // $1,500.00
      currency: "USD",
      lowBalanceThresholdCents: 5000, // $50.00
    },
  });

  console.log("✅ Created wallet with $1,500.00 balance");

  // Create transactions
  await prisma.transaction.createMany({
    data: [
      {
        userId: alice.id,
        walletId: (await prisma.wallet.findUnique({ where: { organizationId: org.id } }))!.id,
        type: "TOP_UP",
        method: "STRIPE",
        amountCents: 100000, // $1,000.00
        currency: "USD",
        status: "SUCCEEDED",
        meta: JSON.stringify({ stripePaymentIntentId: "pi_demo_123" }),
      },
      {
        userId: alice.id,
        walletId: (await prisma.wallet.findUnique({ where: { organizationId: org.id } }))!.id,
        type: "TOP_UP",
        method: "COINBASE",
        amountCents: 50000, // $500.00
        currency: "USD",
        status: "SUCCEEDED",
        meta: JSON.stringify({ coinbaseChargeId: "cb_demo_456" }),
      },
      {
        userId: alice.id,
        walletId: (await prisma.wallet.findUnique({ where: { organizationId: org.id } }))!.id,
        type: "SPEND",
        method: "SYSTEM",
        amountCents: -25000, // -$250.00
        currency: "USD",
        status: "SUCCEEDED",
        meta: JSON.stringify({ campaignId: "campaign_1", description: "Campaign spend" }),
      },
    ],
  });

  console.log("✅ Created transactions");

  // Create publisher site
  const site = await prisma.site.create({
    data: {
      userId: bob.id,
      domain: "demo-crypto-news.com",
      status: "APPROVED",
      verifiedAt: new Date(),
    },
  });

  console.log("✅ Created site:", site.domain);

  // Create placements
  await prisma.placement.createMany({
    data: [
      {
        siteId: site.id,
        name: "Homepage Banner",
        type: "BANNER",
        size: "300x250",
        pathPattern: "/",
        cpmCents: 200, // $2.00 CPM
        status: "ACTIVE",
      },
      {
        siteId: site.id,
        name: "Sidebar Rectangle",
        type: "BANNER",
        size: "300x600",
        pathPattern: "/**",
        cpmCents: 300, // $3.00 CPM
        status: "ACTIVE",
      },
    ],
  });

  console.log("✅ Created placements");

  // Create advertiser campaign
  const campaign = await prisma.campaign.create({
    data: {
      userId: bob.id,
      name: "Launch Alpha",
      status: "ACTIVE",
      startAt: new Date("2024-01-01"),
      endAt: new Date("2024-01-31"),
        totalBudgetCents: 500000, // $5,000.00
      reservedCents: 250000, // $2,500.00
    },
  });

  console.log("✅ Created campaign:", campaign.name);

  // Create line item
  const lineItem = await prisma.lineItem.create({
    data: {
      campaignId: campaign.id,
      name: "Main Line Item",
      budgetCents: 100000, // $1,000.00
      placementTarget: JSON.stringify({
        siteIds: [site.id],
        placementTypes: ["BANNER"],
        sizes: ["300x250"],
      }),
      cpmCents: 500, // $5.00 CPM
      targeting: JSON.stringify({ countries: ["US", "CA", "GB"], types: ["desktop", "mobile"] }),
      status: "ACTIVE",
    },
  });

  console.log("✅ Created line item");

  // Create creatives
  await prisma.creative.createMany({
    data: [
      {
        campaignId: campaign.id,
        lineItemId: lineItem.id,
        type: "IMAGE",
        size: "300x250",
        width: 300,
        height: 250,
        fileUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=250&fit=crop",
        clickUrl: "https://example.com/landing",
        status: "APPROVED",
      },
      {
        campaignId: campaign.id,
        lineItemId: lineItem.id,
        type: "IMAGE",
        size: "300x250",
        width: 300,
        height: 250,
        fileUrl: "https://images.unsplash.com/photo-1642790105077-0a8b1b5b5b5b?w=300&h=250&fit=crop",
        clickUrl: "https://example.com/landing",
        status: "APPROVED",
      },
    ],
  });

  console.log("✅ Created creatives");

  // Create sample impressions and clicks
  const placements = await prisma.placement.findMany();
  const creatives = await prisma.creative.findMany();

  for (let i = 0; i < 100; i++) {
    const impression = await prisma.impression.create({
      data: {
        campaignId: campaign.id,
        creativeId: creatives[0].id,
        lineItemId: lineItem.id,
        placementId: placements[Math.floor(Math.random() * placements.length)].id,
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        ua: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        country: ["US", "CA", "GB"][Math.floor(Math.random() * 3)],
        device: ["desktop", "mobile"][Math.floor(Math.random() * 2)],
        viewabilityMs: Math.floor(Math.random() * 5000) + 1000,
        ivtFlag: Math.random() < 0.05, // 5% bot rate
      },
    });

    // Create click for some impressions
    if (Math.random() < 0.02) { // 2% CTR
      await prisma.click.create({
        data: {
          campaignId: impression.campaignId,
          creativeId: impression.creativeId,
          placementId: impression.placementId,
          siteId: impression.siteId,
          impressionId: impression.id,
          clickId: `click_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          ip: impression.ip,
          ua: impression.ua,
          country: impression.country,
          device: impression.device,
          size: impression.size,
        },
      });
    }
  }

  console.log("✅ Created sample impressions and clicks");

  // Create payout
  await prisma.payout.create({
    data: {
      userId: bob.id,
      amountCents: 75000, // $750.00
      currency: "USD",
      status: "REQUESTED",
      method: "USDT",
      meta: JSON.stringify({
        walletAddress: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8b6",
        requestedAt: new Date(),
      }),
    },
  });

  console.log("✅ Created payout request");

  // Create notifications
  await prisma.notification.createMany({
    data: [
      {
        userId: alice.id,
        type: "CAMPAIGN",
        title: "Campaign Performance Update",
        message: "Your 'Launch Alpha' campaign has reached 50% of its budget.",
      },
      {
        userId: bob.id,
        type: "PAYOUT",
        title: "Payout Request Received",
        message: "Your payout request for $750.00 is being processed.",
      },
      {
        userId: bob.id,
        type: "BILLING",
        title: "Low Balance Alert",
        message: "Your wallet balance is below the threshold. Consider adding funds.",
      },
    ],
  });

  console.log("✅ Created notifications");

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
