
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { doctors, staff } from "@/lib/placeholder-data";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

type AttendanceStatus = 'present' | 'absent' | 'leave';

const allUsers: User[] = [...doctors, ...staff];

export default function AttendancePage() {
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [attendance, setAttendance] = useState<Record<string, AttendanceStatus>>({});
    const { toast } = useToast();

    const handleStatusChange = (userId: string, status: AttendanceStatus) => {
        setAttendance(prev => ({ ...prev, [userId]: status }));
    };

    const handleSaveAttendance = () => {
        // In a real app, you'd send this data to your backend
        console.log({
            date: date ? format(date, 'yyyy-MM-dd') : 'N/A',
            records: attendance
        });
        toast({
            title: "Attendance Saved",
            description: `Attendance for ${date ? format(date, 'MMMM d, yyyy') : ''} has been successfully recorded.`,
        });
    };

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-headline">Manage Attendance</h2>
                    <p className="text-muted-foreground">
                        Select a date and mark attendance for all doctors and staff.
                    </p>
                </div>
                <Button onClick={handleSaveAttendance} disabled={Object.keys(attendance).length === 0}>
                    <Save className="mr-2 h-4 w-4" /> Save Attendance
                </Button>
            </div>
            <div className="grid gap-6 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Select Date</CardTitle>
                        <CardDescription>Choose the date to mark attendance for.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                        />
                    </CardContent>
                </Card>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>User List</CardTitle>
                        <CardDescription>
                            Attendance for {date ? format(date, 'MMMM d, yyyy') : '...'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {allUsers.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint={user.dataAiHint} />
                                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p>{user.name}</p>
                                                    <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <RadioGroup
                                                defaultValue="present"
                                                className="flex justify-end gap-4"
                                                onValueChange={(value) => handleStatusChange(user.id, value as AttendanceStatus)}
                                                value={attendance[user.id] || 'present'}
                                            >
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="present" id={`${user.id}-present`} />
                                                    <Label htmlFor={`${user.id}-present`}>Present</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="absent" id={`${user.id}-absent`} />
                                                    <Label htmlFor={`${user.id}-absent`}>Absent</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="leave" id={`${user.id}-leave`} />
                                                    <Label htmlFor={`${user.id}-leave`}>Leave</Label>
                                                </div>
                                            </RadioGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

