const events = []
const sessionId = crypto.randomUUID()

export function log(verb, object, page, value) {
  events.push({
    timestamp: new Date().toISOString(),
    sessionId,
    verb,
    object,
    page,
    value,
  })
}

export function getEvents() {
  return [...events]
}

export function downloadEvents() {
  const blob = new Blob([JSON.stringify(events, null, 2)], {
    type: 'application/json',
  })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `events-${sessionId.slice(0, 8)}.json`
  a.click()
  URL.revokeObjectURL(a.href)
}

export function clear() {
  events.length = 0
}
