# Mutual Fund Explorer - Setup Instructions

## Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (or local MongoDB instance)

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/mutual-funds-explorer
```

You've already configured this with your MongoDB Atlas connection.

### 3. Run the Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Features Overview

### 1. **Active Funds Filtering**
- Only active funds (with recent NAV data) are displayed
- MongoDB stores fund data with `isActive` flag
- API automatically filters inactive funds

### 2. **Daily Data Updates (Cron Job)**
- Runs daily at 7:00 AM
- Fetches latest fund data from MF API
- Updates MongoDB with NAV history
- Marks funds as active/inactive based on latest NAV date
- Manual trigger available at: `POST /api/cron/trigger`

### 3. **Watchlist Feature**
- Navigate to `/watchlist`
- Add funds from scheme detail page
- Track performance: 1 Day, 1 Month, 3 Months, 6 Months, 1 Year
- Color-coded returns (green for positive, red for negative)

### 4. **Virtual Portfolio**
- Navigate to `/virtual-portfolio`
- Create virtual SIP investments
- Simulates investment growth over time
- Tracks total invested, current value, and returns
- Supports daily, weekly, and monthly SIP frequencies

### 5. **Existing Features (Enhanced)**
- Fund listing with pagination and search
- Scheme details with NAV charts
- SIP and SWP calculators
- Returns calculation for multiple periods

## API Endpoints

### Funds
- `GET /api/mf` - List all active funds (with pagination)
- `GET /api/scheme/:code` - Get scheme details
- `GET /api/scheme/:code/returns` - Calculate returns
- `POST /api/scheme/:code/sip` - Calculate SIP
- `POST /api/scheme/:code/swp` - Calculate SWP

### Watchlist
- `GET /api/watchlist` - Get user watchlist
- `POST /api/watchlist` - Add fund to watchlist
- `DELETE /api/watchlist/:code` - Remove from watchlist
- `GET /api/watchlist/performance?schemeCode=:code` - Get performance metrics

### Virtual Portfolio
- `GET /api/virtual-portfolio` - Get user portfolio
- `POST /api/virtual-portfolio` - Create virtual SIP
- `DELETE /api/virtual-portfolio/:id` - Remove SIP

### Cron Jobs
- `GET /api/cron/init` - Initialize cron jobs
- `POST /api/cron/trigger` - Manually trigger data update

## Database Collections

### funds
- Stores all mutual fund schemes
- Fields: schemeCode, schemeName, fundHouse, category, navHistory, isActive, etc.

### watchlist
- User's watchlist items
- Fields: userId, schemeCode, addedDate

### virtual_portfolio
- User's virtual SIP investments
- Fields: userId, schemeCode, amount, frequency, startDate, endDate, returns, etc.

## Initial Data Population

To populate the database with fund data, you can:

1. **Wait for the cron job** (runs at 7:00 AM daily)
2. **Manually trigger** the update:
   ```bash
   curl -X POST http://localhost:3000/api/cron/trigger
   ```

Note: The initial data population may take 10-30 minutes depending on the number of funds.

## User Management

Currently uses a default user (`default-user`) for simplicity. In production:
- Implement authentication (NextAuth.js, Auth0, etc.)
- Replace `userId: 'default-user'` with actual user sessions
- Add user-specific routes and permissions

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variable: `MONGODB_URI`
4. Deploy

Note: Cron jobs on Vercel require Vercel Cron (paid feature) or use external cron services.

### Alternative: Railway, Render, or DigitalOcean
- Set environment variables
- Ensure MongoDB connection is accessible
- Cron jobs will work natively

## Troubleshooting

### MongoDB Connection Issues
- Verify `MONGODB_URI` in `.env.local`
- Check MongoDB Atlas IP whitelist (allow all: 0.0.0.0/0)
- Ensure database user has read/write permissions

### Cron Job Not Running
- Check server logs for cron initialization
- Manually trigger: `POST /api/cron/trigger`
- Verify node-cron is installed

### Data Not Loading
- Check if MongoDB has data (use MongoDB Compass)
- Verify API routes are accessible
- Check browser console for errors

## Tech Stack

- **Frontend**: Next.js 14, React 18, Material UI v5
- **Backend**: Next.js API Routes
- **Database**: MongoDB (Mongoose)
- **Charts**: Recharts
- **Data Fetching**: SWR
- **Cron Jobs**: node-cron
- **Styling**: MUI with custom pastel theme

## Performance Optimization

- In-memory caching (12-24 hour TTL)
- MongoDB indexes on frequently queried fields
- Pagination for large datasets
- Lazy loading and skeletons for better UX

## Future Enhancements

- User authentication and authorization
- Email notifications for watchlist alerts
- Export portfolio to PDF/Excel
- Compare multiple funds side-by-side
- Advanced filtering (by category, returns, etc.)
- Mobile app (React Native)
