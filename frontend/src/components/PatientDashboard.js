import React from 'react';
import Sidebar from './Sidebar';

const patientNav = [
  { path: '/patient/book-appointment', name: 'Book Appointment' },
  { path: '/patient/appointments', name: 'My Appointments' },
  { path: '/patient/reports', name: 'Reports' },
  { path: '/patient/profile', name: 'Profile Settings' },
];

export default function PatientDashboard() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar navItems={patientNav} title="Patient Portal" />
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h1>Welcome, Patient!</h1>
        <p>This is your personal health portal.</p>
      </div>
    </div>
  );
}
