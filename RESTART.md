# How to Properly Restart the Server

Follow these steps to ensure all new API routes are loaded:

1. **Stop the server completely** (Ctrl+C in terminal)

2. **Delete the .next cache folder**:
   ```bash
   Remove-Item -Recurse -Force .next
   ```

3. **Start the server fresh**:
   ```bash
   npm run dev
   ```

4. **Wait for compilation** to complete (you'll see "Ready in X seconds")

5. **Test the watchlist API** by visiting:
   ```
   http://localhost:3000/api/watchlist
   ```

This should return an empty watchlist: `{"watchlist":[]}`
