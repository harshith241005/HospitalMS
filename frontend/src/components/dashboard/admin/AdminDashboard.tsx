'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  Calendar, 
  Building, 
  Bed, 
  Activity,
  TrendingUp,
  Clock,
  User
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface HospitalStats {
  totalPatients: number;
  totalDoctors: number;
  totalAppointments: number;
  totalDepartments: number;
  totalRooms: number;
  occupiedRooms: number;
  availableRooms: number;
  todaysAppointments: number;
  occupancyRate: number;
}

interface DepartmentStat {
  _id: string;
  name: string;
  totalBeds: number;
  doctorCount: number;
}

interface RoomStat {
  _id: string;
  total: number;
  occupied: number;
  available: number;
}

interface AppointmentTrend {
  _id: {
    year: number;
    month: number;
  };
  count: number;
}

interface RecentAppointment {
  _id: string;
  patientId: {
    name: string;
    age: number;
    gender: string;
  };
  doctorId: {
    name: string;
    specialization: string;
  };
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  reason: string;
}

interface AdminData {
  name: string;
  email: string;
  designation: string;
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState<{
    admin: AdminData;
    stats: {
      overview: HospitalStats;
      departmentStats: DepartmentStat[];
      roomStats: RoomStat[];
      appointmentTrends: AppointmentTrend[];
    };
    recentAppointments: RecentAppointment[];
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

      const response = await fetch('http://localhost:5000/api/dashboard/admin', {
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

  const getMonthName = (month: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[month - 1];
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

  const { admin, stats, recentAppointments } = dashboardData;
  const { overview, departmentStats, roomStats, appointmentTrends } = stats;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hospital Management Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {admin.name} • {admin.designation}</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Today's Activity</p>
          <p className="text-2xl font-bold">{overview.todaysAppointments} appointments</p>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalPatients}</div>
            <p className="text-xs text-muted-foreground">Active patients in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalDoctors}</div>
            <p className="text-xs text-muted-foreground">Across {overview.totalDepartments} departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalAppointments}</div>
            <p className="text-xs text-muted-foreground">{overview.todaysAppointments} scheduled today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Room Occupancy</CardTitle>
            <Bed className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.occupancyRate}%</div>
            <p className="text-xs text-muted-foreground">
              {overview.occupiedRooms}/{overview.totalRooms} rooms occupied
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Rooms</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{overview.availableRooms}</div>
            <p className="text-xs text-muted-foreground">Ready for new patients</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Occupied Rooms</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{overview.occupiedRooms}</div>
            <p className="text-xs text-muted-foreground">Currently in use</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overview.totalDepartments}</div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              Department Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentStats.map((dept) => (
                <div key={dept._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{dept.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {dept.doctorCount} doctors • {dept.totalBeds} beds
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline">{dept.doctorCount} docs</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Room Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bed className="h-5 w-5" />
              Room Status by Type
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {roomStats.map((room) => (
                <div key={room._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{room._id}</h4>
                    <p className="text-sm text-muted-foreground">
                      Total: {room.total} rooms
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Badge className="bg-green-100 text-green-800">
                      {room.available} available
                    </Badge>
                    <Badge className="bg-red-100 text-red-800">
                      {room.occupied} occupied
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointment Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Appointment Trends (Last 6 Months)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-4 h-40">
            {appointmentTrends.map((trend, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="bg-primary rounded-t w-12 min-h-[20px]"
                  style={{ 
                    height: `${Math.max((trend.count / Math.max(...appointmentTrends.map(t => t.count))) * 120, 20)}px` 
                  }}
                ></div>
                <div className="text-xs text-center mt-2">
                  <div className="font-medium">{trend.count}</div>
                  <div className="text-muted-foreground">
                    {getMonthName(trend._id.month)} {trend._id.year}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Appointments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Appointments
          </CardTitle>
        </CardHeader>
        <CardContent>
          {recentAppointments.length > 0 ? (
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
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
                      <span>Dr. {appointment.doctorId.name}</span>
                      <span>{appointment.doctorId.specialization}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{formatDate(appointment.appointmentDate)}</span>
                      <span>{appointment.appointmentTime}</span>
                    </div>
                    <p className="text-sm mt-1">{appointment.reason}</p>
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
              No recent appointments
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
