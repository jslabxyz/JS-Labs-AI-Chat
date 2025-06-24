#!/usr/bin/env node

/**
 * Setup script for Shopify AI Agent
 * Handles initial configuration and validation
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

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

function checkPrerequisites() {
  log('\n🔍 Checking prerequisites...', 'blue');
  
  // Check Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  
  if (majorVersion < 18) {
    log(`❌ Node.js 18+ required. Current version: ${nodeVersion}`, 'red');
    process.exit(1);
  }
  log(`✅ Node.js ${nodeVersion}`, 'green');
  
  // Check for required files
  const requiredFiles = ['package.json', 'prisma/schema.prisma'];
  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      log(`❌ Missing required file: ${file}`, 'red');
      process.exit(1);
    }
  }
  log('✅ Required files present', 'green');
}

function setupEnvironment() {
  log('\n📝 Setting up environment...', 'blue');
  
  // Create .env if it doesn't exist
  if (!fs.existsSync('.env')) {
    if (fs.existsSync('.env.example')) {
      fs.copyFileSync('.env.example', '.env');
      log('✅ Created .env from template', 'green');
      log('⚠️  Please edit .env with your actual credentials', 'yellow');
    } else {
      log('❌ No .env.example found', 'red');
      process.exit(1);
    }
  } else {
    log('✅ .env file exists', 'green');
  }
  
  // Validate environment variables
  const envContent = fs.readFileSync('.env', 'utf8');
  const requiredVars = [
    'SHOPIFY_API_KEY',
    'SHOPIFY_API_SECRET', 
    'CLAUDE_API_KEY',
    'DATABASE_URL'
  ];
  
  const missingVars = requiredVars.filter(variable => {
    return !envContent.includes(`${variable}=`) || 
           envContent.includes(`${variable}=your_`) ||
           envContent.includes(`${variable}=YOUR_`);
  });
  
  if (missingVars.length > 0) {
    log('⚠️  The following environment variables need to be configured:', 'yellow');
    missingVars.forEach(variable => {
      log(`   - ${variable}`, 'yellow');
    });
    log('\nPlease edit .env with your actual credentials before continuing.', 'yellow');
  }
}

function setupDatabase() {
  log('\n🗄️  Setting up database...', 'blue');
  
  try {
    // Generate Prisma client
    log('Generating Prisma client...', 'blue');
    execSync('npx prisma generate', { stdio: 'inherit' });
    log('✅ Prisma client generated', 'green');
    
    // Run migrations
    log('Running database migrations...', 'blue');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    log('✅ Database migrations completed', 'green');
    
  } catch (error) {
    log(`❌ Database setup failed: ${error.message}`, 'red');
    process.exit(1);
  }
}

function installDependencies() {
  log('\n📦 Installing dependencies...', 'blue');
  
  try {
    execSync('npm install', { stdio: 'inherit' });
    log('✅ Dependencies installed', 'green');
  } catch (error) {
    log(`❌ Failed to install dependencies: ${error.message}`, 'red');
    process.exit(1);
  }
}

function displayNextSteps() {
  log('\n🎉 Setup completed successfully!', 'green');
  log('\n📋 Next steps:', 'bold');
  log('1. Edit .env with your actual API keys and credentials', 'blue');
  log('2. Create a Shopify app in your Partner Dashboard', 'blue');
  log('3. Run "npm run dev" to start the development server', 'blue');
  log('4. Install the app on your development store', 'blue');
  log('5. Deploy the theme extension with "npm run deploy"', 'blue');
  log('\nFor detailed instructions, see SETUP.md', 'yellow');
}

function main() {
  log('🚀 Shopify AI Agent Setup', 'bold');
  log('================================', 'bold');
  
  checkPrerequisites();
  installDependencies();
  setupEnvironment();
  setupDatabase();
  displayNextSteps();
}

main();