import type { InterestId, ItemStatus, WouldStart } from '../state/types'

export const interests: { id: InterestId; label: string }[] = [
  { id: 'drawing', label: 'Рисунок' },
  { id: 'clothes', label: 'Одежда' },
  { id: 'dance', label: 'Танцы' },
  { id: 'music', label: 'Музыка' },
  { id: 'own', label: 'Своё' },
]

export const statusOptions: { id: ItemStatus; label: string }[] = [
  { id: 'idea', label: 'идея' },
  { id: 'draft', label: 'черновик' },
  { id: 'doing', label: 'делаю' },
  { id: 'done-for-me', label: 'готово для меня' },
  { id: 'want-to-show', label: 'хочу показать' },
]

export const wouldStartOptions: { id: WouldStart; label: string }[] = [
  { id: 'yes', label: 'Да' },
  { id: 'maybe', label: 'Возможно' },
  { id: 'probably-not', label: 'Скорее нет' },
  { id: 'dont-know', label: 'Не знаю' },
]

export function interestLabel(id: InterestId): string {
  return interests.find((item) => item.id === id)?.label ?? id
}

export function statusLabel(id: ItemStatus): string {
  return statusOptions.find((item) => item.id === id)?.label ?? id
}
