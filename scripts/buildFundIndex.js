const axios = require('axios');
const fs = require('fs');
const path = require('path');

console.log('[FUND INDEX] Starting fund status index build...');

async function buildFundIndex() {
  try {
    // Fetch all schemes
    console.log('[FUND INDEX] Fetching all schemes from API...');
    const response = await axios.get('https://api.mfapi.in/mf', {
      timeout: 30000
    });
    const allSchemes = response.data;
    console.log(`[FUND INDEX] Found ${allSchemes.length} schemes`);

    const statusIndex = {
      active: [],
      inactive: [],
      lastUpdated: new Date().toISOString(),
      totalSchemes: allSchemes.length
    };

    // Process in batches
    const batchSize = 100;
    const totalSchemes = allSchemes.length;
    let processed = 0;

    for (let i = 0; i < totalSchemes; i += batchSize) {
      const batch = allSchemes.slice(i, i + batchSize);

      const results = await Promise.allSettled(
        batch.map(async (scheme) => {
          try {
            const detailResponse = await axios.get(
              `https://api.mfapi.in/mf/${scheme.schemeCode}`,
              { timeout: 5000 }
            );

            const navData = detailResponse.data?.data;
            if (!Array.isArray(navData) || navData.length === 0) {
              return { schemeCode: scheme.schemeCode, isActive: false };
            }

            const latestNav = navData[0];
            const dateParts = latestNav.date.split('-');
            const latestDate = new Date(
              dateParts[2],
              dateParts[1] - 1,
              dateParts[0]
            );

            const twoYearsAgo = new Date();
            twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

            const isActive = latestDate >= twoYearsAgo;
            return { schemeCode: scheme.schemeCode, isActive };
          } catch (error) {
            // On error, mark as inactive
            return { schemeCode: scheme.schemeCode, isActive: false };
          }
        })
      );

      // Process results
      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          if (result.value.isActive) {
            statusIndex.active.push(result.value.schemeCode);
          } else {
            statusIndex.inactive.push(result.value.schemeCode);
          }
        }
      });

      processed += batch.length;
      const percentage = ((processed / totalSchemes) * 100).toFixed(1);
      console.log(
        `[FUND INDEX] Processed ${processed}/${totalSchemes} (${percentage}%)`
      );

      // Small delay to avoid overwhelming API
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log(
      `[FUND INDEX] Index complete: ${statusIndex.active.length} active, ${statusIndex.inactive.length} inactive`
    );

    // Save to public directory
    const publicDir = path.join(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const outputPath = path.join(publicDir, 'fund-status.json');
    fs.writeFileSync(outputPath, JSON.stringify(statusIndex, null, 2));
    console.log(`[FUND INDEX] Saved to ${outputPath}`);

    // Also save metadata
    const metadata = {
      lastUpdated: statusIndex.lastUpdated,
      totalSchemes: statusIndex.totalSchemes,
      activeCount: statusIndex.active.length,
      inactiveCount: statusIndex.inactive.length
    };
    
    const metadataPath = path.join(publicDir, 'fund-status-metadata.json');
    fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
    console.log(`[FUND INDEX] Metadata saved to ${metadataPath}`);

    return statusIndex;
  } catch (error) {
    console.error('[FUND INDEX] Error building index:', error.message);
    process.exit(1);
  }
}

// Run the build
buildFundIndex()
  .then(() => {
    console.log('[FUND INDEX] Build completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('[FUND INDEX] Build failed:', error);
    process.exit(1);
  });
