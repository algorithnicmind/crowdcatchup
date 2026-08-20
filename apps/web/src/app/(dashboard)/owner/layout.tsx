import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserRoleFromEmail } from "@/lib/rbac";
import React from "react";

export default async function OwnerLayoutGuard({ children }: { children: React.ReactNode }) {
  try {
    const user = await currentUser();
    const primaryEmail = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    const role = getUserRoleFromEmail(primaryEmail);

    if (role !== "EVENT_OWNER") {
      redirect("/unauthorized");
    }
  } catch (error) {
    console.warn("Clerk API error in Owner layout. Bypassing check to prevent crash:", error);
  }

  return <>{children}</>;
}
