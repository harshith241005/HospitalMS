import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdminUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');

    // Remove existing admin accounts
    await User.deleteMany({ role: 'admin' });
    console.log('🗑️  Removed existing admin accounts');

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('harshith@#123', salt);

    // Create the new admin user
    const adminUser = new User({
      name: 'Harshith Boyina',
      email: 'harshithboyina@gmail.com',
      password: hashedPassword,
      role: 'admin',
      employeeId: 'EMP001',
      designation: 'Hospital Administrator',
      phone: '+91-9000000001',
      permissions: [
        'user_management',
        'doctor_management', 
        'patient_management',
        'appointment_management',
        'billing_management',
        'report_generation',
        'system_settings'
      ],
      address: {
        street: 'Hospital Admin Office',
        city: 'Hyderabad',
        state: 'Telangana',
        pincode: '500001'
      },
      isActive: true
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: harshithboyina@gmail.com');
    console.log('🔑 Password: harshith@#123');
    console.log('👤 Role: admin');
    console.log('🏥 Designation: Hospital Administrator');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();
