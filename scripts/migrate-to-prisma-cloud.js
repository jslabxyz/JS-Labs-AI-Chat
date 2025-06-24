#!/usr/bin/env node

/**
 * Migration Script: SQLite to Prisma Cloud
 * 
 * This script helps migrate data from local SQLite database to Prisma Cloud PostgreSQL
 * 
 * Usage:
 *   node scripts/migrate-to-prisma-cloud.js
 * 
 * Prerequisites:
 *   1. Prisma Cloud account set up
 *   2. New DATABASE_URL configured for Prisma Cloud
 *   3. Both old and new databases accessible
 */

import { PrismaClient } from '@prisma/client';
import { readFile } from 'fs/promises';
import { join } from 'path';

// Configuration
const OLD_DATABASE_URL = 'file:dev.sqlite';
const NEW_DATABASE_URL = process.env.DATABASE_URL;

if (!NEW_DATABASE_URL || NEW_DATABASE_URL.includes('sqlite')) {
  console.error('❌ Please set DATABASE_URL to your Prisma Cloud connection string');
  process.exit(1);
}

// Initialize Prisma clients
const oldPrisma = new PrismaClient({
  datasources: {
    db: {
      url: OLD_DATABASE_URL
    }
  }
});

const newPrisma = new PrismaClient({
  datasources: {
    db: {
      url: NEW_DATABASE_URL
    }
  }
});

/**
 * Main migration function
 */
async function migrate() {
  console.log('🚀 Starting migration from SQLite to Prisma Cloud...\n');

  try {
    // Test connections
    console.log('🔍 Testing database connections...');
    await testConnections();
    
    // Migrate data
    console.log('📊 Migrating data...');
    await migrateData();
    
    // Verify migration
    console.log('✅ Verifying migration...');
    await verifyMigration();
    
    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await oldPrisma.$disconnect();
    await newPrisma.$disconnect();
  }
}

/**
 * Test database connections
 */
async function testConnections() {
  try {
    await oldPrisma.$connect();
    console.log('  ✅ Connected to SQLite database');
  } catch (error) {
    throw new Error(`Cannot connect to SQLite database: ${error.message}`);
  }

  try {
    await newPrisma.$connect();
    console.log('  ✅ Connected to Prisma Cloud database');
  } catch (error) {
    throw new Error(`Cannot connect to Prisma Cloud database: ${error.message}`);
  }
  
  console.log();
}

/**
 * Migrate all data from old to new database
 */
async function migrateData() {
  // Migrate Sessions
  await migrateTable('Session', async () => {
    const sessions = await oldPrisma.session.findMany();
    console.log(`  📄 Found ${sessions.length} sessions to migrate`);
    
    for (const session of sessions) {
      await newPrisma.session.upsert({
        where: { id: session.id },
        update: session,
        create: session
      });
    }
    return sessions.length;
  });

  // Migrate Conversations
  await migrateTable('Conversation', async () => {
    const conversations = await oldPrisma.conversation.findMany();
    console.log(`  📄 Found ${conversations.length} conversations to migrate`);
    
    for (const conversation of conversations) {
      await newPrisma.conversation.upsert({
        where: { id: conversation.id },
        update: conversation,
        create: conversation
      });
    }
    return conversations.length;
  });

  // Migrate Messages
  await migrateTable('Message', async () => {
    const messages = await oldPrisma.message.findMany();
    console.log(`  📄 Found ${messages.length} messages to migrate`);
    
    for (const message of messages) {
      await newPrisma.message.upsert({
        where: { id: message.id },
        update: message,
        create: message
      });
    }
    return messages.length;
  });

  // Migrate Customer Tokens
  await migrateTable('CustomerToken', async () => {
    const tokens = await oldPrisma.customerToken.findMany();
    console.log(`  📄 Found ${tokens.length} customer tokens to migrate`);
    
    for (const token of tokens) {
      await newPrisma.customerToken.upsert({
        where: { id: token.id },
        update: token,
        create: token
      });
    }
    return tokens.length;
  });

  // Migrate Code Verifiers
  await migrateTable('CodeVerifier', async () => {
    const verifiers = await oldPrisma.codeVerifier.findMany();
    console.log(`  📄 Found ${verifiers.length} code verifiers to migrate`);
    
    for (const verifier of verifiers) {
      await newPrisma.codeVerifier.upsert({
        where: { id: verifier.id },
        update: verifier,
        create: verifier
      });
    }
    return verifiers.length;
  });

  // Migrate Customer Account URLs
  await migrateTable('CustomerAccountUrl', async () => {
    const urls = await oldPrisma.customerAccountUrl.findMany();
    console.log(`  📄 Found ${urls.length} customer account URLs to migrate`);
    
    for (const url of urls) {
      await newPrisma.customerAccountUrl.upsert({
        where: { id: url.id },
        update: url,
        create: url
      });
    }
    return urls.length;
  });
}

/**
 * Helper function to migrate a single table
 */
async function migrateTable(tableName, migrationFn) {
  try {
    console.log(`\n📋 Migrating ${tableName}...`);
    const count = await migrationFn();
    console.log(`  ✅ Successfully migrated ${count} ${tableName.toLowerCase()} records`);
  } catch (error) {
    console.error(`  ❌ Failed to migrate ${tableName}:`, error.message);
    throw error;
  }
}

/**
 * Verify the migration was successful
 */
async function verifyMigration() {
  const tables = [
    { name: 'Session', oldFn: () => oldPrisma.session.count(), newFn: () => newPrisma.session.count() },
    { name: 'Conversation', oldFn: () => oldPrisma.conversation.count(), newFn: () => newPrisma.conversation.count() },
    { name: 'Message', oldFn: () => oldPrisma.message.count(), newFn: () => newPrisma.message.count() },
    { name: 'CustomerToken', oldFn: () => oldPrisma.customerToken.count(), newFn: () => newPrisma.customerToken.count() },
    { name: 'CodeVerifier', oldFn: () => oldPrisma.codeVerifier.count(), newFn: () => newPrisma.codeVerifier.count() },
    { name: 'CustomerAccountUrl', oldFn: () => oldPrisma.customerAccountUrl.count(), newFn: () => newPrisma.customerAccountUrl.count() }
  ];

  console.log('\n📊 Verification Results:');
  console.log('┌─────────────────────┬─────────────┬─────────────┬────────────┐');
  console.log('│ Table               │ SQLite      │ Prisma Cloud│ Status     │');
  console.log('├─────────────────────┼─────────────┼─────────────┼────────────┤');

  let allMatch = true;

  for (const table of tables) {
    try {
      const oldCount = await table.oldFn();
      const newCount = await table.newFn();
      const match = oldCount === newCount;
      const status = match ? '✅ Match' : '❌ Mismatch';
      
      if (!match) allMatch = false;
      
      console.log(`│ ${table.name.padEnd(19)} │ ${oldCount.toString().padEnd(11)} │ ${newCount.toString().padEnd(11)} │ ${status.padEnd(10)} │`);
    } catch (error) {
      console.log(`│ ${table.name.padEnd(19)} │ ${'Error'.padEnd(11)} │ ${'Error'.padEnd(11)} │ ${'❌ Error'.padEnd(10)} │`);
      allMatch = false;
    }
  }

  console.log('└─────────────────────┴─────────────┴─────────────┴────────────┘');

  if (!allMatch) {
    throw new Error('Migration verification failed - record counts do not match');
  }

  console.log('\n✅ All record counts match! Migration verified successfully.');
}

/**
 * Main execution
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  migrate().catch(console.error);
}

export { migrate };