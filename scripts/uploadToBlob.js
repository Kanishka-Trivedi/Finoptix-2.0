const { put } = require('@vercel/blob');
const fs = require('fs');
const path = require('path');

async function uploadToBlob() {
  try {
    console.log('[BLOB UPLOAD] Starting upload to Vercel Blob...');

    const filePath = path.join(process.cwd(), 'public', 'fund-status.json');
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      console.log('[BLOB UPLOAD] No BLOB_READ_WRITE_TOKEN found, skipping upload');
      console.log('[BLOB UPLOAD] File saved locally at public/fund-status.json');
      return;
    }

    const blob = await put('fund-status.json', fileContent, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN,
    });

    console.log(`[BLOB UPLOAD] Uploaded successfully to: ${blob.url}`);
    
    // Save the blob URL for reference
    const urlPath = path.join(process.cwd(), 'public', 'fund-status-url.txt');
    fs.writeFileSync(urlPath, blob.url);
    
    return blob.url;
  } catch (error) {
    console.error('[BLOB UPLOAD] Error uploading to blob:', error.message);
    console.log('[BLOB UPLOAD] Continuing with local file...');
  }
}

uploadToBlob()
  .then(() => {
    console.log('[BLOB UPLOAD] Upload completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('[BLOB UPLOAD] Upload failed:', error);
    process.exit(0); // Don't fail the workflow
  });
