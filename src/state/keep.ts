import { flushSync } from 'react-dom'
import { go } from '../router'
import { useStore } from './context'
import type { Item } from './types'

export function useKeep() {
  const { update } = useStore()
  return (item: Item) => {
    flushSync(() => {
      update((current) => ({
        ...current,
        items: [item, ...current.items.filter((entry) => entry.id !== item.id)],
      }))
    })
    go({ name: 'thing', id: item.id, saved: true })
  }
}
