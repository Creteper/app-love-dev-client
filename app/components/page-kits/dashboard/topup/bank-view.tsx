import * as React from "react"
import { Check, ChevronLeft, Copy } from "lucide-react"

type BankViewProps = {
  amount: number
  onConfirm: () => void
  onBack: () => void
}

export function BankView({ amount, onConfirm, onBack }: BankViewProps) {
  const [copied, setCopied] = React.useState<string | null>(null)

  const fields = React.useMemo(
    () => [
      { key: "name", label: "户名", value: "科技有限公司" },
      { key: "bank", label: "开户行", value: "中国工商银行 · xxx" },
      { key: "account", label: "账号", value: "6222 0288 0000 1234 567" },
      { key: "memo", label: "汇款备注", value: `LD-${Date.now().toString().slice(-8)}` },
    ],
    []
  )

  const copy = async (val: string, key: string) => {
    try {
      await navigator.clipboard.writeText(val)
      setCopied(key)
      setTimeout(() => setCopied(null), 1200)
    } catch {
      // clipboard unavailable — no-op
    }
  }

  return (
    <div className="relative">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-500/15 via-slate-500/5 to-transparent px-6 pt-5 pb-4">
        <button
          onClick={onBack}
          className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" />
          返回
        </button>
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-background shadow-sm">
            <img src="/assets/对公汇款.svg" alt="对公汇款" className="size-5" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium tracking-tight">对公汇款</span>
            <span className="text-[11px] text-muted-foreground">1–3 个工作日到账</span>
          </div>
          <div className="ml-auto flex items-baseline gap-1">
            <span className="text-xs text-muted-foreground">¥</span>
            <span className="text-xl font-semibold tabular-nums tracking-tight">
              {amount.toLocaleString("zh-CN")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3 px-6 pt-5 pb-6">
        <div className="flex flex-col gap-1 rounded-2xl border border-border/60 bg-muted/30 p-4">
          {fields.map((f, i) => (
            <div
              key={f.key}
              className={`flex items-center gap-3 py-2 ${
                i === fields.length - 1 ? "" : "border-b border-border/40"
              }`}
            >
              <span className="text-xs text-muted-foreground">{f.label}</span>
              <span className="ml-auto truncate text-sm tabular-nums tracking-tight">
                {f.value}
              </span>
              <button
                onClick={() => copy(f.value, f.key)}
                className="flex size-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
              >
                {copied === f.key ? (
                  <Check className="size-3.5 text-emerald-500" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
        <p className="text-[11px] leading-relaxed text-muted-foreground">
          请使用对公账户转账，转账时务必填写汇款备注，财务核对后将自动入账（1–3 个工作日）。
        </p>

        <button
          onClick={onConfirm}
          className="mt-1 flex h-11 items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-all hover:scale-[1.01] hover:shadow-md"
        >
          <Check className="size-4" />
          我已完成转账
        </button>
      </div>
    </div>
  )
}