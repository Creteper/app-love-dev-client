"use client"

import * as React from "react"
import { useLocation } from "react-router"

export type NavItem = {
  title: string
  subtitle: string
  url: string
  collapseSecond: boolean
}

export const navItems: NavItem[] = [
  {
    title: "仪表盘",
    subtitle: "项目概览与数据",
    url: "/dashboard",
    collapseSecond: true,
  },
  {
    title: "对话",
    subtitle: "与 AI 协作梳理需求",
    url: "/dashboard/chats",
    collapseSecond: false,
  },
  {
    title: "消息",
    subtitle: "项目群组与产物",
    url: "/dashboard/messages",
    collapseSecond: false,
  },
  {
    title: "我的",
    subtitle: "账户与设置",
    url: "/dashboard/me",
    collapseSecond: true,
  },
]

type SidebarNavContextValue = {
  activeItem: NavItem
  navItems: NavItem[]
  subItem: string | null
  setSubItem: (s: string | null) => void
  skipNextLoadingRef: React.MutableRefObject<boolean>
}

const SidebarNavContext = React.createContext<SidebarNavContextValue | null>(null)

export function useSidebarNav() {
  const ctx = React.useContext(SidebarNavContext)
  if (!ctx) throw new Error("useSidebarNav must be used within SidebarNavProvider")
  return ctx
}

export function SidebarNavProvider({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation()

  const activeItem = React.useMemo(() => {
    const exact = navItems.find((i) => i.url === pathname)
    if (exact) return exact
    const prefix = navItems.find(
      (i) => i.url !== "/dashboard" && pathname.startsWith(i.url + "/")
    )
    return prefix ?? navItems[0]
  }, [pathname])

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
    <SidebarNavContext.Provider
      value={{ activeItem, navItems, subItem, setSubItem, skipNextLoadingRef }}
    >
      {children}
    </SidebarNavContext.Provider>
  )
}
