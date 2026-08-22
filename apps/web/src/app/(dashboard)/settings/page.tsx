'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/auth-store';
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Paintbrush,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Camera,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type SaveStatus = 'idle' | 'saving' | 'success' | 'error';

export default function SettingsPage() {
  const { role, user } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatarStr, setAvatarStr] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [notificationsOn, setNotificationsOn] = useState(true);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarStr(reader.result as string);
        setSaveStatus('idle');
      };
      reader.readAsDataURL(file);
    }
  };

  // Pre-fill form from Clerk data on load
  useEffect(() => {
    if (user) {
      setFullName(user.name ?? '');
      setPhoneNumber(user.phone ?? '');
      setAvatarStr(user.avatar ?? null);
    }
  }, [user]);

  const handleSave = async () => {
    if (!fullName.trim()) {
      setErrorMsg('Name cannot be empty.');
      setSaveStatus('error');
      return;
    }

    setSaveStatus('saving');
    setErrorMsg('');

    try {
      const { apiClient } = await import('@/lib/api-client');
      
      const response = await apiClient<any>('/auth/me/profile', {
        method: 'PATCH',
        headers: {
          'X-User-Email': user?.email || user?.id || ''
        },
        body: JSON.stringify({
          full_name: fullName.trim(),
          phone_number: phoneNumber.trim()
        })
      });
      
      useAuthStore.getState().updateProfile(response.full_name, response.phone_number, avatarStr || undefined);

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: any) {
      setErrorMsg(err.message || 'An unexpected error occurred.');
      setSaveStatus('error');
      setTimeout(() => setSaveStatus('idle'), 5000);
    }
  };

  const isDirty =
    fullName !== (user?.name ?? '') ||
    phoneNumber !== (user?.phone ?? '') ||
    avatarStr !== (user?.avatar ?? null);

  return (
    <div className="h-[calc(100vh-64px)] w-full overflow-y-auto bg-black p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <SettingsIcon className="h-5 w-5 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Settings</h1>
            <p className="text-zinc-500 text-sm mt-1">Manage your account settings and preferences.</p>
          </div>
        </div>

        {/* Toast / status banner */}
        {saveStatus === 'success' && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-emerald-400 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Profile saved successfully!
          </div>
        )}
        {saveStatus === 'error' && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-red-400 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {/* Profile Settings — editable */}
          <div className="bg-zinc-950 border border-zinc-800/50 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <User className="h-5 w-5 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">Profile</h2>
            </div>
            <div className="space-y-5">
              {/* Profile Picture */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-full overflow-hidden bg-zinc-800 border border-zinc-700 flex items-center justify-center shrink-0">
                    {avatarStr ? (
                      <img src={avatarStr} alt="Profile" className="h-full w-full object-cover" />
                    ) : (
                      <span className="text-xl text-zinc-400 font-medium">
                        {fullName.charAt(0) || user?.name?.charAt(0) || 'U'}
                      </span>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-sm text-zinc-300"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Change Picture
                  </Button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label
                  htmlFor="setting-full-name"
                  className="text-xs font-semibold text-zinc-500 uppercase tracking-wider"
                >
                  Full Name
                </label>
                <input
                  id="setting-full-name"
                  type="text"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setSaveStatus('idle'); }}
                  placeholder="Enter your full name"
                  className="mt-1 w-full text-sm text-zinc-100 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50
                             transition-colors placeholder:text-zinc-600"
                />
              </div>

              {/* Email — read-only, comes from auth store */}
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Email
                </label>
                <div className="mt-1 text-sm text-zinc-400 bg-zinc-900/30 border border-zinc-800/60 rounded-lg px-3 py-2 select-none cursor-not-allowed">
                  {user?.email ?? user?.id ?? 'No email provided'}
                </div>
                <p className="mt-1 text-xs text-zinc-600">Identity provided by your organization.</p>
              </div>

              {/* Phone Number */}
              <div>
                <label
                  htmlFor="setting-phone"
                  className="text-xs font-semibold text-zinc-500 uppercase tracking-wider"
                >
                  Phone Number
                </label>
                <input
                  id="setting-phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => { setPhoneNumber(e.target.value); setSaveStatus('idle'); }}
                  placeholder="+91 98765 43210"
                  className="mt-1 w-full text-sm text-zinc-100 bg-zinc-900/50 border border-zinc-800 rounded-lg px-3 py-2
                             focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50
                             transition-colors placeholder:text-zinc-600"
                />
              </div>

              {/* Role — read-only */}
              <div>
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                  Role
                </label>
                <div className="mt-1 text-sm text-zinc-300 bg-zinc-900/30 border border-zinc-800/60 rounded-lg px-3 py-2 flex items-center gap-2 cursor-not-allowed">
                  <Shield className="h-4 w-4 text-emerald-500" />
                  {role || 'CITIZEN'}
                </div>
              </div>

              {/* Save button */}
              <Button
                id="save-profile-button"
                onClick={handleSave}
                disabled={saveStatus === 'saving' || !isDirty}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold
                           disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
              >
                {saveStatus === 'saving' ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving…</>
                ) : (
                  <><Save className="h-4 w-4 mr-2" />Save Changes</>
                )}
              </Button>
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
                <div 
                  className={`h-5 w-9 rounded-full relative cursor-pointer transition-colors duration-200 ${notificationsOn ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                  onClick={() => setNotificationsOn(!notificationsOn)}
                >
                  <div className={`absolute top-1 h-3 w-3 rounded-full bg-white shadow-sm transition-all duration-200 ${notificationsOn ? 'right-1' : 'left-1'}`} />
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
              <Button
                variant="destructive"
                id="delete-account-button"
                className="bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors"
              >
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}




