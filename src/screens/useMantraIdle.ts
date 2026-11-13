import { useCallback, useEffect, useState } from 'react'

const IDLE_MS = 60_000

export function useMantraIdle(enabled: boolean, paused: boolean) {
  const [asleep, setAsleep] = useState(false)

  useEffect(() => {
    if (!enabled || paused) {
      setAsleep(false)
      return
    }
    if (asleep) return
    let timer = window.setTimeout(() => setAsleep(true), IDLE_MS)
    const poke = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => setAsleep(true), IDLE_MS)
    }
    window.addEventListener('pointerdown', poke, { capture: true })
    window.addEventListener('keydown', poke, { capture: true })
    window.addEventListener('scroll', poke, { capture: true, passive: true })
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('pointerdown', poke, { capture: true })
      window.removeEventListener('keydown', poke, { capture: true })
      window.removeEventListener('scroll', poke, { capture: true })
    }
  }, [enabled, paused, asleep])

  const wake = useCallback(() => setAsleep(false), [])
  return [asleep, wake] as const
}
