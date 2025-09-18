import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";
import { reports, prescriptions } from "@/lib/placeholder-data";
import { format } from "date-fns";

export default function PatientReportsPage() {

    const allDocuments = [
        ...reports.map(r => ({ ...r, type: 'Lab Report' })),
        ...prescriptions.map(p => ({ 
            id: p.id, 
            name: `Prescription: ${p.medications.map(m=>m.name).join(', ')}`, 
            uploadDate: p.date,
            type: 'Prescription'
        })),
    ].sort((a,b) => b.uploadDate.getTime() - a.uploadDate.getTime());

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight font-headline">My Reports</h2>
            <p className="text-muted-foreground">
                Access and download your prescriptions and lab reports.
            </p>
            <Card>
                <CardHeader>
                    <CardTitle>My Documents</CardTitle>
                    <CardDescription>All your available medical documents in one place.</CardDescription>
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
                            {allDocuments.map((doc) => (
                                <TableRow key={`${doc.type}-${doc.id}`}>
                                    <TableCell className="font-medium">{doc.name}</TableCell>
                                    <TableCell>{doc.type}</TableCell>
                                    <TableCell>{format(doc.uploadDate, 'MMMM d, yyyy')}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm">
                                            <Download className="mr-2 h-4 w-4" /> Download
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {allDocuments.length === 0 && (
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
        </div>
    );
}
