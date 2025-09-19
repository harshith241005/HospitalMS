import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import models
import User from '../models/User.js';
import Department from '../models/Department.js';
import Appointment from '../models/Appointment.js';
import Report from '../models/Report.js';
import Room from '../models/Room.js';
import Service from '../models/Service.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message);
    process.exit(1);
  }
};

// Read JSON files
const readJSONFile = (filename) => {
  const filePath = path.join(__dirname, '../../sample-data', filename);
  const data = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(data);
};

// Import data function
const importData = async () => {
  try {
    console.log('🚀 Starting data import...');

    // Clear existing data
    await User.deleteMany({});
    await Department.deleteMany({});
    await Appointment.deleteMany({});
    await Report.deleteMany({});
    await Room.deleteMany({});
    await Service.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Import hospital info (departments, rooms, services)
    const hospitalInfo = readJSONFile('hospital-info.json');
    
    // Import departments
    const departments = hospitalInfo.departments.map(dept => ({
      _id: new mongoose.Types.ObjectId(),
      name: dept.name,
      description: `${dept.name} department providing specialized medical care`,
      totalDoctors: dept.totalDoctors,
      totalBeds: dept.totalBeds,
      services: dept.services,
      equipment: dept.equipment,
      location: dept.location,
      emergencyAvailable: dept.emergencyAvailable,
      isActive: true
    }));
    
    await Department.insertMany(departments);
    console.log('✅ Imported departments');

    // Create department mapping for doctors
    const deptMap = {};
    departments.forEach(dept => {
      deptMap[dept.name] = dept._id;
    });

    // Import users (patients, doctors, admins)
    const patients = readJSONFile('patients.json');
    const doctors = readJSONFile('doctors.json');
    const admins = readJSONFile('admins.json');

    // Process patients
    const processedPatients = patients.map(patient => ({
      ...patient,
      _id: new mongoose.Types.ObjectId(patient._id)
    }));

    // Process doctors with department assignment
    const processedDoctors = doctors.map(doctor => {
      const deptName = doctor.specialization === 'Cardiology' ? 'Cardiology' :
                      doctor.specialization === 'Neurology' ? 'Neurology' :
                      doctor.specialization === 'Pediatrics' ? 'Pediatrics' :
                      doctor.specialization === 'Orthopedic Surgery' ? 'Orthopedics' :
                      doctor.specialization === 'Obstetrics & Gynecology' ? 'Obstetrics & Gynecology' :
                      doctor.specialization === 'Dermatology' ? 'Dermatology' :
                      doctor.specialization === 'Psychiatry' ? 'Psychiatry' : 'Cardiology';
      
      return {
        ...doctor,
        _id: new mongoose.Types.ObjectId(doctor._id),
        department: deptMap[deptName] || deptMap['Cardiology']
      };
    });

    // Process admins (remove department field as it's not required for admins)
    const processedAdmins = admins.map(admin => {
      const { department, ...adminData } = admin; // Remove department field
      return {
        ...adminData,
        _id: new mongoose.Types.ObjectId(admin._id)
      };
    });

    // Insert all users
    await User.insertMany([...processedPatients, ...processedDoctors, ...processedAdmins]);
    console.log('✅ Imported users (patients, doctors, admins)');

    // Import appointments
    const appointments = readJSONFile('appointments.json');
    const processedAppointments = appointments.map(apt => ({
      ...apt,
      _id: new mongoose.Types.ObjectId(apt._id),
      patientId: new mongoose.Types.ObjectId(apt.patientId),
      doctorId: new mongoose.Types.ObjectId(apt.doctorId)
    }));

    await Appointment.insertMany(processedAppointments);
    console.log('✅ Imported appointments');

    // Import reports
    const reports = readJSONFile('reports.json');
    const processedReports = reports.map(report => ({
      ...report,
      _id: new mongoose.Types.ObjectId(report._id),
      patientId: new mongoose.Types.ObjectId(report.patientId),
      doctorId: new mongoose.Types.ObjectId(report.doctorId),
      appointmentId: report.appointmentId ? new mongoose.Types.ObjectId(report.appointmentId) : undefined
    }));

    await Report.insertMany(processedReports);
    console.log('✅ Imported reports');

    // Import rooms
    const rooms = hospitalInfo.rooms.map(room => ({
      roomNumber: room.roomNumber,
      type: room.type,
      department: room.department,
      capacity: room.capacity,
      currentOccupancy: room.currentOccupancy,
      status: room.status,
      amenities: room.amenities,
      dailyRate: room.dailyRate,
      isActive: true
    }));

    await Room.insertMany(rooms);
    console.log('✅ Imported rooms');

    // Import services
    const services = hospitalInfo.services.map(service => ({
      name: service.name,
      description: service.description,
      department: service.department,
      cost: service.cost,
      available: service.available,
      operatingHours: {
        start: '09:00',
        end: '18:00',
        is24x7: service.name.includes('Emergency') || service.name.includes('Pharmacy')
      },
      isActive: true
    }));

    await Service.insertMany(services);
    console.log('✅ Imported services');

    console.log('🎉 Sample data imported successfully!');
    console.log('\n📊 Import Summary:');
    console.log(`- Departments: ${departments.length}`);
    console.log(`- Patients: ${processedPatients.length}`);
    console.log(`- Doctors: ${processedDoctors.length}`);
    console.log(`- Admins: ${processedAdmins.length}`);
    console.log(`- Appointments: ${processedAppointments.length}`);
    console.log(`- Reports: ${processedReports.length}`);
    console.log(`- Rooms: ${rooms.length}`);
    console.log(`- Services: ${services.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error importing data:', error);
    process.exit(1);
  }
};

// Run the import
const runImport = async () => {
  await connectDB();
  await importData();
};

runImport();
