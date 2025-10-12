import { startCronJobs } from '../../../lib/cronJobs.js';

let initialized = false;

export default async function handler(req, res) {
  if (!initialized) {
    startCronJobs();
    initialized = true;
  }
  
  res.status(200).json({ message: 'Cron jobs initialized' });
}
