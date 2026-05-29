import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./app.css";
import { TooltipProvider } from "~/components/ui/tooltip"
import { Loading } from "./components/ui/loading";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-cn" className="font-MiSans">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <TooltipProvider>{children}</TooltipProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-background">
      <Loading className="h-20 w-48" />
    </div>
  )
}


export default function App() {
  return <Outlet />;
}

export { ErrorBoundary };
