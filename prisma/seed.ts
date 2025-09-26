import { PrismaClient, Role, CampaignStatus, PricingType, TransactionType, ApprovalStatus } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@coinads.com' },
    update: {},
    create: { email: 'admin@coinads.com', role: Role.ADMIN, name: 'Admin' }
  });

  // Advertiser + sample campaign
  const advertiser = await prisma.user.upsert({
    where: { email: 'adv@coinads.com' },
    update: {},
    create: { email: 'adv@coinads.com', role: Role.ADVERTISER, name: 'Advertiser One' }
  });

  const campaign = await prisma.campaign.create({
    data: {
      advertiserId: advertiser.id,
      name: 'Launch Campaign',
      budget: 500.0,
      status: CampaignStatus.PENDING,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }
  });

  await prisma.creative.create({
    data: {
      campaignId: campaign.id,
      fileUrl: 'https://cdn.coinads.io/sample/728x90.jpg',
      clickUrl: 'https://coinads.com',
      altText: 'Sample Leaderboard'
    }
  });

  // Publisher + site + placement
  const publisher = await prisma.user.upsert({
    where: { email: 'pub@coinads.com' },
    update: {},
    create: { email: 'pub@coinads.com', role: Role.PUBLISHER, name: 'Publisher One' }
  });

  const site = await prisma.site.create({
    data: {
      publisherId: publisher.id,
      domain: 'example-crypto-news.com',
      verified: true,
      approved: true
    }
  });

  const placement = await prisma.placement.create({
    data: {
      siteId: site.id,
      size: '728x90',
      pricing: PricingType.CPM,
      price: 6.0,
      approved: true
    }
  });

  // Link placement to campaign (optional for MVP if your UI assumes later selection)
  await prisma.report.create({
    data: {
      campaignId: campaign.id,
      date: new Date(),
      impressions: 0,
      clicks: 0,
      spend: 0
    }
  });

  await prisma.transaction.create({
    data: {
      userId: advertiser.id,
      amount: 250.0,
      type: TransactionType.DEPOSIT,
      status: 'PAID'
    }
  });

  // Create some sample admin logs
  await prisma.adminLog.create({
    data: {
      userId: admin.id,
      action: 'create',
      entityType: 'campaign',
      entityId: campaign.id
    }
  });

  await prisma.adminLog.create({
    data: {
      userId: admin.id,
      action: 'approve',
      entityType: 'site',
      entityId: site.id
    }
  });

  // Create sample approvals
  await prisma.approval.create({
    data: {
      entityType: 'campaign',
      entityId: campaign.id,
      status: ApprovalStatus.APPROVED,
      adminUserId: admin.id
    }
  });

  await prisma.approval.create({
    data: {
      entityType: 'site',
      entityId: site.id,
      status: ApprovalStatus.APPROVED,
      adminUserId: admin.id
    }
  });

  // Create additional demo data
  const advertiser2 = await prisma.user.upsert({
    where: { email: 'adv2@coinads.com' },
    update: {},
    create: { email: 'adv2@coinads.com', role: Role.ADVERTISER, name: 'Advertiser Two' }
  });

  const campaign2 = await prisma.campaign.create({
    data: {
      advertiserId: advertiser2.id,
      name: 'DeFi Platform Campaign',
      budget: 1000.0,
      status: CampaignStatus.ACTIVE,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    }
  });

  const publisher2 = await prisma.user.upsert({
    where: { email: 'pub2@coinads.com' },
    update: {},
    create: { email: 'pub2@coinads.com', role: Role.PUBLISHER, name: 'Publisher Two' }
  });

  const site2 = await prisma.site.create({
    data: {
      publisherId: publisher2.id,
      domain: 'crypto-daily-news.com',
      verified: false,
      approved: false
    }
  });

  const placement2 = await prisma.placement.create({
    data: {
      siteId: site2.id,
      size: '300x250',
      pricing: PricingType.CPM,
      price: 4.5,
      approved: false
    }
  });

  // Create additional sample reports for demo data
  await prisma.report.create({
    data: {
      campaignId: campaign2.id,
      date: new Date(),
      impressions: 1500,
      clicks: 45,
      spend: 7.50
    }
  });

  await prisma.report.create({
    data: {
      campaignId: campaign.id,
      date: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
      impressions: 800,
      clicks: 24,
      spend: 4.00
    }
  });

  console.log({ 
    admin, 
    advertiser, 
    advertiser2,
    campaign, 
    campaign2,
    publisher, 
    publisher2,
    site, 
    site2,
    placement, 
    placement2 
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
