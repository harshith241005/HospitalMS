import express from 'express';
import { 
  getPatientDashboard, 
  getDoctorDashboard, 
  getAdminDashboard,
  getHospitalOverview,
  bookAppointment,
  updateAppointmentStatus
} from '../controllers/dashboardController.js';
import { authenticate, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/hospital-overview', getHospitalOverview);

// Protected routes - require authentication
router.use(authenticate);

// Patient routes
router.get('/patient', authorize('patient'), getPatientDashboard);
router.post('/patient/book-appointment', authorize('patient'), bookAppointment);

// Doctor routes
router.get('/doctor', authorize('doctor'), getDoctorDashboard);
router.patch('/doctor/appointment/:appointmentId/status', authorize('doctor'), updateAppointmentStatus);

// Admin routes
router.get('/admin', authorize('admin'), getAdminDashboard);

export default router;
