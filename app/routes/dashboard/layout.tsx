import * as React from "react"
import { Outlet, useLocation, useNavigate } from "react-router"
import { AnimatePresence, motion } from "motion/react"
import { AppSidebar } from "~/components/page-kits/dashboard/app-sidebar"
import { MobileBottomNav } from "~/components/page-kits/dashboard/mobile-bottom-nav"
import { MobileSecondPanelSheet } from "~/components/page-kits/dashboard/mobile-second-panel"
import {
  SidebarNavProvider,
  useSidebarNav,
} from "~/components/page-kits/dashboard/sidebar-nav-context"
import { Loading } from "~/components/ui/loading"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar"
import { ArrowLeft, ChevronRight, PanelLeft, ShieldCheck, Wallet } from "lucide-react"
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

function DashboardOutlet({ reserveBottomNav }: { reserveBottomNav: boolean }) {
  const location = useLocation()
  const { skipNextLoadingRef } = useSidebarNav()
  const [isLoading, setIsLoading] = React.useState(true)
  const isMobile = useIsMobile()

  React.useEffect(() => {
    if (skipNextLoadingRef.current) {
      skipNextLoadingRef.current = false
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    const t = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(t)
  }, [location.pathname, skipNextLoadingRef])

  return (
    <div
      data-content-area
      className="relative flex-1 overflow-hidden"
    >
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

function DashboardBreadcrumb() {
  const { activeItem, subItem } = useSidebarNav()
  const hasSub = !!subItem

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink href="#">首页</BreadcrumbLink>
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
                <BreadcrumbLink href="#" className="text-muted-foreground">
                  {activeItem.title}
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
              key="sub-level"
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

function DashboardChrome() {
  const { activeItem } = useSidebarNav()
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [sheetOpen, setSheetOpen] = React.useState(false)

  // Detail page = three+ segments past the dashboard root,
  // for sections that have a second panel (collapseSecond === false).
  const isDetailPage = React.useMemo(() => {
    if (activeItem.collapseSecond) return false
    const rest = location.pathname.slice(activeItem.url.length)
    return rest.startsWith("/") && rest.length > 1
  }, [activeItem.collapseSecond, activeItem.url, location.pathname])

  // Messages root renders the second panel full-screen, so no trigger needed there.
  // All other second-panel routes show the trigger (chats root, chat detail, message detail).
  const isMessagesRoot = location.pathname === "/dashboard/messages"
  const showMobileSecondTrigger =
    isMobile && !activeItem.collapseSecond && !isMessagesRoot
  const showMobileBack = isMobile && isDetailPage

  return (
    <>
      <AppSidebar />
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
          <DashboardBreadcrumb />
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
                    <span className="flex size-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300">
                      <ShieldCheck className="size-3.5" />
                    </span>
                    <span className="text-[11px] tracking-wide text-muted-foreground">信誉分</span>
                    <span className="font-semibold tabular-nums tracking-tight text-foreground">650</span>
                    <span className="ml-0.5 inline-block size-1.5 rounded-full bg-emerald-500" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium">信誉良好</span>
                    <span className="text-[11px] text-muted-foreground">≥ 650 可享分期支付</span>
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
                      <Wallet className="size-3.5" />
                    </span>
                    <span className="text-[11px] tracking-wide text-muted-foreground">余额</span>
                    <span className="font-semibold tabular-nums tracking-tight text-foreground">
                      <span className="mr-0.5 text-[11px] font-normal text-muted-foreground">¥</span>
                      128.00
                    </span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" align="end">
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs font-medium">平台托管余额</span>
                    <span className="text-[11px] text-muted-foreground">点击查看充值与流水</span>
                  </div>
                </TooltipContent>
              </Tooltip>
            </div>

            <div className="hidden h-6 w-px bg-border/70 md:block" />

            <a href="#" className="flex items-center gap-2.5 rounded-full p-0.5 pr-2 transition-colors hover:bg-muted/60">
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src="/assets/avatar%20(1).png" alt="用户" />
                <AvatarFallback className="rounded-full text-xs">CN</AvatarFallback>
              </Avatar>
              <div className="hidden flex-col text-sm leading-tight md:flex">
                <span className="font-medium tracking-tight">Creteper</span>
                <span className="text-[11px] text-muted-foreground">mycreteper@gmail.com</span>
              </div>
            </a>
          </div>
        </header>
        <DashboardOutlet reserveBottomNav={isMobile && !isDetailPage} />
      </SidebarInset>
      {isMobile && !isDetailPage && <MobileBottomNav />}
      {isMobile && !activeItem.collapseSecond && (
        <MobileSecondPanelSheet open={sheetOpen} onOpenChange={setSheetOpen} />
      )}
    </>
  )
}

export default function DashBoardLayOut() {
  return (
    <SidebarNavProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "350px",
            "--sidebar-width-icon": "5rem",
          } as React.CSSProperties
        }
      >
        <DashboardChrome />
      </SidebarProvider>
    </SidebarNavProvider>
  )
}
