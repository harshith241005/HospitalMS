
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <h2 className="text-3xl font-bold tracking-tight font-headline">Settings</h2>
            <p className="text-muted-foreground">Manage your account and notification preferences.</p>

            <Card>
                <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Choose how you want to be notified.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between space-x-4">
                        <div className="space-y-1">
                            <Label htmlFor="appointment-reminders" className="font-semibold">Appointment Reminders</Label>
                            <p className="text-sm text-muted-foreground">Receive reminders for your upcoming appointments.</p>
                        </div>
                        <Switch id="appointment-reminders" defaultChecked />
                    </div>
                    
                    <Separator />

                    <div className="flex items-center justify-between space-x-4">
                        <div className="space-y-1">
                            <Label htmlFor="prescription-alerts" className="font-semibold">Prescription Alerts</Label>
                            <p className="text-sm text-muted-foreground">Get notified when a new prescription is added or needs a renewal.</p>
                        </div>
                        <Switch id="prescription-alerts" defaultChecked />
                    </div>

                    <Separator />

                    <div className="space-y-4">
                        <h4 className="text-base font-semibold">Notification Channels</h4>
                        <div className="flex items-center justify-between space-x-4 pl-4">
                            <Label htmlFor="email-notifications">Email Notifications</Label>
                            <Switch id="email-notifications" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between space-x-4 pl-4">
                            <div>
                                <Label htmlFor="sms-notifications">SMS Notifications</Label>
                                <p className="text-xs text-muted-foreground">Coming soon!</p>
                            </div>
                            <Switch id="sms-notifications" disabled />
                        </div>
                         <div className="flex items-center justify-between space-x-4 pl-4">
                            <div>
                                <Label htmlFor="push-notifications">Push Notifications</Label>
                                <p className="text-xs text-muted-foreground">Coming soon!</p>
                            </div>
                            <Switch id="push-notifications" disabled />
                        </div>
                    </div>

                </CardContent>
            </Card>
        </div>
    );
}
