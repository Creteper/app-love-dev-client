import { AdminAuthProvider } from "~/components/page-kits/admin/admin-auth-context"
import { AdminSignupForm } from "~/components/page-kits/admin/admin-signup-form"

export function meta() {
  return [
    { title: "爱开发 - 后台注册" },
    { name: "description", content: "申请爱开发后台账号" },
  ]
}

export default function AdminSignup() {
  return (
    <AdminAuthProvider>
      <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
        <div className="w-full max-w-sm md:max-w-4xl">
          <AdminSignupForm />
        </div>
      </div>
    </AdminAuthProvider>
  )
}
