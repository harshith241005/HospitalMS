'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, CheckCircle, AlertCircle, User, Phone } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Patient {
  _id: string;
  name: string;
  age: number;
  gender: string;
  phone: string;
  medicalHistory: string[];
}

interface Appointment {
  _id: string;
  patientId: {
    name: string;
    age: number;
    gender: string;
    phone: string;
  };
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  reason: string;
  symptoms: string[];
  consultationFee: number;
}

interface DashboardStats {
  totalPatients: number;
  totalAppointments: number;
  todaysAppointments: number;
  pendingRequests: number;
  completedToday: number;
}

interface DoctorData {
  name: string;
  email: string;
  specialization: string;
  experience: number;
}

export default function DoctorDashboard() {
  const [dashboardData, setDashboardData] = useState<{
    doctor: DoctorData;
    appointments: Appointment[];
    todaysAppointments: Appointment[];
    pendingAppointments: Appointment[];
    patients: Patient[];
    stats: DashboardStats;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          variant: 'destructive',
          title: 'Authentication Error',
          description: 'Please login to access dashboard',
        });
        return;
      }

      const response = await fetch('http://localhost:5000/api/dashboard/doctor', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDashboardData(data.data);
      } else {
        throw new Error('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Dashboard fetch error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load dashboard data',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/dashboard/doctor/appointment/${appointmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Appointment ${status} successfully`,
        });
        fetchDashboardData(); // Refresh data
      } else {
        throw new Error('Failed to update appointment');
      }
    } catch (error) {
      console.error('Update appointment error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update appointment status',
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString: string) => {
    return timeString;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Failed to load dashboard data</p>
      </div>
    );
  }

  const { doctor, appointments, todaysAppointments, pendingAppointments, patients, stats } = dashboardData;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Good morning, Dr. {doctor.name}!</h1>
          <p className="text-muted-foreground">{doctor.specialization} • {doctor.experience} years experience</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Today's Schedule</p>
          <p className="text-2xl font-bold">{stats.todaysAppointments} appointments</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPatients}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todaysAppointments}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingRequests}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Today</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedToday}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAppointments}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todaysAppointments.length > 0 ? (
              <div className="space-y-4">
                {todaysAppointments.map((appointment) => (
                  <div key={appointment._id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{appointment.patientId.name}</span>
                        <Badge variant="outline">
                          {appointment.patientId.age}Y, {appointment.patientId.gender}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-1">
                        <span>{formatTime(appointment.appointmentTime)}</span>
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {appointment.patientId.phone}
                        </span>
                      </div>
                      <p className="text-sm">{appointment.reason}</p>
                      {appointment.symptoms.length > 0 && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Symptoms: {appointment.symptoms.join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No appointments scheduled for today
              </p>
            )}
          </CardContent>
        </Card>

        {/* Pending Appointment Requests */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Pending Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingAppointments.length > 0 ? (
              <div className="space-y-4">
                {pendingAppointments.map((appointment) => (
                  <div key={appointment._id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{appointment.patientId.name}</span>
                      <Badge variant="outline">
                        {appointment.patientId.age}Y, {appointment.patientId.gender}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span>{formatDate(appointment.appointmentDate)}</span>
                      <span>{formatTime(appointment.appointmentTime)}</span>
                    </div>
                    <p className="text-sm mb-3">{appointment.reason}</p>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={() => updateAppointmentStatus(appointment._id, 'confirmed')}
                      >
                        Accept
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => updateAppointmentStatus(appointment._id, 'cancelled')}
                      >
                        Decline
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No pending appointment requests
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Patients */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Recent Patients
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {patients.map((patient) => (
                <div key={patient._id} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{patient.name}</span>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">
                    {patient.age} years, {patient.gender}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <Phone className="h-3 w-3" />
                    {patient.phone}
                  </div>
                  {patient.medicalHistory.length > 0 && (
                    <div className="text-xs text-muted-foreground">
                      History: {patient.medicalHistory.slice(0, 2).join(', ')}
                      {patient.medicalHistory.length > 2 && '...'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No patients found
            </p>
          )}
        </CardContent>
      </Card>

      {/* All Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>All Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.slice(0, 10).map((appointment) => (
                <div key={appointment._id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{appointment.patientId.name}</span>
                      <Badge variant="outline">
                        {appointment.patientId.age}Y, {appointment.patientId.gender}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatDate(appointment.appointmentDate)}</span>
                      <span>{formatTime(appointment.appointmentTime)}</span>
                    </div>
                    <p className="text-sm mt-1">{appointment.reason}</p>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(appointment.status)}>
                      {appointment.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">
                      ₹{appointment.consultationFee}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No appointments found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
