import * as React from "react"
import { Check, Sparkles } from "lucide-react"
import {
  MIN_AMOUNT,
  payMethods,
  presetAmounts,
  type PayMethod,
} from "./shared"

type FormViewProps = {
  amount: number
  setAmount: (n: number) => void
  customInput: string
  setCustomInput: (s: string) => void
  method: PayMethod
  setMethod: (m: PayMethod) => void
  effective: number
  valid: boolean
  onSubmit: () => void
}

export function FormView({
  amount,
  setAmount,
  customInput,
  setCustomInput,
  method,
  setMethod,
  effective,
  valid,
  onSubmit,
}: FormViewProps) {
  return (
    <div className="relative">
      {/* Decorative header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-violet-500/5 to-transparent px-6 pt-7 pb-6">
        <div className="absolute -top-10 -right-10 size-40 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/80">
            钱包充值
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-medium text-muted-foreground">¥</span>
            <span className="text-4xl font-semibold tabular-nums tracking-tight">
              {valid ? effective.toLocaleString("zh-CN") : "—"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            最低 ¥{MIN_AMOUNT} 起 · 余额可用于新项目托管
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-6 pt-5 pb-6">
        {/* Amounts */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/80">
            选择金额
          </span>
          <div className="grid grid-cols-3 gap-2">
            {presetAmounts.map((n) => {
              const active = !customInput && amount === n
              return (
                <button
                  key={n}
                  onClick={() => {
                    setAmount(n)
                    setCustomInput("")
                  }}
                  className={`relative flex items-center justify-center rounded-2xl border px-3 py-3 text-sm transition-all ${
                    active
                      ? "border-primary border-2 bg-foreground/5 shadow-sm"
                      : "border-border/60 hover:border-border hover:bg-muted/40"
                  }`}
                >
                  <span className="text-[11px] text-muted-foreground">¥</span>
                  <span className="ml-0.5 font-semibold tabular-nums tracking-tight">{n}</span>
                </button>
              )
            })}
          </div>
          <div className="relative mt-1">
            <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-muted-foreground">
              ¥
            </span>
            <input
              type="number"
              min={MIN_AMOUNT}
              inputMode="decimal"
              placeholder="自定义金额"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="h-11 w-full rounded-2xl border border-border/60 bg-background pr-3 pl-7 text-sm tabular-nums focus:border-foreground focus:outline-none"
            />
          </div>
          {customInput && !valid && (
            <span className="text-[11px] text-red-500">最低充值金额 ¥{MIN_AMOUNT}</span>
          )}
        </div>

        {/* Payment methods */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/80">
            支付方式
          </span>
          <div className="flex flex-col gap-1.5">
            {payMethods.map((m) => {
              const active = method === m.id
              return (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all ${
                    active
                      ? " shadow-sm"
                      : "border-border/60 hover:border-border hover:bg-muted/40"
                  }`}
                >
                  {active && (
                    <div
                      className={`pointer-events-none absolute inset-0 -z-0 bg-gradient-to-r ${m.accent}`}
                    />
                  )}
                  <span className="relative flex size-10 shrink-0 items-center justify-center rounded-full bg-background shadow-sm">
                    <img src={m.logo} alt={m.label} className="size-6" />
                  </span>
                  <div className="relative flex flex-col leading-tight">
                    <span className="text-sm font-medium tracking-tight">{m.label}</span>
                    <span className="text-[11px] text-muted-foreground">{m.hint}</span>
                  </div>
                  <span
                    className={`relative ml-auto flex size-5 items-center justify-center rounded-full border-2 transition-colors ${
                      active ? "border-foreground bg-foreground" : "border-border"
                    }`}
                  >
                    {active && <Check className="size-3 text-background" strokeWidth={3} />}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={!valid}
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-all hover:scale-[1.01] hover:shadow-md disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          确认充值 ¥{valid ? effective.toLocaleString("zh-CN") : "—"}
        </button>
      </div>
    </div>
  )
}