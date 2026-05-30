"use client"

import * as React from "react"

export type RealNameInfo = {
  name: string
  idNumber: string
}

type RealNameValue = {
  verified: boolean
  info: RealNameInfo | null
  dialogOpen: boolean
  openDialog: () => void
  setDialogOpen: (v: boolean) => void
  markVerified: (info: RealNameInfo) => void
  /** Demo helper — wipes any saved auth and re-opens the dialog. */
  resetAndPrompt: () => void
}

const RealNameContext = React.createContext<RealNameValue | null>(null)

export function useRealName(): RealNameValue {
  const ctx = React.useContext(RealNameContext)
  if (!ctx)
    throw new Error("useRealName must be used within a RealNameProvider")
  return ctx
}

type ProviderProps = {
  children: React.ReactNode
  /** Demo: when true, prompt on every mount (default). */
  initiallyPrompt?: boolean
}

export function RealNameProvider({
  children,
  initiallyPrompt = true,
}: ProviderProps) {
  const [info, setInfo] = React.useState<RealNameInfo | null>(null)
  const [dialogOpen, setDialogOpen] = React.useState(initiallyPrompt)

  const openDialog = React.useCallback(() => setDialogOpen(true), [])

  const markVerified = React.useCallback((next: RealNameInfo) => {
    setInfo(next)
  }, [])

  const resetAndPrompt = React.useCallback(() => {
    setInfo(null)
    setDialogOpen(true)
  }, [])

  const value = React.useMemo<RealNameValue>(
    () => ({
      verified: info !== null,
      info,
      dialogOpen,
      openDialog,
      setDialogOpen,
      markVerified,
      resetAndPrompt,
    }),
    [info, dialogOpen, openDialog, markVerified, resetAndPrompt]
  )

  return (
    <RealNameContext.Provider value={value}>
      {children}
    </RealNameContext.Provider>
  )
}
