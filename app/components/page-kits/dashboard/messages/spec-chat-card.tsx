"use client"

import * as React from "react"
import { CalendarRange, ChevronRight, Sparkles, Wallet } from "lucide-react"
import { cn } from "~/lib/utils"
import { InvoiceDialog, InvoiceMiniCard } from "../chats/invoice"
import type { ProjectSpec } from "../chats/data"
import type { SpecCardVariant, SpecPayload } from "./data"

type Props = {
  spec: SpecPayload
  variant: SpecCardVariant
  align?: "left" | "right"
}

const variantConfig: Record<
  SpecCardVariant,
  { badge: string; accent: string; eyebrow: string }
> = {
  ai: {
    badge: "Love · AI 初稿",
    accent: "text-primary",
    eyebrow: "AI 帮你整理的需求初稿",
  },
  cs: {
    badge: "Love · 客服终版",
    accent: "text-emerald-700 dark:text-emerald-300",
    eyebrow: "客服已确认的终版需求",
  },
}

function specSummary(md: string): string {
  return md
    .replace(/^#+[^\n]*\n+/gm, "")
    .replace(/[*`>]/g, "")
    .replace(/^[-*]\s+/gm, "· ")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 2)
    .join(" ")
}

export function SpecChatCard({ spec, variant, align = "left" }: Props) {
  const [open, setOpen] = React.useState(false)
  const cfg = variantConfig[variant]
  // SpecPayload is structurally identical to ProjectSpec; cast to satisfy InvoiceDialog.
  const dialogSpec = spec as unknown as ProjectSpec

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group block w-full max-w-md text-left",
          align === "right" ? "ml-auto" : "mr-auto"
        )}
      >
        <InvoiceMiniCard innerClassName="px-5 py-4">
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  "text-[10px] font-semibold tracking-[0.18em] uppercase",
                  cfg.accent
                )}
              >
                {cfg.badge}
              </span>
              <ChevronRight className="size-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </div>

            <h4 className="truncate text-sm font-semibold tracking-tight">
              {spec.projectName}
            </h4>

            <div className="grid grid-cols-3 gap-2 rounded-xl bg-muted/40 p-2.5">
              <Stat
                icon={<Wallet className="size-3" />}
                label={variant === "cs" ? "最终价" : "预估价"}
                value={spec.estimatedPrice}
              />
              <Stat
                icon={<CalendarRange className="size-3" />}
                label={variant === "cs" ? "确认工期" : "预估工期"}
                value={spec.estimatedDuration}
              />
              <Stat
                icon={<Sparkles className="size-3" />}
                label="等级"
                value={`${spec.level} 级`}
              />
            </div>

            <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
              {specSummary(spec.requirementsMd) ||
                "点击查看完整需求确认单"}
            </p>

            <span className="text-[11px] text-muted-foreground">
              {cfg.eyebrow} · 点击查看完整
            </span>
          </div>
        </InvoiceMiniCard>
      </button>

      <InvoiceDialog
        open={open}
        onOpenChange={setOpen}
        spec={dialogSpec}
        variant={variant}
        onConfirm={() => setOpen(false)}
      />
    </>
  )
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="inline-flex items-center gap-1 text-[9px] uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </span>
      <span className="truncate text-xs font-semibold tabular-nums tracking-tight text-foreground">
        {value}
      </span>
    </div>
  )
}
