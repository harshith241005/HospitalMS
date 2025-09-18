
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar, PieChart, Pie, Cell } from "recharts";

const appointmentData = [
  { name: 'Cardiology', count: 120 },
  { name: 'Pediatrics', count: 90 },
  { name: 'Neurology', count: 75 },
  { name: 'Orthopedics', count: 110 },
  { name: 'Oncology', count: 60 },
];

const revenueData = [
  { name: 'Jan', revenue: 45000 },
  { name: 'Feb', revenue: 52000 },
  { name: 'Mar', revenue: 71000 },
  { name: 'Apr', revenue: 65000 },
  { name: 'May', revenue: 82000 },
  { name: 'Jun', revenue: 94000 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function AdminReportsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight font-headline">Reports & Analytics</h2>
            <p className="text-muted-foreground">
                Visualizing hospital performance and key metrics.
            </p>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Appointments per Department</CardTitle>
                        <CardDescription>Number of appointments in the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={appointmentData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="count"
                                    nameKey="name"
                                    label={(props) => `${props.name}: ${props.value}`}
                                >
                                    {appointmentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle>Monthly Revenue</CardTitle>
                         <CardDescription>Revenue generated from services over the last 6 months.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                                <Legend />
                                <Bar dataKey="revenue" fill="hsl(var(--primary))" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
