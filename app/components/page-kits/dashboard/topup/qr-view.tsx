import * as React from "react"
import { Check, ChevronLeft } from "lucide-react"
import { payMethods, type PayMethod } from "./shared"

type QrViewProps = {
  amount: number
  method: PayMethod
  onConfirm: () => void
  onBack: () => void
}

export function QrView({ amount, method, onConfirm, onBack }: QrViewProps) {
  const m = payMethods.find((x) => x.id === method)!
  const headerGradient =
    method === "wechat"
      ? "from-emerald-500/15 via-emerald-500/5"
      : "from-blue-500/15 via-blue-500/5"

  return (
    <div className="relative">
      <div
        className={`relative overflow-hidden bg-gradient-to-br ${headerGradient} to-transparent px-6 pt-5 pb-4`}
      >
        <button
          onClick={onBack}
          className="mb-3 inline-flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          <ChevronLeft className="size-3.5" />
          返回
        </button>
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-full bg-background shadow-sm">
            <img src={m.logo} alt={m.label} className="size-5" />
          </span>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-medium tracking-tight">{m.label}</span>
            <span className="text-[11px] text-muted-foreground">扫码完成支付</span>
          </div>
          <div className="ml-auto flex items-baseline gap-1">
            <span className="text-xs text-muted-foreground">¥</span>
            <span className="text-xl font-semibold tabular-nums tracking-tight">
              {amount.toLocaleString("zh-CN")}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 px-6 pt-5 pb-6">
        <div className="relative">
          <FakeQR seed={method.charCodeAt(0) + amount} />
          <span className="absolute top-1/2 left-1/2 flex size-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl bg-white shadow-md ring-2 ring-white">
            <img src={m.logo} alt={m.label} className="size-7" />
          </span>
        </div>
        <div className="flex flex-col items-center gap-1">
          <span className="text-sm font-medium tracking-tight">
            请使用{m.label}扫一扫
          </span>
          <span className="text-[11px] text-muted-foreground">完成支付后点击下方按钮</span>
        </div>

        <button
          onClick={onConfirm}
          className="mt-1 flex h-11 w-full items-center justify-center gap-2 rounded-full bg-foreground text-sm font-medium text-background transition-all hover:scale-[1.01] hover:shadow-md"
        >
          <Check className="size-4" />
          已支付
        </button>
        <button
          onClick={onBack}
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          切换其他支付方式
        </button>
      </div>
    </div>
  )
}

/* Fake QR — visual only, not scannable */
function FakeQR({ seed }: { seed: number }) {
  const size = 25

  const cells = React.useMemo(() => {
    const arr = new Array<boolean>(size * size).fill(false)
    const rng = (i: number) => {
      const x = Math.sin(seed * 37.137 + i * 13.91 + 11) * 10000
      return x - Math.floor(x)
    }
    for (let i = 0; i < arr.length; i++) arr[i] = rng(i) > 0.52

    const placeMarker = (ox: number, oy: number) => {
      for (let y = -1; y <= 7; y++) {
        for (let x = -1; x <= 7; x++) {
          const ax = x + ox
          const ay = y + oy
          if (ax < 0 || ay < 0 || ax >= size || ay >= size) continue
          const isQuiet = x === -1 || x === 7 || y === -1 || y === 7
          const isOuter = x === 0 || x === 6 || y === 0 || y === 6
          const isInner = x >= 2 && x <= 4 && y >= 2 && y <= 4
          arr[ay * size + ax] = !isQuiet && (isOuter || isInner)
        }
      }
    }
    placeMarker(0, 0)
    placeMarker(size - 7, 0)
    placeMarker(0, size - 7)
    return arr
  }, [seed])

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="size-52 rounded-2xl bg-white p-3 shadow-md ring-1 ring-border/40"
      shapeRendering="crispEdges"
    >
      {cells.map(
        (on, i) =>
          on && (
            <rect
              key={i}
              x={i % size}
              y={Math.floor(i / size)}
              width="1"
              height="1"
              fill="#0f172a"
            />
          )
      )}
    </svg>
  )
}
