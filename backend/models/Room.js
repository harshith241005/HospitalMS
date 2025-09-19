import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['General Ward', 'Private Room', 'ICU', 'Operation Theater', 'Maternity Room', 'Pediatric Ward', 'Deluxe Suite', 'Isolation Room']
  },
  department: {
    type: String,
    required: true
  },
  capacity: {
    type: Number,
    required: true,
    min: 1
  },
  currentOccupancy: {
    type: Number,
    default: 0,
    min: 0
  },
  status: {
    type: String,
    enum: ['Available', 'Occupied', 'Maintenance', 'Reserved'],
    default: 'Available'
  },
  amenities: [{
    type: String
  }],
  dailyRate: {
    type: Number,
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  assignedDate: {
    type: Date
  },
  dischargeDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Virtual to check availability
roomSchema.virtual('isAvailable').get(function() {
  return this.currentOccupancy < this.capacity && this.status === 'Available';
});

// Update status based on occupancy
roomSchema.pre('save', function(next) {
  if (this.currentOccupancy >= this.capacity) {
    this.status = 'Occupied';
  } else if (this.currentOccupancy === 0 && this.status === 'Occupied') {
    this.status = 'Available';
  }
  next();
});

export default mongoose.model('Room', roomSchema);
