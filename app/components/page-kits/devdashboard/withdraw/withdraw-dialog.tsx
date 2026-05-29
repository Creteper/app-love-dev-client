import * as React from "react"
import { Dialog, DialogContent } from "~/components/ui/dialog"
import { SuccessView } from "~/components/page-kits/dashboard/topup"
import { FormView } from "./form-view"
import { WITHDRAW_MIN, type PayoutMethod, payoutMethods } from "./shared"

type Stage = "form" | "success"

type WithdrawDialogProps = {
  open: boolean
  onOpenChange: (v: boolean) => void
  /** Current withdrawable balance in CNY */
  available: number
  /** Fired with the amount actually withdrawn after the success view is shown */
  onSuccess?: (amount: number, method: PayoutMethod) => void
  defaultMethod?: PayoutMethod
}

export function WithdrawDialog({
  open,
  onOpenChange,
  available,
  onSuccess,
  defaultMethod = "wechat",
}: WithdrawDialogProps) {
  const [amount, setAmount] = React.useState<number>(
    Math.min(500, Math.max(WITHDRAW_MIN, Math.floor(available)))
  )
  const [customInput, setCustomInput] = React.useState("")
  const [method, setMethod] = React.useState<PayoutMethod>(defaultMethod)
  const [stage, setStage] = React.useState<Stage>("form")
  const [processing, setProcessing] = React.useState(false)

  const effective = customInput ? Number(customInput) : amount
  const reason = !Number.isFinite(effective)
    ? undefined
    : effective < WITHDRAW_MIN
      ? `最低提现金额 ¥${WITHDRAW_MIN}`
      : effective > available
        ? `不能超过可提现余额 ¥${available.toLocaleString("zh-CN")}`
        : undefined
  const valid =
    Number.isFinite(effective) && effective >= WITHDRAW_MIN && effective <= available

  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setAmount(Math.min(500, Math.max(WITHDRAW_MIN, Math.floor(available))))
        setCustomInput("")
        setMethod(defaultMethod)
        setStage("form")
        setProcessing(false)
      }, 250)
      return () => clearTimeout(t)
    }
  }, [open, available, defaultMethod])

  const proceed = () => {
    if (!valid || processing) return
    setProcessing(true)
    window.setTimeout(() => {
      setStage("success")
      setProcessing(false)
      onSuccess?.(effective, method)
    }, 700)
  }

  const methodInfo = payoutMethods.find((m) => m.id === method)
  const successHint = `已发起至 ${methodInfo?.label ?? "账户"} · ${
    method === "bank" ? "1–3 个工作日内到账" : "预计实时到账"
  }`

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-md">
        {stage === "form" && (
          <FormView
            available={available}
            amount={amount}
            setAmount={setAmount}
            customInput={customInput}
            setCustomInput={setCustomInput}
            method={method}
            setMethod={setMethod}
            effective={effective}
            valid={valid}
            reason={reason}
            processing={processing}
            onSubmit={proceed}
          />
        )}
        {stage === "success" && (
          <SuccessView
            amount={effective}
            title="提现成功"
            hint={successHint}
            sign="-"
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
