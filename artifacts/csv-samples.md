# CSV Export Samples

## Advertiser Reports Export

```csv
Campaign,Date,Impressions,Clicks,Spend,CTR,CPM,CPC
Test Campaign,2024-01-01,1000,50,25.00,5.00%,25.00,0.50
Test Campaign,2024-01-02,1200,60,30.00,5.00%,25.00,0.50
Test Campaign,2024-01-03,800,40,20.00,5.00%,25.00,0.50
```

## Publisher Reports Export

```csv
Site,Placement,Date,Impressions,Clicks,Earnings,CTR,CPM
example-publisher.test,300x250,2024-01-01,1000,50,5.00,5.00%,5.00
example-publisher.test,300x250,2024-01-02,1200,60,6.00,5.00%,5.00
example-publisher.test,300x250,2024-01-03,800,40,4.00,5.00%,5.00
```

## Admin Reports Export

```csv
Date,Campaign,Site,Impressions,Clicks,Revenue,Advertiser,Publisher
2024-01-01,Test Campaign,example-publisher.test,1000,50,5.00,adv@coinads.test,pub@coinads.test
2024-01-02,Test Campaign,example-publisher.test,1200,60,6.00,adv@coinads.test,pub@coinads.test
2024-01-03,Test Campaign,example-publisher.test,800,40,4.00,adv@coinads.test,pub@coinads.test
```

## Campaign Performance Export

```csv
Campaign Name,Status,Budget,Spend,Impressions,Clicks,Conversions,CTR,CPM,CPC,CPA
Test Campaign,PENDING,1000.00,75.00,3000,150,0,5.00%,25.00,0.50,0.00
```

## Site Performance Export

```csv
Site Domain,Status,Impressions,Earnings,Placements,Avg CPM,Total Clicks
example-publisher.test,APPROVED,3000,15.00,1,5.00,150
coinranking.com,APPROVED,0,0.00,4,0.00,0
cryptodaily.co.uk,APPROVED,0,0.00,4,0.00,0
```

## Transaction History Export

```csv
Date,Type,Amount,Status,Description,User
2024-01-01,DEPOSIT,500.00,COMPLETED,Initial deposit,adv@coinads.test
2024-01-02,SPEND,25.00,COMPLETED,Campaign spend,adv@coinads.test
2024-01-03,EARNINGS,5.00,COMPLETED,Publisher earnings,pub@coinads.test
```

## User Management Export

```csv
Email,Role,Name,Created At,Last Login,Status
admin@coinads.test,ADMIN,Admin User,2024-01-01,2024-01-01,ACTIVE
adv@coinads.test,ADVERTISER,Advertiser User,2024-01-01,2024-01-01,ACTIVE
pub@coinads.test,PUBLISHER,Publisher User,2024-01-01,2024-01-01,ACTIVE
```

## Approval History Export

```csv
Date,Entity Type,Entity ID,Action,Status,Reason,Admin
2024-01-01,CAMPAIGN,1,APPROVE,APPROVED,Meets quality standards,admin@coinads.test
2024-01-01,SITE,1,APPROVE,APPROVED,Domain verified,admin@coinads.test
2024-01-01,PLACEMENT,1,APPROVE,APPROVED,Good placement,admin@coinads.test
```

## Notes

- All CSV exports include proper headers
- Data is properly formatted and escaped
- Date formats are consistent (YYYY-MM-DD)
- Currency values are properly formatted
- Large datasets are handled efficiently
- Exports respect user permissions and data access
- File naming follows convention: `{type}-{date}.csv`
