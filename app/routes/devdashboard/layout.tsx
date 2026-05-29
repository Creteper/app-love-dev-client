import * as React from "react"
import { Outlet, useLocation, useNavigate, Link } from "react-router"
import { AnimatePresence, motion } from "motion/react"
import { DevAppSidebar } from "~/components/page-kits/devdashboard/app-sidebar"
import { DevMobileBottomNav } from "~/components/page-kits/devdashboard/mobile-bottom-nav"
import { DevMobileSecondPanelSheet } from "~/components/page-kits/devdashboard/mobile-second-panel"
import {
  DevSidebarNavProvider,
  useDevSidebarNav,
} from "~/components/page-kits/devdashboard/sidebar-nav-context"
import { Loading } from "~/components/ui/loading"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar"
import {
  ArrowLeft,
  ChevronRight,
  PanelLeft,
  ShieldCheck,
  Briefcase,
} from "lucide-react"
import { useIsMobile } from "~/hooks/use-mobile"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "~/components/ui/sidebar"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip"

function DevDashboardOutlet({
  reserveBottomNav,
}: {
  reserveBottomNav: boolean
}) {
  const location = useLocation()
  const { skipNextLoadingRef } = useDevSidebarNav()
  const [isLoading, setIsLoading] = React.useState(true)
  const isMobile = useIsMobile()

  React.useEffect(() => {
    if (skipNextLoadingRef.current) {
      skipNextLoadingRef.current = false
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    const t = setTimeout(() => setIsLoading(false), 700)
    return () => clearTimeout(t)
  }, [location.pathname, skipNextLoadingRef])

  return (
    <div data-content-area className="relative flex-1 overflow-hidden">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-x-0 top-0 flex items-center justify-center bg-background"
            style={{
              bottom:
                isMobile && reserveBottomNav
                  ? "calc(4rem + env(safe-area-inset-bottom))"
                  : 0,
            }}
          >
            <Loading className="h-20 w-48" />
          </motion.div>
        ) : (
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-x-0 top-0 overflow-auto"
            style={{
              bottom:
                isMobile && reserveBottomNav
                  ? "calc(4rem + env(safe-area-inset-bottom))"
                  : 0,
            }}
          >
            <Outlet />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function DevBreadcrumb() {
  const { activeItem, subItem } = useDevSidebarNav()
  const hasSub = !!subItem
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink asChild>
            <Link to="/devlopments">接单大厅</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden md:block" />
        <BreadcrumbItem className="relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={activeItem.title + (hasSub ? "-link" : "-page")}
              initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              {hasSub ? (
                <BreadcrumbLink asChild className="text-muted-foreground">
                  <Link to={activeItem.url}>{activeItem.title}</Link>
                </BreadcrumbLink>
              ) : (
                <BreadcrumbPage>{activeItem.title}</BreadcrumbPage>
              )}
            </motion.span>
          </AnimatePresence>
        </BreadcrumbItem>

        <AnimatePresence initial={false}>
          {hasSub && (
            <motion.li
              key="dev-sub-level"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="inline-flex items-center gap-2 overflow-hidden whitespace-nowrap text-muted-foreground"
            >
              <ChevronRight className="size-3.5 shrink-0" />
              <span className="relative inline-block overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={subItem}
                    initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                    transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    className="inline-block text-foreground font-normal"
                  >
                    {subItem}
                  </motion.span>
                </AnimatePresence>
              </span>
            </motion.li>
          )}
        </AnimatePresence>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

function DevDashboardChrome() {
  const { activeItem } = useDevSidebarNav()
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [sheetOpen, setSheetOpen] = React.useState(false)

  const isDetailPage = React.useMemo(() => {
    if (activeItem.collapseSecond) return false
    const rest = location.pathname.slice(activeItem.url.length)
    return rest.startsWith("/") && rest.length > 1
  }, [activeItem.collapseSecond, activeItem.url, location.pathname])

  const isMessagesRoot = location.pathname === "/devdashboard/messages"
  const showMobileSecondTrigger =
    isMobile && !activeItem.collapseSecond && !isMessagesRoot
  const showMobileBack = isMobile && isDetailPage

  return (
    <>
      <DevAppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-30 flex shrink-0 items-center gap-2 border-b bg-background p-4">
          {!isMobile && <SidebarTrigger className="md:hidden" />}
          {showMobileBack && (
            <button
              type="button"
              onClick={() => navigate(activeItem.url)}
              aria-label="返回列表"
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeft className="size-4" />
            </button>
          )}
          <DevBreadcrumb />
          {showMobileSecondTrigger && (
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              aria-label="打开列表"
              className="ml-2 flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <PanelLeft className="size-4" />
            </button>
          )}
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden items-center gap-2 md:flex">
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="group flex h-9 items-center gap-2 rounded-full bg-muted/50 pr-3 pl-2.5 text-sm transition-colors hover:bg-muted"
                  >
                    <span className="flex size-6 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
                      <ShieldCheck className="size-3.5" />
                    </span>
                    <span className="text-[11px] tracking-wide text-muted-foreground">
                      等级
                    </span>
                    <span className="font-semibold tracking-tight text-foreground">
                      B
                    </span>
                    <span className="ml-0.5 inline-block size-1.5 rounded-full bg-amber-500" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium">B 级开发者</span>
                    <span className="text-[11px] text-muted-foreground">
                      可接 ≤ B 级单
                    </span>
                  </div>
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="group flex h-9 items-center gap-2 rounded-full bg-muted/50 pr-3 pl-2.5 text-sm transition-colors hover:bg-muted"
                  >
                    <span className="flex size-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                      <Briefcase className="size-3.5" />
                    </span>
                    <span className="text-[11px] tracking-wide text-muted-foreground">
                      进行中
                    </span>
                    <span className="font-semibold tabular-nums tracking-tight text-foreground">
                      3
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium">3 个项目开发中</span>
                    <span className="text-[11px] text-muted-foreground">
                      记得每日上传进度
                    </span>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="hidden h-6 w-px bg-border/70 md:block" />

            <Link
              to="/devdashboard/me"
              className="flex items-center gap-2.5 rounded-full p-0.5 pr-2 transition-colors hover:bg-muted/60"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src="/assets/avatar%20(2).png" alt="开发者" />
                <AvatarFallback className="rounded-full text-xs">
                  DV
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col text-sm leading-tight md:flex">
                <span className="font-medium tracking-tight">爱开发·开发者</span>
                <span className="text-[11px] text-muted-foreground">
                  B 级 · 已认证
                </span>
              </div>
            </Link>
          </div>
        </header>
        <DevDashboardOutlet reserveBottomNav={isMobile && !isDetailPage} />
      </SidebarInset>
      {isMobile && !isDetailPage && <DevMobileBottomNav />}
      {isMobile && !activeItem.collapseSecond && (
        <DevMobileSecondPanelSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
        />
      )}
    </>
  )
}

export default function DevDashboardLayout() {
  return (
    <DevSidebarNavProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "350px",
            "--sidebar-width-icon": "5rem",
          } as React.CSSProperties
        }
      >
        <DevDashboardChrome />
      </SidebarProvider>
    </DevSidebarNavProvider>
  )
}
