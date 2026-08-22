import { UserRole } from "@/stores/auth-store";

/**
 * Deterministically extracts the user's role based on their primary email address.
 * 
 * Mapping Rules:
 * - @city.gov or authority@demo.com -> AUTHORITY
 * - @police.gov or police@demo.com -> POLICE
 * - @owner.com or owner@demo.com -> EVENT_OWNER
 * - Everything else -> CITIZEN
 */
export function getUserRoleFromEmail(email: string | undefined | null): UserRole {
  if (!email) return "CITIZEN";

  const lowerEmail = email.toLowerCase();

  // Authority Checking
  if (lowerEmail.endsWith("@city.gov") || lowerEmail === "authority@demo.com" || lowerEmail.includes("+authority@")) {
    return "AUTHORITY";
  }

  // Police Checking
  if (lowerEmail.endsWith("@police.gov") || lowerEmail === "police@demo.com" || lowerEmail.includes("+police@")) {
    return "POLICE";
  }

  // Event Owner Checking
  if (lowerEmail.endsWith("@owner.com") || lowerEmail === "owner@demo.com" || lowerEmail.includes("+owner@")) {
    return "EVENT_OWNER";
  }

  // Default to Citizen for all standard emails (e.g. @gmail.com)
  return "CITIZEN";
}
