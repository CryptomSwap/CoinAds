import { PrismaClient, Role, PricingType } from '@prisma/client';
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
  console.log("🌱 Starting minimal database seed...");

  // Create admin user from environment variables
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@coinads.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'admin123';
  
  const hashedPassword = await bcrypt.hash(adminPassword, 12);
  
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: { 
      email: adminEmail, 
      role: Role.ADMIN, 
      name: 'Admin User',
      password: hashedPassword
    }
  });

  console.log("✅ Created admin user:", admin.email);

  // Load publishers catalog
  const catalogPath = join(process.cwd(), 'data', 'publishers.json');
  const catalogData: PublisherCatalog[] = JSON.parse(readFileSync(catalogPath, 'utf8'));

  console.log("📚 Loading publishers catalog...");

  // Create publisher users and sites from catalog
  for (const publisher of catalogData) {
    // Create publisher user
    const publisherUser = await prisma.user.upsert({
      where: { email: `partner@${publisher.domain}` },
      update: {},
      create: {
        email: `partner@${publisher.domain}`,
        name: `${publisher.displayName} Partner`,
        role: Role.PUBLISHER,
      }
    });

    console.log(`✅ Created publisher user: ${publisherUser.email}`);

    // Create sites and placements
    for (const siteData of publisher.sites) {
      const site = await prisma.site.upsert({
        where: { 
          domain: siteData.domain 
        },
        update: {},
        create: {
          publisherId: publisherUser.id,
          domain: siteData.domain,
          verified: true,
          approved: true,
        }
      });

      console.log(`✅ Created site: ${site.domain}`);

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

      console.log(`✅ Created ${siteData.placements.length} placements for ${site.domain}`);
    }
  }

  console.log("🎉 Minimal seed completed successfully!");
  console.log("\n📋 Summary:");
  console.log(`- Admin user: ${adminEmail}`);
  console.log(`- Publishers: ${catalogData.length}`);
  console.log(`- Total sites: ${catalogData.reduce((sum, p) => sum + p.sites.length, 0)}`);
  console.log(`- Total placements: ${catalogData.reduce((sum, p) => sum + p.sites.reduce((s, site) => s + site.placements.length, 0), 0)}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
