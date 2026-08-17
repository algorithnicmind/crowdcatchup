import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/rbac";
import React from "react";

export default async function PoliceLayoutGuard({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  const primaryEmail = user?.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
  const role = getUserRole(primaryEmail, user?.publicMetadata);

  if (role !== "POLICE") {
    redirect("/unauthorized");
  }

  return <>{children}</>;
}
