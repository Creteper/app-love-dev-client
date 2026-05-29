import { SignupForm } from "~/components/page-kits/signup-form";
import type { Route } from "./+types/home";


export function meta({ }: Route.MetaArgs) {
  return [
    { title: "爱开发 - 注册" },
    { name: "description", content: "注册“爱开发”账号" },
  ];
}

export default function SignUp() {

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignupForm />
      </div>
    </div>
  );
}
