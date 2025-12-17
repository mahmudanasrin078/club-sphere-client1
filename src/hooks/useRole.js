"use client"

import { useAuth } from "./useAuth"

export const useRole = () => {
  const { dbUser, loading } = useAuth()

  return {
    role: dbUser?.role || "member",
    isAdmin: dbUser?.role === "admin",
    isManager: dbUser?.role === "clubManager",
    isMember: dbUser?.role === "member",
    loading,
  }
}
