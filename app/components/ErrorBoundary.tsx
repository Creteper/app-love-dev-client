import { isRouteErrorResponse, Link } from "react-router";
import type { Route } from "../+types/root";
import { Button } from "./ui/button";
import { motion } from "motion/react"

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let code = "500";
  let message = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    code = String(error.status);
    message =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || message;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    message = error.message;
    stack = error.stack;
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center font-MiSans!"
      style={{ backgroundColor: "#f5f5f7" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.4,
          scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
        }}

        className="flex flex-col items-center text-center px-6">
        <img src="\assets\error-boundary.png" alt="error" className="h-64" />
        <span
          className="font-semibold"
          style={{
            fontFamily: "SF Pro Display, system-ui, -apple-system, sans-serif",
            fontSize: 40,
            lineHeight: 1.1,
            color: "#1d1d1f",
          }}
        >
          {code}
        </span>

        <p
          className="mt-4 max-w-md"
          style={{
            fontSize: 17,
            lineHeight: 1.47,
            letterSpacing: "-0.374px",
            color: "#7a7a7a",
          }}
        >
          遇到了些错误....
          <span className="text-destructive/50">{message}</span>
        </p>

        {stack && (
          <pre
            className="mt-8 w-full max-w-lg overflow-x-auto rounded-lg p-6 text-left"
            style={{
              backgroundColor: "#ffffff",
              fontSize: 12,
              lineHeight: 1.5,
              color: "#333333",
              border: "1px solid #e0e0e0",
            }}
          >
            <code>{stack}</code>
          </pre>
        )}



        <Link
          to="/"
        >
          <Button className="mt-4">回到首页</Button>
        </Link>

      </motion.div>
    </main>
  );
}