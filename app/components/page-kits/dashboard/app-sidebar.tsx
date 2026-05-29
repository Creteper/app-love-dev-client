"use client"

import * as React from "react"
import { Link } from "react-router"
import { motion } from "motion/react"
import { useIsMobile } from "~/hooks/use-mobile"
import { navItems, useSidebarNav } from "./sidebar-nav-context"
import { navIcons } from "./nav-icons"
import { SecondPanelContent } from "./second-panel-content"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { activeItem } = useSidebarNav()
  const { state } = useSidebar()
  const isMobile = useIsMobile()

  if (isMobile) return null

  return (
    <div
      className="contents"
      style={
        activeItem.collapseSecond
          ? ({ "--sidebar-width": "var(--sidebar-width-icon)" } as React.CSSProperties)
          : undefined
      }
    >
      <Sidebar
        collapsible="icon"
        className="*:data-[sidebar=sidebar]:flex-row"
        {...props}
      >
        {/* First sidebar — icon nav */}
        <Sidebar collapsible="none" className="w-20! border-r">
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <a href="#" className="flex items-center justify-center">
                  <img src="/assets/logo.png" alt="爱开发" className="h-16" />
                </a>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent className="px-1.5 md:px-0">
                <SidebarMenu className="relative gap-1">
                  {navItems.map((item) => {
                    const isActive = activeItem.url === item.url
                    const Icon = navIcons[item.url]
                    const link = (
                      <Link
                        to={item.url}
                        className={`relative z-10 flex w-full flex-col items-center justify-center gap-1 aspect-square h-auto rounded-xl text-sm transition-none focus-visible:outline-none ${
                          isActive
                            ? "text-primary-foreground"
                            : "text-foreground hover:bg-muted"
                        }`}
                      >
                        {Icon && <Icon className="size-5" />}
                        <span className="text-[11px] leading-none">{item.title}</span>
                      </Link>
                    )
                    return (
                      <SidebarMenuItem key={item.url} className="relative">
                        {isActive && (
                          <motion.div
                            layoutId="nav-pill"
                            className="absolute inset-0 z-0 rounded-xl bg-primary"
                            transition={{ type: "spring", stiffness: 500, damping: 33, mass: 0.8 }}
                          />
                        )}
                        {state === "collapsed" ? (
                          <Tooltip>
                            <TooltipTrigger asChild>{link}</TooltipTrigger>
                            <TooltipContent side="right" align="center">
                              <div>
                                <div className="font-medium">{item.title}</div>
                                <div className="text-xs text-muted-foreground">{item.subtitle}</div>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          link
                        )}
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Second sidebar — content panel */}
        {!activeItem.collapseSecond && (
          <motion.div
            key="second-sidebar"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="hidden min-w-0 flex-1 md:flex"
          >
            <Sidebar data-sidebar-type="secound" collapsible="none" className="w-full">
              <SecondPanelContent />
            </Sidebar>
          </motion.div>
        )}
      </Sidebar>
    </div>
  )
}
