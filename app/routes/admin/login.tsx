import { AdminAuthProvider } from "~/components/page-kits/admin/admin-auth-context"
import { AdminLoginForm } from "~/components/page-kits/admin/admin-login-form"

export function meta() {
  return [
    { title: "爱开发 - 后台登录" },
    { name: "description", content: "爱开发后台管理端 · 仅限平台员工" },
  ]
}

export default function AdminLogin() {
  return (
    <AdminAuthProvider>
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
          <AdminLoginForm />
        </div>
      </div>
    </AdminAuthProvider>
  )
}
