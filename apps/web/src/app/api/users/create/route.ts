import { NextResponse } from "next/server";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { getUserRole } from "@/lib/rbac";

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const primaryEmail = user.emailAddresses.find(e => e.id === user.primaryEmailAddressId)?.emailAddress;
    const role = getUserRole(primaryEmail, user.publicMetadata);

    if (role !== "AUTHORITY") {
      return new NextResponse("Forbidden: Only Authority can create staff users", { status: 403 });
    }

    const body = await req.json();
    const { email, password, role: targetRole, fullName } = body;

    if (!email || !password || !targetRole) {
      return new NextResponse("Missing required fields", { status: 400 });
    }

    if (targetRole !== "POLICE" && targetRole !== "EVENT_OWNER") {
      return new NextResponse("Invalid role. Can only create POLICE or EVENT_OWNER.", { status: 400 });
    }

    const [firstName, ...lastNameParts] = (fullName || "").split(" ");
    
    // Support for both newer and older clerkClient API signatures
    const client = typeof clerkClient === 'function' ? await clerkClient() : clerkClient;

    const newUser = await client.users.createUser({
      emailAddress: [email],
      password: password,
      firstName: firstName || undefined,
      lastName: lastNameParts.length > 0 ? lastNameParts.join(" ") : undefined,
      publicMetadata: {
        role: targetRole,
      },
      skipPasswordChecks: true,
      skipPasswordRequirement: true
    });

    return NextResponse.json({ success: true, userId: newUser.id, email: email, role: targetRole });
  } catch (error: any) {
    console.error("Error creating user:", error);
    // Return friendly error if it's a Clerk error (like duplicate email)
    const message = error?.errors?.[0]?.message || error?.message || "Internal Server Error";
    return new NextResponse(message, { status: 500 });
  }
}
