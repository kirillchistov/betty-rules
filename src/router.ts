export type Route =
  | { name: 'onboarding' }
  | { name: 'splash' }
  | { name: 'now' }
  | { name: 'zine'; stuck: boolean }
  | { name: 'story'; id: string }
  | { name: 'slot'; id: string }
  | { name: 'things' }
  | {
      name: 'thing'
      id: string
      storyId?: string
      actionId?: string
      slotId?: string
      saved?: boolean
    }
  | { name: 'settings' }

export function parseHash(hash: string): Route | null {
  const raw = hash.replace(/^#/, '')
  if (!raw || raw === '/') return null
  const [path, queryString] = raw.split('?')
  const query = new URLSearchParams(queryString ?? '')
  const parts = path.split('/').filter(Boolean)
  const head = parts[0]
  if (head === 'onboarding') return { name: 'onboarding' }
  if (head === 'splash') return { name: 'splash' }
  if (head === 'now') return { name: 'now' }
  if (head === 'zine') return { name: 'zine', stuck: query.get('stuck') === '1' }
  if (head === 'story' && parts[1]) return { name: 'story', id: decodeURIComponent(parts[1]) }
  if (head === 'slot' && parts[1]) return { name: 'slot', id: decodeURIComponent(parts[1]) }
  if (head === 'things') return { name: 'things' }
  if (head === 'settings') return { name: 'settings' }
  if (head === 'thing' && parts[1]) {
    const storyId = query.get('story') || undefined
    const actionId = query.get('action') || undefined
    const slotId = query.get('slot') || undefined
    return {
      name: 'thing',
      id: decodeURIComponent(parts[1]),
      storyId,
      actionId,
      slotId,
      saved: query.get('saved') === '1',
    }
  }
  return null
}

export function toHash(route: Route): string {
  switch (route.name) {
    case 'onboarding':
      return '#/onboarding'
    case 'splash':
      return '#/splash'
    case 'now':
      return '#/now'
    case 'zine':
      return route.stuck ? '#/zine?stuck=1' : '#/zine'
    case 'story':
      return `#/story/${encodeURIComponent(route.id)}`
    case 'slot':
      return `#/slot/${encodeURIComponent(route.id)}`
    case 'things':
      return '#/things'
    case 'settings':
      return '#/settings'
    case 'thing': {
      const query = new URLSearchParams()
      if (route.storyId) query.set('story', route.storyId)
      if (route.actionId) query.set('action', route.actionId)
      if (route.slotId) query.set('slot', route.slotId)
      if (route.saved) query.set('saved', '1')
      const suffix = query.toString()
      return `#/thing/${encodeURIComponent(route.id)}${suffix ? `?${suffix}` : ''}`
    }
  }
}

export function go(route: Route, mode: 'push' | 'replace' = 'push') {
  const next = toHash(route)
  if (location.hash === next) return
  if (mode === 'replace') location.replace(next)
  else location.hash = next
}

export function resolve(hash: string, seenOnboarding: boolean): Route {
  return parseHash(hash) ?? (seenOnboarding ? { name: 'now' } : { name: 'onboarding' })
}
