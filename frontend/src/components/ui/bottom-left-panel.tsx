'use client';

import React, { useState } from 'react';
import { Plus, MessageCircle, Bell, Calendar, UserPlus, Stethoscope } from 'lucide-react';
import { Button } from './button';
import { Badge } from './badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './tooltip';
import { usePathname } from 'next/navigation';

interface QuickAction {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
}

interface BottomLeftPanelProps {
  userRole: 'patient' | 'doctor' | 'admin';
  onQuickBook?: () => void;
  onQuickAccept?: () => void;
  onQuickAdd?: () => void;
  onOpenChat?: () => void;
  onOpenNotifications?: () => void;
  notificationCount?: number;
}

export function BottomLeftPanel({
  userRole,
  onQuickBook,
  onQuickAccept,
  onQuickAdd,
  onOpenChat,
  onOpenNotifications,
  notificationCount = 0
}: BottomLeftPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const pathname = usePathname();

  // Don't show on login pages
  if (pathname === '/' || pathname.includes('/login')) {
    return null;
  }

  const getQuickAction = (): QuickAction => {
    switch (userRole) {
      case 'patient':
        return {
          icon: <Calendar className="h-6 w-6" />,
          label: 'Quick Book',
          onClick: onQuickBook || (() => {}),
          color: 'bg-blue-500 hover:bg-blue-600'
        };
      case 'doctor':
        return {
          icon: <Stethoscope className="h-6 w-6" />,
          label: 'Quick Accept',
          onClick: onQuickAccept || (() => {}),
          color: 'bg-green-500 hover:bg-green-600'
        };
      case 'admin':
        return {
          icon: <UserPlus className="h-6 w-6" />,
          label: 'Quick Add',
          onClick: onQuickAdd || (() => {}),
          color: 'bg-purple-500 hover:bg-purple-600'
        };
      default:
        return {
          icon: <Plus className="h-6 w-6" />,
          label: 'Quick Action',
          onClick: () => {},
          color: 'bg-gray-500 hover:bg-gray-600'
        };
    }
  };

  const quickAction = getQuickAction();

  return (
    <TooltipProvider>
      <div 
        className="fixed bottom-4 left-4 z-50 flex flex-col items-center space-y-2"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        {/* Quick Action Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="lg"
              className={`h-14 w-14 rounded-full shadow-lg transition-all duration-200 ${quickAction.color} text-white`}
              onClick={quickAction.onClick}
            >
              {quickAction.icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>{quickAction.label}</p>
          </TooltipContent>
        </Tooltip>

        {/* Chat/AI Helper Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="h-12 w-12 rounded-full shadow-md bg-white hover:bg-gray-50 border-2"
              onClick={onOpenChat}
            >
              <MessageCircle className="h-5 w-5 text-blue-600" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>AI Assistant</p>
          </TooltipContent>
        </Tooltip>

        {/* Notifications Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="outline"
              className="h-12 w-12 rounded-full shadow-md bg-white hover:bg-gray-50 border-2 relative"
              onClick={onOpenNotifications}
            >
              <Bell className="h-5 w-5 text-orange-600" />
              {notificationCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-500 text-white text-xs">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </Badge>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Notifications {notificationCount > 0 && `(${notificationCount})`}</p>
          </TooltipContent>
        </Tooltip>

        {/* Expanded Labels */}
        {isExpanded && (
          <div className="absolute left-16 bottom-0 flex flex-col space-y-2 bg-white rounded-lg shadow-lg p-2 border">
            <div className="text-sm font-medium text-gray-700">{quickAction.label}</div>
            <div className="text-sm text-gray-500">AI Help</div>
            <div className="text-sm text-gray-500">
              Alerts {notificationCount > 0 && `(${notificationCount})`}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
