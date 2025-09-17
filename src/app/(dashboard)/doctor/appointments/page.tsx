
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Appointment } from "@/lib/types";
import { Check, X } from "lucide-react";
import { format } from "date-fns";

async function getPendingAppointments(): Promise<Appointment[]> {
    try {
        // In a real app, you might have a dedicated endpoint for pending appointments.
        // For now, we fetch all and filter.
        const response = await fetch('http://localhost:3001/api/appointments', {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch appointments. Status: ${response.status}`);
        }

        const allAppointments = await response.json();
        
        // Filter for pending approvals and convert date strings to Date objects
        return allAppointments
            .filter((appt: Appointment) => appt.status === 'Pending Approval')
            .map((appt: any) => ({
                ...appt,
                date: new Date(appt.date)
            }));

    } catch (error) {
        console.error("Error fetching pending appointments:", error);
        return [];
    }
}


export default async function DoctorAppointmentsPage() {
    const pendingAppointments = await getPendingAppointments();

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight font-headline">Appointment Requests</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Pending Approvals</CardTitle>
                    <CardDescription>Review and respond to new appointment requests from patients.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Patient</TableHead>
                                <TableHead>Requested Date</TableHead>
                                <TableHead>Requested Time</TableHead>
                                <TableHead>Reason for Visit</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingAppointments.length > 0 ? pendingAppointments.map((appointment: Appointment) => (
                                <TableRow key={appointment.id}>
                                    <TableCell className="font-medium">{appointment.patient.name}</TableCell>
                                    <TableCell>{format(appointment.date, "MMMM d, yyyy")}</TableCell>
                                    <TableCell>{format(appointment.date, "h:mm a")}</TableCell>
                                    <TableCell>{appointment.reason}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" className="mr-2 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600">
                                            <Check className="mr-1 h-4 w-4" /> Approve
                                        </Button>
                                        <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600">
                                            <X className="mr-1 h-4 w-4" /> Reject
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                                        No pending appointment requests. This could also mean the backend is not running.
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
