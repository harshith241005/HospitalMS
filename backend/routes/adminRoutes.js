import express from 'express';
import { getDoctors, getPatients, addDoctor, addPatient, updateDoctor, deleteDoctor, getDashboard } from '../controllers/userController.js';
import { getAllAppointments } from '../controllers/appointmentController.js';
import { getAllReports, deleteReport } from '../controllers/reportController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply auth and admin role to all routes
router.use(authenticate);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboard);

// User management
router.get('/doctors', getDoctors);
router.post('/doctors', addDoctor);
router.put('/doctors/:id', updateDoctor);
router.delete('/doctors/:id', deleteDoctor);

router.get('/patients', getPatients);
router.post('/patients', addPatient);

// Appointments
router.get('/appointments', getAllAppointments);

// Reports
router.get('/reports', getAllReports);
router.delete('/reports/:id', deleteReport);

export default router;
