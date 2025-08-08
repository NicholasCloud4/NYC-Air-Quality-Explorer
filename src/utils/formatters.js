export function formatTick(ts) {
  const d = new Date(ts)
  const y = d.getFullYear()
  const m = d.getMonth() + 1
  if (m === 1) return `${y}`
  if (m === 6) return `${y}-06`
  return ''
}

export function humanize(val) {
  if (val == null || Number.isNaN(val)) return '—'
  const n = Number(val)
  if (Math.abs(n) >= 1000) return n.toLocaleString()
  if (Math.abs(n) >= 100) return n.toFixed(1)
  if (Math.abs(n) >= 10) return n.toFixed(2)
  return n.toPrecision(3)
}
