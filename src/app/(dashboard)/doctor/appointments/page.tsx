
'use client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { appointments } from "@/lib/placeholder-data";
import type { Appointment } from "@/lib/types";
import { Check, X } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";

export default function DoctorAppointmentsPage() {
    const { toast } = useToast();
    // In a real app, you'd get the logged-in doctor's ID
    const loggedInDoctorId = 'doc-1'; 
    const [pendingAppointments, setPendingAppointments] = useState<Appointment[]>([]);

    useEffect(() => {
        setPendingAppointments(appointments.filter(a => a.doctor.id === loggedInDoctorId && a.status === 'Pending Approval'));
    }, []);

    const handleAppointmentAction = (appointmentId: string, action: 'approve' | 'reject') => {
        const appointmentIndex = appointments.findIndex(a => a.id === appointmentId);
        if (appointmentIndex > -1) {
            const appointment = appointments[appointmentIndex];
            if (action === 'approve') {
                appointments[appointmentIndex].status = 'Scheduled';
            } else {
                appointments[appointmentIndex].status = 'Canceled';
            }
            setPendingAppointments(prev => prev.filter(a => a.id !== appointmentId));
            toast({
                title: `Appointment ${action === 'approve' ? 'Approved' : 'Rejected'}`,
                description: `The appointment with ${appointment.patient.name} has been ${action === 'approve' ? 'scheduled' : 'rejected'}.`,
            });
        }
    };

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
                                    <TableCell>{format(new Date(appointment.date), "MMMM d, yyyy")}</TableCell>
                                    <TableCell>{format(new Date(appointment.date), "h:mm a")}</TableCell>
                                    <TableCell>{appointment.reason}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm" className="mr-2 border-green-500 text-green-500 hover:bg-green-50 hover:text-green-600" onClick={() => handleAppointmentAction(appointment.id, 'approve')}>
                                            <Check className="mr-1 h-4 w-4" /> Approve
                                        </Button>
                                        <Button variant="outline" size="sm" className="border-red-500 text-red-500 hover:bg-red-50 hover:text-red-600" onClick={() => handleAppointmentAction(appointment.id, 'reject')}>
                                            <X className="mr-1 h-4 w-4" /> Reject
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center text-muted-foreground h-24">
                                        No pending appointment requests.
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

    