import * as React from "react"
import { Dialog as DialogPrimitive } from "radix-ui"
import {
  CalendarRange,
  CheckCircle2,
  FileText,
  Hammer,
  Wallet,
  X,
} from "lucide-react"
import { cn } from "~/lib/utils"
import { MiniMarkdown } from "./mini-markdown"
import type { ProjectPhase, ProjectSpec } from "./data"

const TOOTH_W = 14
const TOOTH_H = 7

const triangleSvg = (apex: "up" | "down") => {
  const points =
    apex === "up"
      ? `0,${TOOTH_H} ${TOOTH_W / 2},0 ${TOOTH_W},${TOOTH_H}`
      : `0,0 ${TOOTH_W / 2},${TOOTH_H} ${TOOTH_W},0`
  return `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${TOOTH_W} ${TOOTH_H}' preserveAspectRatio='none'><polygon fill='black' points='${points}'/></svg>`
  )}`
}

const _up = triangleSvg("up")
const _down = triangleSvg("down")
const _maskImage = `url("${_up}"), linear-gradient(#000, #000), url("${_down}")`
const _maskSize = `${TOOTH_W}px ${TOOTH_H}px, 100% calc(100% - ${TOOTH_H * 2}px), ${TOOTH_W}px ${TOOTH_H}px`

export const invoiceMaskStyle: React.CSSProperties = {
  WebkitMaskImage: _maskImage,
  maskImage: _maskImage,
  WebkitMaskRepeat: "repeat-x, no-repeat, repeat-x",
  maskRepeat: "repeat-x, no-repeat, repeat-x",
  WebkitMaskPosition: "top, center, bottom",
  maskPosition: "top, center, bottom",
  WebkitMaskSize: _maskSize,
  maskSize: _maskSize,
}

export const INVOICE_TOOTH_H = TOOTH_H

/**
 * Reusable invoice-style card with zigzag top/bottom edges.
 * Drop-shadow wrapper ensures the shadow follows the jagged silhouette.
 */
export function InvoiceMiniCard({
  className,
  innerClassName,
  children,
}: {
  className?: string
  innerClassName?: string
  children: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "drop-shadow-[0_10px_24px_rgba(15,23,42,0.10)]",
        className
      )}
    >
      <div
        className={cn("bg-card text-card-foreground", innerClassName)}
        style={invoiceMaskStyle}
      >
        {/* Padding leaves room for tooth height on top/bottom */}
        <div className="px-4 pt-5 pb-5">{children}</div>
      </div>
    </div>
  )
}

function PhaseColumn({
  title,
  icon: Icon,
  phases,
}: {
  title: string
  icon: React.ComponentType<{ className?: string }>
  phases: ProjectPhase[]
}) {
  return (
    <div className="flex flex-1 flex-col gap-3">
      <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-foreground uppercase">
        <Icon className="size-3.5 text-primary" />
        {title}
      </div>
      <ol className="relative flex flex-col gap-4 border-l border-dashed border-border/70 pl-5">
        {phases.map((p, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[1.45rem] top-1 flex size-3 items-center justify-center rounded-full border border-primary bg-background">
              <span className="size-1.5 rounded-full bg-primary" />
            </span>
            <div className="flex flex-col gap-1.5">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium text-foreground">
                  {p.label}
                </span>
                <span className="text-[10px] tracking-wide text-muted-foreground tabular-nums">
                  {p.range}
                </span>
              </div>
              <ul className="flex flex-col gap-1 text-xs text-muted-foreground">
                {p.items.map((it, j) => (
                  <li key={j} className="flex items-start gap-1.5">
                    <span className="mt-[0.45em] inline-block size-1 shrink-0 rounded-full bg-muted-foreground/50" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

type InvoiceVariant = "ai" | "cs"

const variantConfig: Record<
  InvoiceVariant,
  {
    badge: string
    title: (name: string) => string
    invoicePrefix: string
    footerNote: string
    confirmLabel: string
  }
> = {
  ai: {
    badge: "Love · Dev Invoice",
    title: (n) => `${n} · 需求确认单`,
    invoicePrefix: "LD",
    footerNote: "确认后将由人工客服与你对接，进一步核实细节后上架至接单列表。",
    confirmLabel: "确认需求，联系客服",
  },
  cs: {
    badge: "Love · 客服终版确认",
    title: (n) => `${n} · 终版确认单`,
    invoicePrefix: "LD-CS",
    footerNote: "确认后将自动建立项目群，并按等级匹配开发者接单。",
    confirmLabel: "确认需求，自动建群",
  },
}

export function InvoiceDialog({
  open,
  onOpenChange,
  spec,
  variant = "ai",
  onConfirm,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  spec: ProjectSpec
  variant?: InvoiceVariant
  onConfirm: () => void
}) {
  const cfg = variantConfig[variant]
  const invoiceNo = React.useMemo(
    () =>
      `${cfg.invoicePrefix}-${new Date().getFullYear()}-${String(
        Math.floor(Math.random() * 9000) + 1000
      )}`,
    [cfg.invoicePrefix, open]
  )
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <DialogPrimitive.Content
          aria-describedby={undefined}
          className={cn(
            "fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2",
            "w-[calc(100vw-1rem)] max-h-[92dvh]",
            "sm:w-[80vw] md:w-[60vw] lg:w-[50vw]",
            "outline-none",
            "data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
            "data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
            "duration-150"
          )}
        >
          <div className="relative drop-shadow-[0_24px_48px_rgba(15,23,42,0.18)]">
            <div
              className="relative bg-card text-card-foreground"
              style={invoiceMaskStyle}
            >
              <div className="flex max-h-[92dvh] flex-col">
                {/* Header */}
                <div className="flex items-start justify-between gap-4 border-b border-dashed border-border/60 px-6 pt-8 pb-5 sm:px-10">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold tracking-[0.25em] text-primary uppercase">
                      {cfg.badge}
                    </span>
                    <DialogPrimitive.Title className="font-heading text-xl font-semibold tracking-tight text-foreground">
                      {cfg.title(spec.projectName)}
                    </DialogPrimitive.Title>
                    <span className="text-xs text-muted-foreground">
                      No. {invoiceNo}
                    </span>
                  </div>
                  <DialogPrimitive.Close
                    aria-label="关闭"
                    className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <X className="size-4" />
                  </DialogPrimitive.Close>
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto px-6 py-6 sm:px-10">
                  {/* Summary stats */}
                  <div className="grid grid-cols-3 gap-3 rounded-2xl bg-muted/40 p-4">
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center gap-1 text-[10px] tracking-wide text-muted-foreground uppercase">
                        <Wallet className="size-3" />
                        {variant === "cs" ? "最终价" : "预估价"}
                      </span>
                      <span className="text-base font-semibold tabular-nums text-foreground">
                        {spec.estimatedPrice}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center gap-1 text-[10px] tracking-wide text-muted-foreground uppercase">
                        <CalendarRange className="size-3" />
                        {variant === "cs" ? "确认工期" : "预估工期"}
                      </span>
                      <span className="text-base font-semibold tabular-nums text-foreground">
                        {spec.estimatedDuration}
                      </span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="inline-flex items-center gap-1 text-[10px] tracking-wide text-muted-foreground uppercase">
                        <Hammer className="size-3" />
                        项目等级
                      </span>
                      <span className="text-base font-semibold text-foreground">
                        {spec.level} 级
                      </span>
                    </div>
                  </div>

                  {/* Requirements */}
                  <div className="mt-8 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-foreground uppercase">
                      <FileText className="size-3.5 text-primary" />
                      需求文档
                    </div>
                    <div className="rounded-2xl border border-border/50 bg-background/60 px-5 py-4">
                      <MiniMarkdown source={spec.requirementsMd} />
                    </div>
                  </div>

                  {/* Two timelines */}
                  <div className="mt-8 grid gap-8 md:grid-cols-2">
                    <PhaseColumn
                      title="开发计划"
                      icon={Hammer}
                      phases={spec.phasesPrimary}
                    />
                    <PhaseColumn
                      title="结算计划"
                      icon={Wallet}
                      phases={spec.phasesSecondary}
                    />
                  </div>

                  {/* Signature line */}
                  <div className="mt-10 flex items-end justify-between gap-4 border-t border-dashed border-border/60 pt-4">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[10px] tracking-wide text-muted-foreground uppercase">
                        {variant === "cs" ? "客服" : "AI 需求分析师"}
                      </span>
                      <span className="font-heading text-sm font-medium">
                        {variant === "cs" ? "小张 · 爱开发" : "Jane · 爱开发"}
                      </span>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="text-[10px] tracking-wide text-muted-foreground uppercase">
                        生成时间
                      </span>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        {new Date().toLocaleString("zh-CN", { hour12: false })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="border-t border-dashed border-border/60 bg-muted/30 px-6 pt-4 pb-8 sm:px-10">
                  <div className="flex flex-col-reverse items-stretch gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-[11px] text-muted-foreground">
                      {cfg.footerNote}
                    </p>
                    <button
                      type="button"
                      onClick={onConfirm}
                      className="group inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-sm transition-all hover:scale-[1.02] hover:shadow-md"
                    >
                      <CheckCircle2 className="size-4" />
                      {cfg.confirmLabel}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
