import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, Wallet } from "lucide-react";
import { format } from 'date-fns';

const billingHistory = [
    { id: 'inv-001', date: new Date('2024-05-15'), service: 'Annual Checkup', amount: 150.00, status: 'Paid' },
    { id: 'inv-002', date: new Date('2024-04-22'), service: 'Specialist Consultation', amount: 250.00, status: 'Paid' },
    { id: 'inv-003', date: new Date('2024-03-10'), service: 'Lab Test - Bloodwork', amount: 75.50, status: 'Paid' },
    { id: 'inv-004', date: new Date(), service: 'X-Ray Imaging', amount: 200.00, status: 'Pending' },
];

export default function BillingPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight font-headline">Billing & Payments</h2>
            <p className="text-muted-foreground">View your transaction history and download invoices.</p>
            <Card>
                <CardHeader>
                    <CardTitle>Payment History</CardTitle>
                    <CardDescription>A complete record of your payments and pending bills.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Invoice ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Service</TableHead>
                                <TableHead>Amount</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead><span className="sr-only">Actions</span></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {billingHistory.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.id}</TableCell>
                                    <TableCell>{format(item.date, 'MMMM d, yyyy')}</TableCell>
                                    <TableCell>{item.service}</TableCell>
                                    <TableCell>${item.amount.toFixed(2)}</TableCell>
                                    <TableCell>{item.status}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="outline" size="sm">
                                            <Download className="mr-2 h-4 w-4" /> Download
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                             {billingHistory.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">
                                        <Wallet className="mx-auto h-12 w-12 text-muted-foreground" />
                                        <p className="mt-2">No billing history found.</p>
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
