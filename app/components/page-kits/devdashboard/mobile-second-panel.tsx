"use client"

import { Sheet, SheetContent, SheetTitle } from "~/components/ui/sheet"
import { DevSecondPanelContent } from "./second-panel-content"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
}

export function DevMobileSecondPanelSheet({ open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-[85%] max-w-sm! p-0 gap-0"
      >
        <SheetTitle className="sr-only">项目群组</SheetTitle>
        <DevSecondPanelContent onItemSelect={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  )
}
