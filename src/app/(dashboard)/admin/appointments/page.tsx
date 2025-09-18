
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { appointments as allAppointments } from "@/lib/placeholder-data";

const statusColors: Record<AppointmentStatus, string> = {
    Scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Canceled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Pending Approval': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};


export default function AllAppointmentsPage() {

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight font-headline">All Appointments</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Appointment Overview</CardTitle>
                    <CardDescription>A log of all appointments within the hospital.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Patient</TableHead>
                                <TableHead>Doctor</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Reason</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {allAppointments.length > 0 ? allAppointments.map((appointment: Appointment) => (
                                <TableRow key={appointment.id}>
                                    <TableCell className="font-medium">{appointment.patient.name}</TableCell>
                                    <TableCell>Dr. {appointment.doctor.name}</TableCell>
                                    <TableCell>{format(new Date(appointment.date), "MMMM d, yyyy")}</TableCell>
                                    <TableCell>{format(new Date(appointment.date), "h:mm a")}</TableCell>
                                    <TableCell>
                                        <Badge className={cn("border-transparent", statusColors[appointment.status])}>
                                            {appointment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{appointment.reason}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center h-24">
                                        No appointments found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
