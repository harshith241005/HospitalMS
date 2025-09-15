'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import Link from 'next/link';

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

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().min(6, {
    message: 'Password must be at least 6 characters.',
  }),
});

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Simulate login logic
    console.log(values);
    // In a real app, you'd call your auth provider here.
    // On success, redirect to the dashboard.
    // We'll simulate a role-based redirect.
    if (values.email.includes('admin')) {
      router.push('/admin');
    } else if (values.email.includes('doctor')) {
      router.push('/doctor');
    } else {
      router.push('/dashboard');
    }
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
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
                        href="#"
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
            </div>
            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Sign In
            </Button>
          </form>
        </Form>
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
          <Button variant="outline">
            <svg role="img" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
              <path
                fill="currentColor"
                d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.02-2.6 1.98-4.66 1.98-3.56 0-6.47-2.91-6.47-6.47s2.91-6.47 6.47-6.47c1.94 0 3.32.73 4.31 1.69l2.43-2.43C16.71 3.29 14.75 2.5 12.48 2.5c-4.97 0-9 4.03-9 9s4.03 9 9 9c4.85 0 8.53-3.46 8.53-8.75v-.25h-8.53z"
              ></path>
            </svg>
            Google
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex justify-center p-6 pt-0">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
