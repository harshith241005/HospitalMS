
'use client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { appointments } from "@/lib/placeholder-data";
import { format } from "date-fns";
import { useState, useEffect } from 'react';

export default function SchedulePage() {
    const loggedInDoctorId = 'doc-1'; 

    const [scheduledDates, setScheduledDates] = useState<Date[]>([]);
    const [upcomingAppointments, setUpcomingAppointments] = useState(appointments
        .filter(a => a.doctor.id === loggedInDoctorId && a.status === 'Scheduled' && new Date(a.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5));

    useEffect(() => {
        const dates = appointments
            .filter(a => a.doctor.id === loggedInDoctorId && a.status === 'Scheduled')
            .map(a => new Date(a.date));
        setScheduledDates(dates);
    }, []);
    
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight font-headline">My Schedule</h2>
            <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Calendar</CardTitle>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Calendar
                            mode="multiple"
                            selected={scheduledDates}
                            className="rounded-md border"
                            defaultMonth={new Date()}
                        />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {upcomingAppointments.length > 0 ? (
                            <ul className="space-y-4">
                                {upcomingAppointments.map(appt => (
                                    <li key={appt.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary">
                                        <div>
                                            <p className="font-semibold">{appt.patient.name}</p>
                                            <p className="text-sm text-muted-foreground">{appt.reason}</p>
                                        </div>
                                        <div className="text-right flex-shrink-0 ml-4">
                                            <p className="text-sm font-medium">{format(new Date(appt.date), "EEE, MMM d")}</p>
                                            <p className="text-xs text-muted-foreground">{format(new Date(appt.date), "h:mm a")}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
