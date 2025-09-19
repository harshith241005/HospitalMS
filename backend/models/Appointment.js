import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentDate: {
    type: Date,
    required: true
  },
  appointmentTime: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    default: 30 // minutes
  },
  status: {
    type: String,
    enum: ['scheduled', 'confirmed', 'cancelled', 'completed', 'pending'],
    default: 'pending'
  },
  type: {
    type: String,
    enum: ['consultation', 'follow-up', 'routine-checkup', 'emergency', 'prenatal-checkup'],
    default: 'consultation'
  },
  reason: {
    type: String,
    trim: true,
    required: true
  },
  symptoms: [{
    type: String,
    trim: true
  }],
  consultationFee: {
    type: Number,
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  notes: {
    type: String,
    trim: true
  },
  // Virtual fields populated from User model
  patientName: String,
  doctorName: String,
  specialization: String
}, {
  timestamps: true
});

// Populate patient and doctor details
appointmentSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'patientId',
    select: 'name email phone'
  }).populate({
    path: 'doctorId',
    select: 'name email specialization'
  });
  next();
});

export default mongoose.model('Appointment', appointmentSchema);
