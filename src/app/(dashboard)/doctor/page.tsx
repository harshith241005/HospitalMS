import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { appointments } from "@/lib/placeholder-data";
import { Calendar, UserCheck } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export default function DoctorDashboardPage() {
    const todayAppointments = appointments.filter(a => new Date(a.date).toDateString() === new Date().toDateString() && (a.status === 'Scheduled'));
    const pendingAppointments = appointments.filter(a => a.status === 'Pending Approval').slice(0, 3);

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Welcome, Dr. Grant!</h2>
                    <p className="text-muted-foreground">Here's what's on your schedule for today.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
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
                        {pendingAppointments.length > 0 ? (
                            <ul className="space-y-2">
                                {pendingAppointments.map(appt => (
                                    <li key={appt.id} className="flex items-center justify-between text-sm">
                                        <p className="font-semibold">{appt.patient.name}</p>
                                        <p className="text-muted-foreground">{format(appt.date, "MMM d, h:mm a")}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">No pending requests.</p>
                        )}
                        <Button variant="link" asChild className="p-0 h-auto mt-4">
                            <Link href="/doctor/appointments">Manage Requests</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
