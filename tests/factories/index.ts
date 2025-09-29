import { PrismaClient, Role, PricingType, CampaignStatus, TransactionType } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export interface UserFactoryData {
  email?: string;
  name?: string;
  role?: Role;
  password?: string;
}

export interface SiteFactoryData {
  domain?: string;
  publisherId?: number;
  verified?: boolean;
  approved?: boolean;
}

export interface PlacementFactoryData {
  siteId?: number;
  size?: string;
  pricing?: PricingType;
  price?: number;
  approved?: boolean;
}

export interface CampaignFactoryData {
  name?: string;
  advertiserId?: number;
  budget?: number;
  status?: CampaignStatus;
  startDate?: Date;
  endDate?: Date;
}

export interface TransactionFactoryData {
  userId?: number;
  type?: TransactionType;
  amount?: number;
  status?: string;
}

// User factory
export async function createUser(data: UserFactoryData = {}) {
  const hashedPassword = data.password ? await bcrypt.hash(data.password, 12) : undefined;
  
  return prisma.user.create({
    data: {
      email: data.email || `test-${Date.now()}@example.com`,
      name: data.name || 'Test User',
      role: data.role || Role.ADVERTISER,
      password: hashedPassword,
    },
  });
}

// Site factory
export async function createSite(data: SiteFactoryData = {}) {
  if (!data.publisherId) {
    const publisher = await createUser({ role: Role.PUBLISHER });
    data.publisherId = publisher.id;
  }

  return prisma.site.create({
    data: {
      domain: data.domain || `test-${Date.now()}.com`,
      publisherId: data.publisherId,
      verified: data.verified ?? true,
      approved: data.approved ?? true,
    },
  });
}

// Placement factory
export async function createPlacement(data: PlacementFactoryData = {}) {
  if (!data.siteId) {
    const site = await createSite();
    data.siteId = site.id;
  }

  return prisma.placement.create({
    data: {
      siteId: data.siteId,
      size: data.size || '728x90',
      pricing: data.pricing || PricingType.CPM,
      price: data.price || 5.0,
      approved: data.approved ?? true,
    },
  });
}

// Campaign factory
export async function createCampaign(data: CampaignFactoryData = {}) {
  if (!data.advertiserId) {
    const advertiser = await createUser({ role: Role.ADVERTISER });
    data.advertiserId = advertiser.id;
  }

  return prisma.campaign.create({
    data: {
      name: data.name || `Test Campaign ${Date.now()}`,
      advertiserId: data.advertiserId,
      budget: data.budget || 1000.0,
      status: data.status || CampaignStatus.PENDING,
      startDate: data.startDate || new Date(),
      endDate: data.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });
}

// Transaction factory
export async function createTransaction(data: TransactionFactoryData = {}) {
  if (!data.userId) {
    const user = await createUser();
    data.userId = user.id;
  }

  return prisma.transaction.create({
    data: {
      userId: data.userId,
      type: data.type || TransactionType.DEPOSIT,
      amount: data.amount || 100.0,
      status: data.status || 'SUCCEEDED',
    },
  });
}

// Cleanup function for tests
export async function cleanupTestData() {
  await prisma.transaction.deleteMany({});
  await prisma.placement.deleteMany({});
  await prisma.site.deleteMany({});
  await prisma.campaign.deleteMany({});
  await prisma.user.deleteMany({});
}

// Helper to create a complete test scenario
export async function createTestScenario() {
  const advertiser = await createUser({ 
    role: Role.ADVERTISER, 
    email: 'test-advertiser@example.com' 
  });
  
  const publisher = await createUser({ 
    role: Role.PUBLISHER, 
    email: 'test-publisher@example.com' 
  });
  
  const site = await createSite({ 
    domain: 'test-site.com', 
    publisherId: publisher.id 
  });
  
  const placement = await createPlacement({ 
    siteId: site.id, 
    size: '728x90', 
    price: 5.0 
  });
  
  const campaign = await createCampaign({ 
    advertiserId: advertiser.id, 
    name: 'Test Campaign' 
  });
  
  const transaction = await createTransaction({ 
    userId: advertiser.id, 
    amount: 500.0 
  });

  return {
    advertiser,
    publisher,
    site,
    placement,
    campaign,
    transaction,
  };
}
