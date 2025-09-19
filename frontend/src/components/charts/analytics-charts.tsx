'use client';

import React from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  getAppointmentsPerMonth, 
  getDoctorUtilization, 
  getBedOccupancyRate, 
  getRevenueData,
  doctors,
  appointments,
  hospitalInfo
} from '@/lib/placeholder-data';

// Patient Dashboard Charts
export function PatientAppointmentsChart() {
  const data = getAppointmentsPerMonth().slice(0, 6); // Last 6 months
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Appointments This Year</CardTitle>
        <CardDescription>Your appointment history</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="appointments" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function MedicationAdherenceGauge({ adherence = 85 }: { adherence?: number }) {
  const data = [
    { name: 'Adherence', value: adherence, fill: '#10B981' },
    { name: 'Missed', value: 100 - adherence, fill: '#E5E7EB' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Medication Adherence</CardTitle>
        <CardDescription>Current month compliance</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={80}
              startAngle={90}
              endAngle={450}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="text-center mt-2">
          <span className="text-2xl font-bold text-green-600">{adherence}%</span>
          <p className="text-sm text-gray-500">Compliance Rate</p>
        </div>
      </CardContent>
    </Card>
  );
}

export function VitalsTrendChart() {
  const vitalsData = [
    { date: '2025-01', bp: 120, sugar: 95, weight: 70 },
    { date: '2025-02', bp: 118, sugar: 92, weight: 69 },
    { date: '2025-03', bp: 122, sugar: 98, weight: 71 },
    { date: '2025-04', bp: 115, sugar: 90, weight: 68 },
    { date: '2025-05', bp: 119, sugar: 94, weight: 70 },
    { date: '2025-06', bp: 117, sugar: 91, weight: 69 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Vitals Trend</CardTitle>
        <CardDescription>BP, Sugar, Weight over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={vitalsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="bp" stroke="#EF4444" name="BP (Systolic)" />
            <Line type="monotone" dataKey="sugar" stroke="#F59E0B" name="Blood Sugar" />
            <Line type="monotone" dataKey="weight" stroke="#10B981" name="Weight (kg)" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Doctor Dashboard Charts
export function DoctorAppointmentLoadChart() {
  const weekData = [
    { day: 'Mon', appointments: 8, completed: 6 },
    { day: 'Tue', appointments: 6, completed: 5 },
    { day: 'Wed', appointments: 10, completed: 8 },
    { day: 'Thu', appointments: 7, completed: 7 },
    { day: 'Fri', appointments: 9, completed: 6 },
    { day: 'Sat', appointments: 4, completed: 4 },
    { day: 'Sun', appointments: 2, completed: 2 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Weekly Appointment Load</CardTitle>
        <CardDescription>Scheduled vs completed appointments</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={weekData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="appointments" fill="#3B82F6" name="Scheduled" />
            <Bar dataKey="completed" fill="#10B981" name="Completed" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function PatientWaitingTimeChart() {
  const waitingData = [
    { time: '9 AM', avgWait: 15 },
    { time: '10 AM', avgWait: 22 },
    { time: '11 AM', avgWait: 18 },
    { time: '2 PM', avgWait: 12 },
    { time: '3 PM', avgWait: 25 },
    { time: '4 PM', avgWait: 20 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Average Waiting Time</CardTitle>
        <CardDescription>Patient wait time by hour</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={waitingData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} min`, 'Wait Time']} />
            <Line type="monotone" dataKey="avgWait" stroke="#F59E0B" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function AppointmentStatusPieChart() {
  const statusData = [
    { name: 'Completed', value: 65, fill: '#10B981' },
    { name: 'Pending', value: 20, fill: '#F59E0B' },
    { name: 'Cancelled', value: 10, fill: '#EF4444' },
    { name: 'Rescheduled', value: 5, fill: '#6B7280' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Appointment Status</CardTitle>
        <CardDescription>This month's appointment breakdown</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              outerRadius={60}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

// Admin Dashboard Charts
export function AppointmentsPerDepartmentChart() {
  const deptData = hospitalInfo.departments.map(dept => ({
    department: dept.name,
    appointments: Math.floor(Math.random() * 50) + 20,
    revenue: Math.floor(Math.random() * 100000) + 50000
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Appointments by Department</CardTitle>
        <CardDescription>Monthly department performance</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={deptData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis dataKey="department" type="category" width={80} />
            <Tooltip />
            <Bar dataKey="appointments" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function RevenueOverTimeChart() {
  const revenueData = getRevenueData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Revenue Trend</CardTitle>
        <CardDescription>Last 12 months revenue performance</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `₹${value / 1000}K`} />
            <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']} />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function DoctorUtilizationChart() {
  const utilizationData = doctors.map(doctor => ({
    name: doctor.name.replace('Dr. ', ''),
    utilization: getDoctorUtilization(doctor.id),
    specialization: doctor.specialization
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Doctor Utilization</CardTitle>
        <CardDescription>Confirmed appointments / Available slots * 100</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={utilizationData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis tickFormatter={(value) => `${value}%`} />
            <Tooltip 
              formatter={(value, name, props) => [
                `${value}%`, 
                'Utilization',
                `Specialization: ${props.payload.specialization}`
              ]} 
            />
            <Bar dataKey="utilization" fill="#8B5CF6" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function BedOccupancyChart() {
  const occupancyData = [
    { type: 'General Ward', total: 20, occupied: 16 },
    { type: 'Private Room', total: 15, occupied: 12 },
    { type: 'ICU', total: 8, occupied: 6 },
    { type: 'Emergency', total: 5, occupied: 3 }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium">Bed Occupancy Rate</CardTitle>
        <CardDescription>Current occupancy by room type</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={occupancyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="type" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#E5E7EB" name="Total Beds" />
            <Bar dataKey="occupied" fill="#EF4444" name="Occupied" />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-center">
          <span className="text-lg font-bold text-red-600">{getBedOccupancyRate()}%</span>
          <p className="text-sm text-gray-500">Overall Occupancy</p>
        </div>
      </CardContent>
    </Card>
  );
}
