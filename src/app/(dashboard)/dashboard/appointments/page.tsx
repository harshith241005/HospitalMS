
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Appointment, AppointmentStatus, Patient, Doctor } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PlusCircle, Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { appointments as placeholderAppointments, doctors, users } from "@/lib/placeholder-data";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

const statusColors: Record<AppointmentStatus, string> = {
    Scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Canceled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    'Pending Approval': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
};

const appointmentSchema = z.object({
    doctorId: z.string().min(1, "Please select a doctor."),
    date: z.date({ required_error: "Please select a date." }),
    reason: z.string().min(1, "Please provide a reason for your visit."),
});

// This is a mock function to simulate getting the current user.
const getCurrentPatient = (): Patient => {
    return users.find(u => u.email === 'patient@hospital.com') as Patient;
}


export default function AppointmentsPage() {
    // This state now acts as a trigger to re-render the component when the underlying placeholder data changes.
    const [appointments, setAppointments] = useState(placeholderAppointments);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();
    const currentPatient = getCurrentPatient();

    const form = useForm<z.infer<typeof appointmentSchema>>({
        resolver: zodResolver(appointmentSchema),
        defaultValues: {
            reason: "",
        },
    });

    const onSubmit = (values: z.infer<typeof appointmentSchema>) => {
        const selectedDoctor = doctors.find(d => d.id === values.doctorId) as Doctor;
        
        const newAppointment: Appointment = {
            id: `appt-${Date.now()}`,
            patient: currentPatient,
            doctor: selectedDoctor,
            date: values.date,
            status: 'Pending Approval',
            reason: values.reason,
        };

        // Directly mutate the central placeholder data array
        placeholderAppointments.unshift(newAppointment);

        // Update the local state to trigger a re-render
        setAppointments([...placeholderAppointments]);
        
        toast({
            title: "Appointment Requested",
            description: `Your request has been sent to Dr. ${selectedDoctor.name} and is pending approval.`,
        });
        setIsDialogOpen(false);
        form.reset();
    };
    
    // Filter appointments directly from the potentially updated central array
    const currentUserAppointments = appointments.filter(a => a.patient.id === currentPatient.id);
    const upcomingAppointments = currentUserAppointments.filter(a => new Date(a.date) >= new Date() && a.status !== 'Canceled');
    const pastAppointments = currentUserAppointments.filter(a => new Date(a.date) < new Date() || a.status === 'Canceled');


    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight font-headline">My Appointments</h2>
                 <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" /> Book New Appointment
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Book an Appointment</DialogTitle>
                        </DialogHeader>
                         <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="doctorId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Doctor</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a doctor" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {doctors.map(d => <SelectItem key={d.id} value={d.id}>Dr. {d.name} ({d.specialization})</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Appointment Date</FormLabel>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant={"outline"}
                                                            className={cn(
                                                                "w-full pl-3 text-left font-normal",
                                                                !field.value && "text-muted-foreground"
                                                            )}
                                                            >
                                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="start">
                                                    <Calendar
                                                        mode="single"
                                                        selected={field.value}
                                                        onSelect={field.onChange}
                                                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                                                        initialFocus
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="reason"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Reason for Visit</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="Briefly describe the reason for your visit..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">Request Appointment</Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Doctor</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Reason</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {upcomingAppointments.length > 0 ? upcomingAppointments.map((appointment: Appointment) => (
                                <TableRow key={appointment.id}>
                                    <TableCell className="font-medium">Dr. {appointment.doctor.name}</TableCell>
                                    <TableCell>{format(new Date(appointment.date), "MMMM d, yyyy 'at' h:mm a")}</TableCell>
                                    <TableCell>
                                        <Badge className={cn("border-transparent", statusColors[appointment.status])}>
                                            {appointment.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{appointment.reason}</TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">No upcoming appointments.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

             <Card>
                <CardHeader>
                    <CardTitle>Past Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Doctor</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pastAppointments.length > 0 ? pastAppointments.map((appointment: Appointment) => (
                                <TableRow key={appointment.id}>
                                    <TableCell className="font-medium">Dr. {appointment.doctor.name}</TableCell>
                                    <TableCell>{format(new Date(appointment.date), "MMMM d, yyyy")}</TableCell>
                                    <TableCell>
                                        <Badge className={cn("border-transparent", statusColors[appointment.status])}>
                                            {appointment.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24">No past appointments.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );

}
