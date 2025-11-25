const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://srandhari_db_user:irbe33sv6y25Gwz3@qualityzeone.ygdfcer.mongodb.net/qualityze_admin?retryWrites=true&w=majority&appName=qualityzeOne";

async function checkUser() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('qualityze_admin');
    const users = await db.collection('users').find().toArray();
    
    console.log('📊 Total Users:', users.length);
    console.log('');
    users.forEach((user, index) => {
      console.log(`User ${index + 1}:`);
      console.log('  Email:', user.email);
      console.log('  Name:', user.name);
      console.log('  Role:', user.role);
      console.log('  Created:', user.createdAt);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

checkUser();
