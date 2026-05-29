"use client"

import * as React from "react"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "~/components/ui/field"
import { Input } from "~/components/ui/input"
import { Headset, ShieldCheck } from "lucide-react"
import { useNavigate } from "react-router"
import {
  useAdminAuth,
  type AdminRole,
  roleHint,
  roleLabel,
} from "./admin-auth-context"

export function AdminLoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const { signIn } = useAdminAuth()
  const [role, setRole] = React.useState<AdminRole>("cs")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    // For demo we sign in as a known seed account so example data shows up.
    const name = role === "admin" ? "运营·总台" : "客服·小张"
    signIn({ role, name, email: email.trim() })
    navigate("/admin")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">爱开发 · 后台</h1>
                <p className="text-balance text-muted-foreground">
                  登录后台管理端，仅供平台员工使用
                </p>
              </div>

              <Field>
                <FieldLabel>身份</FieldLabel>
                <div className="grid grid-cols-2 gap-2">
                  <RoleCard
                    icon={<Headset className="size-4" />}
                    active={role === "cs"}
                    onClick={() => setRole("cs")}
                    value="cs"
                  />
                  <RoleCard
                    icon={<ShieldCheck className="size-4" />}
                    active={role === "admin"}
                    onClick={() => setRole("admin")}
                    value="admin"
                  />
                </div>
                <FieldDescription>{roleHint[role]}</FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="email">邮箱</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="staff@lovedev.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">密码</FieldLabel>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    忘记密码？
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <Button type="submit">以 {roleLabel[role]} 身份登录</Button>
              </Field>
              <FieldDescription className="text-center">
                还没有账号？<a href="/admin/signup">注册</a>
              </FieldDescription>
            </FieldGroup>
          </form>
          <div className="relative hidden bg-muted md:block">
            <img
              src="/assets/description.png"
              alt="后台示意"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        所有操作均会记入审计日志。
      </FieldDescription>
    </div>
  )
}

function RoleCard({
  icon,
  active,
  onClick,
  value,
}: {
  icon: React.ReactNode
  active: boolean
  onClick: () => void
  value: AdminRole
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-left text-sm transition-all",
        active
          ? "border-foreground bg-foreground/5 shadow-sm"
          : "border-border/60 hover:border-border hover:bg-muted/40"
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-md",
          active
            ? "bg-foreground text-background"
            : "bg-muted text-muted-foreground"
        )}
      >
        {icon}
      </span>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-medium">{roleLabel[value]}</span>
        <span className="text-[11px] text-muted-foreground">
          {value === "cs" ? "对接客户" : "全权限"}
        </span>
      </div>
    </button>
  )
}
