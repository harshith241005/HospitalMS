import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import bcrypt from 'bcryptjs';

// Get all doctors
export const getDoctors = async (req, res) => {
  try {
    const doctors = await User.find({ role: 'doctor' }).select('-password');
    res.json(doctors);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all patients
export const getPatients = async (req, res) => {
  try {
    const patients = await User.find({ role: 'patient' }).select('-password');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add a new doctor
export const addDoctor = async (req, res) => {
  try {
    const { name, email, password, specialization, availability } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const doctor = new User({
      name,
      email,
      password: hashedPassword,
      role: 'doctor',
      specialization,
      availability
    });

    await doctor.save();
    res.status(201).json({ message: 'Doctor added successfully', doctor: doctor._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Add a new patient
export const addPatient = async (req, res) => {
  try {
    const { name, email, password, age, medicalHistory } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const patient = new User({
      name,
      email,
      password: hashedPassword,
      role: 'patient',
      age,
      medicalHistory: medicalHistory || []
    });

    await patient.save();
    res.status(201).json({ message: 'Patient added successfully', patient: patient._id });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update doctor
export const updateDoctor = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const doctor = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ message: 'Doctor updated successfully', doctor });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete doctor
export const deleteDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await User.findByIdAndDelete(id);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ message: 'Doctor deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get dashboard stats (Admin)
export const getDashboard = async (req, res) => {
  try {
    const doctorCount = await User.countDocuments({ role: 'doctor' });
    const patientCount = await User.countDocuments({ role: 'patient' });
    const appointmentCount = await Appointment.countDocuments();

    res.json({
      totalDoctors: doctorCount,
      totalPatients: patientCount,
      totalAppointments: appointmentCount
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Set doctor availability
export const setAvailability = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { availability } = req.body;

    const doctor = await User.findByIdAndUpdate(doctorId, { availability }, { new: true });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json({ message: 'Availability updated successfully', doctor });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update patient profile
export const updateProfile = async (req, res) => {
  try {
    const { patientId } = req.params;
    const { name, age, medicalHistory } = req.body;

    const patient = await User.findByIdAndUpdate(patientId, { name, age, medicalHistory }, { new: true });
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json({ message: 'Profile updated successfully', patient });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
