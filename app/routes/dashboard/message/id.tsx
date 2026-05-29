import * as React from "react"
import { useParams, Link } from "react-router"
import { motion } from "motion/react"
import { MessageCircleOff } from "lucide-react"
import { ChatRoom, getGroupById } from "~/components/page-kits/dashboard/messages"
import { useSidebarNav } from "~/components/page-kits/dashboard/sidebar-nav-context"
import type { Route } from "./+types/id";

export function meta({ params }: Route.MetaArgs) {
  const group = getGroupById(params.id)
  return [
    { title: group ? `爱开发 - ${group.name}` : "爱开发 - 消息" },
    { name: "description", content: "爱开发，帮你实现想法" },
  ];
}

export default function DashboardMessageDetail() {
  const params = useParams()
  const group = getGroupById(params.id)
  const { setSubItem } = useSidebarNav()

  React.useEffect(() => {
    if (group) setSubItem(group.name)
  }, [group?.id, group?.name, setSubItem])

  if (!group) {
    return (
      <main className="flex h-full min-h-full items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="flex flex-col items-center gap-3 text-center"
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-muted/60 text-muted-foreground">
            <MessageCircleOff className="size-5" />
          </div>
          <div className="text-sm font-medium">未找到该群组</div>
          <Link
            to="/dashboard/messages"
            className="rounded-full bg-foreground px-4 py-1.5 text-xs font-medium text-background transition-all hover:scale-[1.03]"
          >
            返回消息列表
          </Link>
        </motion.div>
      </main>
    )
  }

  return <ChatRoom group={group} />
}