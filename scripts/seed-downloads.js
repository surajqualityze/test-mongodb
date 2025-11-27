const { MongoClient } = require('mongodb');

// Replace with your actual MongoDB connection string
const uri = "mongodb+srv://srandhari_db_user:irbe33sv6y25Gwz3@qualityzeone.ygdfcer.mongodb.net/qualityze_admin?retryWrites=true&w=majority&appName=qualityzeOne";

async function seedDownloads() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('qualityze_admin');
    
    // Get a whitepaper to reference
    const whitepaper = await db.collection('whitepapers').findOne();
    
    if (!whitepaper) {
      console.log('⚠️ No whitepapers found. Create a whitepaper first!');
      return;
    }

    console.log('📄 Found whitepaper:', whitepaper.title);

    const testDownloads = [
      {
        resourceType: 'whitepaper',
        resourceId: whitepaper._id.toString(),
        resourceTitle: whitepaper.title,
        resourceUrl: whitepaper.pdfUrl,
        userEmail: 'john.doe@example.com',
        userName: 'John Doe',
        userCompany: 'ABC Corp',
        userJobTitle: 'Manager',
        userPhone: '+1-555-0101',
        formData: {
          country: 'USA',
          industry: 'Finance',
          consent: true,
        },
        emailSent: true,
        emailStatus: 'delivered',
        emailSentAt: new Date(),
        followUpRequired: true,
        followUpStatus: 'pending',
        downloadedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      },
      {
        resourceType: 'whitepaper',
        resourceId: whitepaper._id.toString(),
        resourceTitle: whitepaper.title,
        resourceUrl: whitepaper.pdfUrl,
        userEmail: 'jane.smith@example.com',
        userName: 'Jane Smith',
        userCompany: 'XYZ Inc',
        userJobTitle: 'Director',
        userPhone: '+1-555-0102',
        formData: {
          country: 'USA',
          industry: 'Healthcare',
          consent: true,
        },
        emailSent: true,
        emailStatus: 'delivered',
        emailSentAt: new Date(),
        followUpRequired: true,
        followUpStatus: 'contacted',
        downloadedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        resourceType: 'whitepaper',
        resourceId: whitepaper._id.toString(),
        resourceTitle: whitepaper.title,
        resourceUrl: whitepaper.pdfUrl,
        userEmail: 'bob.johnson@example.com',
        userName: 'Bob Johnson',
        userCompany: 'Tech Solutions',
        userJobTitle: 'Analyst',
        userPhone: '+1-555-0103',
        formData: {
          country: 'Canada',
          industry: 'Technology',
          consent: true,
        },
        emailSent: false,
        emailStatus: 'pending',
        followUpRequired: true,
        followUpStatus: 'pending',
        downloadedAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        resourceType: 'whitepaper',
        resourceId: whitepaper._id.toString(),
        resourceTitle: whitepaper.title,
        resourceUrl: whitepaper.pdfUrl,
        userEmail: 'sarah.williams@example.com',
        userName: 'Sarah Williams',
        userCompany: 'Global Bank',
        userJobTitle: 'VP Operations',
        userPhone: '+1-555-0104',
        formData: {
          country: 'UK',
          industry: 'Banking',
          consent: true,
        },
        emailSent: true,
        emailStatus: 'delivered',
        emailSentAt: new Date(),
        followUpRequired: true,
        followUpStatus: 'converted',
        downloadedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      },
      {
        resourceType: 'whitepaper',
        resourceId: whitepaper._id.toString(),
        resourceTitle: whitepaper.title,
        resourceUrl: whitepaper.pdfUrl,
        userEmail: 'mike.davis@example.com',
        userName: 'Mike Davis',
        userCompany: 'StartupXYZ',
        userJobTitle: 'CEO',
        userPhone: '+1-555-0105',
        formData: {
          country: 'USA',
          industry: 'Technology',
          consent: true,
        },
        emailSent: true,
        emailStatus: 'failed',
        emailError: 'Invalid email address',
        followUpRequired: true,
        followUpStatus: 'pending',
        downloadedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      },
    ];

    const result = await db.collection('downloads').insertMany(testDownloads);
    
    console.log('✅ Successfully added test download records!');
    console.log(`📊 Added ${result.insertedCount} downloads`);
    console.log('🎉 You can now view them at /admin/downloads');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.close();
    console.log('🔌 Disconnected from MongoDB');
  }
}

seedDownloads();


//node scripts/seed-downloads.js