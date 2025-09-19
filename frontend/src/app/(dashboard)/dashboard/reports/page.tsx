
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileText, Stethoscope } from "lucide-react";
import { reports, prescriptions } from "@/lib/placeholder-data";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PrescriptionCard from "@/components/dashboard/patient/prescription-card";

export default function PatientReportsPage() {

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight font-headline">My Medical Records</h2>
            <p className="text-muted-foreground">
                Access your prescriptions and lab reports in one place.
            </p>
            
            <Tabs defaultValue="prescriptions" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="prescriptions">
                        <Stethoscope className="mr-2 h-4 w-4" />
                        My Prescriptions
                    </TabsTrigger>
                    <TabsTrigger value="reports">
                        <FileText className="mr-2 h-4 w-4" />
                        My Lab Reports
                    </TabsTrigger>
                </TabsList>
                
                <TabsContent value="prescriptions" className="space-y-4">
                     <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                        {prescriptions.length > 0 ? (
                            prescriptions.map(p => <PrescriptionCard key={p.id} prescription={p} />)
                        ) : (
                             <Card className="col-span-full">
                                <CardContent className="h-48 flex flex-col items-center justify-center text-center">
                                    <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                                    <p className="mt-4">No prescriptions found.</p>
                                    <p className="text-sm text-muted-foreground">Your issued prescriptions will appear here.</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="reports" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Documents</CardTitle>
                            <CardDescription>All your available lab reports.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Document</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead><span className="sr-only">Actions</span></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reports.map((doc) => (
                                        <TableRow key={`${doc.id}`}>
                                            <TableCell className="font-medium">{doc.name}</TableCell>
                                            <TableCell>Lab Report</TableCell>
                                            <TableCell>{format(doc.uploadDate, 'MMMM d, yyyy')}</TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="outline" size="sm">
                                                    <Download className="mr-2 h-4 w-4" /> Download
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {reports.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center">
                                                <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                                                <p className="mt-2">No documents found.</p>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
