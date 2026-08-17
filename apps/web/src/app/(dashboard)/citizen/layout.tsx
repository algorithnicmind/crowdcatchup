import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserRoleFromEmail } from "@/lib/rbac";
import React from "react";

export default async function CitizenLayoutGuard({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  const primaryEmail = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
  const role = getUserRoleFromEmail(primaryEmail);

  if (role !== "CITIZEN") {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
