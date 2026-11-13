import { useEffect, useState } from 'react'
import { Nav } from './components/Nav'
import { cx } from './components/ui'
import { Mantras } from './screens/Mantras'
import { useMantraIdle } from './screens/useMantraIdle'
import { Now } from './screens/Now'
import { Onboarding } from './screens/Onboarding'
import { Try } from './screens/Try'
import { Settings } from './screens/Settings'
import { Slot } from './screens/Slot'
import { Splash } from './screens/Splash'
import { Story } from './screens/Story'
import { Thing } from './screens/Thing'
import { Things } from './screens/Things'
import { Zine } from './screens/Zine'
import { go, parseHash, resolve, type Route } from './router'
import { StoreProvider, useStore } from './state/context'

export function App() {
  return (
    <StoreProvider>
      <Root />
    </StoreProvider>
  )
}

function Root() {
  const { state } = useStore()
  const [route, setRoute] = useState<Route>(() => resolve(location.hash))

  useEffect(() => {
    document.documentElement.dataset.theme = state.theme
    document.documentElement.style.colorScheme = state.theme === 'collage' ? 'dark' : 'light'
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', state.theme === 'collage' ? '#0c0b0f' : '#efe8ff')
  }, [state.theme])

  useEffect(() => {
    const sync = () => {
      const parsed = parseHash(location.hash)
      if (parsed) {
        setRoute(parsed)
        return
      }
      const next: Route = { name: 'now' }
      go(next, 'replace')
      setRoute(next)
    }
    sync()
    window.addEventListener('hashchange', sync)
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  const showNav = route.name === 'now' || route.name === 'zine' || route.name === 'things' || route.name === 'mantras'
  const [asleep, wake] = useMantraIdle(state.mantrasEnabled, route.name === 'mantras')

  return (
    <div className="app">
      <div className={cx('phone', showNav && 'has-nav')}>
        <div className="moon" aria-hidden="true" />
        <Screen route={route} />
        {showNav ? <Nav current={route.name} /> : null}
        {asleep ? (
          <div className="mantra-sleep" role="dialog" aria-modal="true" aria-label="Мантры">
            <Mantras onClose={wake} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

function Screen({ route }: { route: Route }) {
  switch (route.name) {
    case 'onboarding':
      return <Onboarding />
    case 'splash':
      return <Splash />
    case 'now':
      return <Now />
    case 'try':
      return <Try key={route.id} id={route.id} />
    case 'zine':
      return <Zine stuck={route.stuck} />
    case 'story':
      return <Story key={route.id} id={route.id} />
    case 'slot':
      return <Slot key={route.id} id={route.id} />
    case 'things':
      return <Things />
    case 'mantras':
      return <Mantras />
    case 'thing':
      return (
        <Thing
          key={`${route.id}:${route.actionId ?? ''}:${route.slotId ?? ''}`}
          route={route}
        />
      )
    case 'settings':
      return <Settings />
    default: {
      const neverRoute: never = route
      return neverRoute
    }
  }
}
