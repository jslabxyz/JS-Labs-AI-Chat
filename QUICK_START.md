# 🚀 Quick Start Guide

## Get Your AI Agent Running in 10 Minutes

### Step 1: Get Your API Keys (5 minutes)

#### Claude API Key:
1. Go to https://console.anthropic.com
2. Sign up/login
3. Go to "API Keys" → "Create Key"
4. Copy your API key

#### Shopify Partner Setup:
1. Go to https://partners.shopify.com
2. Sign up/login to Partner Dashboard
3. Click "Apps" → "Create app" → "Create app manually"
4. **Don't fill in URLs yet** - we'll do this after setup

### Step 2: Setup Your Project (3 minutes)

```bash
# Install dependencies and setup
npm run setup

# Edit your environment file
cp .env.example .env
```

Edit `.env` with your keys:
```bash
CLAUDE_API_KEY=your_claude_key_here
SHOPIFY_API_KEY=your_shopify_api_key_here  # Get from Partner Dashboard
SHOPIFY_API_SECRET=your_shopify_secret_here  # Get from Partner Dashboard
```

### Step 3: Start Development (1 minute)

```bash
npm run dev
```

This will:
- ✅ Start your local server
- ✅ Create an ngrok tunnel
- ✅ Show you the installation URL
- ✅ Auto-update your .env with the tunnel URL

### Step 4: Configure Shopify App (1 minute)

1. **Copy the ngrok URL** from your terminal (looks like `https://abc123.ngrok.io`)
2. **Go back to your Shopify Partner Dashboard**
3. **In your app settings:**
   - App URL: `https://abc123.ngrok.io`
   - Allowed redirection URLs: `https://abc123.ngrok.io/auth/callback`
4. **Copy your API key and secret** to your `.env` file

### Step 5: Install & Test (30 seconds)

1. **Use the installation URL** from your terminal
2. **Install on your development store**
3. **Test the chat**: Open your store and look for the chat bubble!

## 🎉 That's it!

Your AI chat agent is now running. Try these commands:
- "Hi" - Basic chat
- "Search for products" - Product search
- "Add [product name] to cart" - Cart operations

## Next Steps

- **Deploy theme extension**: `npm run deploy`
- **Customize prompts**: Edit `app/prompts/prompts.json`
- **Verify setup**: `npm run verify`

## Troubleshooting

**Chat not working?**
- Check browser console for errors
- Verify Claude API key is correct
- Run `npm run verify` to check configuration

**Can't install app?**
- Make sure ngrok URL matches in Partner Dashboard
- Check API key/secret are correct
- Restart `npm run dev` if ngrok URL changed

**Need help?** Check `SETUP.md` for detailed instructions.