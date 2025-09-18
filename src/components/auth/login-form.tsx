'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup,
  User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

interface LoginFormProps {
  userType: 'Patient' | 'Staff';
}

export default function LoginForm({ userType }: LoginFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleRoleBasedRedirect = async (user: User) => {
    // This is a placeholder for role-based logic.
    // In a real app, you'd fetch the user's role from your backend/Firestore
    // after getting the ID token.
    const email = user.email || '';

    if (email.startsWith('admin')) {
        router.push('/admin');
    } else if (email.startsWith('doctor')) {
        router.push('/doctor');
    } else {
        router.push('/dashboard');
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const { email, password } = values;
    
    // Test account logic
    const testAccounts: { [email: string]: string } = {
        'admin@hospital.com': '/admin',
        'doctor@hospital.com': '/doctor',
        'patient@hospital.com': '/dashboard'
    };

    if (testAccounts[email] && password === '12345678') {
      try {
        // We need a signed-in user for the dashboard logic to work, but it doesn't have to be the *right* one
        // for this mock scenario. We can sign in an anonymous or test user.
        // A more robust mock would involve custom tokens.
        if (auth.currentUser?.email !== 'test@test.com') {
             await signInWithEmailAndPassword(auth, 'test@test.com', '12345678').catch(async () => {
                await auth.createUserWithEmailAndPassword('test@test.com', '12345678');
                await signInWithEmailAndPassword(auth, 'test@test.com', '12345678');
             });
        }
        
        // Create a mock user object for redirection logic
        const mockUser = { email: email } as User;
        await handleRoleBasedRedirect(mockUser);

      } catch (e: any) {
        console.error("Test account login error:", e.message);
        toast({
            variant: 'destructive',
            title: 'Test Account Login Failed',
            description: "Could not sign in with the test account. Please check Firebase connectivity.",
        });
      } finally {
        setIsLoading(false);
      }
      return;
    }


    try {
      const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
      await handleRoleBasedRedirect(userCredential.user);

    } catch (error: any) {
      let description = "Invalid credentials. Please check your email and password.";
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        // No console log needed here as it's an expected user error.
      } else {
        console.error('Authentication error:', error.message);
        description = "An unexpected error occurred. Please try again.";
      }
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    const provider = new GoogleAuthProvider();
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      await handleRoleBasedRedirect(result.user);
    } catch (error: any) {
      console.error('Google Sign-In Error:', error.message);
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Failed',
        description: "Could not sign in with Google. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <fieldset disabled={isLoading} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="name@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>Password</FormLabel>
                       <Link
                        href="/forgot-password"
                        className="text-sm font-medium text-primary hover:underline"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </Form>
        {userType === 'Patient' && (
          <>
            <div className="relative my-6">
              <Separator />
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <Button variant="outline" onClick={handleGoogleSignIn} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
                  <path
                    fill="currentColor"
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.6 1.98-4.66 1.98-3.56 0-6.47-2.91-6.47-6.47s2.91-6.47 6.47-6.47c1.94 0 3.32.73 4.31 1.69l2.43-2.43C16.71 3.29 14.75 2.5 12.48 2.5c-4.97 0-9 4.03-9 9s4.03 9 9 9c4.85 0 8.53-3.46 8.53-8.75v-.25h-8.53z"
                  ></path>
                </svg>
                Google
              </Button>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center p-6 pt-0">
        {userType === 'Patient' ? (
            <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link
                    href="/register"
                    className="font-medium text-primary hover:underline"
                >
                    Sign up
                </Link>
            </p>
        ) : (
            <p className="text-sm text-muted-foreground">
                <Link
                    href="/"
                    className="font-medium text-primary hover:underline"
                >
                    Back to main login options
                </Link>
            </p>
        )}
      </CardFooter>
    </Card>
  );
}
