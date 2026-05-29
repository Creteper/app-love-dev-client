"use client"

import * as React from "react"
import { useLocation } from "react-router"
import type { AdminRole } from "./admin-auth-context"

export type AdminNavItem = {
  title: string
  subtitle: string
  url: string
  collapseSecond: boolean
  roles: AdminRole[]
}

export const adminNavItems: AdminNavItem[] = [
  {
    title: "概览",
    subtitle: "总收入与未结算总览",
    url: "/admin",
    collapseSecond: true,
    roles: ["admin"],
  },
  {
    title: "工作台",
    subtitle: "我负责的项目与待办",
    url: "/admin",
    collapseSecond: true,
    roles: ["cs"],
  },
  {
    title: "用户",
    subtitle: "开发者 / 客户 / 客服账号",
    url: "/admin/users",
    collapseSecond: true,
    roles: ["admin"],
  },
  {
    title: "项目",
    subtitle: "全部项目 · 上架 / 下架 / 查看",
    url: "/admin/projects",
    collapseSecond: true,
    roles: ["admin"],
  },
  {
    title: "项目",
    subtitle: "我负责的项目",
    url: "/admin/projects",
    collapseSecond: false,
    roles: ["cs"],
  },
  {
    title: "待对接",
    subtitle: "已分配但未确认需求的客户",
    url: "/admin/pending",
    collapseSecond: false,
    roles: ["cs"],
  },
  {
    title: "财务",
    subtitle: "总 / 未结算 / 已结算",
    url: "/admin/finance",
    collapseSecond: true,
    roles: ["admin"],
  },
  {
    title: "我的",
    subtitle: "账户与设置",
    url: "/admin/me",
    collapseSecond: true,
    roles: ["admin", "cs"],
  },
]

export function navItemsForRole(role: AdminRole): AdminNavItem[] {
  return adminNavItems.filter((i) => i.roles.includes(role))
}

type AdminSidebarNavContextValue = {
  activeItem: AdminNavItem
  navItems: AdminNavItem[]
  subItem: string | null
  setSubItem: (s: string | null) => void
  skipNextLoadingRef: React.MutableRefObject<boolean>
}

const AdminSidebarNavContext =
  React.createContext<AdminSidebarNavContextValue | null>(null)

export function useAdminSidebarNav() {
  const ctx = React.useContext(AdminSidebarNavContext)
  if (!ctx)
    throw new Error(
      "useAdminSidebarNav must be used within AdminSidebarNavProvider"
    )
  return ctx
}

export function AdminSidebarNavProvider({
  role,
  children,
}: {
  role: AdminRole
  children: React.ReactNode
}) {
  const { pathname } = useLocation()
  const navItems = React.useMemo(() => navItemsForRole(role), [role])

  const activeItem = React.useMemo(() => {
    const exact = navItems.find((i) => i.url === pathname)
    if (exact) return exact
    const prefix = navItems.find(
      (i) => i.url !== "/admin" && pathname.startsWith(i.url + "/")
    )
    return prefix ?? navItems[0]
  }, [pathname, navItems])

  const [subItem, setSubItem] = React.useState<string | null>(null)
  const skipNextLoadingRef = React.useRef(false)

  const prevUrl = React.useRef(activeItem.url)
  React.useEffect(() => {
    if (prevUrl.current !== activeItem.url) {
      setSubItem(null)
      prevUrl.current = activeItem.url
    }
  }, [activeItem.url])

  return (
    <AdminSidebarNavContext.Provider
      value={{
        activeItem,
        navItems,
        subItem,
        setSubItem,
        skipNextLoadingRef,
      }}
    >
      {children}
    </AdminSidebarNavContext.Provider>
  )
}
