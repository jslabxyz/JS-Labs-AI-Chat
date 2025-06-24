# 🧪 Testing Guide

## MCP Tools Testing

### Available MCP Tools

Your AI agent integrates with these Shopify MCP tools:

#### Storefront Tools:
- `search_shop_catalog` - Search products in store
- `get_cart` - Retrieve current cart contents  
- `update_cart` - Add/remove items from cart
- `search_shop_policies_and_faqs` - Search store policies

#### Customer Tools (require authentication):
- `get_most_recent_order_status` - Get recent orders
- `get_order_status` - Get specific order details
- `initiate_return` - Start return process

### Test Scenarios

#### 1. Basic Chat Functionality

**Test:** Simple conversation
```
User: "Hi there!"
Expected: Friendly greeting response from AI
```

**Test:** Product inquiry
```
User: "What products do you have?"
Expected: AI suggests using search or asks for specifics
```

#### 2. Product Search Testing

**Test:** General search
```
User: "search for products"
Expected: 
- Tool use message appears
- Product results displayed in cards
- Maximum 3 products shown
```

**Test:** Specific product search
```
User: "search for snowboards"
Expected:
- search_shop_catalog tool called
- Relevant snowboard products returned
- Product cards with images, prices, titles
```

**Test:** No results search
```
User: "search for unicorns"
Expected:
- Tool called successfully
- "No products found" message
- AI explains no matching products
```

#### 3. Cart Operations Testing

**Test:** Add product to cart
```
User: "add The Videographer Snowboard to my cart"
Expected:
- update_cart tool called
- Success confirmation
- Checkout link provided
```

**Test:** View cart contents
```
User: "what's in my cart?"
Expected:
- get_cart tool called
- Cart contents displayed
- Total price shown
```

**Test:** Update cart quantity
```
User: "update my cart to make that 2 items please"
Expected:
- update_cart tool called with quantity
- Updated cart totals
- New checkout link
```

#### 4. Policy Search Testing

**Test:** Store policy inquiry
```
User: "what is your return policy?"
Expected:
- search_shop_policies_and_faqs tool called
- Relevant policy information returned
- Clear, formatted response
```

**Test:** Shipping information
```
User: "what countries do you ship to?"
Expected:
- Policy search tool used
- Shipping information provided
```

#### 5. Customer Account Testing

**Test:** Order status (unauthenticated)
```
User: "show me my recent orders"
Expected:
- Authentication prompt appears
- Auth URL provided as clickable link
- Popup window opens for OAuth
```

**Test:** Order status (authenticated)
```
User: "show me my recent orders"
Expected:
- get_most_recent_order_status tool called
- Order information displayed
- Order numbers, dates, status shown
```

**Test:** Specific order lookup
```
User: "tell me about order #1001"
Expected:
- get_order_status tool called
- Detailed order information
- Line items, shipping, status
```

## Authentication Flow Testing

### OAuth Flow Test

1. **Trigger auth requirement:**
   ```
   User: "show my orders"
   ```

2. **Verify auth prompt:**
   - Auth message appears
   - Clickable auth link present
   - Link opens in popup window

3. **Complete OAuth:**
   - Shopify customer login screen
   - Permission grant screen
   - Successful redirect

4. **Verify auth completion:**
   - Popup closes automatically
   - "Authorization successful" message
   - Original request resumes
   - Order data displayed

5. **Test persistent auth:**
   - Refresh page
   - Try another authenticated request
   - Should work without re-auth

## Error Handling Testing

### API Error Scenarios

**Test:** Invalid Claude API key
```
Expected: Graceful error message, no crash
```

**Test:** Rate limit exceeded
```
Expected: Rate limit message, retry suggestion
```

**Test:** Network connectivity issues
```
Expected: Connection error message, fallback response
```

### MCP Error Scenarios

**Test:** MCP server unavailable
```
Expected: Tool use fails gracefully, AI explains issue
```

**Test:** Invalid tool arguments
```
Expected: Tool error handled, AI recovers
```

## Performance Testing

### Response Time Testing

Monitor these metrics:
- **Initial response time**: < 2 seconds
- **Streaming chunk delivery**: < 500ms intervals
- **Tool execution time**: < 5 seconds
- **Authentication flow**: < 30 seconds

### Load Testing

Use tools like Artillery to test:
- **Concurrent conversations**: 10+ simultaneous users
- **Message throughput**: Messages per second
- **Database performance**: Query response times

### Memory Testing

Monitor for:
- **Memory leaks**: Long-running conversations
- **Connection pooling**: Database connections
- **Cleanup**: Completed conversations

## Browser Compatibility Testing

### Desktop Browsers
- ✅ Chrome (latest)
- ✅ Firefox (latest)  
- ✅ Safari (latest)
- ✅ Edge (latest)

### Mobile Browsers
- ✅ iOS Safari
- ✅ Android Chrome
- ✅ Samsung Internet

### Responsive Design Testing

Test different screen sizes:
- **Desktop**: 1920x1080, 1366x768
- **Tablet**: 768x1024, 834x1194
- **Mobile**: 375x667, 414x896

## Test Automation

### Automated Test Script

Create `test-chat.js`:

```javascript
// Basic automated testing
const testScenarios = [
  {
    input: "Hi",
    expectContains: ["hello", "help", "how can"]
  },
  {
    input: "search for products", 
    expectTool: "search_shop_catalog",
    expectProducts: true
  },
  {
    input: "add first product to cart",
    expectTool: "update_cart",
    expectContains: ["cart", "checkout"]
  }
];

// Run tests
await runTestScenarios(testScenarios);
```

### Manual Testing Checklist

#### Pre-deployment:
- [ ] All MCP tools work
- [ ] Authentication flow works
- [ ] Product cards display correctly
- [ ] Mobile interface responsive
- [ ] Error handling graceful
- [ ] Conversation history persists

#### Post-deployment:
- [ ] SSL certificate valid
- [ ] Chat bubble appears on store
- [ ] All URLs resolve correctly
- [ ] Database connections stable
- [ ] Performance within targets

## Debugging Tools

### Browser Developer Tools
- **Console**: Check for JavaScript errors
- **Network**: Monitor API requests
- **Elements**: Inspect chat UI components
- **Application**: Check local storage, session data

### Server-side Debugging
- **Logs**: Check Remix server logs
- **Database**: Query conversation/message tables
- **Claude API**: Verify API calls and responses
- **MCP**: Test tool calls directly

### Common Issues & Solutions

1. **Chat not appearing:**
   - Check theme extension deployment
   - Verify JavaScript loads correctly
   - Check for CSS conflicts

2. **Authentication fails:**
   - Verify redirect URLs in Partner Dashboard
   - Check API key/secret configuration
   - Test OAuth flow step by step

3. **Tools not working:**
   - Check MCP server connectivity
   - Verify tool arguments format
   - Test network connectivity

4. **Poor performance:**
   - Check database query performance
   - Monitor API response times
   - Review server resource usage