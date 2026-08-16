import { SignIn } from "@clerk/nextjs";
import { Users } from "lucide-react";

export default function CitizenLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 bg-[url('/grid-light.svg')] bg-center [mask-image:linear-gradient(180deg,black,rgba(0,0,0,0))]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-400/20 rounded-full blur-[120px]" />
      
      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-4">
        <div className="mb-8 flex flex-col items-center">
          <div className="p-4 bg-white/50 rounded-2xl border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)] mb-4">
            <Users className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">Citizen Portal</h1>
          <p className="text-slate-600 text-center">Stay safe and informed. Log in to access live crowd density and routing.</p>
        </div>

        <SignIn 
          routing="hash" 
          fallbackRedirectUrl="/citizen" 
          appearance={{
            elements: {
              formButtonPrimary: 'bg-emerald-600 hover:bg-emerald-700 text-sm normal-case',
              card: 'bg-white/80 backdrop-blur-xl border border-slate-200 shadow-2xl',
              headerTitle: 'text-slate-900',
              headerSubtitle: 'text-slate-500',
              socialButtonsBlockButton: 'text-slate-700 border-slate-200 hover:bg-slate-50',
              socialButtonsBlockButtonText: 'text-slate-600 font-medium',
              dividerLine: 'bg-slate-200',
              dividerText: 'text-slate-400',
              formFieldLabel: 'text-slate-700',
              formFieldInput: 'bg-white border-slate-200 text-slate-900 focus:ring-emerald-500 focus:border-emerald-500',
              footerActionText: 'text-slate-500',
              footerActionLink: 'text-emerald-600 hover:text-emerald-700',
              identityPreviewText: 'text-slate-700',
              identityPreviewEditButton: 'text-emerald-600 hover:text-emerald-700'
            }
          }}
        />
      </div>
    </div>
  );
}
