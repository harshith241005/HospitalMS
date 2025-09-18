'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appointments, doctors, patients } from "@/lib/placeholder-data";
import { Calendar, Stethoscope, User } from "lucide-react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function AdminDashboardPage() {
    const totalDoctors = doctors.length;
    const totalPatients = patients.length;
    const upcomingAppointments = appointments.filter(a => a.status === 'Scheduled').length;
    
    const chartData = [
        { name: 'Jan', appointments: 45 },
        { name: 'Feb', appointments: 62 },
        { name: 'Mar', appointments: 78 },
        { name: 'Apr', appointments: 55 },
        { name: 'May', appointments: 89 },
        { name: 'Jun', appointments: 102 },
    ];

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight font-headline">Dashboard Overview</h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Doctors</CardTitle>
                        <Stethoscope className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalDoctors}</div>
                        <p className="text-xs text-muted-foreground">Currently active in the system.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPatients}</div>
                        <p className="text-xs text-muted-foreground">Registered in the system.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingAppointments}</div>
                        <p className="text-xs text-muted-foreground">Scheduled across all departments.</p>
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Appointment Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="appointments" fill="hsl(var(--primary))" />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    )
}
