
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appointments, doctors, patients } from "@/lib/placeholder-data";
import { Calendar, Stethoscope, User } from "lucide-react";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { useEffect, useState } from "react";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalDoctors: 0,
        totalPatients: 0,
        upcomingAppointments: 0,
    });

    // This effect will re-run if the underlying placeholder data is mutated,
    // though for a real app, you'd fetch this data or use a global state manager.
    useEffect(() => {
        setStats({
            totalDoctors: doctors.length,
            totalPatients: patients.length,
            upcomingAppointments: appointments.filter(a => a.status === 'Scheduled').length,
        });
    }, []);


    const chartData = [
        { name: 'Jan', appointments: appointments.filter(a => new Date(a.date).getMonth() === 0).length },
        { name: 'Feb', appointments: appointments.filter(a => new Date(a.date).getMonth() === 1).length },
        { name: 'Mar', appointments: appointments.filter(a => new Date(a.date).getMonth() === 2).length },
        { name: 'Apr', appointments: appointments.filter(a => new Date(a.date).getMonth() === 3).length },
        { name: 'May', appointments: appointments.filter(a => new Date(a.date).getMonth() === 4).length },
        { name: 'Jun', appointments: appointments.filter(a => new Date(a.date).getMonth() === 5).length },
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
                        <div className="text-2xl font-bold">{stats.totalDoctors}</div>
                        <p className="text-xs text-muted-foreground">Currently active in the system.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalPatients}</div>
                        <p className="text-xs text-muted-foreground">Registered in the system.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.upcomingAppointments}</div>
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
