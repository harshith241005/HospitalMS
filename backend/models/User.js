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
  specialization: {
    type: String,
    required: function() { return this.role === 'doctor'; }
  },
  availability: {
    type: String,
    required: function() { return this.role === 'doctor'; }
  },
  age: {
    type: Number,
    required: function() { return this.role === 'patient'; }
  },
  medicalHistory: [{
    type: String
  }]
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
