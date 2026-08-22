"use client";

import React, { useState } from 'react';
import { Shield, Key, Plus, Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useUserStore, UserAccount } from '@/stores/user-store';
import { UserRole } from '@/stores/auth-store';

export default function UserManagementPage() {
  const { users, addUser } = useUserStore();
  const [role, setRole] = useState<UserRole>('POLICE');
  const [name, setName] = useState('');
  
  const [generatedAccount, setGeneratedAccount] = useState<UserAccount | null>(null);
  const [copied, setCopied] = useState(false);

  const generatedUsers = users.filter(u => u.role === 'POLICE' || u.role === 'EVENT_OWNER');

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    // Generate random 6 character ID and random password
    const genId = `${role === 'POLICE' ? 'POL' : 'OWN'}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const genPass = Math.random().toString(36).substring(2, 10);

    const newAcc = addUser({
      name,
      role,
      generatedId: genId,
      password: genPass
    });

    setGeneratedAccount(newAcc);
    setName('');
    toast.success(`${role} account generated successfully.`);
  };

  const copyCredentials = () => {
    if (!generatedAccount) return;
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://localhost:3000';
    const text = `Role: ${generatedAccount.role}\nID: ${generatedAccount.generatedId}\nPassword: ${generatedAccount.password}\nLogin at: ${origin}/login`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Credentials copied to clipboard');
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Access Control</h1>
        <p className="text-zinc-400 mt-2">Generate and manage official credentials for Police and Event Owners.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Plus className="w-5 h-5 text-emerald-500" />
            Generate New Credentials
          </h2>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-zinc-400">Assign Role</Label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full h-10 px-3 rounded-md border border-zinc-800 bg-zinc-900 text-white text-sm outline-none focus:border-emerald-500"
              >
                <option value="POLICE">Field Police Officer</option>
                <option value="EVENT_OWNER">Event Owner</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Officer / Owner Name</Label>
              <Input 
                required
                placeholder="e.g. Officer Smith"
                value={name}
                onChange={e => setName(e.target.value)}
                className="bg-zinc-900 border-zinc-800 text-white"
              />
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white mt-2">
              Generate ID & Password
            </Button>
          </form>

          {generatedAccount && (
            <div className="mt-8 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-emerald-400 font-medium text-sm uppercase tracking-wider">Credentials Generated</h3>
                  <p className="text-white font-bold mt-1">{generatedAccount.name} ({generatedAccount.role})</p>
                </div>
                <Button variant="ghost" size="icon" onClick={copyCredentials} className="text-zinc-400 hover:text-white">
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <div className="bg-black/50 rounded-md p-3 font-mono text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-zinc-500">ID:</span>
                  <span className="text-emerald-400">{generatedAccount.generatedId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">Password:</span>
                  <span className="text-zinc-300">{generatedAccount.password}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* List */}
        <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-500" />
            Active Authority Accounts
          </h2>
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
            {generatedUsers.length === 0 ? (
              <p className="text-zinc-500 text-sm text-center py-8">No accounts generated yet.</p>
            ) : (
              generatedUsers.map(u => (
                <div key={u.id} className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-white font-medium text-sm">{u.name}</p>
                    <p className="text-zinc-500 text-xs mt-0.5">{u.role} • {u.generatedId}</p>
                  </div>
                  <Shield className={`w-4 h-4 ${u.role === 'POLICE' ? 'text-blue-500' : 'text-purple-500'}`} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
