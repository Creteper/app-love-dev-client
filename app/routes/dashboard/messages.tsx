import { Outlet, useOutlet } from "react-router"
import { motion } from "motion/react"
import { MessagesSquare } from "lucide-react"
import { useIsMobile } from "~/hooks/use-mobile"
import { SecondPanelContent } from "~/components/page-kits/dashboard/second-panel-content"
import { MessagesLogoIntro } from "~/components/page-kits/messages-logo-intro"
import type { Route } from "./+types/messages";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "爱开发 - 消息" },
    { name: "description", content: "爱开发，帮你实现想法" },
  ];
}

export default function DashboardMessages() {
  const outlet = useOutlet()
  const isMobile = useIsMobile()

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
        <SecondPanelContent />
      </div>
    )
  }

  return (
    <main className="flex h-full min-h-full items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-col items-center gap-5 text-center"
      >
        <MessagesLogoIntro />

        <div className="flex flex-col items-center gap-1.5">
          <div className="inline-flex items-center gap-1.5 text-sm font-medium tracking-tight">
            <MessagesSquare className="size-4 text-muted-foreground" />
            <span>选择一个群组开始交谈</span>
          </div>
          <p className="text-xs text-muted-foreground">
            所有项目沟通都将在平台内安全留痕
          </p>
        </div>
      </motion.div>
    </main>
  )
}
