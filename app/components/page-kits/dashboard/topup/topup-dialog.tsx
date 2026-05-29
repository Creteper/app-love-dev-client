import * as React from "react"
import { Dialog, DialogContent } from "~/components/ui/dialog"
import { BankView } from "./bank-view"
import { FormView } from "./form-view"
import { QrView } from "./qr-view"
import { SuccessView } from "./success-view"
import { MIN_AMOUNT, type PayMethod, type Stage } from "./shared"

type TopupDialogProps = {
  open: boolean
  onOpenChange: (v: boolean) => void
  /** invoked when the user finishes a top-up; receives the final amount */
  onSuccess?: (amount: number) => void
  /** initial preset amount, defaults to 100 */
  defaultAmount?: number
  /** initial payment method, defaults to "wechat" */
  defaultMethod?: PayMethod
}

export function TopupDialog({
  open,
  onOpenChange,
  onSuccess,
  defaultAmount = 100,
  defaultMethod = "wechat",
}: TopupDialogProps) {
  const [amount, setAmount] = React.useState<number>(defaultAmount)
  const [customInput, setCustomInput] = React.useState("")
  const [method, setMethod] = React.useState<PayMethod>(defaultMethod)
  const [stage, setStage] = React.useState<Stage>("form")

  const effective = customInput ? Number(customInput) : amount
  const valid = !Number.isNaN(effective) && effective >= MIN_AMOUNT

  // Reset state shortly after the dialog closes so the next open starts clean
  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setAmount(defaultAmount)
        setCustomInput("")
        setMethod(defaultMethod)
        setStage("form")
      }, 250)
      return () => clearTimeout(t)
    }
  }, [open, defaultAmount, defaultMethod])

  const proceed = () => {
    if (!valid) return
    setStage(method === "bank" ? "bank" : "qrcode")
  }

  const succeed = () => {
    setStage("success")
    onSuccess?.(effective)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 sm:max-w-md">
        {stage === "form" && (
          <FormView
            amount={amount}
            setAmount={setAmount}
            customInput={customInput}
            setCustomInput={setCustomInput}
            method={method}
            setMethod={setMethod}
            effective={effective}
            valid={valid}
            onSubmit={proceed}
          />
        )}
        {stage === "qrcode" && (
          <QrView
            amount={effective}
            method={method}
            onConfirm={succeed}
            onBack={() => setStage("form")}
          />
        )}
        {stage === "bank" && (
          <BankView
            amount={effective}
            onConfirm={succeed}
            onBack={() => setStage("form")}
          />
        )}
        {stage === "success" && (
          <SuccessView amount={effective} onClose={() => onOpenChange(false)} />
        )}
      </DialogContent>
    </Dialog>
  )
}