import { PrismaClient, PricingType, Role } from '@prisma/client';

const prisma = new PrismaClient();

// Utility to safely map string values to PricingType enum
const toPricingType = (v: string): PricingType => {
  const normalized = v.trim().toUpperCase();
  const allowed = Object.values(PricingType) as string[];
  if (allowed.includes(normalized)) return normalized as PricingType;
  throw new Error(`Unknown PricingType: ${v}. Allowed: ${allowed.join(", ")}`);
};

// Utility to safely map string values to Role enum
const toRole = (v: string): Role => {
  const normalized = v.trim().toUpperCase();
  const allowed = Object.values(Role) as string[];
  if (allowed.includes(normalized)) return normalized as Role;
  throw new Error(`Unknown Role: ${v}. Allowed: ${allowed.join(", ")}`);
};

async function seedPartnerInventory() {
  console.log('🌱 Seeding partner inventory...');

  try {
    // Skip demo users - use main seed script for admin user

    // Create partner users
    const coinrankingUser = await prisma.user.upsert({
      where: { email: 'partner@coinranking.com' },
      update: {},
      create: {
        email: 'partner@coinranking.com',
        name: 'Coinranking Partner',
        role: toRole('PUBLISHER'),
      }
    });

    const cryptodailyUser = await prisma.user.upsert({
      where: { email: 'partner@cryptodaily.co.uk' },
      update: {},
      create: {
        email: 'partner@cryptodaily.co.uk',
        name: 'CryptoDaily Partner',
        role: toRole('PUBLISHER'),
      }
    });

    // Create partner sites
    const coinrankingSite = await prisma.site.upsert({
      where: { 
        id: 1 // Use a simple ID for upsert
      },
      update: {},
      create: {
        publisherId: coinrankingUser.id,
        domain: 'coinranking.com',
        verified: true,
        approved: true,
      }
    });

    const cryptodailySite = await prisma.site.upsert({
      where: { 
        id: 2 // Use a simple ID for upsert
      },
      update: {},
      create: {
        publisherId: cryptodailyUser.id,
        domain: 'cryptodaily.co.uk',
        verified: true,
        approved: true,
      }
    });

    console.log('✅ Created partner sites');

    // Create Coinranking placements
    const coinrankingPlacements = [
      {
        size: '728x90',
        pricing: 'CPM',
        price: 6.00,
        approved: true
      },
      {
        size: '728x90',
        pricing: 'CPM',
        price: 5.00,
        approved: true
      },
      {
        size: '728x90',
        pricing: 'CPM',
        price: 5.00,
        approved: true
      },
      {
        size: '300x250',
        pricing: 'CPM',
        price: 5.00,
        approved: true
      }
    ];

    for (const placement of coinrankingPlacements) {
      await prisma.placement.create({
        data: {
          siteId: coinrankingSite.id,
          size: placement.size,
          pricing: toPricingType(placement.pricing),
          price: placement.price,
          approved: placement.approved
        }
      });
    }

    console.log('✅ Created Coinranking placements');

    // Create Cryptodaily placements (TBD pricing)
    const cryptodailyPlacements = [
      {
        size: '1920x82',
        pricing: 'CPM',
        price: 0.00, // TBD pricing
        approved: true
      },
      {
        size: '1920x82',
        pricing: 'CPM',
        price: 0.00, // TBD pricing
        approved: true
      },
      {
        size: '728x90',
        pricing: 'CPM',
        price: 0.00, // TBD pricing
        approved: true
      },
      {
        size: '300x250',
        pricing: 'CPM',
        price: 0.00, // TBD pricing
        approved: true
      }
    ];

    for (const placement of cryptodailyPlacements) {
      await prisma.placement.create({
        data: {
          siteId: cryptodailySite.id,
          size: placement.size,
          pricing: toPricingType(placement.pricing),
          price: placement.price,
          approved: placement.approved
        }
      });
    }

    console.log('✅ Created Cryptodaily placements');

    console.log('🎉 Partner inventory seeded successfully!');
    console.log('\nPartner accounts:');
    console.log('Coinranking: partner@coinranking.com');
    console.log('CryptoDaily: partner@cryptodaily.co.uk');

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
