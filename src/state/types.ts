export type ThemeName = 'lunar' | 'collage'

export type AttitudeId = 'study' | 'think' | 'mistakes' | 'people' | 'money' | 'agency'

export type Reaction = 'resonates' | 'not-quite' | 'otherwise'

export type TimeChoice = '2' | '5' | '15' | 'uncounted'

export type InterestId = 'drawing' | 'clothes' | 'dance' | 'music' | 'own'

export type ItemStatus = 'idea' | 'draft' | 'doing' | 'done-for-me' | 'want-to-show'

export type WouldStart = 'yes' | 'maybe' | 'probably-not' | 'dont-know'

export type Reflection = {
  whatHappened: string
  minutes: string
  wouldHaveStarted: WouldStart | null
}

export type ItemSource = {
  type: 'own' | 'story' | 'slot'
  storyId?: string
  actionId?: string
  slotId?: string
}

export type Item = {
  id: string
  title: string
  note: string
  link: string
  nextStep: string
  status: ItemStatus
  source?: ItemSource
  createdAt: string
  updatedAt: string
  reflection?: Reflection
}

export type AttitudeState = {
  customTitle: string
  reaction: Reaction | null
  otherwiseNote: string
}

export type OpenSlot = {
  id: string
  customTitle: string
  note: string
}

export type FeedbackNote = {
  id: string
  text: string
  createdAt: string
}

export type AppState = {
  seenOnboarding: boolean
  seenSplash: boolean
  theme: ThemeName
  interests: InterestId[]
  timeChoice: TimeChoice | null
  attitudes: Record<AttitudeId, AttitudeState>
  openSlots: OpenSlot[]
  items: Item[]
  feedback: FeedbackNote[]
}

export const ATTITUDE_IDS: AttitudeId[] = [
  'study',
  'think',
  'mistakes',
  'people',
  'money',
  'agency',
]

export const SLOT_IDS = ['slot-1', 'slot-2', 'slot-3'] as const

export const OPEN_STATUSES: ItemStatus[] = ['idea', 'draft', 'doing']
