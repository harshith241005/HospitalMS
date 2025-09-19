
'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { patients, reports, prescriptions } from "@/lib/placeholder-data";
import type { Patient } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';

export default function PatientHistoryPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

    const handleSearch = () => {
        const foundPatient = patients.find(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            p.id.toLowerCase() === searchTerm.toLowerCase()
        );
        setSelectedPatient(foundPatient || null);
    };
    
    const patientReports = selectedPatient ? reports.filter(r => r.patientId === selectedPatient.id) : [];
    const patientPrescriptions = selectedPatient ? prescriptions.filter(p => p.patient.id === selectedPatient.id) : [];

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight font-headline">Patient Medical History</h2>
            <Card>
                <CardHeader>
                    <CardTitle>Search Patient</CardTitle>
                    <CardDescription>Enter a patient's name or ID to view their history.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex w-full max-w-sm items-center space-x-2">
                        <Input 
                            type="text" 
                            placeholder="Patient Name or ID..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <Button onClick={handleSearch}><Search className="mr-2 h-4 w-4" /> Search</Button>
                    </div>
                </CardContent>
            </Card>

            {selectedPatient ? (
                <div className="space-y-6">
                     <Card>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarImage src={selectedPatient.avatarUrl} alt={selectedPatient.name} />
                                <AvatarFallback>{selectedPatient.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className="text-2xl">{selectedPatient.name}</CardTitle>
                                <CardDescription>{selectedPatient.email} | ID: {selectedPatient.id}</CardDescription>
                            </div>
                        </CardHeader>
                    </Card>
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Prescriptions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {patientPrescriptions.length > 0 ? patientPrescriptions.map(p => (
                                        <li key={p.id} className="text-sm">
                                            <p className="font-semibold">{p.medications.map(m=>m.name).join(', ')}</p>
                                            <p className="text-muted-foreground">
                                                Prescribed on {format(p.date, "MMMM d, yyyy")}
                                            </p>
                                        </li>
                                    )) : <p className="text-sm text-muted-foreground">No prescriptions found.</p>}
                                </ul>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Uploaded Reports</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {patientReports.length > 0 ? patientReports.map(r => (
                                        <li key={r.id} className="text-sm">
                                            <p className="font-semibold">{r.name}</p>
                                             <p className="text-muted-foreground">
                                                Uploaded on {format(r.uploadDate, "MMMM d, yyyy")}
                                            </p>
                                        </li>
                                    )) : <p className="text-sm text-muted-foreground">No reports found.</p>}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            ) : (
                <Card className="mt-6">
                    <CardContent className="text-center text-muted-foreground py-12">
                        <p>Search for a patient to see their details.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
