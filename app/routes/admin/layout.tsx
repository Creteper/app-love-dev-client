import * as React from "react"
import { Outlet, useLocation, useNavigate, Link } from "react-router"
import { AnimatePresence, motion } from "motion/react"
import {
  AdminAuthProvider,
  useAdminAuth,
  roleLabel,
} from "~/components/page-kits/admin/admin-auth-context"
import {
  AdminSidebarNavProvider,
  useAdminSidebarNav,
} from "~/components/page-kits/admin/sidebar-nav-context"
import { AdminAppSidebar } from "~/components/page-kits/admin/app-sidebar"
import { AdminMobileBottomNav } from "~/components/page-kits/admin/mobile-bottom-nav"
import { AdminMobileSecondPanelSheet } from "~/components/page-kits/admin/mobile-second-panel"
import { Loading } from "~/components/ui/loading"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar"
import {
  ArrowLeft,
  ChevronRight,
  LogOut,
  PanelLeft,
  ShieldCheck,
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

function AdminOutlet({ reserveBottomNav }: { reserveBottomNav: boolean }) {
  const location = useLocation()
  const { skipNextLoadingRef } = useAdminSidebarNav()
  const [isLoading, setIsLoading] = React.useState(true)
  const isMobile = useIsMobile()

  React.useEffect(() => {
    if (skipNextLoadingRef.current) {
      skipNextLoadingRef.current = false
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    const t = setTimeout(() => setIsLoading(false), 600)
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

function AdminBreadcrumb() {
  const { activeItem, subItem } = useAdminSidebarNav()
  const hasSub = !!subItem
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className="hidden md:block">
          <BreadcrumbLink asChild>
            <Link to="/admin">后台</Link>
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
              key="admin-sub-level"
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

function AdminChrome() {
  const { activeItem } = useAdminSidebarNav()
  const { user, signOut } = useAdminAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [sheetOpen, setSheetOpen] = React.useState(false)

  const isDetailPage = React.useMemo(() => {
    if (activeItem.collapseSecond) return false
    const rest = location.pathname.slice(activeItem.url.length)
    return rest.startsWith("/") && rest.length > 1
  }, [activeItem.collapseSecond, activeItem.url, location.pathname])

  const showMobileSecondTrigger =
    isMobile && !activeItem.collapseSecond && !isDetailPage
  const showMobileBack = isMobile && isDetailPage

  return (
    <>
      <AdminAppSidebar />
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
          <AdminBreadcrumb />
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
            {user ? (
              <span className="hidden items-center gap-1.5 rounded-full bg-amber-100 px-2 py-1 text-[11px] font-medium text-amber-700 md:inline-flex dark:bg-amber-500/15 dark:text-amber-300">
                <ShieldCheck className="size-3" />
                {roleLabel[user.role]}
              </span>
            ) : null}

            <Link
              to="/admin/me"
              className="flex items-center gap-2.5 rounded-full p-0.5 pr-2 transition-colors hover:bg-muted/60"
            >
              <Avatar className="h-8 w-8 rounded-full">
                <AvatarImage src="/assets/avatar%20(1).png" alt={user?.name ?? "员工"} />
                <AvatarFallback className="rounded-full text-xs">
                  {user?.name?.slice(0, 2) ?? "AD"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden flex-col text-sm leading-tight md:flex">
                <span className="font-medium tracking-tight">
                  {user?.name ?? "员工"}
                </span>
                <span className="text-[11px] text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => {
                signOut()
                navigate("/admin/login")
              }}
              aria-label="退出登录"
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </header>
        <AdminOutlet reserveBottomNav={isMobile && !isDetailPage} />
      </SidebarInset>
      {isMobile && !isDetailPage && <AdminMobileBottomNav />}
      {isMobile && !activeItem.collapseSecond && (
        <AdminMobileSecondPanelSheet
          open={sheetOpen}
          onOpenChange={setSheetOpen}
        />
      )}
    </>
  )
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()

  React.useEffect(() => {
    if (hydrated && !user && !location.pathname.startsWith("/admin/login")) {
      navigate("/admin/login", { replace: true })
    }
  }, [hydrated, user, location.pathname, navigate])

  if (!hydrated) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <Loading className="h-20 w-48" />
      </div>
    )
  }
  if (!user) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background text-sm text-muted-foreground">
        正在跳转到登录…
      </div>
    )
  }
  return <>{children}</>
}

export default function AdminLayout() {
  return (
    <AdminAuthProvider>
      <AuthGate>
        <AdminLayoutInner />
      </AuthGate>
    </AdminAuthProvider>
  )
}

function AdminLayoutInner() {
  const { user } = useAdminAuth()
  // user is guaranteed non-null inside <AuthGate>.
  return (
    <AdminSidebarNavProvider role={user!.role}>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "350px",
            "--sidebar-width-icon": "5rem",
          } as React.CSSProperties
        }
      >
        <AdminChrome />
      </SidebarProvider>
    </AdminSidebarNavProvider>
  )
}
