'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { DashboardNav } from '@/components/dashboard-nav';
import {
  Sidebar,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { TooltipProvider } from '@/components/ui/tooltip';
import { getCurrentUser } from '@/lib/auth';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      console.log('Dashboard Layout - Checking auth for path:', pathname);
      const user = getCurrentUser();
      console.log('Dashboard Layout - Current user:', user);
      
      if (!user || !user.isAuthenticated) {
        console.log('Dashboard Layout - Not authenticated, redirecting to /');
        // Not authenticated, redirect to login
        router.push('/');
        return;
      }

      // Check if user is accessing the correct dashboard
      const userRole = user.role;
      const currentPath = pathname;
      console.log('Dashboard Layout - User role:', userRole, 'Current path:', currentPath);

      // Role-based access control
      if (currentPath.startsWith('/admin') && userRole !== 'admin') {
        console.log('Dashboard Layout - Admin access denied, redirecting');
        router.push(userRole === 'doctor' ? '/doctor' : '/dashboard');
        return;
      }
      
      if (currentPath.startsWith('/doctor') && userRole !== 'doctor') {
        console.log('Dashboard Layout - Doctor access denied, redirecting');
        router.push(userRole === 'admin' ? '/admin' : '/dashboard');
        return;
      }
      
      if (currentPath.startsWith('/dashboard') && userRole !== 'patient') {
        console.log('Dashboard Layout - Patient access denied, redirecting');
        router.push(userRole === 'admin' ? '/admin' : '/doctor');
        return;
      }

      console.log('Dashboard Layout - Auth successful, showing dashboard');
      setIsAuthenticated(true);
      setIsLoading(false);
    };

    // Add a small delay to ensure localStorage is available
    setTimeout(checkAuth, 100);
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Sidebar>
          <DashboardNav />
        </Sidebar>
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
