# PowerShell script to add RequireAuth wrapper to all remaining dashboard pages

$files = @(
    "app/app/admin/approvals/page.tsx",
    "app/app/admin/delivery/page.tsx", 
    "app/app/admin/logs/page.tsx",
    "app/app/admin/pricing/page.tsx",
    "app/app/admin/transactions/page.tsx",
    "app/app/admin/users/page.tsx",
    "app/app/advertiser/billing/page.tsx",
    "app/app/advertiser/campaigns/new/page.tsx",
    "app/app/advertiser/campaigns/new/review/page.tsx",
    "app/app/advertiser/campaigns/[id]/page.tsx",
    "app/app/advertiser/creatives/page.tsx",
    "app/app/advertiser/reports/page.tsx",
    "app/app/advertiser/support/page.tsx",
    "app/app/advertiser/wallet/page.tsx",
    "app/app/publisher/ad-tags/page.tsx",
    "app/app/publisher/earnings/page.tsx",
    "app/app/publisher/payouts/page.tsx",
    "app/app/publisher/placements/page.tsx",
    "app/app/publisher/reports/page.tsx",
    "app/app/publisher/sites/new/page.tsx",
    "app/app/publisher/sites/[id]/verify/page.tsx",
    "app/app/publisher/support/page.tsx"
)

foreach ($file in $files) {
    Write-Host "Processing $file"
    
    # Read the file content
    $content = Get-Content $file -Raw
    
    # Check if it's already a client component
    if ($content -match "'use client';" -or $content -match '"use client";') {
        Write-Host "  - Already a client component"
        
        # Add RequireAuth import if not present
        if ($content -notmatch "import RequireAuth") {
            # Find the last import line and add RequireAuth import
            $lines = $content -split "`n"
            $lastImportIndex = -1
            for ($i = 0; $i -lt $lines.Length; $i++) {
                if ($lines[$i] -match "^import.*from") {
                    $lastImportIndex = $i
                }
            }
            
            if ($lastImportIndex -ge 0) {
                $lines[$lastImportIndex] += "`nimport RequireAuth from `"@/components/RequireAuth`";"
                $content = $lines -join "`n"
            }
        }
        
        # Wrap the main return statement with RequireAuth
        if ($content -match "return \(`n\s*<div") {
            $content = $content -replace "return \(`n\s*<div", "return (`n    <RequireAuth>`n      <div"
        } elseif ($content -match "return \(`n\s*<") {
            $content = $content -replace "return \(`n\s*<", "return (`n    <RequireAuth>`n      <"
        }
        
        # Close the RequireAuth wrapper before the final closing
        if ($content -match "`n\s*\);\s*`n\s*}\s*$") {
            $content = $content -replace "`n\s*\);\s*`n\s*}\s*$", "`n      </RequireAuth>`n    );`n  }"
        }
        
    } else {
        Write-Host "  - Converting to client component"
        
        # Add 'use client' directive at the top
        $content = "'use client';`n`n" + $content
        
        # Add RequireAuth import
        $lines = $content -split "`n"
        $lastImportIndex = -1
        for ($i = 0; $i -lt $lines.Length; $i++) {
            if ($lines[$i] -match "^import.*from") {
                $lastImportIndex = $i
            }
        }
        
        if ($lastImportIndex -ge 0) {
            $lines[$lastImportIndex] += "`nimport RequireAuth from `"@/components/RequireAuth`";"
            $content = $lines -join "`n"
        }
        
        # Wrap the main return statement with RequireAuth
        if ($content -match "return \(`n\s*<div") {
            $content = $content -replace "return \(`n\s*<div", "return (`n    <RequireAuth>`n      <div"
        } elseif ($content -match "return \(`n\s*<") {
            $content = $content -replace "return \(`n\s*<", "return (`n    <RequireAuth>`n      <"
        }
        
        # Close the RequireAuth wrapper before the final closing
        if ($content -match "`n\s*\);\s*`n\s*}\s*$") {
            $content = $content -replace "`n\s*\);\s*`n\s*}\s*$", "`n      </RequireAuth>`n    );`n  }"
        }
    }
    
    # Write the updated content back to the file
    Set-Content $file $content -NoNewline
    Write-Host "  - Updated successfully"
}

Write-Host "All files processed!"
