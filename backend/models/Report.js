import mongoose from 'mongoose';

const vitalSignsSchema = new mongoose.Schema({
  bloodPressure: String,
  heartRate: String,
  temperature: String,
  weight: String,
  height: String
}, { _id: false });

const testResultSchema = new mongoose.Schema({
  testName: String,
  result: String,
  normalRange: String,
  status: String
}, { _id: false });

const prescriptionSchema = new mongoose.Schema({
  medicine: String,
  dosage: String,
  frequency: String,
  duration: String,
  instructions: String
}, { _id: false });

const reportSchema = new mongoose.Schema({
  reportId: {
    type: String,
    required: true,
    unique: true
  },
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
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment',
    required: false
  },
  reportDate: {
    type: Date,
    default: Date.now
  },
  reportType: {
    type: String,
    required: true,
    enum: ['Diagnostic Report', 'Neurological Assessment', 'Orthopedic Assessment', 'Pediatric Checkup Report', 'Post-Surgical Follow-up', 'Dermatological Assessment', 'Prenatal Checkup Report']
  },
  diagnosis: {
    type: String,
    required: true,
    trim: true
  },
  symptoms: [{
    type: String,
    trim: true
  }],
  vitalSigns: vitalSignsSchema,
  testResults: [testResultSchema],
  prescription: [prescriptionSchema],
  recommendations: [{
    type: String,
    trim: true
  }],
  nextAppointment: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Draft', 'Final', 'Reviewed'],
    default: 'Draft'
  },
  // Virtual fields
  patientName: String,
  doctorName: String
}, {
  timestamps: true
});

// Auto-generate reportId
reportSchema.pre('save', function(next) {
  if (!this.reportId) {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    this.reportId = `RPT-${year}-${randomNum}`;
  }
  next();
});

// Populate patient and doctor details
reportSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'patientId',
    select: 'name email age gender'
  }).populate({
    path: 'doctorId',
    select: 'name email specialization'
  });
  next();
});

export default mongoose.model('Report', reportSchema);
