import mongoose from 'mongoose';

const prescriptionSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: true
  },
  medicines: [{
    type: String,
    required: true
  }],
  notes: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Prescription', prescriptionSchema);
