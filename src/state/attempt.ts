import type { Item, ItemSource } from './types'

const months = [
  'января',
  'февраля',
  'марта',
  'апреля',
  'мая',
  'июня',
  'июля',
  'августа',
  'сентября',
  'октября',
  'ноября',
  'декабря',
]

export function attemptTitle(short: string, date = new Date()): string {
  const name = short.trim() || 'Своя затея'
  return `${name} · ${date.getDate()} ${months[date.getMonth()]}`
}

export function makeAttempt(input: {
  id: string
  title: string
  note?: string
  link?: string
  nextStep?: string
  source?: ItemSource
}): Item {
  const now = new Date().toISOString()
  const item: Item = {
    id: input.id,
    title: input.title.trim() || attemptTitle('Своя затея'),
    note: input.note?.trim() ?? '',
    link: input.link?.trim() ?? '',
    nextStep: input.nextStep?.trim() ?? '',
    status: 'draft',
    createdAt: now,
    updatedAt: now,
  }
  if (input.source) item.source = input.source
  return item
}

export function keptSummary(item: Pick<Item, 'note' | 'link' | 'nextStep'>): string {
  const parts: string[] = []
  if (item.nextStep) parts.push('шаги')
  if (item.note) parts.push('заметка')
  if (item.link) parts.push('ссылка')
  if (parts.length === 0) return 'Сохранилось только название. Рисунок, видео и файлы сюда сами не попадают.'
  return `Сохранилось: ${parts.join(', ')}. Рисунок, видео и файлы сюда сами не попадают.`
}
