import * as React from "react"
import { Check, Loader2 } from "lucide-react"
import { WITHDRAW_MIN, payoutMethods, type PayoutMethod } from "./shared"

type FormViewProps = {
  available: number
  amount: number
  setAmount: (n: number) => void
  customInput: string
  setCustomInput: (s: string) => void
  method: PayoutMethod
  setMethod: (m: PayoutMethod) => void
  effective: number
  valid: boolean
  reason?: string
  processing: boolean
  onSubmit: () => void
}

export function FormView({
  available,
  amount,
  setAmount,
  customInput,
  setCustomInput,
  method,
  setMethod,
  effective,
  valid,
  reason,
  processing,
  onSubmit,
}: FormViewProps) {
  const presets = React.useMemo(() => {
    const candidates = [100, 500, 1000, 2000]
    const list = candidates.filter((n) => n <= available)
    if (available >= WITHDRAW_MIN) list.push(available)
    return Array.from(new Set(list))
  }, [available])

  return (
    <div className="relative">
      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent px-6 pt-7 pb-6">
        <div className="absolute -top-10 -right-10 size-40 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="relative flex flex-col gap-1">
          <span className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/80">
            提现到账
          </span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-medium text-muted-foreground">¥</span>
            <span className="text-4xl font-semibold tabular-nums tracking-tight">
              {valid ? effective.toLocaleString("zh-CN") : "—"}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            可提现余额 ¥{available.toLocaleString("zh-CN")} · 最低 ¥
            {WITHDRAW_MIN} 起
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-6 pt-5 pb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/80">
              选择金额
            </span>
            <button
              type="button"
              onClick={() => {
                setAmount(available)
                setCustomInput("")
              }}
              disabled={available < WITHDRAW_MIN}
              className="text-[11px] text-primary transition-opacity hover:opacity-80 disabled:opacity-40"
            >
              全部提现
            </button>
          </div>
          {presets.length ? (
            <div className="grid grid-cols-3 gap-2">
              {presets.map((n) => {
                const active = !customInput && amount === n
                const isAll = n === available
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
                    <span className="ml-0.5 font-semibold tabular-nums tracking-tight">
                      {n.toLocaleString("zh-CN")}
                    </span>
                    {isAll ? (
                      <span className="absolute -top-1.5 right-1.5 rounded-full bg-foreground px-1 text-[9px] font-medium text-background">
                        全部
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          ) : null}
          <div className="relative mt-1">
            <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-sm text-muted-foreground">
              ¥
            </span>
            <input
              type="number"
              min={WITHDRAW_MIN}
              max={available}
              inputMode="decimal"
              placeholder="自定义金额"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              className="h-11 w-full rounded-2xl border border-border/60 bg-background pr-3 pl-7 text-sm tabular-nums focus:border-foreground focus:outline-none"
            />
          </div>
          {!valid && reason ? (
            <span className="text-[11px] text-red-500">{reason}</span>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-xs font-medium uppercase tracking-widest text-muted-foreground/80">
            到账方式
          </span>
          <div className="flex flex-col gap-1.5">
            {payoutMethods.map((m) => {
              const active = method === m.id
              return (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`group relative flex items-center gap-3 overflow-hidden rounded-2xl border px-4 py-3.5 text-left transition-all ${
                    active
                      ? "shadow-sm"
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
                    <span className="text-sm font-medium tracking-tight">
                      {m.label}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {m.hint}
                    </span>
                  </div>
                  <span
                    className={`relative ml-auto flex size-5 items-center justify-center rounded-full border-2 transition-colors ${
                      active ? "border-foreground bg-foreground" : "border-border"
                    }`}
                  >
                    {active && (
                      <Check className="size-3 text-background" strokeWidth={3} />
                    )}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <button
          onClick={onSubmit}
          disabled={!valid || processing}
          className="flex h-12 items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-all hover:scale-[1.01] hover:shadow-md disabled:opacity-40 disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          {processing ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              处理中…
            </>
          ) : (
            <>确认提现 ¥{valid ? effective.toLocaleString("zh-CN") : "—"}</>
          )}
        </button>
      </div>
    </div>
  )
}
