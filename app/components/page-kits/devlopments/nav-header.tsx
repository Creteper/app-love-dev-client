import * as React from "react"
import { Link, useLocation } from "react-router"
import gsap from "gsap"
import { useGSAP } from "@gsap/react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "~/components/ui/navigation-menu"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "~/components/ui/avatar"
import { cn } from "~/lib/utils"
import { recentMessages } from "./data"
import { MessageSquare } from "lucide-react"

gsap.registerPlugin(useGSAP)

type NavLink = { label: string; to: string }

const navLinks: NavLink[] = [
  { label: "接单大厅", to: "/devlopments" },
]

export function DevNavHeader() {
  const location = useLocation()
  const headerRef = React.useRef<HTMLElement>(null)
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
        tl.from(".dev-logo", { y: -10, autoAlpha: 0, duration: 0.5 })
          .from(
            ".dev-nav-item",
            { y: -6, autoAlpha: 0, duration: 0.45, stagger: 0.08 },
            "-=0.25"
          )
          .from(
            ".dev-user",
            { x: 12, autoAlpha: 0, duration: 0.5 },
            "-=0.35"
          )
      })
      return () => mm.revert()
    },
    { scope: headerRef }
  )

  const isActive = (to: string) =>
    to === "/devlopments"
      ? location.pathname === "/devlopments"
      : location.pathname.startsWith(to)

  return (
    <header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-40 w-full transition-colors duration-300",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl backdrop-saturate-150"
          : "border-b border-transparent bg-background/40 backdrop-blur-md"
      )}
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4 sm:px-6 lg:px-8">
        <Link to="/devlopments" className="dev-logo flex items-center gap-2">
          <img
            src="/assets/logo-text.svg"
            alt="爱开发"
            className="h-6 w-auto dark:invert text-black"
          />
          <span className="sr-only">爱开发 · 开发者端</span>
        </Link>

        <NavigationMenu viewport={false} className="ml-2 hidden md:flex">
          <NavigationMenuList className="gap-1">
            {navLinks.map((item) => (
              <NavigationMenuItem key={item.to} className="dev-nav-item">
                <NavigationMenuLink
                  asChild
                  data-active={isActive(item.to) || undefined}
                  className="h-9 px-3 text-sm font-medium"
                >
                  <Link to={item.to}>{item.label}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}

            <NavigationMenuItem className="dev-nav-item">
              <NavigationMenuTrigger className="h-9 px-3 text-sm font-medium">
                消息
              </NavigationMenuTrigger>
              <NavigationMenuContent className="min-w-80 p-2">
                <div className="flex items-center justify-between px-2 pt-1 pb-2">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="size-3.5 text-muted-foreground" />
                    <span className="text-xs font-medium text-muted-foreground">
                      最近聊天
                    </span>
                  </div>
                  <Link
                    to="/devdashboard/messages"
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    查看全部
                  </Link>
                </div>
                <ul className="flex flex-col">
                  {recentMessages.map((m) => (
                    <li key={m.id}>
                      <NavigationMenuLink asChild>
                        <Link
                          to="/devdashboard/messages"
                          className="flex flex-col gap-0.5 rounded-md px-2 py-2"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="truncate text-sm font-medium">
                              {m.group}
                            </span>
                            <div className="flex shrink-0 items-center gap-1.5">
                              {m.unread ? (
                                <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-medium text-primary-foreground">
                                  {m.unread}
                                </span>
                              ) : null}
                              <span className="text-[11px] text-muted-foreground">
                                {m.time}
                              </span>
                            </div>
                          </div>
                          <span className="truncate text-xs text-muted-foreground">
                            {m.preview}
                          </span>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center gap-3">
          <Link
            to="/devdashboard"
            aria-label="进入开发者工作台"
            className="dev-user flex items-center gap-2.5 rounded-full p-0.5 pr-2 transition-colors hover:bg-muted/60"
          >
            <Avatar className="size-8 rounded-full">
              <AvatarImage src="/assets/avatar%20(2).png" alt="开发者头像" />
              <AvatarFallback className="rounded-full text-xs">DV</AvatarFallback>
            </Avatar>
            <div className="hidden flex-col text-sm leading-tight md:flex">
              <span className="font-medium tracking-tight">爱开发·开发者</span>
              <span className="text-[11px] text-muted-foreground">B 级 · 已认证</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  )
}
