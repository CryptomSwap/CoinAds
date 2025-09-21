import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedPartnerInventory() {
  console.log('🌱 Seeding partner inventory...');

  try {
    // Create demo users first
    const demoAdvertiser = await prisma.user.upsert({
      where: { email: 'demo@advertiser.com' },
      update: {},
      create: {
        email: 'demo@advertiser.com',
        name: 'Demo Advertiser',
        role: 'ADVERTISER',
        emailVerified: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    const demoPublisher = await prisma.user.upsert({
      where: { email: 'demo@publisher.com' },
      update: {},
      create: {
        email: 'demo@publisher.com',
        name: 'Demo Publisher',
        role: 'PUBLISHER',
        emailVerified: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    const demoAdmin = await prisma.user.upsert({
      where: { email: 'admin@coinads.com' },
      update: {},
      create: {
        email: 'admin@coinads.com',
        name: 'Admin User',
        role: 'ADMIN',
        emailVerified: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // Create partner users
    const coinrankingUser = await prisma.user.upsert({
      where: { email: 'partner@coinranking.com' },
      update: {},
      create: {
        email: 'partner@coinranking.com',
        name: 'Coinranking Partner',
        role: 'PUBLISHER',
        emailVerified: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    const cryptodailyUser = await prisma.user.upsert({
      where: { email: 'partner@cryptodaily.co.uk' },
      update: {},
      create: {
        email: 'partner@cryptodaily.co.uk',
        name: 'CryptoDaily Partner',
        role: 'PUBLISHER',
        emailVerified: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // Create partner sites
    const coinrankingSite = await prisma.site.upsert({
      where: { 
        userId_domain: {
          userId: coinrankingUser.id,
          domain: 'coinranking.com'
        }
      },
      update: {},
      create: {
        userId: coinrankingUser.id,
        domain: 'coinranking.com',
        name: 'Coinranking',
        description: 'Leading cryptocurrency price tracking and market data platform',
        status: 'APPROVED',
        verifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    const cryptodailySite = await prisma.site.upsert({
      where: { 
        userId_domain: {
          userId: cryptodailyUser.id,
          domain: 'cryptodaily.co.uk'
        }
      },
      update: {},
      create: {
        userId: cryptodailyUser.id,
        domain: 'cryptodaily.co.uk',
        name: 'CryptoDaily',
        description: 'Daily cryptocurrency news and analysis',
        status: 'APPROVED',
        verifiedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('✅ Created partner sites');

    // Create Coinranking placements
    const coinrankingPlacements = [
      {
        name: 'Sticky Banner',
        size: '728x90',
        pathPattern: '/*',
        position: 'ABOVE',
        cpmCents: 600, // $6.00 CPM
        status: 'APPROVED'
      },
      {
        name: 'Top Leaderboard',
        size: '728x90',
        pathPattern: '/*',
        position: 'ABOVE',
        cpmCents: 500, // $5.00 CPM
        status: 'APPROVED'
      },
      {
        name: 'Middle Leaderboard',
        size: '728x90',
        pathPattern: '/*',
        position: 'BELOW',
        cpmCents: 500, // $5.00 CPM
        status: 'APPROVED'
      },
      {
        name: 'Side Banner',
        size: '300x250',
        pathPattern: '/*',
        position: 'ABOVE',
        cpmCents: 500, // $5.00 CPM
        status: 'APPROVED'
      }
    ];

    for (const placement of coinrankingPlacements) {
      await prisma.placement.create({
        data: {
          siteId: coinrankingSite.id,
          name: placement.name,
          size: placement.size,
          pathPattern: placement.pathPattern,
          position: placement.position,
          cpmCents: placement.cpmCents,
          status: placement.status,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }

    console.log('✅ Created Coinranking placements');

    // Create Cryptodaily placements (TBD pricing)
    const cryptodailyPlacements = [
      {
        name: 'Top Fixed Banner',
        size: '1920x82',
        pathPattern: '/*',
        position: 'ABOVE',
        cpmCents: null, // TBD pricing
        status: 'APPROVED'
      },
      {
        name: 'Bottom Fixed Banner',
        size: '1920x82',
        pathPattern: '/*',
        position: 'BELOW',
        cpmCents: null, // TBD pricing
        status: 'APPROVED'
      },
      {
        name: 'Leadership Banner',
        size: '728x90',
        pathPattern: '/*',
        position: 'ABOVE',
        cpmCents: null, // TBD pricing
        status: 'APPROVED'
      },
      {
        name: 'Sidebar Banner',
        size: '300x250',
        pathPattern: '/*',
        position: 'ABOVE',
        cpmCents: null, // TBD pricing
        status: 'APPROVED'
      }
    ];

    for (const placement of cryptodailyPlacements) {
      await prisma.placement.create({
        data: {
          siteId: cryptodailySite.id,
          name: placement.name,
          size: placement.size,
          pathPattern: placement.pathPattern,
          position: placement.position,
          cpmCents: placement.cpmCents,
          status: placement.status,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      });
    }

    console.log('✅ Created Cryptodaily placements');

    // Create wallets for demo users
    await prisma.wallet.upsert({
      where: { userId: demoAdvertiser.id },
      update: {},
      create: {
        userId: demoAdvertiser.id,
        balanceCents: 50000, // $500
        currency: 'USD',
        lowBalanceThresholdCents: 5000 // $50
      }
    });

    await prisma.wallet.upsert({
      where: { userId: demoPublisher.id },
      update: {},
      create: {
        userId: demoPublisher.id,
        balanceCents: 8925, // $89.25
        currency: 'USD',
        lowBalanceThresholdCents: 5000 // $50
      }
    });

    console.log('✅ Created demo users and wallets');

    console.log('🎉 Partner inventory seeded successfully!');
    console.log('\nDemo accounts:');
    console.log('Advertiser: demo@advertiser.com');
    console.log('Publisher: demo@publisher.com');
    console.log('Admin: admin@coinads.com');
    console.log('Password: any password (demo mode)');

  } catch (error) {
    console.error('❌ Error seeding partner inventory:', error);
    throw error;
  }
}

async function main() {
  await seedPartnerInventory();
  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
