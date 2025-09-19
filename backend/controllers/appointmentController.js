import Appointment from '../models/Appointment.js';

// Book appointment (Patient)
export const bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, reason } = req.body;
    const patientId = req.user._id;

    const appointment = new Appointment({
      patientId,
      doctorId,
      date,
      time,
      reason,
      status: 'PENDING'
    });

    await appointment.save();
    res.status(201).json({ message: 'Appointment booked successfully', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get patient's appointments
export const getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user._id })
      .populate('doctorId', 'name specialization')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get doctor's appointments
export const getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user._id })
      .populate('patientId', 'name age')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all appointments (Admin)
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('patientId', 'name')
      .populate('doctorId', 'name specialization')
      .sort({ date: -1 });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update appointment status (Doctor/Admin)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const appointment = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment status updated', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Cancel appointment (Patient)
export const cancelAppointment = async (req, res) => {
  try {
    const { id } = req.params;

    const appointment = await Appointment.findOneAndUpdate(
      { _id: id, patientId: req.user._id },
      { status: 'CANCELLED' },
      { new: true }
    );

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    res.json({ message: 'Appointment cancelled', appointment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
