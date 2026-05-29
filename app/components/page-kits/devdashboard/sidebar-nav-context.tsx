"use client"

import * as React from "react"
import { useLocation } from "react-router"

export type DevNavItem = {
  title: string
  subtitle: string
  url: string
  collapseSecond: boolean
}

export const devNavItems: DevNavItem[] = [
  {
    title: "仪表盘",
    subtitle: "接单情况与收入",
    url: "/devdashboard",
    collapseSecond: true,
  },
  {
    title: "消息",
    subtitle: "项目群组与进度",
    url: "/devdashboard/messages",
    collapseSecond: false,
  },
  {
    title: "我的",
    subtitle: "等级与账户",
    url: "/devdashboard/me",
    collapseSecond: true,
  },
]

type DevSidebarNavContextValue = {
  activeItem: DevNavItem
  navItems: DevNavItem[]
  subItem: string | null
  setSubItem: (s: string | null) => void
  skipNextLoadingRef: React.MutableRefObject<boolean>
}

const DevSidebarNavContext =
  React.createContext<DevSidebarNavContextValue | null>(null)

export function useDevSidebarNav() {
  const ctx = React.useContext(DevSidebarNavContext)
  if (!ctx)
    throw new Error(
      "useDevSidebarNav must be used within DevSidebarNavProvider"
    )
  return ctx
}

export function DevSidebarNavProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const { pathname } = useLocation()

  const activeItem = React.useMemo(() => {
    const exact = devNavItems.find((i) => i.url === pathname)
    if (exact) return exact
    const prefix = devNavItems.find(
      (i) => i.url !== "/devdashboard" && pathname.startsWith(i.url + "/")
    )
    return prefix ?? devNavItems[0]
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
    <DevSidebarNavContext.Provider
      value={{
        activeItem,
        navItems: devNavItems,
        subItem,
        setSubItem,
        skipNextLoadingRef,
      }}
    >
      {children}
    </DevSidebarNavContext.Provider>
  )
}
