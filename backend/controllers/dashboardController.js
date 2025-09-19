import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Report from '../models/Report.js';
import Department from '../models/Department.js';
import Room from '../models/Room.js';
import Service from '../models/Service.js';

// Patient Dashboard
export const getPatientDashboard = async (req, res) => {
  try {
    const patientId = req.user._id;
    
    // Get patient's appointments
    const appointments = await Appointment.find({ patientId })
      .populate('doctorId', 'name specialization')
      .sort({ appointmentDate: -1 })
      .limit(10);

    // Get patient's reports
    const reports = await Report.find({ patientId })
      .populate('doctorId', 'name specialization')
      .sort({ reportDate: -1 })
      .limit(5);

    // Get upcoming appointments
    const upcomingAppointments = await Appointment.find({
      patientId,
      appointmentDate: { $gte: new Date() },
      status: { $in: ['scheduled', 'confirmed'] }
    }).populate('doctorId', 'name specialization')
      .sort({ appointmentDate: 1 })
      .limit(3);

    // Dashboard stats
    const stats = {
      totalAppointments: await Appointment.countDocuments({ patientId }),
      completedAppointments: await Appointment.countDocuments({ patientId, status: 'completed' }),
      upcomingAppointments: upcomingAppointments.length,
      totalReports: await Report.countDocuments({ patientId })
    };

    res.json({
      success: true,
      data: {
        patient: req.user,
        appointments,
        reports,
        upcomingAppointments,
        stats
      }
    });
  } catch (error) {
    console.error('Patient dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Doctor Dashboard
export const getDoctorDashboard = async (req, res) => {
  try {
    const doctorId = req.user._id;
    
    // Get doctor's appointments
    const appointments = await Appointment.find({ doctorId })
      .populate('patientId', 'name age gender phone')
      .sort({ appointmentDate: -1 })
      .limit(10);

    // Get today's appointments
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    const todaysAppointments = await Appointment.find({
      doctorId,
      appointmentDate: { $gte: startOfDay, $lte: endOfDay }
    }).populate('patientId', 'name age gender phone')
      .sort({ appointmentTime: 1 });

    // Get pending appointments (requests)
    const pendingAppointments = await Appointment.find({
      doctorId,
      status: 'pending'
    }).populate('patientId', 'name age gender phone')
      .sort({ createdAt: -1 })
      .limit(5);

    // Get doctor's patients
    const patients = await Appointment.find({ doctorId, status: 'completed' })
      .populate('patientId', 'name age gender phone medicalHistory')
      .distinct('patientId');

    // Dashboard stats
    const stats = {
      totalPatients: patients.length,
      totalAppointments: await Appointment.countDocuments({ doctorId }),
      todaysAppointments: todaysAppointments.length,
      pendingRequests: await Appointment.countDocuments({ doctorId, status: 'pending' }),
      completedToday: await Appointment.countDocuments({ 
        doctorId, 
        appointmentDate: { $gte: startOfDay, $lte: endOfDay },
        status: 'completed'
      })
    };

    res.json({
      success: true,
      data: {
        doctor: req.user,
        appointments,
        todaysAppointments,
        pendingAppointments,
        patients: patients.slice(0, 10), // Limit to 10 recent patients
        stats
      }
    });
  } catch (error) {
    console.error('Doctor dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Admin Dashboard
export const getAdminDashboard = async (req, res) => {
  try {
    // Hospital overview stats
    const totalPatients = await User.countDocuments({ role: 'patient', isActive: true });
    const totalDoctors = await User.countDocuments({ role: 'doctor', isActive: true });
    const totalAppointments = await Appointment.countDocuments();
    const totalDepartments = await Department.countDocuments({ isActive: true });
    const totalRooms = await Room.countDocuments({ isActive: true });
    const occupiedRooms = await Room.countDocuments({ status: 'Occupied', isActive: true });
    const availableRooms = await Room.countDocuments({ status: 'Available', isActive: true });

    // Recent appointments
    const recentAppointments = await Appointment.find()
      .populate('patientId', 'name age gender')
      .populate('doctorId', 'name specialization')
      .sort({ createdAt: -1 })
      .limit(10);

    // Today's appointments
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    
    const todaysAppointments = await Appointment.countDocuments({
      appointmentDate: { $gte: startOfDay, $lte: endOfDay }
    });

    // Department-wise doctor count
    const departmentStats = await Department.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'department',
          as: 'doctors'
        }
      },
      {
        $project: {
          name: 1,
          totalBeds: 1,
          doctorCount: { $size: '$doctors' }
        }
      }
    ]);

    // Room occupancy by type
    const roomStats = await Room.aggregate([
      {
        $group: {
          _id: '$type',
          total: { $sum: 1 },
          occupied: { $sum: { $cond: [{ $eq: ['$status', 'Occupied'] }, 1, 0] } },
          available: { $sum: { $cond: [{ $eq: ['$status', 'Available'] }, 1, 0] } }
        }
      }
    ]);

    // Monthly appointment trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const appointmentTrends = await Appointment.aggregate([
      {
        $match: {
          appointmentDate: { $gte: sixMonthsAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$appointmentDate' },
            month: { $month: '$appointmentDate' }
          },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    const stats = {
      overview: {
        totalPatients,
        totalDoctors,
        totalAppointments,
        totalDepartments,
        totalRooms,
        occupiedRooms,
        availableRooms,
        todaysAppointments,
        occupancyRate: totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0
      },
      departmentStats,
      roomStats,
      appointmentTrends
    };

    res.json({
      success: true,
      data: {
        admin: req.user,
        stats,
        recentAppointments
      }
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Hospital Overview (Public)
export const getHospitalOverview = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true })
      .populate('headDoctorId', 'name')
      .select('name description totalDoctors totalBeds services location emergencyAvailable');

    const services = await Service.find({ isActive: true, available: true })
      .select('name description cost operatingHours');

    const doctorsByDepartment = await Department.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: 'department',
          as: 'doctors'
        }
      },
      {
        $project: {
          name: 1,
          doctorCount: { $size: '$doctors' },
          doctors: {
            $map: {
              input: '$doctors',
              as: 'doctor',
              in: {
                name: '$$doctor.name',
                specialization: '$$doctor.specialization',
                experience: '$$doctor.experience',
                consultationFee: '$$doctor.consultationFee'
              }
            }
          }
        }
      }
    ]);

    const hospitalStats = {
      totalDepartments: await Department.countDocuments({ isActive: true }),
      totalDoctors: await User.countDocuments({ role: 'doctor', isActive: true }),
      totalServices: await Service.countDocuments({ isActive: true, available: true }),
      totalBeds: await Room.aggregate([
        { $group: { _id: null, totalBeds: { $sum: '$capacity' } } }
      ])
    };

    res.json({
      success: true,
      data: {
        departments,
        services,
        doctorsByDepartment,
        hospitalStats
      }
    });
  } catch (error) {
    console.error('Hospital overview error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Book Appointment (Patient)
export const bookAppointment = async (req, res) => {
  try {
    const patientId = req.user._id;
    const { doctorId, appointmentDate, appointmentTime, reason, symptoms } = req.body;

    // Get doctor details for consultation fee
    const doctor = await User.findById(doctorId);
    if (!doctor || doctor.role !== 'doctor') {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    // Check if appointment slot is available
    const existingAppointment = await Appointment.findOne({
      doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      status: { $in: ['scheduled', 'confirmed'] }
    });

    if (existingAppointment) {
      return res.status(400).json({ message: 'This time slot is already booked' });
    }

    const appointment = new Appointment({
      patientId,
      doctorId,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      reason,
      symptoms: symptoms || [],
      consultationFee: doctor.consultationFee,
      patientName: req.user.name,
      doctorName: doctor.name,
      specialization: doctor.specialization
    });

    await appointment.save();

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Book appointment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Appointment Status (Doctor)
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, notes } = req.body;
    const doctorId = req.user._id;

    const appointment = await Appointment.findOne({ _id: appointmentId, doctorId });
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    appointment.status = status;
    if (notes) appointment.notes = notes;
    
    await appointment.save();

    res.json({
      success: true,
      message: 'Appointment status updated successfully',
      data: appointment
    });
  } catch (error) {
    console.error('Update appointment status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
