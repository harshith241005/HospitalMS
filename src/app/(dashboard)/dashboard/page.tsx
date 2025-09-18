
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { appointments, prescriptions, reports, users } from "@/lib/placeholder-data";
import type { Patient } from "@/lib/types";
import { Calendar, FileText, Pill } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

// This is a mock function to simulate getting the current user.
const getCurrentPatient = (): Patient => {
    return users.find(u => u.email === 'patient@hospital.com') as Patient;
}


export default function PatientDashboardPage() {
    const patient = getCurrentPatient();
    const upcomingAppointmentCount = appointments.filter(a => a.patient.id === patient.id && new Date(a.date) >= new Date() && a.status === 'Scheduled').length;
    const reportCount = reports.filter(r => r.patientId === patient.id).length;
    const prescriptionCount = prescriptions.filter(p => p.patient.id === patient.id).length;

    const latestAppointment = appointments
        .filter(a => a.patient.id === patient.id && a.status === 'Scheduled')
        .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

    const latestPrescription = prescriptions
        .filter(p => p.patient.id === patient.id)
        .sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];


    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">Welcome back, {patient.name}!</h2>
            <p className="text-muted-foreground">Here’s a quick overview of your health dashboard.</p>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{upcomingAppointmentCount}</div>
                        <p className="text-xs text-muted-foreground">You have {upcomingAppointmentCount} appointments scheduled.</p>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Prescriptions</CardTitle>
                        <Pill className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{prescriptionCount}</div>
                        <p className="text-xs text-muted-foreground">Total prescriptions issued.</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Medical Reports</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{reportCount}</div>
                        <p className="text-xs text-muted-foreground">Total reports available.</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Next Appointment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {latestAppointment ? (
                            <div>
                                <p className="text-lg font-semibold">Dr. {latestAppointment.doctor.name}</p>
                                <p className="text-muted-foreground">{new Date(latestAppointment.date).toLocaleString('default', { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute:'2-digit' })}</p>
                                <p className="mt-2">{latestAppointment.reason}</p>
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No upcoming appointments scheduled.</p>
                        )}
                        <Link href="/dashboard/appointments" passHref>
                            <Button className="mt-4">View All Appointments</Button>
                        </Link>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Latest Prescription</CardTitle>
                    </CardHeader>
                    <CardContent>
                         {latestPrescription ? (
                            <div>
                                <p className="text-lg font-semibold">{latestPrescription.medications.map(m => m.name).join(', ')}</p>
                                <p className="text-muted-foreground">Prescribed by Dr. {latestPrescription.doctor.name} on {new Date(latestPrescription.date).toLocaleDateString()}</p>
                                <p className="mt-2 text-sm">{latestPrescription.notes}</p>
                            </div>
                        ) : (
                            <p className="text-muted-foreground">No prescriptions found.</p>
                        )}
                        <Link href="/dashboard/reports" passHref>
                            <Button variant="outline" className="mt-4">View All Records</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
