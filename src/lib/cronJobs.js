import cron from 'node-cron';
import axios from 'axios';
import connectDB from './mongodb.js';
import Fund from '../models/Fund.js';

let cronJobStarted = false;

// Helper to check if a fund is active (has NAV from today or yesterday)
function isFundActive(navHistory) {
  if (!navHistory || navHistory.length === 0) return false;
  
  const latestNavDate = navHistory[0].date;
  const [day, month, year] = latestNavDate.split('-');
  const navDate = new Date(year, month - 1, day);
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  navDate.setHours(0, 0, 0, 0);
  
  // Fund is active if NAV is from today or yesterday (markets might be closed)
  return navDate >= yesterday;
}

// Update all funds data
async function updateFundsData() {
  console.log('[CRON] Starting daily fund data update...');
  
  try {
    console.log('[CRON] Connecting to MongoDB...');
    await connectDB();
    console.log('[CRON] MongoDB connected successfully');
    
    // Fetch all schemes
    console.log('[CRON] Fetching schemes from API...');
    const response = await axios.get('https://api.mfapi.in/mf');
    const allSchemes = response.data;
    
    console.log(`[CRON] Fetched ${allSchemes.length} schemes from API`);
    
    let activeCount = 0;
    let inactiveCount = 0;
    let processedCount = 0;
    
    // Process schemes in batches to avoid overwhelming the API
    const batchSize = 50;
    for (let i = 0; i < allSchemes.length; i += batchSize) {
      const batch = allSchemes.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (scheme) => {
        try {
          // Fetch detailed scheme data
          const detailResponse = await axios.get(`https://api.mfapi.in/mf/${scheme.schemeCode}`);
          const schemeData = detailResponse.data;
          
          const fullNavHistory = schemeData.data || [];
          const isActive = isFundActive(fullNavHistory);
          
          // Only keep last 2 years of NAV history to save space (730 days)
          const navHistory = fullNavHistory.slice(0, 730);
          
          // Extract fund house and category
          const name = scheme.schemeName || '';
          let fundHouse = 'Unknown';
          const parts = name.split('-');
          if (parts.length > 0) {
            fundHouse = parts[0].trim();
          }
          
          let category = 'Other';
          const nameLower = name.toLowerCase();
          if (nameLower.includes('equity') || nameLower.includes('stock')) {
            category = 'Equity';
          } else if (nameLower.includes('debt') || nameLower.includes('bond')) {
            category = 'Debt';
          } else if (nameLower.includes('hybrid') || nameLower.includes('balanced')) {
            category = 'Hybrid';
          } else if (nameLower.includes('liquid') || nameLower.includes('money market')) {
            category = 'Liquid';
          } else if (nameLower.includes('elss') || nameLower.includes('tax')) {
            category = 'ELSS';
          } else if (nameLower.includes('index') || nameLower.includes('etf')) {
            category = 'Index';
          } else if (nameLower.includes('gilt')) {
            category = 'Gilt';
          }
          
          // Only store active funds to save space
          if (isActive) {
            await Fund.findOneAndUpdate(
              { schemeCode: scheme.schemeCode },
              {
                schemeCode: scheme.schemeCode,
                schemeName: name,
                fundHouse: fundHouse,
                category: category,
                schemeType: schemeData.meta?.scheme_type || 'Unknown',
                schemeCategory: schemeData.meta?.scheme_category || 'Unknown',
                isinGrowth: schemeData.meta?.scheme_isin_growth || null,
                isinDividend: schemeData.meta?.scheme_isin_div || null,
                navHistory: navHistory,
                latestNAV: navHistory.length > 0 ? navHistory[0].nav : null,
                latestNAVDate: navHistory.length > 0 ? navHistory[0].date : null,
                isActive: isActive,
                lastUpdated: new Date()
              },
              { upsert: true, new: true }
            );
            activeCount++;
          } else {
            // Delete inactive funds to free up space
            await Fund.deleteOne({ schemeCode: scheme.schemeCode });
            inactiveCount++;
          }
          
          processedCount++;
          
          // Add small delay to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          console.error(`[CRON] Error processing scheme ${scheme.schemeCode}:`, error.message);
        }
      }));
      
      console.log(`[CRON] Processed ${processedCount}/${allSchemes.length} schemes...`);
    }
    
    console.log(`[CRON] Update complete! Active: ${activeCount}, Inactive: ${inactiveCount}`);
    
  } catch (error) {
    console.error('[CRON] Error updating funds data:', error);
    console.error('[CRON] Error stack:', error.stack);
    throw error; // Re-throw to see in API response
  }
}

// Start cron job
export function startCronJobs() {
  if (cronJobStarted) {
    console.log('[CRON] Cron jobs already started');
    return;
  }
  
  // Run daily at 7:00 AM
  cron.schedule('0 7 * * *', async () => {
    console.log('[CRON] Running scheduled fund data update at 7:00 AM');
    await updateFundsData();
  });
  
  cronJobStarted = true;
  console.log('[CRON] Cron jobs started - scheduled for 7:00 AM daily');
  
  // Optionally run on startup (commented out to avoid long startup times)
  // updateFundsData();
}

// Manual trigger function (can be called via API)
export async function triggerManualUpdate() {
  await updateFundsData();
}
