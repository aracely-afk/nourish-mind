export function todayStr() {
  // Use LOCAL date components — toISOString() is UTC and shifts the date
  // for US-timezone users logging in the evening (e.g. 9 PM Pacific = next day UTC).
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

export function formatDateFull(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export function addDays(dateStr, n) {
  const d = new Date(dateStr + 'T00:00:00')
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function isToday(dateStr) {
  return dateStr === todayStr()
}

export function getLast7Days() {
  const days = []
  for (let i = 6; i >= 0; i--) {
    days.push(addDays(todayStr(), -i))
  }
  return days
}

export function getLast30Days() {
  const days = []
  for (let i = 29; i >= 0; i--) {
    days.push(addDays(todayStr(), -i))
  }
  return days
}

export function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}
