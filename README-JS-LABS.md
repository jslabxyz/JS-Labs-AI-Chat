# JS Labs AI Chat

A powerful, context-aware AI shopping assistant for Shopify stores powered by OpenAI and Model Context Protocol (MCP) tools.

## 🚀 Features

- **Context-Aware Intelligence**: Detects what page customers are viewing and provides relevant assistance
- **Product Search & Discovery**: Advanced catalog search with real-time product information
- **Cart Management**: Add, remove, and manage cart items through natural conversation
- **Order Tracking**: Help customers track orders and initiate returns
- **Store Policies**: Answer questions about shipping, returns, and store policies
- **Real-time Streaming**: Fast, responsive chat experience with typing indicators
- **Mobile Responsive**: Beautiful UI that works on all devices

## 🛠 Technology Stack

- **Backend**: Remix (React framework)
- **AI**: OpenAI GPT-4 with function calling
- **Database**: SQLite with Prisma ORM
- **Integration**: Shopify MCP (Model Context Protocol)
- **Styling**: Custom CSS with mobile-first design

## 📋 Prerequisites

- Node.js 18+ 
- NPM or Yarn
- Shopify Partner Account
- OpenAI API Key
- Shopify Store (for testing)

## 🚀 Quick Start

### 1. Environment Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/JS-Labs-AI-Chat.git
cd JS-Labs-AI-Chat

# Install dependencies
npm install

# Copy environment template
cp .env.example .env
```

### 2. Configure Environment Variables

Edit `.env` file:

```env
# Shopify App Configuration
SHOPIFY_API_KEY=your_shopify_api_key
SHOPIFY_API_SECRET=your_shopify_api_secret

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Database
DATABASE_URL="file:./dev.sqlite"

# App URLs
SHOPIFY_APP_URL=http://localhost:3000
```

### 3. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Create database
npx prisma db push
```

### 4. Start Development Server

```bash
npm run dev
```

Your app will be available at `http://localhost:3000`

## 🎯 Implementation Guide

### Shopify Store Integration

1. **Create Shopify App**:
   - Go to your Shopify Partner Dashboard
   - Create a new app with your local development URL
   - Configure OAuth scopes: `read_products`, `read_orders`, `write_cart`

2. **Install Chat Widget**:
   - Copy the code from `enhanced-chat-widget.html`
   - Add to your theme's `theme.liquid` before `</body>`
   - Update the API endpoint URL to match your deployment

3. **Test Integration**:
   - Visit your store
   - Look for the chat bubble in the bottom right
   - Test various queries like "show me products", "what's in my cart"

### Chat Widget Configuration

The chat widget automatically detects:
- **Product pages**: Offers help with the current product
- **Collection pages**: Suggests related products
- **Cart page**: Helps with cart management
- **Search pages**: Assists with finding products

## 🧪 Testing

Run the test suite:

```bash
# Run all tests
npm test

# Test widget functionality
open public/test-widget.html
```

## 📦 Deployment

### Production Deployment

1. **Environment Setup**:
   ```bash
   # Set production environment variables
   export OPENAI_API_KEY="your_production_key"
   export SHOPIFY_API_KEY="your_production_key"
   export SHOPIFY_API_SECRET="your_production_secret"
   ```

2. **Build and Deploy**:
   ```bash
   # Build for production
   npm run build
   
   # Start production server
   npm start
   ```

3. **Update Chat Widget**:
   - Update the API endpoint in your chat widget
   - Replace `localhost:3000` with your production URL

## 🔧 Configuration

### AI Prompts

Customize AI behavior in `app/prompts/prompts.json`:

```json
{
  "systemPrompts": {
    "standardAssistant": {
      "content": "Your custom prompt here...",
      "version": "1.0"
    }
  }
}
```

### Chat Widget Styling

Modify the CSS in `enhanced-chat-widget.html` to match your brand:

```css
:root {
  --primary-color: #5046e4;  /* Your brand color */
  --chat-width: 450px;       /* Chat window width */
}
```

## 🛡 Security Considerations

- **API Keys**: Never commit API keys to version control
- **CORS**: Configure proper CORS headers for production
- **Rate Limiting**: Implement rate limiting for the chat endpoint
- **Input Validation**: Sanitize all user inputs

## 💡 Key Examples

- `hi` → Context-aware greeting with page-specific help
- `can you search for snowboards` → Uses `search_shop_catalog` MCP tool
- `add The Videographer Snowboard to my cart` → Uses `update_cart` MCP tool
- `what's in my cart` → Uses `get_cart` MCP tool
- `what languages is your store available in?` → Uses `search_shop_policies_and_faqs` MCP tool
- `Show me my recent orders` → Uses `get_most_recent_order_status` MCP tool

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Shopify App Development](https://shopify.dev/apps)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Model Context Protocol](https://modelcontextprotocol.io/)

## 💡 Support

For support, please open an issue on GitHub or contact the development team.

---

Built with ❤️ by JS Labs