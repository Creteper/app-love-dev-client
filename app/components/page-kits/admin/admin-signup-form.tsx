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
  roleLabel,
} from "./admin-auth-context"

export function AdminSignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const { signIn } = useAdminAuth()
  const [role, setRole] = React.useState<AdminRole>("cs")
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [confirm, setConfirm] = React.useState("")
  const valid =
    name.trim().length > 0 &&
    /.+@.+\..+/.test(email.trim()) &&
    password.length >= 8 &&
    password === confirm

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return
    signIn({ role, name: name.trim(), email: email.trim() })
    navigate("/admin")
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">注册后台账号</h1>
                <p className="text-sm text-balance text-muted-foreground">
                  注册需平台审核通过后方可登录使用
                </p>
              </div>

              <Field>
                <FieldLabel>身份</FieldLabel>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("cs")}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-all",
                      role === "cs"
                        ? "border-foreground bg-foreground/5 shadow-sm"
                        : "border-border/60 hover:border-border hover:bg-muted/40"
                    )}
                  >
                    <Headset className="size-4" />
                    {roleLabel.cs}
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm transition-all",
                      role === "admin"
                        ? "border-foreground bg-foreground/5 shadow-sm"
                        : "border-border/60 hover:border-border hover:bg-muted/40"
                    )}
                  >
                    <ShieldCheck className="size-4" />
                    {roleLabel.admin}
                  </button>
                </div>
                <FieldDescription>
                  管理员账号仅限平台运营内部开通，员工请选客服。
                </FieldDescription>
              </Field>

              <Field>
                <FieldLabel htmlFor="name">姓名</FieldLabel>
                <Input
                  id="name"
                  placeholder="例：客服·小张"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
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
                <FieldDescription>
                  请使用平台分配的工作邮箱，方便审核身份。
                </FieldDescription>
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">密码</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">确认密码</FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                    />
                  </Field>
                </Field>
                <FieldDescription>
                  密码至少 8 个字符，两次输入需一致。
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" disabled={!valid}>
                  提交申请
                </Button>
              </Field>
              <FieldDescription className="text-center">
                已有账号？<a href="/admin/login">登录</a>
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
