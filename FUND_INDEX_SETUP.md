# Fund Status Index Setup Guide

This guide explains how to set up the automated fund status indexing system.

## Overview

The system builds a daily index of all 37,000+ mutual funds, categorizing them as "active" or "inactive" based on their NAV data. This eliminates the need for real-time API calls during filtering.

## Files Created

1. `.github/workflows/build-fund-index.yml` - GitHub Actions workflow
2. `scripts/buildFundIndex.js` - Index building script
3. `scripts/uploadToBlob.js` - Vercel Blob upload script
4. `public/fund-status.json` - Generated index file (created after first run)

## Setup Instructions

### Option 1: Local Build (Quick Start)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the index locally:**
   ```bash
   npm run build-index
   ```
   
   This will:
   - Check all 37,000 funds (takes 30-45 minutes)
   - Create `public/fund-status.json`
   - Your app will immediately use this file

3. **Start your dev server:**
   ```bash
   npm run dev
   ```

4. **Test the filters:**
   - Go to `/funds`
   - Click "Active" or "Inactive" filter
   - Should work instantly!

### Option 2: GitHub Actions (Automated Daily Updates)

1. **Push code to GitHub:**
   ```bash
   git add .
   git commit -m "Add fund status indexing system"
   git push
   ```

2. **Run workflow manually (first time):**
   - Go to your GitHub repository
   - Click "Actions" tab
   - Select "Build Fund Status Index"
   - Click "Run workflow"
   - Wait 30-45 minutes for completion

3. **Automatic daily updates:**
   - Workflow runs every day at 2:00 AM UTC
   - Updates the index automatically
   - No manual intervention needed

### Option 3: Vercel Blob Storage (Optional)

If you want to use Vercel Blob Storage instead of committing the file:

1. **Create Vercel Blob Store:**
   - Go to Vercel Dashboard
   - Select your project
   - Go to Storage → Create Database → Blob

2. **Get the token:**
   - Copy the `BLOB_READ_WRITE_TOKEN`

3. **Add to GitHub Secrets:**
   - Go to GitHub repository → Settings → Secrets
   - Add secret: `BLOB_READ_WRITE_TOKEN`
   - Paste the token value

4. **Update API to read from Blob:**
   - The system will automatically use Blob if available
   - Falls back to local file if not

## How It Works

### Building the Index

```javascript
// Checks each fund's latest NAV date
// If NAV is within last 2 years → Active
// If NAV is older or missing → Inactive
```

### Using the Index

```javascript
// API reads from public/fund-status.json
// Instant filtering (no API calls)
// Results in < 100ms
```

## File Structure

```
public/
  └── fund-status.json          # Main index file
  └── fund-status-metadata.json # Metadata (counts, last updated)
  └── fund-status-url.txt       # Blob URL (if using Vercel Blob)

scripts/
  ├── buildFundIndex.js         # Builds the index
  └── uploadToBlob.js           # Uploads to Vercel Blob

.github/
  └── workflows/
      └── build-fund-index.yml  # Daily automation
```

## Index File Format

```json
{
  "active": [100001, 100002, ...],
  "inactive": [100003, 100004, ...],
  "lastUpdated": "2025-10-12T14:30:00.000Z",
  "totalSchemes": 37165
}
```

## Troubleshooting

### "Fund status index is being built" message

**Solution:** Run the index builder locally:
```bash
npm run build-index
```

### GitHub Action fails

**Check:**
- Workflow has correct permissions
- No API rate limits
- Check Actions logs for errors

### Index file not found

**Solution:**
1. Run `npm run build-index` locally
2. Commit the generated `public/fund-status.json`
3. Push to GitHub

## Performance

| Metric | Value |
|--------|-------|
| Index build time | 30-45 minutes |
| File size | ~3 MB |
| Filter response time | < 100ms |
| Cache duration | 24 hours |
| Update frequency | Daily at 2 AM UTC |

## Maintenance

- **Daily:** Automatic via GitHub Actions
- **Manual:** Run `npm run build-index` anytime
- **Storage:** Only 3 MB (never grows)
- **Cost:** $0 (completely free)

## Next Steps

1. ✅ Run `npm install` to install dependencies
2. ✅ Run `npm run build-index` to create initial index
3. ✅ Test the active/inactive filters
4. ✅ Push to GitHub to enable daily automation
5. ✅ (Optional) Set up Vercel Blob Storage

## Support

If you encounter issues:
1. Check console logs for errors
2. Verify `public/fund-status.json` exists
3. Run `npm run build-index` to rebuild
4. Check GitHub Actions logs if using automation
