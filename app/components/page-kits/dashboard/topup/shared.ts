export type PayMethod = "wechat" | "alipay" | "bank"

export type Stage = "form" | "qrcode" | "bank" | "success"

export type PaymentMethodInfo = {
  id: PayMethod
  label: string
  hint: string
  logo: string
  /** tailwind gradient classes for accent background, e.g. "from-emerald-500/15 to-emerald-500/0" */
  accent: string
}

export const presetAmounts = [50, 100, 500, 1000, 2000, 5000]

export const MIN_AMOUNT = 10

export const payMethods: PaymentMethodInfo[] = [
  {
    id: "wechat",
    label: "微信支付",
    hint: "即时到账",
    logo: "/assets/微信.svg",
    accent: "from-emerald-500/15 to-emerald-500/0",
  },
  {
    id: "alipay",
    label: "支付宝",
    hint: "即时到账",
    logo: "/assets/支付宝.svg",
    accent: "from-blue-500/15 to-blue-500/0",
  },
  {
    id: "bank",
    label: "对公汇款",
    hint: "1–3 个工作日",
    logo: "/assets/对公汇款.svg",
    accent: "from-slate-500/15 to-slate-500/0",
  },
]

export const confettiEmojis = [
  "🎉",
  "✨",
  "🎊",
  "💰",
  "🎁",
  "⭐",
  "🌟",
  "💎",
  "🥳",
  "🪅",
]

export function formatAmount(n: number) {
  return n.toLocaleString("zh-CN")
}
