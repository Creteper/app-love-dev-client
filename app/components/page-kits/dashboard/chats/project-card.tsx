import * as React from "react"
import { motion } from "motion/react"
import {
  ChevronRight,
  FileText,
  Receipt,
} from "lucide-react"
import { InvoiceDialog, InvoiceMiniCard } from "./invoice"
import type { ProjectSpec } from "./data"

export function ProjectCard({
  spec,
  onConfirm,
}: {
  spec: ProjectSpec
  onConfirm: () => void
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
        className="max-w-xl"
      >
        <InvoiceMiniCard>
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Receipt className="size-4" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[10px] tracking-[0.18em] text-primary uppercase">
                  Love · Dev Invoice
                </span>
                <span className="truncate text-sm font-semibold text-foreground">
                  {spec.projectName}
                </span>
              </div>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                {spec.level} 级
              </span>
            </div>
            <div className="border-t border-dashed border-border/60" />
            <div className="grid grid-cols-2 gap-3 rounded-xl bg-muted/40 px-3 py-2.5">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] tracking-wide text-muted-foreground uppercase">
                  预估价
                </span>
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {spec.estimatedPrice}
                </span>
              </div>
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] tracking-wide text-muted-foreground uppercase">
                  预估工期
                </span>
                <span className="text-sm font-semibold tabular-nums text-foreground">
                  {spec.estimatedDuration}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-background px-4 py-2.5 text-xs font-medium transition-colors hover:border-primary/60 hover:text-primary"
            >
              <span className="inline-flex items-center gap-2">
                <FileText className="size-3.5" />
                查看详情
              </span>
              <ChevronRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
        </InvoiceMiniCard>
      </motion.div>
      <InvoiceDialog
        open={open}
        onOpenChange={setOpen}
        spec={spec}
        variant="ai"
        onConfirm={() => {
          setOpen(false)
          onConfirm()
        }}
      />
    </>
  )
}
