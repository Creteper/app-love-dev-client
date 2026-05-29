import { Navigate, Outlet, useOutlet } from "react-router"
import { motion } from "motion/react"
import { Inbox } from "lucide-react"
import { useIsMobile } from "~/hooks/use-mobile"
import { useAdminAuth } from "~/components/page-kits/admin/admin-auth-context"
import { AdminSecondPanelContent } from "~/components/page-kits/admin/second-panel-content"

export function meta() {
  return [{ title: "爱开发 - 待对接客户" }]
}

export default function AdminPending() {
  const { user } = useAdminAuth()
  const outlet = useOutlet()
  const isMobile = useIsMobile()

  if (user?.role !== "cs") {
    return <Navigate to="/admin" replace />
  }

  if (outlet) {
    return (
      <div className="flex h-full min-h-full flex-col">
        <Outlet />
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className="flex h-full min-h-full flex-col">
        <AdminSecondPanelContent />
      </div>
    )
  }

  return (
    <main className="flex h-full min-h-full items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-col items-center gap-3 text-center"
      >
        <span className="flex size-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
          <Inbox className="size-5" />
        </span>
        <div className="text-sm font-medium tracking-tight">
          选择一位待对接客户进入对话
        </div>
        <p className="text-xs text-muted-foreground">
          AI 已生成需求初稿，确认前可在左侧二级面板查看 / 搜索
        </p>
      </motion.div>
    </main>
  )
}
