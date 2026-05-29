import * as React from "react"
import { CircleUser, Gauge, MessagesSquare } from "lucide-react"

export const devNavIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  "/devdashboard": Gauge,
  "/devdashboard/messages": MessagesSquare,
  "/devdashboard/me": CircleUser,
}
