
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appointments } from "@/lib/placeholder-data";
import { Calendar, Clock, User } from "lucide-react";
import { format } from 'date-fns';
import { useState, useEffect } from "react";

export default function DoctorDashboardPage() {
    const loggedInDoctorId = 'doc-1';
    
    // Use state to make the component reactive to changes in the placeholder data
    const [doctorAppointments, setDoctorAppointments] = useState(() => appointments.filter(a => a.doctor.id === loggedInDoctorId));

    // This effect could be triggered by a global state change in a real app
    useEffect(() => {
        setDoctorAppointments(appointments.filter(a => a.doctor.id === loggedInDoctorId));
    }, [appointments]); // Dependency on the imported array itself

    const todayAppointments = doctorAppointments.filter(a => format(new Date(a.date), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && a.status === 'Scheduled');
    const pendingApprovals = doctorAppointments.filter(a => a.status === 'Pending Approval').length;
    const totalPatients = new Set(doctorAppointments.map(a => a.patient.id)).size;

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">Doctor Dashboard</h2>
            <p className="text-muted-foreground">Welcome to your professional dashboard.</p>
             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todayAppointments.length}</div>
                        <p className="text-xs text-muted-foreground">You have {todayAppointments.length} scheduled appointments today.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingApprovals}</div>
                        <p className="text-xs text-muted-foreground">{pendingApprovals} requests need your review.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Patients</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalPatients}</div>
                        <p className="text-xs text-muted-foreground">Total unique patients seen.</p>
                    </CardContent>
                </Card>
            </div>
             <Card>
                <CardHeader>
                    <CardTitle>Today's Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                    {todayAppointments.length > 0 ? (
                        <ul className="space-y-4">
                            {todayAppointments.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(appt => (
                                <li key={appt.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                                    <div>
                                        <p className="font-semibold">{appt.patient.name}</p>
                                        <p className="text-sm text-muted-foreground">{appt.reason}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-4">
                                        <p className="text-sm font-medium">{format(new Date(appt.date), "h:mm a")}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-8">No appointments scheduled for today.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
