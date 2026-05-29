"use client"

import { Link } from "react-router"
import { motion } from "motion/react"
import { navItems, useSidebarNav } from "./sidebar-nav-context"
import { navIcons } from "./nav-icons"

export function MobileBottomNav() {
  const { activeItem } = useSidebarNav()

  return (
    <nav
      aria-label="主导航"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <ul className="relative mx-auto flex h-16 max-w-md items-stretch justify-around px-2">
        {navItems.map((item) => {
          const Icon = navIcons[item.url]
          const isActive = activeItem.url === item.url
          return (
            <li key={item.url} className="relative flex flex-1 items-stretch">
              <Link
                to={item.url}
                className={`relative z-10 flex w-full flex-col items-center justify-center gap-0.5 rounded-2xl transition-colors ${
                  isActive ? "text-primary-foreground" : "text-foreground/70"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="mobile-nav-pill"
                    transition={{ type: "spring", stiffness: 500, damping: 33, mass: 0.8 }}
                    className="absolute inset-1 -z-10 rounded-2xl bg-primary"
                  />
                )}
                {Icon && <Icon className="size-5" />}
                <span className="text-[10px] font-medium leading-none">{item.title}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
