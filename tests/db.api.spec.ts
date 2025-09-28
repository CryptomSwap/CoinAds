import { test, expect } from '@playwright/test';
import { seedTestUser, signin, TEST_USER } from './helpers/auth';
import fs from 'fs';
import path from 'path';

interface ApiTestResult {
  endpoint: string;
  method: string;
  status: number;
  success: boolean;
  response?: any;
  error?: string;
  timestamp: number;
}

interface DbTestSummary {
  health: ApiTestResult;
  publisherSites: {
    create: ApiTestResult;
    read: ApiTestResult;
    update: ApiTestResult;
    delete: ApiTestResult;
  };
  advertiserCampaigns: {
    create: ApiTestResult;
    read: ApiTestResult;
    update?: ApiTestResult;
    delete?: ApiTestResult;
  };
  createdResources: Array<{
    type: string;
    id: string;
    data: any;
  }>;
}

test.describe('Database API End-to-End Tests', () => {
  let testSummary: DbTestSummary;
  let authContext: any;
  let createdSiteId: string | null = null;
  let createdCampaignId: string | null = null;

  test.beforeAll(async ({ browser }) => {
    testSummary = {
      health: {} as ApiTestResult,
      publisherSites: {
        create: {} as ApiTestResult,
        read: {} as ApiTestResult,
        update: {} as ApiTestResult,
        delete: {} as ApiTestResult,
      },
      advertiserCampaigns: {
        create: {} as ApiTestResult,
        read: {} as ApiTestResult,
      },
      createdResources: []
    };

    // Create a new context for authenticated requests
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Try to seed and sign in
    await seedTestUser(page);
    const signedIn = await signin(page);
    
    if (signedIn) {
      // Get the storage state for authenticated requests
      authContext = await context.storageState();
      console.log('✅ Authentication context established');
    } else {
      console.log('⚠️ Authentication failed - will test public endpoints only');
    }
    
    await context.close();
  });

  test('Health Check', async ({ request }) => {
    const result: ApiTestResult = {
      endpoint: '/api/health',
      method: 'GET',
      status: 0,
      success: false,
      timestamp: Date.now()
    };

    try {
      const response = await request.get('/api/health');
      result.status = response.status();
      result.response = await response.json();
      
      expect(response.status()).toBe(200);
      expect(result.response).toHaveProperty('ok', true);
      expect(result.response).toHaveProperty('db', 'connected');
      
      result.success = true;
      console.log('✅ Health check passed:', result.response);
    } catch (error) {
      result.error = error instanceof Error ? error.message : String(error);
      console.log('❌ Health check failed:', result.error);
    }

    testSummary.health = result;
  });

  test('Publisher Sites CRUD', async ({ browser }) => {
    if (!authContext) {
      test.skip('Authentication required for publisher sites');
      return;
    }

    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const timestamp = Date.now();
    const testDomain = `test-site-${timestamp}.com`;
    
    // CREATE
    const createResult: ApiTestResult = {
      endpoint: '/api/publisher/sites',
      method: 'POST',
      status: 0,
      success: false,
      timestamp: Date.now()
    };

    try {
      const createResponse = await request.post('/api/publisher/sites', {
        data: {
          name: `Test Site ${timestamp}`,
          domain: testDomain,
          description: 'Test site created by audit',
          category: 'crypto',
          monthlyVisitors: 1000
        }
      });
      
      createResult.status = createResponse.status();
      createResult.response = await createResponse.json();
      
      if (createResponse.ok()) {
        createdSiteId = createResult.response.id;
        testSummary.createdResources.push({
          type: 'publisher_site',
          id: createdSiteId,
          data: createResult.response
        });
        createResult.success = true;
        console.log('✅ Publisher site created:', createdSiteId);
      } else {
        createResult.error = `HTTP ${createResult.status}: ${JSON.stringify(createResult.response)}`;
      }
    } catch (error) {
      createResult.error = error instanceof Error ? error.message : String(error);
    }

    testSummary.publisherSites.create = createResult;

    // READ (list)
    const readResult: ApiTestResult = {
      endpoint: '/api/publisher/sites',
      method: 'GET',
      status: 0,
      success: false,
      timestamp: Date.now()
    };

    try {
      const readResponse = await request.get('/api/publisher/sites');
      readResult.status = readResponse.status();
      readResult.response = await readResponse.json();
      
      if (readResponse.ok() && createdSiteId) {
        const sites = Array.isArray(readResult.response) ? readResult.response : readResult.response.sites || [];
        const foundSite = sites.find((site: any) => site.id === createdSiteId);
        
        if (foundSite) {
          readResult.success = true;
          console.log('✅ Publisher site found in list');
        } else {
          readResult.error = 'Created site not found in list';
        }
      } else {
        readResult.error = `HTTP ${readResult.status}: ${JSON.stringify(readResult.response)}`;
      }
    } catch (error) {
      readResult.error = error instanceof Error ? error.message : String(error);
    }

    testSummary.publisherSites.read = readResult;

    // UPDATE (if we have a site ID)
    if (createdSiteId) {
      const updateResult: ApiTestResult = {
        endpoint: `/api/publisher/sites/${createdSiteId}`,
        method: 'PUT',
        status: 0,
        success: false,
        timestamp: Date.now()
      };

      try {
        const updateResponse = await request.put(`/api/publisher/sites/${createdSiteId}`, {
          data: {
            name: `Updated Test Site ${timestamp}`,
            description: 'Updated description for audit'
          }
        });
        
        updateResult.status = updateResponse.status();
        updateResult.response = await updateResponse.json();
        
        if (updateResponse.ok()) {
          updateResult.success = true;
          console.log('✅ Publisher site updated');
        } else {
          updateResult.error = `HTTP ${updateResult.status}: ${JSON.stringify(updateResult.response)}`;
        }
      } catch (error) {
        updateResult.error = error instanceof Error ? error.message : String(error);
      }

      testSummary.publisherSites.update = updateResult;
    }

    await context.close();
  });

  test('Advertiser Campaigns CRUD', async ({ browser }) => {
    if (!authContext) {
      test.skip('Authentication required for advertiser campaigns');
      return;
    }

    const context = await browser.newContext({ storageState: authContext });
    const request = context.request;
    
    const timestamp = Date.now();
    
    // CREATE
    const createResult: ApiTestResult = {
      endpoint: '/api/advertiser/campaigns',
      method: 'POST',
      status: 0,
      success: false,
      timestamp: Date.now()
    };

    try {
      const createResponse = await request.post('/api/advertiser/campaigns', {
        data: {
          name: `Test Campaign ${timestamp}`,
          description: 'Test campaign created by audit',
          budget: 1000,
          dailyBudget: 100,
          startDate: new Date().toISOString(),
          endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          targetAudience: 'crypto-enthusiasts',
          adFormat: 'banner'
        }
      });
      
      createResult.status = createResponse.status();
      createResult.response = await createResponse.json();
      
      if (createResponse.ok()) {
        createdCampaignId = createResult.response.id;
        testSummary.createdResources.push({
          type: 'advertiser_campaign',
          id: createdCampaignId,
          data: createResult.response
        });
        createResult.success = true;
        console.log('✅ Advertiser campaign created:', createdCampaignId);
      } else {
        createResult.error = `HTTP ${createResult.status}: ${JSON.stringify(createResult.response)}`;
      }
    } catch (error) {
      createResult.error = error instanceof Error ? error.message : String(error);
    }

    testSummary.advertiserCampaigns.create = createResult;

    // READ (list)
    const readResult: ApiTestResult = {
      endpoint: '/api/advertiser/campaigns',
      method: 'GET',
      status: 0,
      success: false,
      timestamp: Date.now()
    };

    try {
      const readResponse = await request.get('/api/advertiser/campaigns');
      readResult.status = readResponse.status();
      readResult.response = await readResponse.json();
      
      if (readResponse.ok() && createdCampaignId) {
        const campaigns = Array.isArray(readResult.response) ? readResult.response : readResult.response.campaigns || [];
        const foundCampaign = campaigns.find((campaign: any) => campaign.id === createdCampaignId);
        
        if (foundCampaign) {
          readResult.success = true;
          console.log('✅ Advertiser campaign found in list');
        } else {
          readResult.error = 'Created campaign not found in list';
        }
      } else {
        readResult.error = `HTTP ${readResult.status}: ${JSON.stringify(readResult.response)}`;
      }
    } catch (error) {
      readResult.error = error instanceof Error ? error.message : String(error);
    }

    testSummary.advertiserCampaigns.read = readResult;

    await context.close();
  });

  test.afterAll(async ({ browser }) => {
    // Cleanup created resources
    if (authContext) {
      const context = await browser.newContext({ storageState: authContext });
      const request = context.request;
      
      // Delete created campaign
      if (createdCampaignId) {
        try {
          const deleteResponse = await request.delete(`/api/advertiser/campaigns/${createdCampaignId}`);
          if (deleteResponse.ok()) {
            console.log('✅ Test campaign cleaned up');
          } else {
            console.log('⚠️ Failed to clean up test campaign');
          }
        } catch (error) {
          console.log('⚠️ Error cleaning up test campaign:', error);
        }
      }
      
      // Delete created site
      if (createdSiteId) {
        try {
          const deleteResponse = await request.delete(`/api/publisher/sites/${createdSiteId}`);
          if (deleteResponse.ok()) {
            console.log('✅ Test site cleaned up');
          } else {
            console.log('⚠️ Failed to clean up test site');
          }
        } catch (error) {
          console.log('⚠️ Error cleaning up test site:', error);
        }
      }
      
      await context.close();
    }

    // Save test results
    const artifactsDir = path.join(process.cwd(), 'audit-artifacts');
    if (!fs.existsSync(artifactsDir)) {
      fs.mkdirSync(artifactsDir, { recursive: true });
    }
    
    const apiDir = path.join(artifactsDir, 'api');
    if (!fs.existsSync(apiDir)) {
      fs.mkdirSync(apiDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const resultFile = path.join(apiDir, `db-api-test-${timestamp}.json`);
    
    fs.writeFileSync(resultFile, JSON.stringify(testSummary, null, 2));
    console.log(`📝 API test results saved to: ${resultFile}`);
  });
});
