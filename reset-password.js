const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

const uri = "mongodb+srv://srandhari_db_user:irbe33sv6y25Gwz3@qualityzeone.ygdfcer.mongodb.net/qualityze_admin?retryWrites=true&w=majority&appName=qualityzeOne";

async function resetPassword() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('qualityze_admin');
    
    const email = 'admin@qualityze.com';
    const newPassword = 'Admin@123456';
    
    console.log('🔄 Resetting password for:', email);
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    // Update password
    const result = await db.collection('users').updateOne(
      { email },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Password reset successful!');
      console.log('');
      console.log('Login with:');
      console.log('  Email:', email);
      console.log('  Password:', newPassword);
    } else {
      console.log('❌ User not found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
  }
}

resetPassword();
