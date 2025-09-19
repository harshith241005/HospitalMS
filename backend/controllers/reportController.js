import Prescription from '../models/Prescription.js';
import Report from '../models/Report.js';

// Create prescription (Doctor)
export const createPrescription = async (req, res) => {
  try {
    const { patientId, appointmentId, medicines, notes } = req.body;
    const doctorId = req.user._id;

    const prescription = new Prescription({
      doctorId,
      patientId,
      appointmentId,
      medicines,
      notes
    });

    await prescription.save();
    res.status(201).json({ message: 'Prescription created successfully', prescription });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get patient's prescriptions
export const getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patientId: req.user._id })
      .populate('doctorId', 'name specialization')
      .populate('appointmentId', 'date time')
      .sort({ date: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get doctor's prescriptions
export const getDoctorPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ doctorId: req.user._id })
      .populate('patientId', 'name age')
      .populate('appointmentId', 'date time')
      .sort({ date: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create report (Doctor/Lab)
export const createReport = async (req, res) => {
  try {
    const { patientId, reportType, fileUrl } = req.body;

    const report = new Report({
      patientId,
      reportType,
      fileUrl
    });

    await report.save();
    res.status(201).json({ message: 'Report created successfully', report });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get patient's reports
export const getPatientReports = async (req, res) => {
  try {
    const reports = await Report.find({ patientId: req.user._id })
      .sort({ date: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all reports (Admin)
export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('patientId', 'name')
      .sort({ date: -1 });
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete report (Admin)
export const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const report = await Report.findByIdAndDelete(id);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
