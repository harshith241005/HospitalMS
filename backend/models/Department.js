import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  headDoctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  totalDoctors: {
    type: Number,
    default: 0
  },
  totalBeds: {
    type: Number,
    default: 0
  },
  services: [{
    type: String,
    trim: true
  }],
  equipment: [{
    type: String,
    trim: true
  }],
  location: {
    type: String,
    trim: true
  },
  emergencyAvailable: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual to get doctors in this department
departmentSchema.virtual('doctors', {
  ref: 'User',
  localField: '_id',
  foreignField: 'department',
  match: { role: 'doctor' }
});

export default mongoose.model('Department', departmentSchema);
