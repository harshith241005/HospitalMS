import express from 'express';
import { getDoctorAppointments, updateAppointmentStatus } from '../controllers/appointmentController.js';
import { createPrescription, getDoctorPrescriptions } from '../controllers/reportController.js';
import { setAvailability } from '../controllers/userController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth and doctor role to all routes
router.use(authenticate);
router.use(authorize('doctor'));

// Appointments
router.get('/appointments/:doctorId', getDoctorAppointments);
router.put('/appointments/:id/status', updateAppointmentStatus);

// Prescriptions
router.post('/prescriptions', createPrescription);
router.get('/prescriptions/:doctorId', getDoctorPrescriptions);

// Schedule
router.post('/schedule/:doctorId', setAvailability);

export default router;
