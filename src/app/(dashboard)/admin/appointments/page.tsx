import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const statusColors: Record<AppointmentStatus, string> = {
    Scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Canceled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Pending Approval': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};

async function getAppointments(): Promise<Appointment[]> {
    try {
        const response = await fetch('http://localhost:3001/api/appointments', { 
          cache: 'no-store' 
        });
    
        if (!response.ok) {
          throw new Error(`Failed to fetch appointments. Status: ${response.status}`);
        }
        
        const data = await response.json();
        // The backend might return date strings, so we need to convert them to Date objects
        return data.map((appt: any) => ({
            ...appt,
            date: new Date(appt.date)
        }));
    
      } catch (error) {
        console.error("Error fetching appointments:", error);
        return []; 
      }
}


export default async function AllAppointmentsPage() {
    const appointments = await getAppointments();

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
                            {appointments.map((appointment: Appointment) => (
                                <TableRow key={appointment.id}>
                                    <TableCell className="font-medium">{appointment.patient.name}</TableCell>
                                    <TableCell>{appointment.doctor.name}</TableCell>
                                    <TableCell>{format(appointment.date, "MMMM d, yyyy")}</TableCell>
                                    <TableCell>{format(appointment.date, "h:mm a")}</TableCell>
                                    <TableCell>
                                        <Badge className={cn("border-transparent", statusColors[appointment.status])}>
                                            {appointment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{appointment.reason}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
