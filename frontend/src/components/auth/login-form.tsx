'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { signInWithGoogle, signInWithEmail } from '@/lib/auth';

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

  const handleRoleBasedRedirect = (userRole: string, email: string) => {
    // Handle role-based routing based on user role from backend
    console.log('Redirecting user with role:', userRole);
    
    switch (userRole) {
      case 'admin':
        console.log('Redirecting to /admin');
        window.location.href = '/admin';
        break;
      case 'doctor':
        console.log('Redirecting to /doctor');
        window.location.href = '/doctor';
        break;
      case 'patient':
        console.log('Redirecting to /dashboard');
        window.location.href = '/dashboard';
        break;
      default:
        console.log('Invalid role:', userRole);
        toast({
          variant: 'destructive',
          title: 'Access Denied',
          description: "Invalid user role. Please contact support.",
        });
        setIsLoading(false);
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const { email, password } = values;
    
    // Test account logic for demo purposes
    const testAccounts: { [email: string]: { role: string, route: string } } = {
        'harshithboyina@gmail.com': { role: 'admin', route: '/admin' },
        'doctor@hospital.com': { role: 'doctor', route: '/doctor' },
        'patient@hospital.com': { role: 'patient', route: '/dashboard' }
    };

    // Check for demo accounts with specific passwords
    const isDemoLogin = (email === 'harshithboyina@gmail.com' && password === 'harshith@#123') ||
                       (email === 'doctor@hospital.com' && password === '12345678') ||
                       (email === 'patient@hospital.com' && password === '12345678');

    if (testAccounts[email] && isDemoLogin) {
      const account = testAccounts[email];
      
      // Store user info in localStorage
      localStorage.setItem('user', JSON.stringify({
        email,
        role: account.role,
        name: email === 'harshithboyina@gmail.com' ? 'Harshith Boyina' : `Demo ${account.role}`,
        isAuthenticated: true,
        token: 'demo-token'
      }));
      
      toast({
        title: "Success!",
        description: `Logged in successfully as ${account.role}`,
      });
      
      // Use window.location.href for more reliable redirection
      console.log('Demo login successful, redirecting to:', account.route);
      setTimeout(() => {
        window.location.href = account.route;
      }, 1000);
      
      setIsLoading(false);
      return;
    }

    try {
      // Call backend login API
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Store user info and JWT token
        localStorage.setItem('user', JSON.stringify({
          email: data.user.email,
          role: data.user.role,
          name: data.user.name,
          id: data.user.id,
          isAuthenticated: true
        }));
        localStorage.setItem('token', data.token);

        toast({
          title: "Success!",
          description: `Logged in successfully as ${data.user.role}`,
        });

        // Handle role-based redirect
        handleRoleBasedRedirect(data.user.role, data.user.email);
      } else {
        toast({
          variant: 'destructive',
          title: 'Authentication Failed',
          description: data.message || 'Invalid credentials. Please check your email and password.',
        });
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleGoogleSignIn() {
    setIsLoading(true);
    try {
      if (userType === 'Patient') {
        // Use Firebase Google Sign In
        const user = await signInWithGoogle();
        
        if (user) {
          toast({
            title: "Success!",
            description: `Logged in successfully as ${user.name}`,
          });
          
          // Redirect based on role
          handleRoleBasedRedirect(user.role, user.email);
        } else {
          throw new Error('Failed to authenticate with Google');
        }
      } else {
        // Staff cannot use Google login
        toast({
          title: "Access Denied",
          description: "Staff members must use email login.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Google Sign In Error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with Google. Please try again.",
        variant: "destructive",
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
            <p className="text-xs text-muted-foreground px-1">
                For demo: Admin: `harshithboyina@gmail.com` / `harshith@#123`, Doctor: `doctor@hospital.com` / `12345678`, Patient: `patient@hospital.com` / `12345678`.
            </p>
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
