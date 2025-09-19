import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'doctor', 'patient'],
    required: true
  },
  // Doctor-specific fields
  specialization: {
    type: String,
    required: function() { return this.role === 'doctor'; }
  },
  department: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Department',
    required: function() { return this.role === 'doctor'; }
  },
  experience: {
    type: Number,
    required: function() { return this.role === 'doctor'; }
  },
  qualification: {
    type: String,
    required: function() { return this.role === 'doctor'; }
  },
  consultationFee: {
    type: Number,
    required: function() { return this.role === 'doctor'; }
  },
  availability: {
    days: [{
      type: String,
      enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    }],
    timeSlots: [{
      start: String,
      end: String
    }]
  },
  
  // Patient-specific fields
  age: {
    type: Number,
    required: function() { return this.role === 'patient'; }
  },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'Other'],
    required: function() { return this.role === 'patient'; }
  },
  phone: {
    type: String,
    required: function() { return this.role === 'patient' || this.role === 'doctor'; }
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  medicalHistory: [{
    type: String
  }],
  emergencyContact: {
    name: String,
    relation: String,
    phone: String
  },
  
  // Admin-specific fields
  employeeId: {
    type: String,
    required: function() { return this.role === 'admin'; }
  },
  designation: {
    type: String,
    required: function() { return this.role === 'admin'; }
  },
  permissions: [{
    type: String
  }],
  
  // Common fields
  firebaseUid: {
    type: String,
    sparse: true, // Allow null values but ensure uniqueness when present
    unique: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
