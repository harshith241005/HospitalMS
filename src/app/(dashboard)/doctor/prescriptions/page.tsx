'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { PlusCircle, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { prescriptions, patients } from '@/lib/placeholder-data';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

const prescriptionSchema = z.object({
    patientId: z.string().min(1, "Please select a patient."),
    medicationName: z.string().min(1, "Medication name is required."),
    dosage: z.string().min(1, "Dosage is required."),
    frequency: z.string().min(1, "Frequency is required."),
    notes: z.string().optional(),
});

export default function DoctorPrescriptionsPage() {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();
    const form = useForm<z.infer<typeof prescriptionSchema>>({
        resolver: zodResolver(prescriptionSchema),
        defaultValues: {
            patientId: '',
            medicationName: '',
            dosage: '',
            frequency: '',
            notes: '',
        }
    });

    const onSubmit = (values: z.infer<typeof prescriptionSchema>) => {
        console.log("New Prescription:", values);
        toast({
            title: "Prescription Created",
            description: `A new prescription for ${values.medicationName} has been created.`,
        });
        setIsDialogOpen(false);
        form.reset();
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight font-headline">Manage Prescriptions</h2>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <PlusCircle className="mr-2 h-4 w-4" /> Add Prescription
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Create New Prescription</DialogTitle>
                        </DialogHeader>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                                <FormField
                                    control={form.control}
                                    name="patientId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Patient</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a patient" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {patients.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="medicationName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Medication Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Lisinopril" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="dosage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Dosage</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., 10mg" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="frequency"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Frequency</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Once a day" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Notes</FormLabel>
                                            <FormControl>
                                                <Textarea placeholder="e.g., Take with food." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">Create Prescription</Button>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Prescription History</CardTitle>
                    <CardDescription>A log of all prescriptions you have issued.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Patient</TableHead>
                                <TableHead>Medication</TableHead>
                                <TableHead>Date Issued</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {prescriptions.map(p => (
                                <TableRow key={p.id}>
                                    <TableCell>{p.patient.name}</TableCell>
                                    <TableCell>{p.medications.map(m => m.name).join(', ')}</TableCell>
                                    <TableCell>{format(p.date, "MMMM d, yyyy")}</TableCell>
                                </TableRow>
                            ))}
                             {prescriptions.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <p className="mt-2">No prescriptions found.</p>
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
