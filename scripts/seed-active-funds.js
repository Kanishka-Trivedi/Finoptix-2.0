// Optimized script to seed only active funds with better error handling
require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

const MONGODB_URI = process.env.MONGODB_URI;

// Helper to check if a fund is active
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
  
  return navDate >= yesterday;
}

async function seedActiveFunds() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    const Fund = mongoose.model('Fund', new mongoose.Schema({
      schemeCode: String,
      schemeName: String,
      fundHouse: String,
      category: String,
      schemeType: String,
      schemeCategory: String,
      isinGrowth: String,
      isinDividend: String,
      navHistory: Array,
      lastUpdated: Date,
      isActive: Boolean,
      latestNAV: String,
      latestNAVDate: String
    }));

    console.log('Fetching all schemes from API...');
    const response = await axios.get('https://api.mfapi.in/mf');
    const allSchemes = response.data;
    console.log(`Total schemes available: ${allSchemes.length}`);

    let activeCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    let processedCount = 0;

    // Process in smaller batches
    const batchSize = 20;
    const maxFunds = 1000; // Limit to first 1000 schemes to avoid timeout

    console.log(`Processing first ${maxFunds} schemes in batches of ${batchSize}...`);

    for (let i = 0; i < Math.min(allSchemes.length, maxFunds); i += batchSize) {
      const batch = allSchemes.slice(i, i + batchSize);
      
      await Promise.all(batch.map(async (scheme) => {
        try {
          const detailResponse = await axios.get(`https://api.mfapi.in/mf/${scheme.schemeCode}`, {
            timeout: 5000 // 5 second timeout
          });
          const schemeData = detailResponse.data;

          const fullNavHistory = schemeData.data || [];
          const isActive = isFundActive(fullNavHistory);

          if (!isActive) {
            skippedCount++;
            return;
          }

          // Only keep last 2 years of NAV history
          const navHistory = fullNavHistory.slice(0, 730);

          const name = scheme.schemeName || '';
          let fundHouse = 'Unknown';
          const parts = name.split('-');
          if (parts.length > 0) {
            fundHouse = parts[0].trim();
          }

          let category = 'Equity';
          const nameLower = name.toLowerCase();
          if (nameLower.includes('debt') || nameLower.includes('bond')) {
            category = 'Debt';
          } else if (nameLower.includes('hybrid')) {
            category = 'Hybrid';
          } else if (nameLower.includes('liquid')) {
            category = 'Liquid';
          } else if (nameLower.includes('elss')) {
            category = 'ELSS';
          }

          await Fund.findOneAndUpdate(
            { schemeCode: scheme.schemeCode },
            {
              schemeCode: scheme.schemeCode,
              schemeName: name,
              fundHouse,
              category,
              schemeType: schemeData.meta?.scheme_type || 'Open Ended',
              schemeCategory: schemeData.meta?.scheme_category || category,
              isinGrowth: schemeData.meta?.scheme_isin_growth || null,
              isinDividend: schemeData.meta?.scheme_isin_div || null,
              navHistory,
              latestNAV: navHistory.length > 0 ? navHistory[0].nav : null,
              latestNAVDate: navHistory.length > 0 ? navHistory[0].date : null,
              isActive: true,
              lastUpdated: new Date()
            },
            { upsert: true, new: true }
          );

          activeCount++;
          
        } catch (error) {
          errorCount++;
          if (error.code !== 'ECONNABORTED') {
            console.error(`Error processing ${scheme.schemeCode}: ${error.message}`);
          }
        }
      }));

      processedCount += batch.length;
      console.log(`Progress: ${processedCount}/${Math.min(allSchemes.length, maxFunds)} | Active: ${activeCount} | Skipped: ${skippedCount} | Errors: ${errorCount}`);

      // Small delay between batches
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log('\n✓ Seeding complete!');
    console.log(`Total processed: ${processedCount}`);
    console.log(`Active funds added: ${activeCount}`);
    console.log(`Inactive funds skipped: ${skippedCount}`);
    console.log(`Errors: ${errorCount}`);
    
  } catch (error) {
    console.error('Error seeding funds:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

seedActiveFunds();
