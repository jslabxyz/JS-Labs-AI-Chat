# Shopify AI Agent Setup Guide

## Quick Start Checklist

### 1. Prerequisites
- [ ] Node.js 18+ installed
- [ ] Shopify Partner account created
- [ ] Claude API key obtained
- [ ] Development store created

### 2. Initial Setup
```bash
# Clone and install dependencies
npm install

# Copy environment template
cp .env.example .env

# Setup database
npm run setup
```

### 3. Environment Configuration

Edit `.env` with your credentials:

```bash
# Get these from your Shopify Partner Dashboard > Apps > [Your App]
SHOPIFY_API_KEY=your_actual_api_key
SHOPIFY_API_SECRET=your_actual_api_secret

# Get this from https://console.anthropic.com
CLAUDE_API_KEY=your_actual_claude_key

# Database (SQLite for development)
DATABASE_URL=file:dev.sqlite

# These will be auto-updated when you run `npm run dev`
SHOPIFY_APP_URL=https://your-ngrok-url.ngrok.io
HOST=https://your-ngrok-url.ngrok.io
```

### 4. Shopify Partner Dashboard Setup

#### Create New App:
1. Go to https://partners.shopify.com
2. Click "Apps" → "Create app" → "Create app manually"
3. Fill in:
   - **App name**: AI Chat Assistant
   - **App URL**: `https://your-ngrok-url.ngrok.io` (get this after running `npm run dev`)
   - **Allowed redirection URLs**: `https://your-ngrok-url.ngrok.io/auth/callback`

#### Configure App Settings:
1. **App setup** tab:
   - Add your ngrok URL to "App URL"
   - Add callback URL to "Allowed redirection URLs"

2. **App distribution** tab:
   - Select "Unlisted" for development

### 5. Development Server

```bash
# Start the development server
npm run dev
```

This will:
- Start Remix server on port 3000
- Launch ngrok tunnel (free tier)
- Display installation URL
- Auto-update your .env file with tunnel URL

### 6. Install on Development Store

1. Copy the installation URL from terminal
2. Open in browser
3. Select your development store
4. Grant permissions when prompted

### 7. Add Theme Extension

After app installation:

```bash
# Deploy theme extension
npm run deploy
```

Then in your store admin:
1. Go to Online Store → Themes
2. Click "Customize" on your active theme
3. Add the "AI Chat Assistant" block
4. Configure settings (bubble color, welcome message, etc.)
5. Save changes

## Configuration Options

### System Prompts
Edit `app/prompts/prompts.json` to customize AI behavior:
- `standardAssistant`: Default helpful assistant
- `enthusiasticAssistant`: More energetic personality

### Chat Settings
In `app/services/config.server.js`:
- Model selection (claude-3-5-sonnet-latest)
- Token limits
- Error messages

### Theme Extension Settings
Available in theme customizer:
- Chat bubble color
- Welcome message
- System prompt selection

## Testing

### 1. Basic Chat Test
- Open your store
- Click the chat bubble
- Send: "Hi"
- Should get AI response

### 2. Product Search Test
- Send: "search for products"
- Should use MCP tools and show product results

### 3. Cart Operations Test
- Send: "add [product name] to my cart"
- Should create/update cart and offer checkout

### 4. Customer Account Test (requires customer login)
- Send: "show my recent orders"
- Should prompt for authentication if not logged in

## Troubleshooting

### Common Issues:

1. **"Missing API key" errors**
   - Check `.env` file has correct CLAUDE_API_KEY
   - Verify key is active in Anthropic console

2. **Shopify authentication fails**
   - Verify ngrok URL matches in Partner Dashboard
   - Check SHOPIFY_API_KEY and SHOPIFY_API_SECRET are correct
   - Ensure callback URL is properly configured

3. **MCP tools not working**
   - Check network connectivity
   - Verify store has products/customers to search
   - Check browser dev tools for API errors

4. **Theme extension not showing**
   - Verify extension was deployed: `npm run deploy`
   - Check theme customizer for the block
   - Ensure block is added to theme and published

### Debug Mode:
Set `NODE_ENV=development` in `.env` for detailed logging.

## Production Deployment

When ready for production:

1. **Update environment variables** for production URLs
2. **Deploy to hosting platform** (Railway, Heroku, etc.)
3. **Update Shopify app URLs** in Partner Dashboard
4. **Submit for app review** if distributing publicly

## Support

- Check the [Shopify App Development docs](https://shopify.dev/docs/apps)
- Review [Claude API documentation](https://docs.anthropic.com/)
- Check GitHub issues for common problems