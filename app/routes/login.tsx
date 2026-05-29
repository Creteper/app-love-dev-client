import type { Route } from "./+types/home";
import { LoginForm } from "~/components/page-kits/login-form"

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "爱开发 - 登录" },
    { name: "description", content: "登录到“爱开发”" },
  ];
}

export default function Login() {

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
}
