import type { Route } from "./+types/signup";
import { DevSignupForm } from "~/components/page-kits/dev-signup-form";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "爱开发 - 开发者注册" },
    { name: "description", content: "注册“爱开发”开发者账号" },
  ];
}

export default function DevSignUp() {

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <DevSignupForm />
      </div>
    </div>
  );
}
