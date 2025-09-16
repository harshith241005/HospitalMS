
import { Bell, CheckCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { notifications } from "@/lib/placeholder-data";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
    // In a real app, you'd filter notifications for the logged-in user
    const userNotifications = notifications.sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight font-headline">Notifications</h2>
                <Button variant="outline">
                    <CheckCheck className="mr-2 h-4 w-4" /> Mark all as read
                </Button>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Alerts</CardTitle>
                    <CardDescription>Here are your latest notifications and reminders.</CardDescription>
                </CardHeader>
                <CardContent>
                    {userNotifications.length > 0 ? (
                        <ul className="space-y-4">
                            {userNotifications.map(notif => (
                                <li key={notif.id} className={cn("flex items-start gap-4 p-4 rounded-lg", !notif.read && "bg-secondary")}>
                                    <div className={cn("p-2 rounded-full", !notif.read ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")}>
                                        <Bell className="h-5 w-5" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-semibold">{notif.title}</p>
                                        <p className="text-sm text-muted-foreground">{notif.message}</p>
                                    </div>
                                    <div className="text-xs text-muted-foreground flex-shrink-0">
                                        {formatDistanceToNow(notif.date, { addSuffix: true })}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <Bell className="mx-auto h-12 w-12" />
                            <p className="mt-4">You have no new notifications.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
