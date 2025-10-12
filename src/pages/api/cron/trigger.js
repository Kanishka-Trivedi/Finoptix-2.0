import { triggerManualUpdate } from '../../../lib/cronJobs.js';

export default async function handler(req, res) {
  // Allow both GET and POST for easier browser access
  if (req.method !== 'POST' && req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Trigger manual update (useful for testing)
    triggerManualUpdate(); // Run async without waiting
    
    res.status(200).json({ 
      message: 'Manual update triggered! This will take 10-30 minutes. Check your server logs for progress.',
      note: 'The process is running in the background. You can close this page.'
    });
  } catch (error) {
    console.error('Error triggering manual update:', error);
    res.status(500).json({ error: 'Failed to trigger update' });
  }
}
