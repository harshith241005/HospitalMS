import express from 'express';
import { bookAppointment, getPatientAppointments, cancelAppointment } from '../controllers/appointmentController.js';
import { getPatientPrescriptions, getPatientReports } from '../controllers/reportController.js';
import { updateProfile } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth and patient role to all routes
router.use(authenticate);
router.use(authorize('patient'));

// Appointments
router.post('/appointments', bookAppointment);
router.get('/appointments/:patientId', getPatientAppointments);
router.put('/appointments/:id/cancel', cancelAppointment);

// Prescriptions
router.get('/prescriptions/:patientId', getPatientPrescriptions);

// Reports
router.get('/reports/:patientId', getPatientReports);

// Profile
router.post('/profile/:patientId', updateProfile);

export default router;
