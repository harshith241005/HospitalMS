'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Upload,
  Stethoscope,
  Users,
  LogOut,
  User,
  Settings,
  Moon,
  Sun,
  Video,
  Bell,
  ClipboardCheck,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { users } from '@/lib/placeholder-data';
import { type UserRole } from '@/lib/types';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
  { href: '/admin/staff', label: 'Staff', icon: Users },
  { href: '/admin/patients', label: 'Patients', icon: User },
  { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
  { href: '/admin/attendance', label: 'Attendance', icon: ClipboardCheck },
  { href: '/admin/notifications', label: 'Notifications', icon: Bell },
];

const doctorNav = [
  { href: '/doctor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/doctor/schedule', label: 'Schedule', icon: Calendar },
  { href: '/doctor/appointments', label: 'Appointments', icon: Users },
  { href: '/doctor/notifications', label: 'Notifications', icon: Bell },
];

const patientNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/appointments', label: 'Appointments', icon: Calendar },
  { href: '/dashboard/prescriptions', label: 'Prescriptions', icon: FileText },
  { href: '/dashboard/reports', label: 'Reports', icon: Upload },
  { href: '/dashboard/video-consultation', label: 'Video Consultation', icon: Video },
  { href: '/dashboard/notifications', label: 'Notifications', icon: Bell },
];

const navItems: Record<UserRole, { href: string; label: string; icon: React.ElementType }[]> = {
  admin: adminNav,
  doctor: doctorNav,
  staff: doctorNav, // Assuming staff has similar nav to doctors
  patient: patientNav,
};

function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2 px-2">
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="group-data-[collapsible=icon]:hidden">Toggle theme</span>
            <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}


export function DashboardNav() {
  const pathname = usePathname();
  const [userRole, setUserRole] = useState<UserRole>('patient');
  
  // In a real app, this would come from an auth context
  const currentUser = users.find(u => u.role === userRole) || users.find(u => u.role === 'patient');

  useEffect(() => {
    if (pathname.startsWith('/admin')) {
      setUserRole('admin');
    } else if (pathname.startsWith('/doctor')) {
      setUserRole('doctor');
    } else if (pathname.startsWith('/staff')) {
        setUserRole('staff');
    } else {
      setUserRole('patient');
    }
  }, [pathname]);

  const currentNav = navItems[userRole];
  const settingsPath = `/${userRole === 'patient' ? 'dashboard' : userRole}/settings`;


  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
            <Stethoscope className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl font-headline group-data-[collapsible=icon]:hidden">MediTrack Pro</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {currentNav.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  asChild
                  tooltip={item.label}
                >
                  <div>
                    <item.icon />
                    <span className="group-data-[collapsible=icon]:hidden">{item.label}</span>
                  </div>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
            <SidebarMenuItem>
                <ThemeToggle />
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href={settingsPath} passHref>
                    <SidebarMenuButton tooltip="Settings" asChild isActive={pathname === settingsPath}>
                        <div>
                            <Settings/>
                            <span className="group-data-[collapsible=icon]:hidden">Settings</span>
                        </div>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/" passHref>
                    <SidebarMenuButton asChild tooltip="Logout">
                        <div>
                            <LogOut/>
                            <span className="group-data-[collapsible=icon]:hidden">Logout</span>
                        </div>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        </SidebarMenu>
        <div className="p-2 mt-2 border-t group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={currentUser?.avatarUrl} alt={currentUser?.name} data-ai-hint={currentUser?.dataAiHint} />
              <AvatarFallback>{currentUser?.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-sm">
                <span className="font-semibold">{currentUser?.name}</span>
                <span className="text-muted-foreground">{currentUser?.email}</span>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </>
  );
}
