import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { CalendarCheck } from "lucide-react";

export default function OwnerLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#090514] relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/10 rounded-full blur-[120px]" />
      
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-4">
        <div className="mb-8 flex flex-col items-center">
          <div className="p-4 bg-slate-900/50 rounded-2xl border border-purple-500/20 shadow-[0_0_30px_rgba(168,85,247,0.2)] mb-4">
            <CalendarCheck className="w-10 h-10 text-purple-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 text-center">Event Owner Dashboard</h1>
          <p className="text-slate-400 text-center">Manage your venues, zones, and coordinate with local authorities.</p>
        </div>

        <SignIn 
          routing="hash" 
          fallbackRedirectUrl="/owner" 
          appearance={{
            baseTheme: dark,
            elements: {
              formButtonPrimary: 'bg-purple-600 hover:bg-purple-700 text-sm normal-case',
              card: 'bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-2xl',
              headerTitle: 'text-white',
              headerSubtitle: 'text-slate-400',
              socialButtonsBlockButton: 'text-white border-slate-700 hover:bg-slate-800',
              socialButtonsBlockButtonText: 'text-slate-300 font-medium',
              dividerLine: 'bg-slate-700',
              dividerText: 'text-slate-500',
              formFieldLabel: 'text-slate-300',
              formFieldInput: 'bg-slate-950 border-slate-700 text-white focus:ring-purple-500 focus:border-purple-500',
              footerActionText: 'text-slate-400',
              footerActionLink: 'text-purple-400 hover:text-purple-300',
              identityPreviewText: 'text-slate-300',
              identityPreviewEditButton: 'text-purple-400 hover:text-purple-300'
            }
          }}
        />
      </div>
    </div>
  );
}
