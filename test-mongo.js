const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://srandhari_db_user:irbe33sv6y25Gwz3@qualityzeone.ygdfcer.mongodb.net/qualityze_admin?retryWrites=true&w=majority&appName=qualityzeOne";

async function testConnection() {
  console.log('🔄 Attempting connection...');
  console.log('📍 URI:', uri.replace(/:[^:@]+@/, ':****@')); // Hide password
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
  });
  
  try {
    await client.connect();
    console.log('✅ Connected successfully!');
    
    const db = client.db('qualityze_admin');
    const collections = await db.listCollections().toArray();
    console.log('📂 Collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Details:', error);
  } finally {
    await client.close();
  }
}

testConnection();
