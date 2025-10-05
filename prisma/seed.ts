import { PrismaClient, Role, PricingType, CampaignStatus } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Publishers catalog data structure
interface PublisherCatalog {
  domain: string;
  displayName: string;
  sites: {
    domain: string;
    placements: {
      size: string;
      position: string;
      pricingType: string;
      price: number;
      description: string;
    }[];
  }[];
}

async function main() {
  console.log("🌱 Starting comprehensive database seed...");

  // Create test users with specific credentials
  const testUsers = [
    {
      email: 'admin@coinads.test',
      password: 'Admin#1234',
      role: Role.ADMIN,
      name: 'Admin User'
    },
    {
      email: 'adv@coinads.test',
      password: 'Adv#1234',
      role: Role.ADVERTISER,
      name: 'Advertiser User'
    },
    {
      email: 'pub@coinads.test',
      password: 'Pub#1234',
      role: Role.PUBLISHER,
      name: 'Publisher User'
    }
  ];

  const createdUsers: any[] = [];
  
  for (const userData of testUsers) {
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: { 
        email: userData.email, 
        role: userData.role, 
        name: userData.name,
        password: hashedPassword
      }
    });

    createdUsers.push(user);
    console.log(`✅ Created ${userData.role} user:`, user.email);
  }

  const admin = createdUsers.find(u => u.role === Role.ADMIN);
  const advertiser = createdUsers.find(u => u.role === Role.ADVERTISER);
  const publisher = createdUsers.find(u => u.role === Role.PUBLISHER);

  // Create test publisher site
  let testSite = await prisma.site.findFirst({
    where: { domain: 'example-publisher.test' }
  });

  if (!testSite) {
    testSite = await prisma.site.create({
      data: {
        publisherId: publisher.id,
        domain: 'example-publisher.test',
        verified: true,
        approved: true,
      }
    });
  }

  console.log(`✅ Created test site: ${testSite.domain}`);

  // Create test placement
  let testPlacement = await prisma.placement.findFirst({
    where: { 
      siteId: testSite.id,
      size: '300x250'
    }
  });

  if (!testPlacement) {
    testPlacement = await prisma.placement.create({
      data: {
        siteId: testSite.id,
        size: '300x250',
        pricing: PricingType.CPM,
        price: 5.0,
        approved: true,
      }
    });
  }

  console.log(`✅ Created test placement: ${testPlacement.size} at $${testPlacement.price} CPM`);

  // Create test campaign for advertiser
  let testCampaign = await prisma.campaign.findFirst({
    where: { 
      advertiserId: advertiser.id,
      name: 'Test Campaign'
    }
  });

  if (!testCampaign) {
    testCampaign = await prisma.campaign.create({
      data: {
        advertiserId: advertiser.id,
        name: 'Test Campaign',
        budget: 1000.0,
        status: CampaignStatus.PENDING,
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      }
    });
  }

  console.log(`✅ Created test campaign: ${testCampaign.name} (${testCampaign.status})`);

  // Create test creative
  let testCreative = await prisma.creative.findFirst({
    where: { 
      campaignId: testCampaign.id,
      fileUrl: 'https://example.com/test-creative.png'
    }
  });

  if (!testCreative) {
    testCreative = await prisma.creative.create({
      data: {
        campaignId: testCampaign.id,
        fileUrl: 'https://example.com/test-creative.png',
        clickUrl: 'https://example.com/landing',
        altText: 'Test Creative',
      }
    });
  }

  console.log(`✅ Created test creative: ${testCreative.altText}`);

  // Create wallet transactions
  const existingTransaction = await prisma.transaction.findFirst({
    where: { 
      userId: advertiser.id,
      type: 'DEPOSIT',
      amount: 500.0
    }
  });

  if (!existingTransaction) {
    await prisma.transaction.create({
      data: {
        userId: advertiser.id,
        amount: 500.0,
        type: 'DEPOSIT',
        status: 'COMPLETED',
      }
    });
  }

  console.log(`✅ Created advertiser wallet transaction: $500 deposit`);

  // Create test orders for advertiser
  const existingOrders = await prisma.order.findMany({
    where: { advertiserId: advertiser.id }
  });

  if (existingOrders.length === 0) {
    await prisma.order.createMany({
      data: [
        { 
          advertiserId: advertiser.id, 
          title: "Launch Q4 banners", 
          notes: "Need banner ads for Q4 holiday season campaign",
          totalAmountMicros: BigInt(500_000_000), 
          currency: "USD", 
          status: "PENDING" 
        },
        { 
          advertiserId: advertiser.id, 
          title: "Native placements Jan", 
          notes: "Native advertising for January product launch",
          totalAmountMicros: BigInt(300_000_000), 
          currency: "USD", 
          status: "APPROVED" 
        },
        { 
          advertiserId: advertiser.id, 
          title: "Video campaign Feb", 
          notes: "Video ads for February brand awareness",
          totalAmountMicros: BigInt(750_000_000), 
          currency: "USD", 
          status: "REJECTED" 
        },
      ],
    });
    console.log(`✅ Created 3 test orders for advertiser`);
  }

  // Load publishers catalog for additional test data
  const catalogPath = join(process.cwd(), 'data', 'publishers.json');
  const catalogData: PublisherCatalog[] = JSON.parse(readFileSync(catalogPath, 'utf8'));

  console.log("📚 Loading additional publishers catalog...");

  // Create additional publisher users and sites from catalog
  for (const publisherData of catalogData) {
    // Create publisher user
    const catalogPublisherUser = await prisma.user.upsert({
      where: { email: `partner@${publisherData.domain}` },
      update: {},
      create: {
        email: `partner@${publisherData.domain}`,
        name: `${publisherData.displayName} Partner`,
        role: Role.PUBLISHER,
      }
    });

    console.log(`✅ Created catalog publisher user: ${catalogPublisherUser.email}`);

    // Create sites and placements
    for (const siteData of publisherData.sites) {
      // Check if site already exists
      let site = await prisma.site.findFirst({
        where: { 
          domain: siteData.domain 
        }
      });

      if (!site) {
        site = await prisma.site.create({
          data: {
            publisherId: catalogPublisherUser.id,
            domain: siteData.domain,
            verified: true,
            approved: true,
          }
        });
      }

      console.log(`✅ Created catalog site: ${site.domain}`);

      // Create placements for this site
      for (const placementData of siteData.placements) {
        await prisma.placement.create({
          data: {
            siteId: site.id,
            size: placementData.size,
            pricing: placementData.pricingType as PricingType,
            price: placementData.price,
            approved: placementData.price > 0, // Only approve placements with pricing
          }
        });
      }

      console.log(`✅ Created ${siteData.placements.length} catalog placements for ${site.domain}`);
    }
  }

  console.log("🎉 Comprehensive seed completed successfully!");
  console.log("\n📋 Summary:");
  console.log(`- Test users: Admin, Advertiser, Publisher`);
  console.log(`- Test site: example-publisher.test`);
  console.log(`- Test placement: 300x250 CPM $5`);
  console.log(`- Test campaign: PENDING status`);
  console.log(`- Test creative: PNG sample`);
  console.log(`- Advertiser wallet: $500 balance`);
  console.log(`- Test orders: 3 orders (PENDING, APPROVED, REJECTED)`);
  console.log(`- Catalog publishers: ${catalogData.length}`);
  console.log(`- Total sites: ${catalogData.reduce((sum, p) => sum + p.sites.length, 0) + 1}`);
  console.log(`- Total placements: ${catalogData.reduce((sum, p) => sum + p.sites.reduce((s, site) => s + site.placements.length, 0), 0) + 1}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
