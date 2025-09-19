import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Stethoscope, User, Shield } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-4xl">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Stethoscope className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-center font-headline tracking-tight text-gray-900 dark:text-gray-50">
            Welcome to MediTrack Pro
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Please select your login method.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="flex flex-col items-center justify-center p-8 text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <User className="h-6 w-6" />
                    </div>
                    <CardTitle className="mt-4 text-2xl font-semibold">For Patients</CardTitle>
                    <CardDescription className="mt-2 text-base text-muted-foreground">
                        Access your health records, book appointments, and view prescriptions.
                    </CardDescription>
                </CardHeader>
                <CardContent className="w-full">
                    <Link href="/login/patient" passHref>
                        <Button className="w-full" size="lg">Patient Login</Button>
                    </Link>
                    <p className="mt-4 text-sm text-muted-foreground">
                        Don&apos;t have an account?{' '}
                        <Link href="/register" className="text-primary font-medium hover:underline">
                            Sign Up
                        </Link>
                    </p>
                </CardContent>
            </Card>

            <Card className="flex flex-col items-center justify-center p-8 text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                     <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
                        <Shield className="h-6 w-6" />
                    </div>
                    <CardTitle className="mt-4 text-2xl font-semibold">For Hospital Staff</CardTitle>
                    <CardDescription className="mt-2 text-base text-muted-foreground">
                        Access admin and doctor dashboards to manage hospital operations.
                    </CardDescription>
                </CardHeader>
                <CardContent className="w-full">
                     <Link href="/login/staff" passHref>
                        <Button className="w-full" variant="outline" size="lg">Staff Login</Button>
                    </Link>
                     <p className="mt-4 text-sm text-muted-foreground">
                        Access for authorized personnel only.
                    </p>
                </CardContent>
            </Card>
        </div>
      </div>
    </main>
  );
}
