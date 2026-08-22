'use client';

import React from 'react';
import { Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { PoliceSidebar } from './PoliceSidebar';
import { AuthorityLayoutSidebar } from './AuthorityLayoutSidebar';
import { OwnerLayoutSidebar } from './OwnerLayoutSidebar';
import { CitizenLayoutSidebar } from './CitizenLayoutSidebar';
import { useMapStore } from '@/stores/map-store';
import { useAuthStore } from '@/stores/auth-store';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const isPolice = pathname?.startsWith('/police');
  const isAuthority = pathname?.startsWith('/authority');
  const isOwner = pathname?.startsWith('/owner');
  const isCitizen = pathname?.startsWith('/citizen');

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-zinc-800 bg-zinc-950/80 px-4 shadow-sm backdrop-blur-md md:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile Sidebar Toggle */}
        <Sheet>
          <SheetTrigger
            render={
              <Button variant="ghost" size="icon" className="md:hidden text-zinc-400 hover:text-white">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Sidebar</span>
              </Button>
            }
          />
          <SheetContent side="left" className="p-0 w-[260px] border-zinc-800 bg-zinc-950">
            {isPolice && <PoliceSidebar />}
            {isAuthority && <AuthorityLayoutSidebar />}
            {isOwner && <OwnerLayoutSidebar />}
            {isCitizen && <CitizenLayoutSidebar />}
            {(!isPolice && !isAuthority && !isOwner && !isCitizen) && <Sidebar />}
          </SheetContent>
        </Sheet>
        {/* Desktop Sidebar Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="hidden md:flex text-zinc-400 hover:text-white"
          onClick={() => useMapStore.getState().toggleSidebar()}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Sidebar</span>
        </Button>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-white cursor-pointer outline-none">
              <Bell className="h-5 w-5" />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 bg-zinc-950 border-zinc-800 text-zinc-300 p-0" align="end">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
              <span className="font-semibold text-white">Notifications</span>
              <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full border border-red-500/30">2 New</span>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto">
              {/* Notification Item 1 */}
              <div className="flex flex-col gap-1 px-4 py-3 border-b border-zinc-800 hover:bg-zinc-900/50 cursor-pointer transition-colors relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 rounded-r-md"></div>
                <span className="text-sm font-medium text-white">High density detected at Gate 3</span>
                <span className="text-xs text-zinc-500">Zone B is nearing maximum safe capacity.</span>
                <span className="text-[10px] text-zinc-600 mt-1">2 mins ago</span>
              </div>
              
              {/* Notification Item 2 */}
              <div className="flex flex-col gap-1 px-4 py-3 border-b border-zinc-800 hover:bg-zinc-900/50 cursor-pointer transition-colors relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-md"></div>
                <span className="text-sm font-medium text-white">Units Deployed</span>
                <span className="text-xs text-zinc-500">2 Police tactical units have arrived at Sector 4.</span>
                <span className="text-[10px] text-zinc-600 mt-1">15 mins ago</span>
              </div>
              
              {/* Notification Item 3 */}
              <div className="flex flex-col gap-1 px-4 py-3 hover:bg-zinc-900/50 cursor-pointer transition-colors">
                <span className="text-sm font-medium text-zinc-300">System Update</span>
                <span className="text-xs text-zinc-500">CrowdShield AI models have been updated successfully.</span>
                <span className="text-[10px] text-zinc-600 mt-1">1 hr ago</span>
              </div>
            </div>
            
            <div className="p-2 border-t border-zinc-800">
              <Button variant="ghost" className="w-full text-xs text-zinc-400 hover:text-white h-8">
                Mark all as read
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-9 w-9 rounded-full border border-zinc-800 p-0 overflow-hidden flex items-center justify-center bg-transparent hover:bg-zinc-800/50 transition-colors outline-none cursor-pointer">
            <Avatar className="h-9 w-9">
              {user?.avatar && (
                <AvatarImage src={user.avatar} alt="Profile" className="object-cover" />
              )}
              <AvatarFallback className="bg-zinc-800 text-zinc-400">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-zinc-950 border-zinc-800 text-zinc-300" align="end">
            <div className="px-2 py-1.5 font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-white">
                  {user?.name || "Demo User"}
                </p>
                <p className="text-xs leading-none text-zinc-500">
                  {user?.phone || user?.email || "No contact info"}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem 
              className="hover:bg-zinc-900 cursor-pointer focus:bg-zinc-900"
              onClick={() => {
                window.location.href = '/settings';
              }}
            >
              Manage Account
            </DropdownMenuItem>
            <DropdownMenuItem 
              className="text-red-500 hover:text-red-400 hover:bg-zinc-900 cursor-pointer focus:bg-zinc-900 focus:text-red-400"
              onClick={() => {
                logout();
                window.location.href = '/login';
              }}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
