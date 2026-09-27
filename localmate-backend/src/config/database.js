const mongoose = require('mongoose');

let memoryServer = null;

const connectDB = async () => {
  const targetUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/localmate';

  // 1. Try connecting to specified MONGODB_URI (e.g. MongoDB Atlas or Local MongoDB)
  try {
    console.log(`🔌 Attempting to connect to MongoDB: ${targetUri.replace(/:([^:@]+)@/, ':****@')}...`);
    const conn = await mongoose.connect(targetUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 45000
    });
    console.log(`✅ MongoDB connected successfully: host=${conn.connection.host}, db=${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.warn(`⚠️ Could not connect to primary MongoDB at ${targetUri} (${error.message})`);

    // 2. In development mode, auto-fallback to embedded real MongoDB engine if external DB isn't running
    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('🔄 Launching embedded development MongoDB engine (MongoMemoryServer)...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create({
          instance: { dbName: 'localmate' }
        });
        const memoryUri = memoryServer.getUri();
        const conn = await mongoose.connect(memoryUri);
        console.log(`✅ Embedded MongoDB engine is ready: ${memoryUri}`);
        console.log('💡 Note: All real Mongoose models, indexes, 2dsphere geo queries & relations are 100% active.');
        console.log('💡 For persistent storage, set MONGODB_URI in .env to a MongoDB Atlas cluster or local mongod.');

        // Auto-seed real data into the memory instance so developer gets full data immediately
        try {
          const { seedDatabase } = require('../seed');
          if (typeof seedDatabase === 'function') {
            await seedDatabase();
          }
        } catch (seedErr) {
          console.log('Seed runner info:', seedErr.message);
        }

        return conn;
      } catch (memErr) {
        console.error('❌ Failed to launch embedded development database:', memErr.message);
      }
    }

    console.error('❌ MongoDB connection failed. Please ensure MongoDB is running or check your MONGODB_URI in .env.');
    process.exit(1);
  }
};

const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};

module.exports = { connectDB, disconnectDB };
