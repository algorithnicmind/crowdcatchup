import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserRoleFromEmail } from "@/lib/rbac";
import React from "react";

export default async function PoliceLayoutGuard({ children }: { children: React.ReactNode }) {
  try {
    const user = await currentUser();
    const primaryEmail = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    const role = getUserRoleFromEmail(primaryEmail);

    if (role !== "POLICE") {
      redirect("/unauthorized");
    }
  } catch (error) {
    console.warn("Clerk API error in Police layout. Bypassing check to prevent crash:", error);
  }

  return <>{children}</>;
}
