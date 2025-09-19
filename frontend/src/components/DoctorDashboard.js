import React from 'react';
import Sidebar from './Sidebar';

const doctorNav = [
  { path: '/doctor/appointments', name: 'My Appointments' },
  { path: '/doctor/schedule', name: 'Schedule Management' },
  { path: '/doctor/prescriptions', name: 'Prescriptions' },
  { path: '/doctor/history', name: 'Patient History' },
];

export default function DoctorDashboard() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar navItems={doctorNav} title="Doctor Portal" />
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h1>Welcome, Doctor!</h1>
        <p>Here is your schedule for today.</p>
      </div>
    </div>
  );
}
