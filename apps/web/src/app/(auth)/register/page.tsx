"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth-store';
import { useUserStore } from '@/stores/user-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Loader2, Lock, User, Mail, Phone, Smartphone } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore(state => state.setAuth);
  const { addUser, getUserByEmailOrPhone } = useUserStore();

  const [step, setStep] = useState<'FORM' | 'OTP'>('FORM');
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [userOtp, setUserOtp] = useState('');

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Check if user already exists
    const existingUser = getUserByEmailOrPhone(email, 'CITIZEN') || getUserByEmailOrPhone(phone, 'CITIZEN');
    if (existingUser) {
      toast.error('An account with this email or phone already exists.');
      setIsLoading(false);
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);

    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await res.json();
      
      if (data.success) {
        if (data.mocked) {
          toast.warning(`OTP sent to console (mocked). Code: ${otp}`);
        } else {
          toast.success('Verification code sent to your email.');
        }
        setStep('OTP');
      } else {
        toast.error('Failed to send OTP email.');
      }
    } catch (err) {
      toast.error('Network error while sending OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      
      if (userOtp === generatedOtp) {
        // Create user in store
        const newUser = addUser({
          name,
          email,
          phone,
          password,
          role: 'CITIZEN'
        });

        // Log them in automatically
        const mockToken = "mock_jwt_token_" + Date.now();
        setAuth(newUser, 'CITIZEN', mockToken);
        
        toast.success('Registration successful!');
        router.push('/citizen');
      } else {
        toast.error('Invalid OTP. Please try again.');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
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
          <p className="text-zinc-500 text-sm mt-2">Citizen Registration</p>
        </div>

        {step === 'FORM' ? (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-400 uppercase text-xs tracking-widest font-bold">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input required type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} className="bg-zinc-900 border-zinc-800 text-white pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400 uppercase text-xs tracking-widest font-bold">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input required type="email" placeholder="john@example.com" value={email} onChange={e => setEmail(e.target.value)} className="bg-zinc-900 border-zinc-800 text-white pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400 uppercase text-xs tracking-widest font-bold">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input required type="tel" placeholder="+91 9876543210" value={phone} onChange={e => setPhone(e.target.value)} className="bg-zinc-900 border-zinc-800 text-white pl-10" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-zinc-400 uppercase text-xs tracking-widest font-bold">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input required type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} className="bg-zinc-900 border-zinc-800 text-white pl-10" />
              </div>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 mt-4">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "CONTINUE"}
            </Button>

            <div className="text-center pt-4 border-t border-zinc-800">
              <p className="text-zinc-500 text-sm">
                Already have an account?{' '}
                <Link href="/login?role=CITIZEN" className="text-emerald-500 hover:text-emerald-400 transition-colors">
                  Log in
                </Link>
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-zinc-400 uppercase text-xs tracking-widest font-bold">Enter Verification Code</Label>
              <div className="relative">
                <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <Input required autoFocus type="text" placeholder="123456" maxLength={6} value={userOtp} onChange={e => setUserOtp(e.target.value)} className="bg-zinc-900 border-zinc-800 text-white pl-10 text-center tracking-[0.5em] text-lg font-bold" />
              </div>
              <p className="text-xs text-zinc-500 text-center mt-2">Code sent to {email}</p>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12">
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "VERIFY & REGISTER"}
            </Button>
            
            <button type="button" onClick={() => setStep('FORM')} className="w-full text-center text-sm text-zinc-500 hover:text-white transition-colors">
              Go back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
