import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { users } from "@/lib/placeholder-data";
import { Calendar, FileText, MoreHorizontal, PlusCircle, UploadCloud } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { Appointment, Prescription, Report } from "@/lib/types";


async function getPatientDashboardData(patientId: string) {
    try {
        const appointmentsPromise = fetch(`http://localhost:3001/api/appointments/patient/${patientId}?status=Scheduled&_limit=2`, { cache: 'no-store' });
        const prescriptionsPromise = fetch(`http://localhost:3001/api/prescriptions/patient/${patientId}?_limit=2`, { cache: 'no-store' });
        const reportsPromise = fetch(`http://localhost:3001/api/reports/patient/${patientId}?_limit=1`, { cache: 'no-store' });

        const [appointmentsResponse, prescriptionsResponse, reportsResponse] = await Promise.all([
            appointmentsPromise,
            prescriptionsPromise,
            reportsPromise,
        ]);

        const upcomingAppointments = appointmentsResponse.ok 
            ? (await appointmentsResponse.json()).map((a: any) => ({...a, date: new Date(a.date)}))
            : [];
        
        const recentPrescriptions = prescriptionsResponse.ok 
            ? (await prescriptionsResponse.json()).map((p: any) => ({...p, date: new Date(p.date)}))
            : [];

        const recentReports = reportsResponse.ok 
            ? (await reportsResponse.json()).map((r: any) => ({...r, uploadDate: new Date(r.uploadDate)}))
            : [];

        return { upcomingAppointments, recentPrescriptions, recentReports };

    } catch (error) {
        console.error("Error fetching patient dashboard data:", error);
        return { upcomingAppointments: [], recentPrescriptions: [], recentReports: [] };
    }
}


export default async function PatientDashboardPage() {
    const currentUser = users.find(u => u.role === 'patient');
    const { upcomingAppointments, recentPrescriptions, recentReports } = await getPatientDashboardData(currentUser?.id || 'pat-1');

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Welcome, {currentUser?.name.split(' ')[0]}!</h2>
                    <p className="text-muted-foreground">Here's a quick overview of your health dashboard.</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Book Appointment
                    </Button>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild><Link href="/dashboard">Patient View</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href="/doctor">Doctor View</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link href="/admin">Admin View</Link></DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {upcomingAppointments.length > 0 ? (
                            <ul className="space-y-4">
                                {upcomingAppointments.map((appt: Appointment) => (
                                    <li key={appt.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary">
                                        <div>
                                            <p className="font-semibold">Dr. {appt.doctor.name}</p>
                                            <p className="text-sm text-muted-foreground">{appt.reason}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{format(appt.date, "EEE, MMM d")}</p>
                                            <p className="text-xs text-muted-foreground">{format(appt.date, "h:mm a")}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">No upcoming appointments.</p>
                        )}
                        <Button variant="link" asChild className="p-0 h-auto mt-4">
                            <Link href="/dashboard/appointments">View all appointments</Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Recent Prescriptions</CardTitle>
                        <FileText className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {recentPrescriptions.length > 0 ? (
                             <ul className="space-y-4">
                                {recentPrescriptions.map((presc: Prescription) => (
                                    <li key={presc.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary">
                                        <div>
                                            <p className="font-semibold">{presc.medications.map(m => m.name).join(', ')}</p>
                                            <p className="text-sm text-muted-foreground">Prescribed by Dr. {presc.doctor.name}</p>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{format(presc.date, "MMM d, yyyy")}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                             <p className="text-sm text-muted-foreground">No recent prescriptions.</p>
                        )}
                         <Button variant="link" asChild className="p-0 h-auto mt-4">
                            <Link href="/dashboard/prescriptions">View all prescriptions</Link>
                        </Button>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Medical Reports</CardTitle>
                        <UploadCloud className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        {recentReports.length > 0 ? (
                            <ul className="space-y-4">
                                {recentReports.map((report: Report) => (
                                    <li key={report.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary">
                                        <div>
                                            <p className="font-semibold">{report.name}</p>
                                            <p className="text-sm text-muted-foreground">Uploaded on {format(report.uploadDate, "MMM d, yyyy")}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-sm text-muted-foreground">No reports uploaded.</p>
                        )}
                        <Button variant="link" asChild className="p-0 h-auto mt-4">
                            <Link href="/dashboard/reports">View or upload reports</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
