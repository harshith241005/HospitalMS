import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { reports } from "@/lib/placeholder-data";
import type { Report } from "@/lib/types";
import { MoreHorizontal, UploadCloud, Download, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ReportsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight font-headline">My Medical Reports</h2>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Upload New Report</CardTitle>
                    <CardDescription>Upload your medical documents like lab results, scans, and summaries.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="report-file">Select file</Label>
                        <div className="flex w-full max-w-sm items-center space-x-2">
                            <Input id="report-file" type="file" />
                            <Button><UploadCloud className="mr-2 h-4 w-4" /> Upload</Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Uploaded Reports</CardTitle>
                    <CardDescription>Access and manage all your uploaded medical reports.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>File Name</TableHead>
                                <TableHead>Upload Date</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reports.map((report: Report) => (
                                <TableRow key={report.id}>
                                    <TableCell className="font-medium">{report.name}</TableCell>
                                    <TableCell>{format(report.uploadDate, "MMMM d, yyyy")}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem>
                                                    <Download className="mr-2 h-4 w-4" />
                                                    Download
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
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
