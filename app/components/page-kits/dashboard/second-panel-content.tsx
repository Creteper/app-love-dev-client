"use client"

import * as React from "react"
import { Link, useParams } from "react-router"
import { AnimatePresence, motion } from "motion/react"
import {
  Briefcase,
  CheckCircle2,
  Clock,
  FileArchive,
  FileText,
  File as FileIcon,
  Image as ImageIcon,
  Plus,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react"
import { useSidebarNav } from "./sidebar-nav-context"
import {
  groups as sharedGroups,
  getDeliverables,
  subscribeDeliverables,
  type DeliverableFileKind,
} from "./messages/data"
import { chats as sharedChats } from "./chats/data"

function useArtifactsList() {
  const subscribe = React.useCallback(
    (cb: () => void) => subscribeDeliverables(cb),
    []
  )
  const get = React.useCallback(() => getDeliverables(), [])
  const deliverables = React.useSyncExternalStore(subscribe, get, get)

  return React.useMemo(() => {
    const groupNameById = new Map(sharedGroups.map((g) => [g.id, g.name]))
    return deliverables.flatMap((d) =>
      d.files.map((f) => ({
        rowId: `${d.id}-${f.id}`,
        name: f.name,
        size: f.size,
        kind: f.kind,
        groupId: d.groupId,
        project: groupNameById.get(d.groupId) ?? d.groupId,
        sender: d.uploadedBy,
        time: d.time,
      }))
    )
  }, [deliverables])
}

const fileKindIcon: Record<
  DeliverableFileKind,
  React.ComponentType<{ className?: string }>
> = {
  image: ImageIcon,
  doc: FileText,
  zip: FileArchive,
  other: FileIcon,
}

const data = {
  chats: sharedChats,
  groups: sharedGroups,
  dashboard: {
    stats: [
      { label: "进行中项目", value: 3, icon: Briefcase, tint: "blue" },
      { label: "待接单", value: 1, icon: Clock, tint: "amber" },
      { label: "已完成", value: 5, icon: CheckCircle2, tint: "emerald" },
    ],
    totalSpent: "¥36,800.00",
    recentActivity: [
      { text: "餐厅点餐系统 · 李工上传了进度截图", time: "刚刚" },
      { text: "电商小程序 · 第二期款项审核通过", time: "2 小时前" },
      { text: "企业官网重构 · 首页交互完成，待验收", time: "昨天" },
      { text: "客服·小张 已匹配数据分析后台开发者", time: "昨天" },
      { text: "电商小程序 · 项目群收到新消息", time: "3 天前" },
    ],
  },
}

const statTintBorder: Record<string, string> = {
  blue: "border-l-blue-200 dark:border-l-blue-500/30",
  amber: "border-l-amber-200 dark:border-l-amber-500/30",
  emerald: "border-l-emerald-200 dark:border-l-emerald-500/30",
}

const statusToneClass: Record<string, string> = {
  amber: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
  blue: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
  green: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
  neutral: "bg-muted text-muted-foreground",
}

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] as const },
  },
}

type Props = {
  onItemSelect?: () => void
}

export function SecondPanelContent({ onItemSelect }: Props) {
  const { activeItem, subItem, setSubItem } = useSidebarNav()
  const [messageTab, setMessageTab] = React.useState<"群组" | "产物">("群组")
  const params = useParams()
  const activeGroupId = params.id
  const activeChatId = params.id
  const artifacts = useArtifactsList()

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="gap-4 border-b border-border/60 px-5 pt-5 pb-4">
        <motion.div
          key={`header-${activeItem.title}`}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
          }}
          className="flex flex-col gap-4"
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -8 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
            }}
            className="flex w-full items-center justify-between"
          >
            <div className="flex flex-col gap-0.5">
              <div className="text-[17px] font-semibold tracking-tight text-foreground">
                {activeItem?.title}
              </div>
              <div className="text-xs text-muted-foreground">
                {activeItem?.subtitle}
              </div>
            </div>
            {activeItem.title === "对话" && (
              <Link
                to="/dashboard/chats"
                onClick={onItemSelect}
                aria-label="新建对话"
                className="flex size-8 items-center justify-center rounded-full bg-muted/70 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Plus className="size-4" />
              </Link>
            )}
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, y: -8 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
            }}
          >
            {activeItem.title === "消息" ? (
              <div className="flex gap-1 rounded-lg bg-muted/60 p-1">
                {(["群组", "产物"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setMessageTab(tab)}
                    className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-all ${
                      messageTab === tab
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            ) : (
              <div className="relative">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  placeholder="搜索对话…"
                  className="h-9 w-full rounded-lg border border-transparent bg-muted/60 pr-3 pl-9 text-sm placeholder:text-muted-foreground focus:border-border focus:bg-background focus:outline-none"
                />
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Scrollable body */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeItem.title}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="px-2 py-2"
          >
            {activeItem.title === "仪表盘" ? (
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-4"
              >
                <motion.div
                  variants={itemVariants}
                  className="flex flex-col gap-0.5"
                >
                  <div className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/70 px-1">
                    概览
                  </div>
                  <div className="flex gap-2">
                    {data.dashboard.stats.map((s) => (
                      <div
                        key={s.label}
                        className={`flex flex-1 flex-col gap-1 rounded-xl border-l-2 bg-muted/40 px-3 py-3 ${
                          statTintBorder[s.tint] ?? ""
                        }`}
                      >
                        <s.icon className="size-4 text-muted-foreground" />
                        <div className="text-lg font-semibold tabular-nums tracking-tight">
                          {s.value}
                        </div>
                        <div className="text-[10px] text-muted-foreground">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col gap-0.5 px-1"
                >
                  <div className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/70">
                    累计投入
                  </div>
                  <div className="flex items-center gap-1.5 rounded-xl bg-muted/40 px-3 py-3">
                    <TrendingUp className="size-4 text-muted-foreground" />
                    <span className="text-lg font-semibold tabular-nums tracking-tight">
                      {data.dashboard.totalSpent}
                    </span>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="flex flex-col gap-2 px-1"
                >
                  <div className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/70">
                    最近动态
                  </div>
                  <div className="flex flex-col gap-1">
                    {data.dashboard.recentActivity.map((act, i) => (
                      <motion.a
                        href="#"
                        key={i}
                        variants={itemVariants}
                        className="flex items-center gap-2 rounded-lg px-3 py-2.5 transition-colors hover:bg-muted/70"
                      >
                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                          <span className="truncate text-xs">{act.text}</span>
                          <span className="text-[10px] text-muted-foreground">
                            {act.time}
                          </span>
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ) : activeItem.title === "对话" ? (
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="flex flex-col gap-1"
              >
                {data.chats.map((chat) => (
                  <motion.div
                    key={chat.id}
                    variants={itemVariants}
                    data-active={activeChatId === chat.id}
                    className="group rounded-xl transition-colors hover:bg-muted/70 data-[active=true]:bg-muted/70"
                  >
                    <Link
                      to={`/dashboard/chats/${chat.id}`}
                      onClick={() => {
                        setSubItem(chat.title)
                        onItemSelect?.()
                      }}
                      className="flex flex-col gap-2 px-3 py-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <Sparkles className="size-3.5" />
                        </span>
                        <span className="flex-1 truncate text-sm font-medium tracking-tight">
                          {chat.title}
                        </span>
                        <span className="shrink-0 text-[11px] text-muted-foreground">
                          {chat.time}
                        </span>
                      </div>
                      <p className="line-clamp-2 pl-9 text-xs leading-relaxed text-muted-foreground">
                        {chat.teaser}
                      </p>
                      <div className="flex items-center gap-2 pl-9">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                            statusToneClass[chat.statusTone] ?? statusToneClass.neutral
                          }`}
                        >
                          {chat.status}
                        </span>
                        <span className="text-[11px] tabular-nums text-muted-foreground">
                          {chat.estimate}
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={messageTab}
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.15 } }}
                  className="flex flex-col gap-1"
                >
                  {messageTab === "群组"
                    ? data.groups.map((group) => (
                        <motion.div
                          key={group.id}
                          variants={itemVariants}
                          data-active={activeGroupId === group.id}
                          className="group rounded-xl transition-colors hover:bg-muted/70 data-[active=true]:bg-muted/70"
                        >
                          <Link
                            to={`/dashboard/messages/${group.id}`}
                            onClick={() => {
                              setSubItem(group.name)
                              onItemSelect?.()
                            }}
                            className="flex flex-col gap-2 px-3 py-3"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={group.avatar}
                                alt={group.name}
                                className="size-9 shrink-0 rounded-full object-cover"
                              />
                              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="flex-1 truncate text-sm font-medium tracking-tight">
                                    {group.name}
                                  </span>
                                  <span className="shrink-0 text-[11px] text-muted-foreground">
                                    {group.time}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <span className="shrink-0">{group.lastSender}</span>
                                  <span className="text-muted-foreground/50">·</span>
                                  <span className="truncate">{group.lastMsg}</span>
                                </div>
                              </div>
                              {group.unread > 0 && (
                                <span className="ml-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground tabular-nums">
                                  {group.unread}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 pl-12">
                              <div className="h-1 flex-1 overflow-hidden rounded-full bg-muted">
                                <div
                                  className="h-full rounded-full bg-foreground/70 transition-all"
                                  style={{ width: `${group.progress}%` }}
                                />
                              </div>
                              <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                                {group.progress}%
                              </span>
                            </div>
                          </Link>
                        </motion.div>
                      ))
                    : artifacts.length === 0
                    ? (
                        <motion.div
                          variants={itemVariants}
                          className="mx-3 mt-4 flex flex-col items-center gap-1.5 rounded-xl border border-dashed border-border/60 bg-muted/20 px-4 py-8 text-center"
                        >
                          <FileArchive className="size-5 text-muted-foreground/70" />
                          <span className="text-xs font-medium tracking-tight">
                            还没有项目产物
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            开发者完成阶段验收后会上传到这里
                          </span>
                        </motion.div>
                      )
                    : artifacts.map((file) => {
                        const Icon = fileKindIcon[file.kind] ?? FileIcon
                        return (
                          <motion.div
                            key={file.rowId}
                            variants={itemVariants}
                          >
                            <Link
                              to={`/dashboard/messages/${file.groupId}`}
                              onClick={() => {
                                setSubItem(file.name)
                                onItemSelect?.()
                              }}
                              data-active={subItem === file.name}
                              className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted/70 data-[active=true]:bg-muted/70"
                            >
                              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                                <Icon className="size-4 text-muted-foreground" />
                              </div>
                              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                                <div className="flex items-center gap-2">
                                  <span className="flex-1 truncate text-sm font-medium tracking-tight">
                                    {file.name}
                                  </span>
                                  <span className="shrink-0 text-[11px] text-muted-foreground">
                                    {file.time}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                                  <span className="truncate">{file.project}</span>
                                  <span className="text-muted-foreground/50">·</span>
                                  <span className="shrink-0">{file.sender}</span>
                                  <span className="text-muted-foreground/50">·</span>
                                  <span className="shrink-0 tabular-nums">{file.size}</span>
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        )
                      })}
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
