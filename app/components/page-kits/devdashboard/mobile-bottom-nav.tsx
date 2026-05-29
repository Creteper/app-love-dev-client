"use client"

import * as React from "react"
import { Link, useLocation } from "react-router"
import { motion } from "motion/react"
import {
  CircleUser,
  Compass,
  Gauge,
  MessagesSquare,
  type LucideIcon,
} from "lucide-react"

type BottomNavItem = {
  title: string
  to: string
  icon: LucideIcon
  matchPrefix?: boolean
}

const items: BottomNavItem[] = [
  { title: "接单大厅", to: "/devlopments", icon: Compass, matchPrefix: true },
  { title: "仪表盘", to: "/devdashboard", icon: Gauge },
  {
    title: "消息",
    to: "/devdashboard/messages",
    icon: MessagesSquare,
    matchPrefix: true,
  },
  { title: "我的", to: "/devdashboard/me", icon: CircleUser, matchPrefix: true },
]

function isActiveItem(pathname: string, item: BottomNavItem): boolean {
  if (item.matchPrefix) {
    return pathname === item.to || pathname.startsWith(item.to + "/")
  }
  return pathname === item.to
}

function pickActive(pathname: string): BottomNavItem | undefined {
  // Prefer the most specific (longest) match so "/devdashboard/messages"
  // beats "/devdashboard" when both prefix-match.
  let best: BottomNavItem | undefined
  for (const item of items) {
    if (!isActiveItem(pathname, item)) continue
    if (!best || item.to.length > best.to.length) best = item
  }
  return best
}

export function DevMobileBottomNav() {
  const { pathname } = useLocation()
  const active = pickActive(pathname)

  return (
    <nav
      aria-label="主导航"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="relative mx-auto flex h-16 max-w-md items-stretch justify-around px-2">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = active?.to === item.to
          return (
            <li key={item.to} className="relative flex flex-1 items-stretch">
              <Link
                to={item.to}
                className={`relative z-10 flex w-full flex-col items-center justify-center gap-0.5 rounded-2xl transition-colors ${
                  isActive ? "text-primary-foreground" : "text-foreground/70"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="dev-mobile-nav-pill"
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 33,
                      mass: 0.8,
                    }}
                    className="absolute inset-1 -z-10 rounded-2xl bg-primary"
                  />
                )}
                <Icon className="size-5" />
                <span className="text-[10px] font-medium leading-none">
                  {item.title}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
