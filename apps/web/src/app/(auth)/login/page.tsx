'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore, UserRole } from '@/stores/auth-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Smartphone, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/authority';
  const setAuth = useAuthStore(state => state.setAuth);

  const [isLoading, setIsLoading] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'PHONE' | 'OTP'>('PHONE');
  const [role, setRole] = useState<UserRole>('AUTHORITY');

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API Call to FastAPI
    setTimeout(() => {
      setIsLoading(false);
      setStep('OTP');
    }, 1000);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API Call to FastAPI
    setTimeout(() => {
      setIsLoading(false);
      // Generate a mock JWT for demo purposes
      const mockToken = "mock_jwt_token_" + Date.now();
      
      setAuth(
        { id: "usr_123", name: "Demo Agent", phone: "+91 " + phone }, 
        role, 
        mockToken
      );
      
      router.push(redirectUrl);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 z-0 opacity-20" style={{
        backgroundImage: 'linear-gradient(to right, #18181b 1px, transparent 1px), linear-gradient(to bottom, #18181b 1px, transparent 1px)',
        backgroundSize: '40px 40px'
      }} />

      <div className="relative z-10 w-full max-w-md bg-zinc-950/80 backdrop-blur-xl border border-zinc-800 rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wider">CROWDSHIELD</h1>
          <p className="text-zinc-500 text-sm mt-2">Secure Access Portal</p>
        </div>

        {step === 'PHONE' ? (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-zinc-400 uppercase text-xs tracking-widest font-bold">Role Access</Label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full h-10 px-3 rounded-md border border-zinc-800 bg-zinc-900 text-white text-sm outline-none focus:border-emerald-500 transition-colors"
              >
                <option value="AUTHORITY">Command Center Authority</option>
                <option value="POLICE">Field Police Officer</option>
                <option value="CITIZEN">Citizen</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400 uppercase text-xs tracking-widest font-bold">Indian Phone Number</Label>
              <div className="flex gap-2">
                <div className="flex items-center justify-center bg-zinc-900 border border-zinc-800 px-3 rounded-md text-zinc-400 font-medium">
                  +91
                </div>
                <Input 
                  required
                  type="tel" 
                  placeholder="9876543210" 
                  pattern="[0-9]{10}"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-700"
                />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "SEND OTP"}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-zinc-400 uppercase text-xs tracking-widest font-bold">Enter OTP</Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input 
                  required
                  autoFocus
                  type="text" 
                  placeholder="123456" 
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="bg-zinc-900 border-zinc-800 text-white placeholder:text-zinc-700 pl-10 text-center tracking-[0.5em] text-lg font-bold"
                />
              </div>
              <p className="text-xs text-zinc-500 text-center mt-2">Code sent to +91 {phone}</p>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "VERIFY & ENTER"}
            </Button>
            
            <button 
              type="button" 
              onClick={() => setStep('PHONE')}
              className="w-full text-center text-sm text-zinc-500 hover:text-white transition-colors"
            >
              Change phone number
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
