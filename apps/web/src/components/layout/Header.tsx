'use client';

import React from 'react';
import { Bell, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserButton } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';

export function Header() {

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
        <div className="h-9 w-9 rounded-full overflow-hidden border border-zinc-800 flex items-center justify-center bg-zinc-900">
          <UserButton 
            appearance={{
              elements: {
                userButtonAvatarBox: "h-9 w-9"
              }
            }}
          />
        </div>
      </div>
    </header>
  );
}
