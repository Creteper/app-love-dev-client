"use client"

import { Sheet, SheetContent, SheetTitle } from "~/components/ui/sheet"
import { AdminSecondPanelContent } from "./second-panel-content"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
}

export function AdminMobileSecondPanelSheet({ open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-[85%] max-w-sm! p-0 gap-0"
      >
        <SheetTitle className="sr-only">二级面板</SheetTitle>
        <AdminSecondPanelContent onItemSelect={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  )
}
