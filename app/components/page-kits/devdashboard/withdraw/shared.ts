export type PayoutMethod = "wechat" | "alipay" | "bank"

export type PayoutMethodInfo = {
  id: PayoutMethod
  label: string
  hint: string
  logo: string
  accent: string
}

export const WITHDRAW_MIN = 50

export const payoutMethods: PayoutMethodInfo[] = [
  {
    id: "wechat",
    label: "微信钱包",
    hint: "实时到账 · 单笔上限 ¥20,000",
    logo: "/assets/微信.svg",
    accent: "from-emerald-500/15 to-emerald-500/0",
  },
  {
    id: "alipay",
    label: "支付宝",
    hint: "实时到账 · 单笔上限 ¥50,000",
    logo: "/assets/支付宝.svg",
    accent: "from-blue-500/15 to-blue-500/0",
  },
  {
    id: "bank",
    label: "银行卡",
    hint: "1–3 个工作日 · 不限单笔金额",
    logo: "/assets/对公汇款.svg",
    accent: "from-slate-500/15 to-slate-500/0",
  },
]
