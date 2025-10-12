// Quick seed script to add sample funds for testing
require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

const MONGODB_URI = process.env.MONGODB_URI;

// Sample scheme codes to fetch
const SAMPLE_SCHEMES = [
  '118989', // SBI Bluechip Fund
  '119551', // HDFC Top 100 Fund
  '120503', // ICICI Prudential Bluechip Fund
  '118834', // Axis Bluechip Fund
  '125497', // Kotak Standard Multicap Fund
];

async function seedSampleFunds() {
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

    console.log(`Fetching ${SAMPLE_SCHEMES.length} sample funds...`);

    for (const schemeCode of SAMPLE_SCHEMES) {
      try {
        console.log(`Fetching scheme ${schemeCode}...`);
        const response = await axios.get(`https://api.mfapi.in/mf/${schemeCode}`);
        const schemeData = response.data;

        const navHistory = schemeData.data || [];
        const name = schemeData.meta?.scheme_name || 'Unknown';
        
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
        }

        // Check if active (has recent NAV)
        const isActive = navHistory.length > 0;

        await Fund.findOneAndUpdate(
          { schemeCode },
          {
            schemeCode,
            schemeName: name,
            fundHouse,
            category,
            schemeType: schemeData.meta?.scheme_type || 'Open Ended',
            schemeCategory: schemeData.meta?.scheme_category || 'Equity',
            isinGrowth: schemeData.meta?.scheme_isin_growth || null,
            isinDividend: schemeData.meta?.scheme_isin_div || null,
            navHistory,
            latestNAV: navHistory.length > 0 ? navHistory[0].nav : null,
            latestNAVDate: navHistory.length > 0 ? navHistory[0].date : null,
            isActive,
            lastUpdated: new Date()
          },
          { upsert: true, new: true }
        );

        console.log(`✓ Added: ${name}`);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`✗ Error fetching scheme ${schemeCode}:`, error.message);
      }
    }

    console.log('\n✓ Sample funds seeded successfully!');
    console.log('You can now test the application.');
    
  } catch (error) {
    console.error('Error seeding funds:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

seedSampleFunds();
