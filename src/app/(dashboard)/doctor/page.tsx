import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { appointments, patients } from "@/lib/placeholder-data";
import { Calendar, User, UserCheck } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DoctorDashboardPage() {
    const todayAppointments = appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString() && (a.status === 'Scheduled'));
    const pendingAppointments = appointments.filter(a => a.status === 'Pending Approval').slice(0, 3);
    const myPatients = patients.slice(0, 5); // Placeholder for doctor's assigned patients

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Welcome, Dr. Grant!</h2>
                    <p className="text-muted-foreground">Here's what's on your schedule for today.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Today's Appointments</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{todayAppointments.length}</div>
                        <p className="text-xs text-muted-foreground">
                            {todayAppointments.length > 0 ? `${todayAppointments.length} scheduled appointments.` : 'No appointments scheduled for today.'}
                        </p>
                        <Button variant="link" asChild className="p-0 h-auto mt-4">
                            <Link href="/doctor/schedule">View Full Schedule</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                        <UserCheck className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{pendingAppointments.length}</div>
                        <p className="text-xs text-muted-foreground">New patient requests.</p>
                       
                        <Button variant="link" asChild className="p-0 h-auto mt-4">
                            <Link href="/doctor/appointments">Manage Requests</Link>
                        </Button>
                    </CardContent>
                </Card>
                 <Card className="md:col-span-2 lg:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">My Patients</CardTitle>
                        <User className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                         <div className="text-2xl font-bold">{myPatients.length}</div>
                        <p className="text-xs text-muted-foreground">Recently active patients.</p>
                        <Button variant="link" asChild className="p-0 h-auto mt-4">
                            {/* This would link to a "My Patients" page */}
                            <Link href="#">View All Patients</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Schedule</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {todayAppointments.length > 0 ? (
                            <ul className="space-y-4">
                                {todayAppointments.map(appt => (
                                    <li key={appt.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary">
                                        <div>
                                            <p className="font-semibold">{appt.patient.name}</p>
                                            <p className="text-sm text-muted-foreground">{appt.reason}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{format(appt.date, "h:mm a")}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">Your schedule for today is clear.</p>
                        )}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Pending Appointment Requests</CardTitle>
                        <CardDescription>Review and respond to new patient requests.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {pendingAppointments.length > 0 ? (
                            <ul className="space-y-2">
                                {pendingAppointments.map(appt => (
                                    <li key={appt.id} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-secondary">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={appt.patient.avatarUrl} alt={appt.patient.name} />
                                                <AvatarFallback>{appt.patient.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{appt.patient.name}</p>
                                                <p className="text-xs text-muted-foreground">{appt.reason}</p>
                                            </div>
                                        </div>
                                        <p className="text-muted-foreground text-xs">{format(appt.date, "MMM d, h:mm a")}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-4">No pending requests.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
