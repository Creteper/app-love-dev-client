import * as React from "react"
import {
  CircleUser,
  LayoutDashboard,
  MessageCircle,
  Sparkles,
} from "lucide-react"

export const navIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "/dashboard": LayoutDashboard,
  "/dashboard/chats": Sparkles,
  "/dashboard/messages": MessageCircle,
  "/dashboard/me": CircleUser,
}
