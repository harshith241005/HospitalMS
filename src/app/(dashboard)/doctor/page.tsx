import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { users } from "@/lib/placeholder-data";
import { Calendar, MoreHorizontal, User, UserCheck } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Appointment, Patient } from "@/lib/types";

async function getDoctorData(doctorId: string) {
    try {
        const appointmentsPromise = fetch(`http://localhost:3001/api/appointments/doctor/${doctorId}`, { cache: 'no-store' });
        const patientsPromise = fetch(`http://localhost:3001/api/patients/doctor/${doctorId}`, { cache: 'no-store' });

        const [appointmentsResponse, patientsResponse] = await Promise.all([appointmentsPromise, patientsPromise]);

        if (!appointmentsResponse.ok) {
            console.error(`Failed to fetch doctor appointments. Status: ${appointmentsResponse.status}`);
        }
        const appointments = appointmentsResponse.ok ? await appointmentsResponse.json() : [];
        const mappedAppointments = appointments.map((appt: any) => ({
            ...appt,
            date: new Date(appt.date)
        }));


        if (!patientsResponse.ok) {
            console.error(`Failed to fetch doctor patients. Status: ${patientsResponse.status}`);
        }
        const patients = patientsResponse.ok ? await patientsResponse.json() : [];

        return { appointments: mappedAppointments, patients };

    } catch (error) {
        console.error("Error fetching doctor data:", error);
        return { appointments: [], patients: [] };
    }
}


export default async function DoctorDashboardPage() {
    const currentUser = users.find(u => u.role === 'doctor');
    const { appointments, patients: myPatients } = await getDoctorData(currentUser?.id || 'doc-1');
    
    const todayAppointments = appointments.filter((a: Appointment) => new Date(a.date).toDateString() === new Date().toDateString() && (a.status === 'Scheduled'));
    const pendingAppointments = appointments.filter((a: Appointment) => a.status === 'Pending Approval').slice(0, 3);

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Welcome, {currentUser?.name}!</h2>
                    <p className="text-muted-foreground">Here's what's on your schedule for today.</p>
                </div>
                 <div className="flex items-center space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild><Link href="/dashboard">Patient View</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href="/doctor">Doctor View</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href="/admin">Admin View</Link></DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
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
                            <Link href="/doctor/patients">View All Patients</Link>
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
                                {todayAppointments.map((appt: Appointment) => (
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
                                {pendingAppointments.map((appt: Appointment) => (
                                    <li key={appt.id} className="flex items-center justify-between text-sm p-2 rounded-lg hover:bg-secondary">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={appt.patient.avatarUrl} alt={appt.patient.name} />
                                                <AvatarFallback>{(appt.patient.name as string).charAt(0)}</AvatarFallback>
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

    