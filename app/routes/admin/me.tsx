import { motion } from "motion/react"
import { useNavigate } from "react-router"
import { LogOut, Settings, ShieldCheck } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import {
  useAdminAuth,
  roleHint,
  roleLabel,
} from "~/components/page-kits/admin/admin-auth-context"

export function meta() {
  return [{ title: "爱开发 - 我的（后台）" }]
}

export default function AdminMe() {
  const { user, signOut } = useAdminAuth()
  const navigate = useNavigate()

  if (!user) return null

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-4 p-4 md:gap-6 md:p-8">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="relative overflow-hidden rounded-3xl border border-border/50 bg-card p-5 md:p-8"
      >
        <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="relative flex flex-wrap items-center gap-5">
          <Avatar className="size-20 rounded-2xl">
            <AvatarImage src="/assets/avatar%20(1).png" alt={user.name} />
            <AvatarFallback className="rounded-2xl text-lg">
              {user.name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex min-w-0 flex-1 flex-col gap-1.5">
            <div className="flex flex-wrap items-baseline gap-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                {user.name}
              </h1>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
                <ShieldCheck className="size-3" />
                {roleLabel[user.role]}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">
              {roleHint[user.role]}
            </p>
          </div>
          <Button size="sm" variant="outline" className="shrink-0">
            <Settings className="size-3.5" />
            编辑资料
          </Button>
        </div>
      </motion.section>

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.06, ease: [0.4, 0, 0.2, 1] }}
        className="flex flex-col gap-3 rounded-3xl border border-border/50 bg-card p-5 md:p-6"
      >
        <h2 className="text-sm font-semibold tracking-tight">账号</h2>
        <p className="text-xs text-muted-foreground">
          所有后台操作都会写入审计日志，包括登录、查看、修改等。
        </p>
        <Button
          variant="outline"
          onClick={() => {
            signOut()
            navigate("/admin/login")
          }}
          className="w-fit"
        >
          <LogOut className="size-3.5" />
          退出登录
        </Button>
      </motion.section>
    </main>
  )
}
