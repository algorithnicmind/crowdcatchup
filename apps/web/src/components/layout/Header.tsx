'use client';

import React from 'react';
import { Bell, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserButton } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Sidebar } from './Sidebar';
import { PoliceSidebar } from './PoliceSidebar';
import { AuthorityLayoutSidebar } from './AuthorityLayoutSidebar';
import { OwnerLayoutSidebar } from './OwnerLayoutSidebar';
import { CitizenLayoutSidebar } from './CitizenLayoutSidebar';
import { useAuthStore } from '@/stores/auth-store';
import { useMapStore } from '@/stores/map-store';
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
