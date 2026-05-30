export function maskName(name: string): string {
  const n = name.trim()
  if (!n) return "—"
  if (n.length <= 1) return n + "*"
  return n[0] + "*".repeat(n.length - 1)
}

export function maskId(id: string): string {
  const v = id.trim()
  if (v.length < 12) return v
  return `${v.slice(0, 4)}${"*".repeat(v.length - 8)}${v.slice(-4)}`
}
