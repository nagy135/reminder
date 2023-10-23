"use client";

import { useAuth } from "@clerk/nextjs";
export function UserName() {
  const { isLoaded, userId, sessionId } = useAuth();
  // In case the user signs out while on the page.
  if (!isLoaded || !userId) {
    return null;
  }
  return <>{userId}</>;
}
