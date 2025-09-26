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
      role: "ADVERTISER",
    },
  });

  const bob = await prisma.user.upsert({
    where: { email: "bob@demo.com" },
    update: {},
    create: {
      email: "bob@demo.com",
      name: "Bob Smith",
      role: "PUBLISHER",
    },
  });

  console.log("✅ Created users:", { alice: alice.email, bob: bob.email });

  console.log("✅ Users created successfully");

  // Create basic transactions for demo
  await prisma.transaction.createMany({
    data: [
      {
        userId: alice.id,
        type: "DEPOSIT",
        amount: 1000.00,
        status: "COMPLETED",
      },
      {
        userId: bob.id,
        type: "PAYOUT",
        amount: 500.00,
        status: "PENDING",
      },
    ],
  });

  console.log("✅ Created demo transactions");

  // Create publisher site
  const site = await prisma.site.create({
    data: {
      publisherId: bob.id,
      domain: "demo-crypto-news.com",
      approved: true,
      verified: true,
    },
  });

  console.log("✅ Created site:", site.domain);

  // Create placements
  await prisma.placement.createMany({
    data: [
      {
        siteId: site.id,
        size: "300x250",
        pricing: "CPM",
        price: 2.00,
        approved: true,
      },
      {
        siteId: site.id,
        size: "300x600",
        pricing: "CPM",
        price: 3.00,
        approved: true,
      },
    ],
  });

  console.log("✅ Created placements");

  // Create advertiser campaign
  const campaign = await prisma.campaign.create({
    data: {
      advertiserId: alice.id,
      name: "Launch Alpha",
      status: "ACTIVE",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2024-01-31"),
      budget: 5000.00, // $5,000.00
    },
  });

  console.log("✅ Created campaign:", campaign.name);

  // Create creatives
  await prisma.creative.createMany({
    data: [
      {
        campaignId: campaign.id,
        fileUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300&h=250&fit=crop",
        clickUrl: "https://example.com/landing",
        altText: "Crypto Trading Platform",
      },
      {
        campaignId: campaign.id,
        fileUrl: "https://images.unsplash.com/photo-1642790105077-0a8b1b5b5b5b?w=300&h=250&fit=crop",
        clickUrl: "https://example.com/landing",
        altText: "Crypto Trading Platform 2",
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
        placementId: placements[Math.floor(Math.random() * placements.length)].id,
        siteId: site.id,
        country: ["US", "CA", "GB"][Math.floor(Math.random() * 3)],
        device: ["desktop", "mobile"][Math.floor(Math.random() * 2)],
        costMicros: 5000000, // $5.00 CPM
      },
    });

    // Create click for some impressions
    if (Math.random() < 0.02) { // 2% CTR
      await prisma.click.create({
        data: {
          impressionId: impression.id,
        },
      });
    }
  }

  console.log("✅ Created sample impressions and clicks");

  console.log("✅ Demo data created successfully");

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
