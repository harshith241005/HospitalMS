import RegisterForm from '@/components/auth/register-form';
import { Stethoscope } from 'lucide-react';

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Stethoscope className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-center font-headline tracking-tight text-gray-900 dark:text-gray-50">
            Create an Account
          </h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Join MediTrack Pro to manage your health with ease.
          </p>
        </div>
        <RegisterForm />
      </div>
    </main>
  );
}
