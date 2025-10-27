# Vercel Deployment Setup for Handwriting Notes

## Prerequisites
- A Vercel account
- An Upstash account (for Redis KV storage)

## Step-by-Step Setup

### 1. Set Up Upstash Redis (Option A: Via Vercel)

1. Go to your Vercel project dashboard
2. Navigate to the **Storage** tab
3. Click **Create Database**
4. Select **KV** (Upstash Redis)
5. Follow the prompts to create a new Redis instance
6. Vercel will automatically set these environment variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

### 1. Set Up Upstash Redis (Option B: Manual)

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create a new Redis database
3. Select the **REST API** tab
4. Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
5. Add these to Vercel as `KV_REST_API_URL` and `KV_REST_API_TOKEN`

### 2. Set Up Editor Secret

1. Generate a strong random secret:
   ```bash
   openssl rand -base64 32
   ```

2. Go to your Vercel project settings
3. Navigate to **Settings** → **Environment Variables**
4. Add a new variable:
   - **Name**: `EDITOR_SECRET`
   - **Value**: Your generated secret
   - **Environments**: Select all (Production, Preview, Development)
5. Click **Save**

### 3. Redeploy Your Application

After adding the environment variables:
1. Go to **Deployments** tab
2. Click the three dots on the latest deployment
3. Select **Redeploy**

Or push a new commit to trigger a deployment.

## Verification

After deployment:

1. Visit your deployed site
2. Navigate to `/notebooks` to create a new notebook
3. Add an ink section and draw something
4. Wait 2 seconds for auto-save (or click "Save Notebook")
5. Refresh the page - your drawing should persist!

## Troubleshooting

### Issue: "Notebook not saved" or "Save Failed"

**Check browser console for errors:**
- `EDITOR_SECRET environment variable is not set!` → Add `EDITOR_SECRET` to Vercel
- `403 Forbidden` → Check that the secret stored in localStorage matches `EDITOR_SECRET`
- Network errors → Check Upstash Redis credentials

**Check Vercel deployment logs:**
```bash
vercel logs
```

### Issue: "Cannot read properties of undefined"

This likely means Redis environment variables are missing:
- Verify `KV_REST_API_URL` is set in Vercel
- Verify `KV_REST_API_TOKEN` is set in Vercel

### Issue: Drawings disappear after refresh

**Possible causes:**
1. Environment variables not set on Vercel
2. Editor secret mismatch (check localStorage)
3. Network failure during save (check browser network tab)

**Solution:**
1. Check browser DevTools → Application → Local Storage
2. Look for `notebook_{id}_secret`
3. This should match your `EDITOR_SECRET` on Vercel

## Local Development

For local development, create a `.env` file in the project root:

```env
KV_REST_API_URL=https://your-redis-instance.upstash.io
KV_REST_API_TOKEN=your-token-here
EDITOR_SECRET=your-secret-here
```

**Note**: Never commit your `.env` file to version control!

## Security Notes

⚠️ **Important**: The current authentication system is a placeholder and **NOT SECURE FOR PRODUCTION**:

- Single shared secret for all notebooks
- No user authentication
- No per-notebook access control
- Secret stored in browser localStorage

For production use, implement:
- Proper user authentication (OAuth, JWT)
- Per-notebook access tokens
- Server-side session management
- Rate limiting on API endpoints

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `KV_REST_API_URL` | Yes | Upstash Redis REST API URL |
| `KV_REST_API_TOKEN` | Yes | Upstash Redis REST API token |
| `EDITOR_SECRET` | Yes | Secret key for notebook editing (should be private) |

## Next Steps

After successful deployment:
1. Test creating and saving notebooks
2. Verify persistence across page refreshes
3. Consider implementing proper authentication
4. Set up monitoring and error tracking
5. Add rate limiting to API endpoints
