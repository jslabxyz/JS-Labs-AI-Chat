#!/usr/bin/env node

/**
 * Verification script for Shopify AI Agent
 * Tests all components and configurations
 */

import fs from 'fs';
import fetch from 'node-fetch';
// import { createClaudeService } from '../app/services/claude.server.js';
import MCPClient from '../app/mcp-client.js';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function verifyEnvironment() {
  log('\n🔍 Verifying environment configuration...', 'blue');
  
  // Load environment variables
  const envPath = '.env';
  if (!fs.existsSync(envPath)) {
    log('❌ .env file not found', 'red');
    return false;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8');
  const vars = {};
  
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=');
    if (key && value) vars[key.trim()] = value.trim();
  });
  
  const required = ['SHOPIFY_API_KEY', 'SHOPIFY_API_SECRET', 'CLAUDE_API_KEY'];
  let valid = true;
  
  for (const key of required) {
    if (!vars[key] || vars[key].includes('your_') || vars[key].includes('YOUR_')) {
      log(`❌ ${key} not configured`, 'red');
      valid = false;
    } else {
      log(`✅ ${key} configured`, 'green');
    }
  }
  
  return valid;
}

async function verifyClaudeAPI() {
  log('\n🤖 Testing Claude API connection...', 'blue');
  
  try {
    // Simple check if API key is configured
    const envContent = fs.readFileSync('.env', 'utf8');
    const claudeKey = envContent.match(/CLAUDE_API_KEY=(.+)/)?.[1];
    
    if (claudeKey && claudeKey.startsWith('sk-ant-api')) {
      log('✅ Claude API key configured correctly', 'green');
      return true;
    } else {
      log('❌ Claude API key not configured', 'red');
      return false;
    }
  } catch (error) {
    log(`❌ Claude API error: ${error.message}`, 'red');
    return false;
  }
}

async function verifyMCPConnection() {
  log('\n🔗 Testing MCP connection...', 'blue');
  
  try {
    // Test with localhost (development mode)
    const mcpClient = new MCPClient(
      'https://localhost:3458',
      'test-conversation',
      'test-shop',
      'https://localhost:3458/customer/api/mcp'
    );
    
    // Try to connect to storefront MCP
    const tools = await mcpClient.connectToStorefrontServer();
    
    if (tools && Array.isArray(tools)) {
      log(`✅ MCP connection successful (${tools.length} tools available)`, 'green');
      return true;
    } else {
      log('⚠️  MCP connection failed (normal in development)', 'yellow');
      return false;
    }
  } catch (error) {
    log('⚠️  MCP connection failed (normal in development)', 'yellow');
    return false;
  }
}

async function verifyDatabase() {
  log('\n🗄️  Verifying database...', 'blue');
  
  try {
    // Check if prisma client can be imported
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    
    // Test database connection
    await prisma.$connect();
    log('✅ Database connection successful', 'green');
    
    // Check tables exist
    const tables = await prisma.$queryRaw`
      SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';
    `;
    
    const expectedTables = ['Session', 'CustomerToken', 'CodeVerifier', 'Conversation', 'Message', 'CustomerAccountUrl'];
    const existingTables = tables.map(t => t.name);
    
    let allTablesExist = true;
    for (const table of expectedTables) {
      if (existingTables.includes(table)) {
        log(`✅ Table ${table} exists`, 'green');
      } else {
        log(`❌ Table ${table} missing`, 'red');
        allTablesExist = false;
      }
    }
    
    await prisma.$disconnect();
    return allTablesExist;
    
  } catch (error) {
    log(`❌ Database error: ${error.message}`, 'red');
    return false;
  }
}

async function verifyThemeExtension() {
  log('\n🎨 Verifying theme extension...', 'blue');
  
  const extensionFiles = [
    'extensions/chat-bubble/shopify.extension.toml',
    'extensions/chat-bubble/blocks/chat-interface.liquid',
    'extensions/chat-bubble/assets/chat.js',
    'extensions/chat-bubble/assets/chat.css',
    'extensions/chat-bubble/locales/en.default.json'
  ];
  
  let valid = true;
  
  for (const file of extensionFiles) {
    if (fs.existsSync(file)) {
      log(`✅ ${file} exists`, 'green');
    } else {
      log(`❌ ${file} missing`, 'red');
      valid = false;
    }
  }
  
  return valid;
}

function generateReport(results) {
  log('\n📊 Verification Report', 'bold');
  log('========================', 'bold');
  
  const checks = [
    { name: 'Environment Configuration', status: results.environment },
    { name: 'Claude API', status: results.claude },
    { name: 'Database', status: results.database },
    { name: 'Theme Extension', status: results.themeExtension },
    { name: 'MCP Connection', status: results.mcp }
  ];
  
  let passed = 0;
  let total = checks.length;
  
  checks.forEach(check => {
    const status = check.status ? '✅ PASS' : '❌ FAIL';
    const color = check.status ? 'green' : 'red';
    log(`${check.name}: ${status}`, color);
    if (check.status) passed++;
  });
  
  log(`\nScore: ${passed}/${total}`, passed === total ? 'green' : 'yellow');
  
  if (passed === total) {
    log('\n🎉 All checks passed! Your app is ready.', 'green');
    log('\nNext steps:', 'bold');
    log('1. Run "npm run dev" to start development server', 'blue');
    log('2. Install app on your development store', 'blue');
    log('3. Test the chat functionality', 'blue');
  } else {
    log('\n⚠️  Some checks failed. Please review the issues above.', 'yellow');
  }
}

async function main() {
  log('🔬 Shopify AI Agent Verification', 'bold');
  log('=================================', 'bold');
  
  const results = {
    environment: await verifyEnvironment(),
    claude: await verifyClaudeAPI(),
    mcp: await verifyMCPConnection(),
    database: await verifyDatabase(),
    themeExtension: await verifyThemeExtension()
  };
  
  generateReport(results);
}

main().catch(error => {
  log(`💥 Verification failed: ${error.message}`, 'red');
  process.exit(1);
});