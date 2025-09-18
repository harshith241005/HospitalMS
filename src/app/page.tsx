'use client';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase'; // Assuming firebase config is in lib
import dynamic from 'next/dynamic';

import LoginComponent from '../components/Login';
import AdminDashboard from '../components/AdminDashboard';
import DoctorDashboard from '../components/DoctorDashboard';
import PatientDashboard from '../components/PatientDashboard';

// A wrapper to handle initial auth state and redirection
const AppWrapper = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // In a real app, you'd fetch the user's role from Firestore/backend
        // For this prototype, we'll use email-based routing
        if (user.email?.includes('admin')) {
          navigate('/admin');
        } else if (user.email?.includes('doctor')) {
          navigate('/doctor');
        } else {
          navigate('/patient');
        }
      } else {
        // If not logged in, ensure they are on the login page
        if (window.location.pathname !== '/') {
            navigate('/');
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
      <Routes>
        <Route path="/" element={<LoginComponent />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/doctor" element={<DoctorDashboard />} />
        <Route path="/patient" element={<PatientDashboard />} />
        {/* Redirect any other path to login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
  );
};

const AppWithRouter = () => (
    <Router>
        <AppWrapper />
    </Router>
);

const App = dynamic(() => Promise.resolve(AppWithRouter), {
    ssr: false,
});


export default App;
