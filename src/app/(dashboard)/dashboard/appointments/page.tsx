import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { appointments } from "@/lib/placeholder-data";
import type { Appointment, AppointmentStatus } from "@/lib/types";
import { cn } from "@/lib/utils";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import { format } from "date-fns";

const statusColors: Record<AppointmentStatus, string> = {
    Scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Canceled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Pending Approval': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};

export default function AppointmentsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight font-headline">My Appointments</h2>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" /> Book New Appointment
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Appointment History</CardTitle>
                    <CardDescription>View and manage all your scheduled, completed, and canceled appointments.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Doctor</TableHead>
                                <TableHead>Specialization</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Time</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {appointments.map((appointment: Appointment) => (
                                <TableRow key={appointment.id}>
                                    <TableCell className="font-medium">{appointment.doctor.name}</TableCell>
                                    <TableCell>{appointment.doctor.specialization}</TableCell>
                                    <TableCell>{format(appointment.date, "MMMM d, yyyy")}</TableCell>
                                    <TableCell>{format(appointment.date, "h:mm a")}</TableCell>
                                    <TableCell>
                                        <Badge className={cn("border-transparent", statusColors[appointment.status])}>
                                            {appointment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                                {appointment.status === 'Scheduled' && <DropdownMenuItem>Reschedule</DropdownMenuItem>}
                                                {appointment.status === 'Scheduled' && <DropdownMenuItem className="text-red-600">Cancel</DropdownMenuItem>}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
