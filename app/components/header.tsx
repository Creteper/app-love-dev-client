import { motion } from "motion/react"
import { useEffect, useRef, useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "./liquid-glass-button";
import { Link } from "react-router";

export default function Header() {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [isEntry, setIsEntry] = useState<boolean>(false)
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      setIsEntry(entry.isIntersecting)
    })

    if (sentinelRef.current) observer.observe(sentinelRef.current);

    return () => observer.disconnect()
  }, [])


  return (
    <>
      <motion.header className={cn("px-4 fixed w-full top-0 font-MiSans z-999 py-3 transition-all", !isEntry ? "bg-black/60 backdrop-blur-xl" : "")}>
        <motion.div className="flex items-center justify-between">
          <img src="./assets/logo-text.png" alt="爱开发" className="h-8" />
          <Link
            to="/login"
          >
            <Button>登录</Button>
          </Link>
        </motion.div>
      </motion.header>
      <div data-slot="sentinel" ref={sentinelRef} />
    </>
  )
}