import type { Route } from "./+types/login";
import { DevLoginForm } from "~/components/page-kits/dev-login-form"

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "爱开发 - 开发者登录" },
    { name: "description", content: "登录到“爱开发”开发者端" },
  ];
}

export default function DevLogin() {

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <DevLoginForm />
      </div>
    </div>
  );
}
