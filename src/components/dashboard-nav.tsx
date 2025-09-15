'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { users } from '@/lib/placeholder-data';
import { type UserRole } from '@/lib/types';

const adminNav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/doctors', label: 'Doctors', icon: Stethoscope },
  { href: '/admin/staff', label: 'Staff', icon: Users },
  { href: '/admin/patients', label: 'Patients', icon: User },
  { href: '/admin/appointments', label: 'Appointments', icon: Calendar },
];

const doctorNav = [
  { href: '/doctor', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/doctor/schedule', label: 'Schedule', icon: Calendar },
  { href: '/doctor/appointments', label: 'Appointments', icon: Users },
];

const patientNav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/appointments', label: 'Appointments', icon: Calendar },
  { href: '/dashboard/prescriptions', label: 'Prescriptions', icon: FileText },
  { href: '/dashboard/reports', label: 'Reports', icon: Upload },
];

const navItems: Record<UserRole, { href: string; label: string; icon: React.ElementType }[]> = {
  admin: adminNav,
  doctor: doctorNav,
  staff: doctorNav, // Assuming staff has similar nav to doctors
  patient: patientNav,
};

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

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-3 p-2">
            <Stethoscope className="w-8 h-8 text-primary" />
            <span className="font-bold text-xl font-headline">MediTrack Pro</span>
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
                  <><item.icon />
                  <span>{item.label}</span></>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="p-2">
        <SidebarMenu>
            <SidebarMenuItem>
                <Link href="#" passHref>
                    <SidebarMenuButton tooltip="Settings">
                        <><Settings/>
                        <span>Settings</span></>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
            <SidebarMenuItem>
                <Link href="/" passHref>
                    <SidebarMenuButton asChild tooltip="Logout">
                        <><LogOut/>
                        <span>Logout</span></>
                    </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
        </SidebarMenu>
        <div className="p-2 mt-2 border-t">
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
