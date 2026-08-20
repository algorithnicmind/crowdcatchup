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
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-white">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="relative h-9 w-9 rounded-full border border-zinc-800 p-0 overflow-hidden flex items-center justify-center bg-transparent hover:bg-zinc-800/50 transition-colors outline-none cursor-pointer">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-zinc-800 text-zinc-400">
                {useAuthStore.getState().user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-zinc-950 border-zinc-800 text-zinc-300" align="end">
            <div className="px-2 py-1.5 font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-white">
                  {useAuthStore.getState().user?.name || "Demo User"}
                </p>
                <p className="text-xs leading-none text-zinc-500">
                  {useAuthStore.getState().user?.phone || useAuthStore.getState().user?.email || "No contact info"}
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
                useAuthStore.getState().logout();
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
