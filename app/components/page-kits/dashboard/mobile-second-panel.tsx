"use client"

import * as React from "react"
import { Sheet, SheetContent, SheetTitle } from "~/components/ui/sheet"
import { SecondPanelContent } from "./second-panel-content"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
}

export function MobileSecondPanelSheet({ open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-[85%] max-w-sm! p-0 gap-0"
      >
        <SheetTitle className="sr-only">二级导航</SheetTitle>
        <SecondPanelContent onItemSelect={() => onOpenChange(false)} />
      </SheetContent>
    </Sheet>
  )
}
