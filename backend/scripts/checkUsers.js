import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const checkUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');
    
    const users = await User.find({}, 'name email role').limit(10);
    console.log('\n📋 Users in database:');
    users.forEach(user => {
      console.log(`- ${user.email} (${user.role}) - ${user.name}`);
    });
    
    console.log(`\n📊 Total users: ${users.length}`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

checkUsers();
