import { SignUp } from "@clerk/nextjs";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090b]">
      <SignUp routing="hash" />
    </div>
  );
}
