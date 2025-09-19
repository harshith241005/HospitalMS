import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
let adminToken, doctorToken, patientToken;

// Test data
const testUsers = {
  admin: {
    email: 'admin@hospital.com',
    password: '12345678'
  },
  doctor: {
    name: 'Dr. Smith',
    email: 'doctor@hospital.com',
    password: '12345678',
    specialization: 'Cardiology',
    availability: 'Mon-Fri, 9AM-5PM'
  },
  patient: {
    name: 'John Doe',
    email: 'patient@hospital.com',
    password: '12345678',
    age: 30
  }
};

// Test functions
async function testAuth() {
  console.log('\n🔐 Testing Authentication...');
  
  try {
    // Test Admin Login
    const adminLogin = await axios.post(`${API_URL}/auth/login`, testUsers.admin);
    adminToken = adminLogin.data.token;
    console.log('✅ Admin login successful');

    // Test Doctor Registration
    const doctorReg = await axios.post(`${API_URL}/auth/register`, {
      ...testUsers.doctor,
      role: 'doctor'
    });
    console.log('✅ Doctor registration successful');

    // Test Doctor Login
    const doctorLogin = await axios.post(`${API_URL}/auth/login`, testUsers.doctor);
    doctorToken = doctorLogin.data.token;
    console.log('✅ Doctor login successful');

    // Test Patient Registration
    const patientReg = await axios.post(`${API_URL}/auth/register`, {
      ...testUsers.patient,
      role: 'patient'
    });
    console.log('✅ Patient registration successful');

    // Test Patient Login
    const patientLogin = await axios.post(`${API_URL}/auth/login`, testUsers.patient);
    patientToken = patientLogin.data.token;
    console.log('✅ Patient login successful');

  } catch (error) {
    console.error('❌ Auth Test Failed:', error.response?.data || error.message, error.stack);
    process.exit(1);
  }
}

async function testAdminFeatures() {
  console.log('\n👑 Testing Admin Features...');
  
  try {
    const headers = { Authorization: `Bearer ${adminToken}` };

    // Test Get All Doctors
    const doctors = await axios.get(`${API_URL}/admin/doctors`, { headers });
    console.log('✅ Get all doctors successful');

    // Test Get All Patients
    const patients = await axios.get(`${API_URL}/admin/patients`, { headers });
    console.log('✅ Get all patients successful');

    // Test Get All Appointments
    const appointments = await axios.get(`${API_URL}/admin/appointments`, { headers });
    console.log('✅ Get all appointments successful');

  } catch (error) {
    console.error('❌ Admin Test Failed:', error.response?.data || error.message);
  }
}

async function testDoctorFeatures() {
  console.log('\n👨‍⚕️ Testing Doctor Features...');
  
  try {
    const headers = { Authorization: `Bearer ${doctorToken}` };

    // Test Get Doctor's Appointments
    const appointments = await axios.get(`${API_URL}/doctor/appointments`, { headers });
    console.log('✅ Get doctor appointments successful');

    // Test Create Prescription
    const prescription = await axios.post(`${API_URL}/doctor/prescriptions`, {
      patientId: 'PATIENT_ID', // This will be replaced with actual ID
      appointmentId: 'APPOINTMENT_ID', // This will be replaced with actual ID
      medicines: [{
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: 'Twice daily',
        duration: '5 days'
      }],
      diagnosis: 'Fever',
      notes: 'Take with food'
    }, { headers });
    console.log('✅ Create prescription successful');

  } catch (error) {
    console.error('❌ Doctor Test Failed:', error.response?.data || error.message);
  }
}

async function testPatientFeatures() {
  console.log('\n🧑‍💼 Testing Patient Features...');
  
  try {
    const headers = { Authorization: `Bearer ${patientToken}` };

    // Test Book Appointment
    const bookAppointment = await axios.post(`${API_URL}/patient/appointments`, {
      doctorId: 'DOCTOR_ID', // This will be replaced with actual ID
      date: '2025-09-20',
      time: '10:00 AM',
      reason: 'Regular checkup'
    }, { headers });
    console.log('✅ Book appointment successful');

    // Test Get Patient's Appointments
    const appointments = await axios.get(`${API_URL}/patient/appointments`, { headers });
    console.log('✅ Get patient appointments successful');

    // Test Get Patient's Reports
    const reports = await axios.get(`${API_URL}/patient/reports`, { headers });
    console.log('✅ Get patient reports successful');

  } catch (error) {
    console.error('❌ Patient Test Failed:', error.response?.data || error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🏥 Starting Hospital Management System API Tests...');
  
  try {
    await testAuth();
    await testAdminFeatures();
    await testDoctorFeatures();
    await testPatientFeatures();
    
    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('\n❌ Test Suite Failed:', error);
  }
}

runAllTests();