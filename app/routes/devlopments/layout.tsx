import { Outlet } from "react-router";
import { DevNavHeader } from "~/components/page-kits/devlopments/nav-header";
import { AmbientBackdrop } from "~/components/page-kits/devlopments/ambient-backdrop";
import { DevMobileBottomNav } from "~/components/page-kits/devdashboard/mobile-bottom-nav";

export default function DevLayOut() {
  return (
    <div className="relative min-h-svh overflow-hidden bg-background text-foreground">
      <AmbientBackdrop />
      <DevNavHeader />
      <main
        className="relative mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6 lg:px-8"
        style={{
          paddingBottom: "calc(6rem + env(safe-area-inset-bottom))",
        }}
      >
        <Outlet />
      </main>
      <DevMobileBottomNav />
    </div>
  )
}
