"use client"

import * as React from "react"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { cn } from "~/lib/utils"
import type {
  DevLevel,
  PendingPhase,
  PendingSpec,
} from "~/components/page-kits/admin/data"

type EditableSpec = PendingSpec

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  initial: PendingSpec
  onConfirm: (next: EditableSpec) => void
}

function clonePhases(phases: PendingPhase[]): PendingPhase[] {
  return phases.map((p) => ({ ...p, items: [...p.items] }))
}

function cloneSpec(spec: PendingSpec): EditableSpec {
  return {
    ...spec,
    phasesPrimary: clonePhases(spec.phasesPrimary),
    phasesSecondary: clonePhases(spec.phasesSecondary),
  }
}

export function CsSpecEditor({ open, onOpenChange, initial, onConfirm }: Props) {
  const [draft, setDraft] = React.useState<EditableSpec>(() => cloneSpec(initial))

  React.useEffect(() => {
    if (open) setDraft(cloneSpec(initial))
  }, [open, initial])

  const valid =
    draft.projectName.trim().length > 0 &&
    draft.estimatedPrice.trim().length > 0 &&
    draft.estimatedDuration.trim().length > 0

  function patch(p: Partial<EditableSpec>) {
    setDraft((d) => ({ ...d, ...p }))
  }

  function patchPhase(
    section: "phasesPrimary" | "phasesSecondary",
    index: number,
    patch: Partial<PendingPhase>
  ) {
    setDraft((d) => ({
      ...d,
      [section]: d[section].map((p, i) => (i === index ? { ...p, ...patch } : p)),
    }))
  }

  function addPhase(section: "phasesPrimary" | "phasesSecondary") {
    setDraft((d) => ({
      ...d,
      [section]: [...d[section], { label: "新阶段", range: "", items: [] }],
    }))
  }

  function removePhase(section: "phasesPrimary" | "phasesSecondary", index: number) {
    setDraft((d) => ({
      ...d,
      [section]: d[section].filter((_, i) => i !== index),
    }))
  }

  function patchPhaseItem(
    section: "phasesPrimary" | "phasesSecondary",
    phaseIdx: number,
    itemIdx: number,
    next: string
  ) {
    setDraft((d) => ({
      ...d,
      [section]: d[section].map((p, i) =>
        i === phaseIdx
          ? {
              ...p,
              items: p.items.map((it, j) => (j === itemIdx ? next : it)),
            }
          : p
      ),
    }))
  }

  function addPhaseItem(
    section: "phasesPrimary" | "phasesSecondary",
    phaseIdx: number
  ) {
    setDraft((d) => ({
      ...d,
      [section]: d[section].map((p, i) =>
        i === phaseIdx ? { ...p, items: [...p.items, ""] } : p
      ),
    }))
  }

  function removePhaseItem(
    section: "phasesPrimary" | "phasesSecondary",
    phaseIdx: number,
    itemIdx: number
  ) {
    setDraft((d) => ({
      ...d,
      [section]: d[section].map((p, i) =>
        i === phaseIdx ? { ...p, items: p.items.filter((_, j) => j !== itemIdx) } : p
      ),
    }))
  }

  function submit() {
    if (!valid) return
    onConfirm({
      ...draft,
      projectName: draft.projectName.trim(),
      estimatedPrice: draft.estimatedPrice.trim(),
      estimatedDuration: draft.estimatedDuration.trim(),
      budget: draft.budget.trim(),
      requirementsMd: draft.requirementsMd.trim(),
      phasesPrimary: draft.phasesPrimary
        .map((p) => ({
          ...p,
          label: p.label.trim(),
          range: p.range.trim(),
          items: p.items.map((it) => it.trim()).filter(Boolean),
        }))
        .filter((p) => p.label.length > 0),
      phasesSecondary: draft.phasesSecondary
        .map((p) => ({
          ...p,
          label: p.label.trim(),
          range: p.range.trim(),
          items: p.items.map((it) => it.trim()).filter(Boolean),
        }))
        .filter((p) => p.label.length > 0),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] w-full! max-w-[calc(100%-1rem)]! overflow-hidden p-0 sm:max-w-[680px]! md:max-w-[760px]! sm:rounded-3xl">
        <div className="flex max-h-[88vh] flex-col">
          <DialogHeader className="gap-2 border-b border-border/60 px-6 pt-6 pb-4">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                <Pencil className="size-3" />
                修改并确认
              </span>
            </div>
            <DialogTitle>编辑终版需求确认单</DialogTitle>
            <DialogDescription>
              基于 AI 初稿微调金额、工期、等级和需求范围。确认后将自动发送一张
              客服终版发票到客户聊天里。
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="flex flex-col gap-4">
              <Field label="项目名称">
                <Input
                  value={draft.projectName}
                  onChange={(e) => patch({ projectName: e.target.value })}
                />
              </Field>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                <Field label="最终价">
                  <Input
                    value={draft.estimatedPrice}
                    onChange={(e) => patch({ estimatedPrice: e.target.value })}
                    placeholder="例：¥ 12,000"
                  />
                </Field>
                <Field label="确认工期">
                  <Input
                    value={draft.estimatedDuration}
                    onChange={(e) => patch({ estimatedDuration: e.target.value })}
                    placeholder="例：30 天"
                  />
                </Field>
                <Field label="项目等级">
                  <div className="flex gap-1 rounded-lg bg-muted/60 p-1">
                    {(["A", "B", "C"] as const).map((lv) => (
                      <button
                        key={lv}
                        type="button"
                        onClick={() => patch({ level: lv as DevLevel })}
                        className={cn(
                          "flex-1 rounded-md py-1 text-xs font-medium transition-all",
                          draft.level === lv
                            ? "bg-background text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {lv} 级
                      </button>
                    ))}
                  </div>
                </Field>
              </div>

              <Field label="价格区间（客户预算）">
                <Input
                  value={draft.budget}
                  onChange={(e) => patch({ budget: e.target.value })}
                  placeholder="例：¥ 8,000 – 12,000"
                />
              </Field>

              <Field label="需求说明（Markdown）">
                <textarea
                  value={draft.requirementsMd}
                  onChange={(e) => patch({ requirementsMd: e.target.value })}
                  rows={10}
                  className="min-h-32 w-full resize-y rounded-lg border border-border/50 bg-background px-3 py-2 font-mono text-[12px] leading-relaxed placeholder:text-muted-foreground focus:border-border focus:outline-none"
                />
              </Field>

              <PhasesEditor
                title="开发阶段"
                section="phasesPrimary"
                phases={draft.phasesPrimary}
                onAdd={() => addPhase("phasesPrimary")}
                onPatch={(i, p) => patchPhase("phasesPrimary", i, p)}
                onRemove={(i) => removePhase("phasesPrimary", i)}
                onPatchItem={(pi, ii, v) => patchPhaseItem("phasesPrimary", pi, ii, v)}
                onAddItem={(pi) => addPhaseItem("phasesPrimary", pi)}
                onRemoveItem={(pi, ii) => removePhaseItem("phasesPrimary", pi, ii)}
              />

              <PhasesEditor
                title="付款里程碑"
                section="phasesSecondary"
                phases={draft.phasesSecondary}
                onAdd={() => addPhase("phasesSecondary")}
                onPatch={(i, p) => patchPhase("phasesSecondary", i, p)}
                onRemove={(i) => removePhase("phasesSecondary", i)}
                onPatchItem={(pi, ii, v) =>
                  patchPhaseItem("phasesSecondary", pi, ii, v)
                }
                onAddItem={(pi) => addPhaseItem("phasesSecondary", pi)}
                onRemoveItem={(pi, ii) =>
                  removePhaseItem("phasesSecondary", pi, ii)
                }
              />
            </div>
          </div>

          <DialogFooter className="border-t border-border/60 bg-card/40 px-6 py-4 backdrop-blur">
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              取消
            </Button>
            <Button onClick={submit} disabled={!valid}>
              确认并发送终版
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  )
}

function PhasesEditor({
  title,
  phases,
  onAdd,
  onPatch,
  onRemove,
  onPatchItem,
  onAddItem,
  onRemoveItem,
}: {
  title: string
  section: "phasesPrimary" | "phasesSecondary"
  phases: PendingPhase[]
  onAdd: () => void
  onPatch: (i: number, p: Partial<PendingPhase>) => void
  onRemove: (i: number) => void
  onPatchItem: (phaseIdx: number, itemIdx: number, next: string) => void
  onAddItem: (phaseIdx: number) => void
  onRemoveItem: (phaseIdx: number, itemIdx: number) => void
}) {
  return (
    <section className="flex flex-col gap-2">
      <header className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Plus className="size-3" />
          添加阶段
        </button>
      </header>

      <ol className="flex flex-col gap-2">
        {phases.map((p, pi) => (
          <li
            key={pi}
            className="flex flex-col gap-2 rounded-xl border border-border/60 bg-card/60 p-3"
          >
            <div className="flex flex-wrap items-center gap-2">
              <Input
                value={p.label}
                onChange={(e) => onPatch(pi, { label: e.target.value })}
                placeholder="阶段名"
                className="h-8 flex-1"
              />
              <Input
                value={p.range}
                onChange={(e) => onPatch(pi, { range: e.target.value })}
                placeholder="时间范围 / 触发条件"
                className="h-8 w-48"
              />
              <button
                type="button"
                onClick={() => onRemove(pi)}
                aria-label="删除阶段"
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>

            <ul className="flex flex-col gap-1">
              {p.items.map((it, ii) => (
                <li key={ii} className="flex items-center gap-2">
                  <span className="size-1 shrink-0 rounded-full bg-muted-foreground/50" />
                  <Input
                    value={it}
                    onChange={(e) => onPatchItem(pi, ii, e.target.value)}
                    placeholder="阶段交付项"
                    className="h-7 flex-1"
                  />
                  <button
                    type="button"
                    onClick={() => onRemoveItem(pi, ii)}
                    aria-label="删除"
                    className="flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-destructive"
                  >
                    <Trash2 className="size-3" />
                  </button>
                </li>
              ))}
              <button
                type="button"
                onClick={() => onAddItem(pi)}
                className="inline-flex w-fit items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Plus className="size-3" />
                添加交付项
              </button>
            </ul>
          </li>
        ))}
      </ol>
    </section>
  )
}
