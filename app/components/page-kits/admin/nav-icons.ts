import * as React from "react"
import {
  BadgeDollarSign,
  CircleUser,
  FolderKanban,
  Gauge,
  Inbox,
  LayoutDashboard,
  Users,
} from "lucide-react"

export const adminNavIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  // dual-use: overview for admin AND "工作台" for cs both live at /admin
  "/admin": LayoutDashboard,
  "/admin/users": Users,
  "/admin/projects": FolderKanban,
  "/admin/pending": Inbox,
  "/admin/finance": BadgeDollarSign,
  "/admin/me": CircleUser,
}

// Optional: fallback icon for any item without an explicit mapping.
export const fallbackAdminNavIcon = Gauge
