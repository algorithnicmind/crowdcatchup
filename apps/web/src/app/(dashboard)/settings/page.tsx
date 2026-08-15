'use client';

import React from 'react';
import { useAuthStore } from '@/stores/auth-store';
import { useUser } from '@clerk/nextjs';
import { Settings as SettingsIcon, User, Shield, Paintbrush } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const { role } = useAuthStore();
  const { user } = useUser();

  return (
    <div className="h-[calc(100vh-64px)] w-full overflow-y-auto bg-black p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <SettingsIcon className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
            <p className="text-zinc-500 text-sm mt-1">Manage your account settings and preferences.</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Settings */}
          <div className="bg-zinc-950 border border-zinc-800/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-5 w-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Profile</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Name</label>
                <div className="mt-1 text-sm text-zinc-300 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2">
                  {user?.fullName || user?.primaryEmailAddress?.emailAddress || 'Loading...'}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Role</label>
                <div className="mt-1 text-sm text-zinc-300 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2 flex items-center gap-2">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  {role || 'CITIZEN'}
                </div>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-zinc-950 border border-zinc-800/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Paintbrush className="h-5 w-5 text-purple-400" />
              <h2 className="text-lg font-semibold text-white">Preferences</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-white">Dark Mode</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Always enabled for the hackathon.</p>
                </div>
                <div className="h-5 w-9 rounded-full bg-emerald-500 relative cursor-not-allowed opacity-50">
                  <div className="absolute right-1 top-1 h-3 w-3 rounded-full bg-white" />
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                <div>
                  <p className="text-sm font-medium text-white">Notifications</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Receive alerts for your zone.</p>
                </div>
                <div className="h-5 w-9 rounded-full bg-emerald-500 relative cursor-pointer">
                  <div className="absolute right-1 top-1 h-3 w-3 rounded-full bg-white shadow-sm" />
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="md:col-span-2 bg-zinc-950 border border-red-500/20 rounded-2xl p-6 shadow-xl mt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">Danger Zone</h2>
                <p className="text-sm text-zinc-400">Permanently delete your account and all associated data.</p>
              </div>
              <Button variant="destructive" className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
