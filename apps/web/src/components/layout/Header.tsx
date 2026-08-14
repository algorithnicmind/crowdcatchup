'use client';

import React from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { Bell, Menu, Search } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';

export function Header() {
  const { user, logout } = useAuthStore();

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
            <Sidebar />
          </SheetContent>
        </Sheet>

        {/* Global Search / Event Selector */}
        <div className="hidden md:flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 transition-colors focus-within:border-emerald-500/50">
          <Search className="h-4 w-4 text-zinc-500" />
          <input 
            type="text" 
            placeholder="Search TechNova 2026..." 
            className="bg-transparent text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none w-48 lg:w-64"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative text-zinc-400 hover:text-white">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9 border border-zinc-800">
                  <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.name || 'User'}`} alt="Avatar" />
                  <AvatarFallback className="bg-zinc-800 text-zinc-200">
                    {user?.name?.substring(0, 2).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent className="w-56 border-zinc-800 bg-zinc-950 text-zinc-200" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-white">{user?.name || 'Guest User'}</p>
                <p className="text-xs leading-none text-zinc-500">
                  {user?.role || 'CITIZEN'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white cursor-pointer">
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="focus:bg-zinc-800 focus:text-white cursor-pointer">
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-zinc-800" />
            <DropdownMenuItem 
              onClick={() => logout()}
              className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
