import * as React from "react"
import { Link } from "react-router"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { Clock, Users, ArrowRight } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"
import { orders, type DevLevel, type Order } from "./data"

gsap.registerPlugin(useGSAP, ScrollTrigger)

const PAGE_SIZE = 5

const levelStyle: Record<DevLevel, string> = {
  A: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300 ring-1 ring-rose-500/20",
  B: "bg-amber-500/10 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 ring-1 ring-amber-500/20",
  C: "bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 ring-1 ring-emerald-500/20",
}

function getPageItems(total: number, current: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const items: (number | "…")[] = [1]
  const left = Math.max(2, current - 1)
  const right = Math.min(total - 1, current + 1)
  if (left > 2) items.push("…")
  for (let i = left; i <= right; i++) items.push(i)
  if (right < total - 1) items.push("…")
  items.push(total)
  return items
}

function OrderCard({ order }: { order: Order }) {
  return (
    <Link
      to={`/devlopments/orders/${order.id}`}
      className="order-card group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border/60 bg-card/80 p-5 backdrop-blur-sm transition-colors hover:border-border">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(120% 80% at 0% 0%, oklch(0.78 0.16 278 / 0.10), transparent 60%)",
        }}
      />
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span className="font-mono tabular-nums">{order.id}</span>
            <span className="size-1 rounded-full bg-border" />
            <span>{order.category}</span>
            <span className="size-1 rounded-full bg-border" />
            <span>{order.client}</span>
          </div>
          <h3 className="text-base font-semibold leading-snug tracking-tight">
            {order.title}
          </h3>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-[11px] font-semibold tracking-wide",
              levelStyle[order.level]
            )}
          >
            {order.level} 级
          </span>
        </div>
      </header>

      <p className="text-sm leading-relaxed text-muted-foreground">
        {order.summary}
      </p>

      <div className="flex flex-wrap gap-1.5">
        {order.tags.map((t) => (
          <span
            key={t}
            className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] text-muted-foreground"
          >
            {t}
          </span>
        ))}
      </div>

      <footer className="flex flex-wrap items-end justify-between gap-3 pt-1">
        <div className="flex flex-wrap items-baseline gap-x-5 gap-y-1 text-xs text-muted-foreground">
          <div className="flex items-baseline gap-1">
            <span className="text-[11px]">报价</span>
            <span className="text-base font-semibold tabular-nums tracking-tight text-foreground">
              <span className="mr-0.5 text-[11px] font-normal text-muted-foreground">
                ¥
              </span>
              {order.budget.toLocaleString()}
            </span>
          </div>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3" />
            {order.duration}
          </span>
          <span className="inline-flex items-center gap-1">
            <Users className="size-3" />
            {order.bids} 人已抢
          </span>
          <span className="text-muted-foreground">{order.postedAt}</span>
        </div>
        <Button size="sm" className="group/btn">
          抢单
          <ArrowRight className="ml-0.5 size-3.5 transition-transform group-hover/btn:translate-x-0.5" />
        </Button>
      </footer>
    </Link>
  )
}

export function OrdersList() {
  const ref = React.useRef<HTMLElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)
  const [page, setPage] = React.useState(1)
  const totalPages = Math.max(1, Math.ceil(orders.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const visible = orders.slice(start, start + PAGE_SIZE)

  const goto = (p: number) => {
    setPage(Math.min(totalPages, Math.max(1, p)))
  }

  // Section header + first paint scroll reveal
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(".orders-header", {
          y: 16,
          autoAlpha: 0,
          duration: 0.55,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ref.current,
            start: "top 85%",
            once: true,
          },
        })
        gsap.set(".order-card", { y: 28, autoAlpha: 0, filter: "blur(6px)" })
        ScrollTrigger.batch(".order-card", {
          start: "top 92%",
          onEnter: (batch) =>
            gsap.to(batch, {
              y: 0,
              autoAlpha: 1,
              filter: "blur(0px)",
              duration: 0.55,
              ease: "power3.out",
              stagger: 0.07,
              clearProps: "filter",
              overwrite: "auto",
            }),
        })
      })
      return () => mm.revert()
    },
    { scope: ref }
  )

  // Re-animate the visible page on pagination change
  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (reduced) return
      const cards =
        listRef.current?.querySelectorAll<HTMLElement>(".order-card") ?? []
      if (!cards.length) return
      gsap.fromTo(
        cards,
        { y: 16, autoAlpha: 0, filter: "blur(6px)" },
        {
          y: 0,
          autoAlpha: 1,
          filter: "blur(0px)",
          duration: 0.45,
          ease: "power3.out",
          stagger: 0.06,
          clearProps: "filter",
          overwrite: "auto",
        }
      )
    },
    { scope: ref, dependencies: [page] }
  )

  return (
    <section ref={ref} aria-label="最新单子" className="space-y-4">
      <header className="orders-header flex items-end justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">最新单子</h2>
          <p className="text-sm text-muted-foreground">
            谁手速快谁先得，已抢即结算定金。
          </p>
        </div>
        <span className="text-xs text-muted-foreground">
          共 <span className="tabular-nums text-foreground">{orders.length}</span> 单
        </span>
      </header>

      <ul ref={listRef} className="space-y-3">
        {visible.map((o) => (
          <li key={o.id}>
            <OrderCard order={o} />
          </li>
        ))}
      </ul>

      <Pagination className="pt-2">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              text="上一页"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                goto(page - 1)
              }}
              aria-disabled={page === 1}
              className={cn(page === 1 && "pointer-events-none opacity-50")}
            />
          </PaginationItem>
          {getPageItems(totalPages, page).map((item, i) =>
            item === "…" ? (
              <PaginationItem key={`e-${i}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <PaginationLink
                  href="#"
                  isActive={item === page}
                  onClick={(e) => {
                    e.preventDefault()
                    goto(item)
                  }}
                >
                  {item}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              text="下一页"
              href="#"
              onClick={(e) => {
                e.preventDefault()
                goto(page + 1)
              }}
              aria-disabled={page === totalPages}
              className={cn(
                page === totalPages && "pointer-events-none opacity-50"
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </section>
  )
}