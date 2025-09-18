import React from 'react';
import Sidebar from './Sidebar';

const adminNav = [
  { path: '/admin/doctors', name: 'Manage Doctors' },
  { path: '/admin/patients', name: 'Manage Patients' },
  { path: '/admin/appointments', name: 'View All Appointments' },
  { path: '/admin/reports', name: 'Hospital Reports' },
];

export default function AdminDashboard() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar navItems={adminNav} title="Admin Portal" />
      <div style={{ flexGrow: 1, padding: '20px' }}>
        <h1>Welcome, Admin!</h1>
        <p>This is the central control panel for hospital management.</p>
      </div>
    </div>
  );
}
