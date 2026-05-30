"use client"

import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import {
  ArrowRight,
  Check,
  IdCard,
  Loader2,
  ScanFace,
  ShieldCheck,
  Smartphone,
  User,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { cn } from "~/lib/utils"
import { maskId, maskName } from "./real-name-utils"

type Stage = "form" | "scan" | "success"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSuccess?: (info: { name: string; idNumber: string }) => void
}

const ID_REGEX = /^[1-9]\d{5}(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/

export function RealNameDialog({ open, onOpenChange, onSuccess }: Props) {
  const [stage, setStage] = React.useState<Stage>("form")
  const [name, setName] = React.useState("")
  const [idNumber, setIdNumber] = React.useState("")
  const [secondsLeft, setSecondsLeft] = React.useState(3)

  // Reset state every time the dialog opens.
  React.useEffect(() => {
    if (open) {
      setStage("form")
      setName("")
      setIdNumber("")
      setSecondsLeft(3)
    }
  }, [open])

  // Mocked face-scan countdown — automatically completes after 3s.
  React.useEffect(() => {
    if (stage !== "scan") return
    setSecondsLeft(3)
    const tickId = window.setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1))
    }, 1000)
    const doneId = window.setTimeout(() => {
      setStage("success")
      onSuccess?.({ name, idNumber })
    }, 3200)
    return () => {
      window.clearInterval(tickId)
      window.clearTimeout(doneId)
    }
  }, [stage, name, idNumber, onSuccess])

  const nameValid = name.trim().length >= 2 && name.trim().length <= 16
  const idValid = ID_REGEX.test(idNumber.trim())
  const canSubmit = nameValid && idValid

  function handleSubmit() {
    if (!canSubmit) return
    setStage("scan")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md overflow-hidden p-0"
        showCloseButton={false}
      >
        <AnimatePresence mode="wait" initial={false}>
          {stage === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <FormStage
                name={name}
                setName={setName}
                idNumber={idNumber}
                setIdNumber={setIdNumber}
                nameValid={nameValid}
                idValid={idValid}
                canSubmit={canSubmit}
                onSubmit={handleSubmit}
              />
            </motion.div>
          )}

          {stage === "scan" && (
            <motion.div
              key="scan"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <ScanStage
                name={name}
                idNumber={idNumber}
                secondsLeft={secondsLeft}
                onCompleteNow={() => {
                  setStage("success")
                  onSuccess?.({ name, idNumber })
                }}
                onBack={() => setStage("form")}
              />
            </motion.div>
          )}

          {stage === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              <SuccessStage
                name={name}
                idNumber={idNumber}
                onDone={() => onOpenChange(false)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

// ------------------------------ Stage 1: Form ------------------------------

function FormStage({
  name,
  setName,
  idNumber,
  setIdNumber,
  nameValid,
  idValid,
  canSubmit,
  onSubmit,
}: {
  name: string
  setName: (s: string) => void
  idNumber: string
  setIdNumber: (s: string) => void
  nameValid: boolean
  idValid: boolean
  canSubmit: boolean
  onSubmit: () => void
}) {
  return (
    <>
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-violet-500/5 to-transparent px-6 pt-7 pb-5">
        <div className="absolute -top-10 -right-10 size-40 rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-foreground text-background">
            <ShieldCheck className="size-5" />
          </span>
          <div className="flex flex-col gap-0.5">
            <DialogHeader>
              <DialogTitle className="text-base font-semibold tracking-tight">
                实名认证
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                按监管要求，首次进入仪表盘前需完成实名认证
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSubmit()
        }}
        className="flex flex-col gap-4 px-6 pt-5 pb-6"
      >
        <FieldShell
          icon={<User className="size-4" />}
          label="真实姓名"
          hint={
            !nameValid && name.length > 0
              ? "请输入 2–16 个字符的真实姓名"
              : "请按身份证上的姓名填写"
          }
          invalid={!nameValid && name.length > 0}
        >
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：张三"
            className="h-11"
            autoFocus
          />
        </FieldShell>

        <FieldShell
          icon={<IdCard className="size-4" />}
          label="身份证号"
          hint={
            !idValid && idNumber.length > 0
              ? "身份证号格式不正确"
              : "全部仅用于身份核验，加密存储"
          }
          invalid={!idValid && idNumber.length > 0}
        >
          <Input
            value={idNumber}
            onChange={(e) =>
              setIdNumber(e.target.value.replace(/\s/g, "").toUpperCase())
            }
            maxLength={18}
            placeholder="18 位身份证号码"
            className="h-11 font-mono tabular-nums"
          />
        </FieldShell>

        <Button
          type="submit"
          size="lg"
          disabled={!canSubmit}
          className="mt-1 w-full"
        >
          下一步 · 人脸识别
          <ArrowRight className="size-4" />
        </Button>

        <p className="text-center text-[11px] leading-relaxed text-muted-foreground">
          我们仅在认证流程中获取你的姓名与身份证号，符合<a className="underline-offset-2 hover:underline" href="#">《个人信息保护法》</a>。
        </p>
      </form>
    </>
  )
}

function FieldShell({
  icon,
  label,
  hint,
  invalid,
  children,
}: {
  icon: React.ReactNode
  label: string
  hint?: string
  invalid?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground/80">
        {icon}
        {label}
      </label>
      {children}
      {hint ? (
        <span
          className={cn(
            "text-[11px]",
            invalid ? "text-rose-500" : "text-muted-foreground"
          )}
        >
          {hint}
        </span>
      ) : null}
    </div>
  )
}

// ------------------------------ Stage 2: Scan ------------------------------

function ScanStage({
  name,
  idNumber,
  secondsLeft,
  onCompleteNow,
  onBack,
}: {
  name: string
  idNumber: string
  secondsLeft: number
  onCompleteNow: () => void
  onBack: () => void
}) {
  return (
    <div className="flex flex-col">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-emerald-500/5 to-transparent px-6 pt-7 pb-4">
        <div className="absolute -top-10 -right-10 size-40 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-foreground text-background">
            <ScanFace className="size-5" />
          </span>
          <div>
            <DialogHeader>
              <DialogTitle className="text-base font-semibold tracking-tight">
                人脸识别
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                请用「爱开发」App 扫码完成活体检测
              </DialogDescription>
            </DialogHeader>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-6 pt-5 pb-6">
        <div className="flex justify-center">
          <FauxQR />
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
          <Loader2 className="size-3.5 animate-spin" />
          {secondsLeft > 0
            ? `等待客户端人脸采集… ${secondsLeft}s`
            : "正在比对，请稍候…"}
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-2xl bg-muted/40 px-4 py-3">
          <KV label="姓名" value={maskName(name)} />
          <KV label="身份证号" value={maskId(idNumber)} />
        </div>

        <div className="flex flex-col gap-2 rounded-xl border border-dashed border-border/60 p-3 text-[11px] leading-relaxed text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
            <Smartphone className="size-3.5" />
            扫码后请按提示完成
          </span>
          <ol className="ml-5 list-decimal space-y-0.5">
            <li>打开「爱开发」App 或微信</li>
            <li>扫描上方二维码</li>
            <li>按引导眨眼、张嘴完成活体检测</li>
          </ol>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={onBack}
            className="h-9 rounded-full px-3 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            返回修改
          </button>
          <Button size="sm" onClick={onCompleteNow}>
            我已完成
            <Check className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="truncate font-mono text-xs tabular-nums tracking-tight">
        {value}
      </span>
    </div>
  )
}

function FauxQR() {
  // A static 25x25 grid producing a QR-like silhouette: three corner finders,
  // one bottom-right alignment square, and a deterministic data pattern.
  const SIZE = 25
  const cell = 8 // px per cell
  const finder = (offsetX: number, offsetY: number) => (
    <g key={`f-${offsetX}-${offsetY}`}>
      <rect
        x={offsetX * cell}
        y={offsetY * cell}
        width={7 * cell}
        height={7 * cell}
        fill="currentColor"
      />
      <rect
        x={(offsetX + 1) * cell}
        y={(offsetY + 1) * cell}
        width={5 * cell}
        height={5 * cell}
        fill="white"
      />
      <rect
        x={(offsetX + 2) * cell}
        y={(offsetY + 2) * cell}
        width={3 * cell}
        height={3 * cell}
        fill="currentColor"
      />
    </g>
  )

  // Deterministic boolean pattern for the data area.
  const isData = (x: number, y: number) => {
    if (x < 8 && y < 8) return false
    if (x >= SIZE - 7 && y < 8) return false
    if (x < 8 && y >= SIZE - 7) return false
    // Bottom-right alignment block
    if (x >= SIZE - 9 && x <= SIZE - 5 && y >= SIZE - 9 && y <= SIZE - 5) {
      return (x + y) % 2 === 0
    }
    // Timing lines
    if (y === 6 && x >= 8 && x < SIZE - 8) return x % 2 === 0
    if (x === 6 && y >= 8 && y < SIZE - 8) return y % 2 === 0
    // Pseudo-random data via a hash
    const h = (x * 73856093) ^ (y * 19349663)
    return (h & 7) > 3
  }

  const cells: React.ReactNode[] = []
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      if (isData(x, y)) {
        cells.push(
          <rect
            key={`${x}-${y}`}
            x={x * cell}
            y={y * cell}
            width={cell}
            height={cell}
            fill="currentColor"
          />
        )
      }
    }
  }

  return (
    <div className="relative">
      <div className="absolute -inset-1 rounded-2xl bg-primary/10 blur-2xl" />
      <div className="relative rounded-2xl bg-white p-3 ring-1 ring-border/60 shadow-lg">
        <svg
          width={SIZE * cell}
          height={SIZE * cell}
          viewBox={`0 0 ${SIZE * cell} ${SIZE * cell}`}
          className="text-foreground"
        >
          <rect width={SIZE * cell} height={SIZE * cell} fill="white" />
          {cells}
          {finder(0, 0)}
          {finder(SIZE - 7, 0)}
          {finder(0, SIZE - 7)}
        </svg>
        <motion.span
          aria-hidden
          initial={{ y: 0 }}
          animate={{ y: SIZE * cell - 6 }}
          transition={{
            duration: 1.6,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
          className="pointer-events-none absolute inset-x-3 top-3 h-0.5 rounded-full bg-emerald-500/70 shadow-[0_0_8px_oklch(0.7_0.18_160_/_0.6)]"
        />
      </div>
    </div>
  )
}

// ------------------------------ Stage 3: Success ------------------------------

function SuccessStage({
  name,
  idNumber,
  onDone,
}: {
  name: string
  idNumber: string
  onDone: () => void
}) {
  return (
    <div className="flex flex-col">
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent px-6 pt-9 pb-6 text-center">
        <div className="absolute -top-10 -right-10 size-40 rounded-full bg-emerald-500/10 blur-3xl" />
        <motion.div
          initial={{ scale: 0.5, opacity: 0, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{
            type: "spring",
            stiffness: 280,
            damping: 18,
            mass: 0.7,
          }}
          className="relative mx-auto mb-3 flex size-14 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-lg"
        >
          <ShieldCheck className="size-7" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="relative text-lg font-semibold tracking-tight"
        >
          实名认证成功
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18, duration: 0.3 }}
          className="relative mt-1 text-xs text-muted-foreground"
        >
          欢迎 {name}，可以开始使用爱开发
        </motion.p>
      </div>

      <div className="flex flex-col gap-4 px-6 pt-4 pb-6">
        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-muted/40 px-4 py-3">
          <KV label="姓名" value={maskName(name)} />
          <KV label="身份证号" value={maskId(idNumber)} />
        </div>
        <Button size="lg" onClick={onDone} className="w-full">
          进入仪表盘
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  )
}
