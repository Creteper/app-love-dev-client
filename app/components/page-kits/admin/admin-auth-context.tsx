"use client"

import * as React from "react"

export type AdminRole = "admin" | "cs"

export type AdminUser = {
  role: AdminRole
  name: string
  email: string
}

type AdminAuthValue = {
  user: AdminUser | null
  hydrated: boolean
  signIn: (user: AdminUser) => void
  signOut: () => void
}

const STORAGE_KEY = "lovedev.admin.user"

const AdminAuthContext = React.createContext<AdminAuthValue | null>(null)

export function useAdminAuth(): AdminAuthValue {
  const ctx = React.useContext(AdminAuthContext)
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider")
  return ctx
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AdminUser | null>(null)
  const [hydrated, setHydrated] = React.useState(false)

  // Hydrate from localStorage on first client render only (avoids SSR mismatch).
  React.useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as AdminUser
        if (parsed && (parsed.role === "admin" || parsed.role === "cs")) {
          setUser(parsed)
        }
      }
    } catch {
      // ignore
    }
    setHydrated(true)
  }, [])

  const signIn = React.useCallback((next: AdminUser) => {
    setUser(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      // ignore
    }
  }, [])

  const signOut = React.useCallback(() => {
    setUser(null)
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
  }, [])

  const value = React.useMemo<AdminAuthValue>(
    () => ({ user, hydrated, signIn, signOut }),
    [user, hydrated, signIn, signOut]
  )

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export const roleLabel: Record<AdminRole, string> = {
  admin: "管理员",
  cs: "客服",
}

export const roleHint: Record<AdminRole, string> = {
  admin: "总台权限 · 账号 / 项目 / 财务全览",
  cs: "客服权限 · 负责对接客户与项目",
}
