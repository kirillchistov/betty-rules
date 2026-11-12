import { attitudes } from '../content/attitudes'
import {
  ATTITUDE_IDS,
  SLOT_IDS,
  type AppState,
  type AttitudeId,
  type AttitudeState,
  type FeedbackNote,
  type InterestId,
  type Item,
  type ItemSource,
  type ItemStatus,
  type OpenSlot,
  type Reaction,
  type Reflection,
  type ThemeName,
  type TimeChoice,
  type WouldStart,
} from './types'

export const STORAGE_KEY = 'svoy-kurs'
const BACKUP_APP = 'svoy-kurs'
const VERSION = 1

const INTERESTS: InterestId[] = ['drawing', 'clothes', 'dance', 'music', 'own']
const STATUSES: ItemStatus[] = ['idea', 'draft', 'doing', 'done-for-me', 'want-to-show']
const REACTIONS: Reaction[] = ['resonates', 'not-quite', 'otherwise']
const WOULD: WouldStart[] = ['yes', 'maybe', 'probably-not', 'dont-know']

function emptyAttitude(): AttitudeState {
  return { customTitle: '', reaction: null, otherwiseNote: '' }
}

export function createDefaultState(): AppState {
  const attitudeState = {} as Record<AttitudeId, AttitudeState>
  for (const id of ATTITUDE_IDS) attitudeState[id] = emptyAttitude()
  return {
    seenOnboarding: false,
    seenSplash: false,
    theme: 'lunar',
    interests: [],
    timeChoice: null,
    attitudes: attitudeState,
    openSlots: SLOT_IDS.map((id) => ({ id, customTitle: '', note: '' })),
    items: [],
    feedback: [],
  }
}

function asString(value: unknown, max = 4000): string {
  return typeof value === 'string' ? value.slice(0, max) : ''
}

function oneOf<T extends string>(value: unknown, options: readonly T[]): T | null {
  return typeof value === 'string' && options.includes(value as T) ? (value as T) : null
}

function normalizeReflection(value: unknown): Reflection | undefined {
  if (!value || typeof value !== 'object') return undefined
  const raw = value as Record<string, unknown>
  const reflection: Reflection = {
    whatHappened: asString(raw.whatHappened, 4000),
    minutes: asString(raw.minutes, 200),
    wouldHaveStarted: oneOf(raw.wouldHaveStarted, WOULD),
  }
  if (!reflection.whatHappened && !reflection.minutes && !reflection.wouldHaveStarted) {
    return undefined
  }
  return reflection
}

function normalizeSource(value: unknown): ItemSource | undefined {
  if (!value || typeof value !== 'object') return undefined
  const raw = value as Record<string, unknown>
  const type = oneOf(raw.type, ['own', 'story', 'slot'] as const)
  if (!type) return undefined
  const source: ItemSource = { type }
  const storyId = asString(raw.storyId, 80)
  const actionId = asString(raw.actionId, 80)
  const slotId = asString(raw.slotId, 80)
  if (storyId) source.storyId = storyId
  if (actionId) source.actionId = actionId
  if (slotId) source.slotId = slotId
  return source
}

function normalizeItem(value: unknown): Item | null {
  if (!value || typeof value !== 'object') return null
  const raw = value as Record<string, unknown>
  const id = asString(raw.id, 80).trim()
  const title = asString(raw.title, 400).trim()
  if (!id || !title) return null
  const now = new Date().toISOString()
  const createdAt = asString(raw.createdAt, 40) || now
  const updatedAt = asString(raw.updatedAt, 40) || createdAt
  const item: Item = {
    id,
    title,
    note: asString(raw.note, 4000),
    link: asString(raw.link, 2000).trim(),
    nextStep: asString(raw.nextStep, 400),
    status: oneOf(raw.status, STATUSES) ?? 'idea',
    createdAt,
    updatedAt,
  }
  const source = normalizeSource(raw.source)
  const reflection = normalizeReflection(raw.reflection)
  if (source) item.source = source
  if (reflection) item.reflection = reflection
  return item
}

function normalizeSlot(value: unknown, fallback: OpenSlot): OpenSlot {
  if (!value || typeof value !== 'object') return fallback
  const raw = value as Record<string, unknown>
  return {
    id: fallback.id,
    customTitle: asString(raw.customTitle, 400),
    note: asString(raw.note, 400),
  }
}

export function normalize(input: unknown): AppState {
  const base = createDefaultState()
  if (!input || typeof input !== 'object') return base
  const raw = input as Record<string, unknown>

  const theme: ThemeName = raw.theme === 'collage' ? 'collage' : 'lunar'
  const timeChoice = oneOf(raw.timeChoice, ['2', '5', '15', 'uncounted'] as const) as TimeChoice | null
  const interestInput = Array.isArray(raw.interests) ? raw.interests : []
  const interests = INTERESTS.filter((id) => interestInput.includes(id))

  const attitudeInput =
    raw.attitudes && typeof raw.attitudes === 'object'
      ? (raw.attitudes as Record<string, unknown>)
      : {}
  const attitudeState = {} as Record<AttitudeId, AttitudeState>
  for (const attitude of attitudes) {
    const prev = attitudeInput[attitude.id]
    const record = prev && typeof prev === 'object' ? (prev as Record<string, unknown>) : {}
    attitudeState[attitude.id] = {
      customTitle: asString(record.customTitle, 400),
      reaction: oneOf(record.reaction, REACTIONS),
      otherwiseNote: asString(record.otherwiseNote, 2000),
    }
  }

  const slotInput = Array.isArray(raw.openSlots) ? raw.openSlots : []
  const openSlots = base.openSlots.map((slot, index) => {
    const match = slotInput.find((item) => {
      return !!item && typeof item === 'object' && (item as { id?: unknown }).id === slot.id
    })
    return normalizeSlot(match ?? slotInput[index], slot)
  })

  const items = Array.isArray(raw.items)
    ? raw.items.map(normalizeItem).filter((item): item is Item => item !== null).slice(0, 200)
    : []

  const feedback = Array.isArray(raw.feedback)
    ? raw.feedback
        .map((entry): FeedbackNote | null => {
          if (!entry || typeof entry !== 'object') return null
          const note = entry as Record<string, unknown>
          const id = asString(note.id, 80).trim()
          const text = asString(note.text, 4000).trim()
          if (!id || !text) return null
          return {
            id,
            text,
            createdAt: asString(note.createdAt, 40) || new Date().toISOString(),
          }
        })
        .filter((note): note is FeedbackNote => note !== null)
        .slice(0, 100)
    : []

  return {
    seenOnboarding: raw.seenOnboarding === true,
    seenSplash: raw.seenSplash === true,
    theme,
    interests,
    timeChoice,
    attitudes: attitudeState,
    openSlots,
    items,
    feedback,
  }
}

export function load(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createDefaultState()
    const parsed: unknown = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return createDefaultState()
    return normalize((parsed as { state?: unknown }).state)
  } catch {
    return createDefaultState()
  }
}

export function persist(state: AppState): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, state }))
    return true
  } catch {
    return false
  }
}

export function downloadBackup(state: AppState) {
  const payload = {
    app: BACKUP_APP,
    version: VERSION,
    exportedAt: new Date().toISOString(),
    state,
  }
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'svoy-kurs.json'
  link.click()
  URL.revokeObjectURL(url)
}

export function parseBackup(data: unknown): AppState | null {
  if (!data || typeof data !== 'object') return null
  const raw = data as Record<string, unknown>
  if (raw.app !== BACKUP_APP || raw.version !== VERSION) return null
  if (!raw.state || typeof raw.state !== 'object') return null
  return normalize(raw.state)
}
