const { MongoClient } = require('mongodb');

const uri = "your-mongodb-connection-string";

async function clearDownloads() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('qualityze_admin');
    
    const result = await db.collection('downloads').deleteMany({});
    console.log(`🗑️ Deleted ${result.deletedCount} download records`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

clearDownloads();
