export const STATUS = ['Nueva', 'En Progreso', 'Completada']
export const PRIORITY = ['Baja', 'Media', 'Alta']

export function uid() {
  if (crypto?.randomUUID) return crypto.randomUUID()
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export function fmtDate(iso) {
  if (!iso) return '—'
  try {
    const d = new Date(iso)
    return new Intl.DateTimeFormat(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d)
  } catch { return iso }
}

export function isOverdue(iso) {
  if (!iso) return false
  const end = new Date(iso); const now = new Date()
  end.setHours(23,59,59,999)
  return end < now
}

export function todayISO() {
  const d = new Date()
  d.setHours(0,0,0,0)
  return d.toISOString().slice(0,10)
}

export function csvEscape(v='') {
  const s = String(v).replace(/"/g, '""')
  if (s.includes(',') || s.includes('\n') || s.includes('"')) return '"' + s + '"'
  return s
}

export function downloadCSV(filename, rows) {
  const header = Object.keys(rows[0] ?? {id: '', title: ''})
  const csv = [
    header.join(','),
    ...rows.map(r => header.map(k => csvEscape(r[k])).join(','))
  ].join('\n')
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url; a.download = filename
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 5000)
}
