#!/usr/bin/env node

/**
 * Database Connection Test
 * 
 * Tests the database connection and basic CRUD operations
 * Works with both SQLite (current) and Prisma Cloud (future)
 */

import { PrismaClient } from '@prisma/client';
import { performance } from 'perf_hooks';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error']
});

async function testDatabase() {
  console.log('🧪 Testing database connection and operations...\n');
  
  const startTime = performance.now();
  
  try {
    // Test 1: Connection
    console.log('1️⃣ Testing database connection...');
    await prisma.$connect();
    console.log('   ✅ Connected successfully');
    
    // Test 2: Basic query
    console.log('\n2️⃣ Testing basic query...');
    const sessionCount = await prisma.session.count();
    console.log(`   ✅ Found ${sessionCount} sessions in database`);
    
    // Test 3: Create test conversation
    console.log('\n3️⃣ Testing conversation creation...');
    const testConversationId = `test_${Date.now()}`;
    
    const conversation = await prisma.conversation.create({
      data: {
        id: testConversationId
      }
    });
    console.log(`   ✅ Created test conversation: ${conversation.id}`);
    
    // Test 4: Create test message
    console.log('\n4️⃣ Testing message creation...');
    const message = await prisma.message.create({
      data: {
        conversationId: testConversationId,
        role: 'user',
        content: 'Hello, this is a test message!'
      }
    });
    console.log(`   ✅ Created test message: ${message.id}`);
    
    // Test 5: Query with relations
    console.log('\n5️⃣ Testing relational query...');
    const conversationWithMessages = await prisma.conversation.findUnique({
      where: { id: testConversationId },
      include: { messages: true }
    });
    console.log(`   ✅ Conversation has ${conversationWithMessages.messages.length} messages`);
    
    // Test 6: Update message
    console.log('\n6️⃣ Testing update operation...');
    const updatedMessage = await prisma.message.update({
      where: { id: message.id },
      data: { content: 'Updated test message content!' }
    });
    console.log(`   ✅ Updated message content`);
    
    // Test 7: Cleanup
    console.log('\n7️⃣ Cleaning up test data...');
    await prisma.message.delete({
      where: { id: message.id }
    });
    await prisma.conversation.delete({
      where: { id: testConversationId }
    });
    console.log('   ✅ Cleaned up test data');
    
    // Performance metrics
    const endTime = performance.now();
    const duration = Math.round(endTime - startTime);
    
    console.log(`\n🎉 All tests passed! (${duration}ms)`);
    
    // Database info
    const databaseUrl = process.env.DATABASE_URL;
    const isDataProxy = process.env.PRISMA_GENERATE_DATAPROXY === 'true';
    const dbType = databaseUrl.startsWith('prisma://') ? 'Prisma Cloud' : 
                   databaseUrl.startsWith('file:') ? 'SQLite' : 'Other';
    
    console.log('\n📊 Database Configuration:');
    console.log(`   Database Type: ${dbType}`);
    console.log(`   Data Proxy: ${isDataProxy ? 'Enabled' : 'Disabled'}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
    
  } catch (error) {
    console.error('\n❌ Database test failed:', error.message);
    
    if (error.code === 'P1001') {
      console.error('\n💡 Troubleshooting tips:');
      console.error('   - Check your DATABASE_URL environment variable');
      console.error('   - Ensure the database server is running');
      console.error('   - Verify network connectivity to Prisma Cloud');
    }
    
    if (error.code === 'P2002') {
      console.error('\n💡 This appears to be a unique constraint error');
      console.error('   - The test data might already exist');
      console.error('   - Try running the test again');
    }
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
  testDatabase().catch(console.error);
}

export { testDatabase };