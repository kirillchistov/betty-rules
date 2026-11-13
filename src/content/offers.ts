export type Offer = {
  id: string
  short: string
  result: string
  pitch: string
  example: string
  steps: [string, string, string]
  storyId: string
  actionId: string
}

export const offers: Offer[] = [
  {
    id: 'look',
    short: 'Эскиз образа',
    result: 'Эскиз образа для выдуманной группы',
    pitch: 'Три силуэта, которые можно показать. Не папка с чужими картинками.',
    example: 'Три фигуры в одежде на одном листе. Неровные линии тоже вариант, не образец для оценки.',
    steps: [
      'Возьми бумагу или открой привычную рисовалку.',
      'Нарисуй три силуэта одежды. Неровные — нормально.',
      'Подпиши, для какой выдуманной группы этот образ.',
    ],
    storyId: 'references',
    actionId: 'silhouettes',
  },
  {
    id: 'cover',
    short: 'Обложка бита',
    result: 'Обложка для своего бита',
    pitch: 'Один предмет и название. Красиво не требуется.',
    example: 'Один предмет и выдуманное название трека. Это обложка попытки, не релиз.',
    steps: [
      'Возьми свой или любимый кусок, даже черновой.',
      'Нарисуй один предмет, который про этот звук.',
      'Добавь название. Можно несуществующего трека.',
    ],
    storyId: 'references',
    actionId: 'three-versions',
  },
  {
    id: 'move',
    short: 'Три движения',
    result: 'Три движения под любимый кусок трека',
    pitch: 'Несколько секунд в обычной камере. Выкладывать не нужно.',
    example: 'Один дубль: начало, движение, стоп. Переснять можно, публиковать не надо.',
    steps: [
      'Включи кусок трека, который не выходит из головы.',
      'Выбери любые пять секунд движения.',
      'Запиши в обычной камере. Переснимать можно, выкладывать не нужно.',
    ],
    storyId: 'first-take',
    actionId: 'dance-fragment',
  },
]

export function offerById(id: string): Offer | undefined {
  return offers.find((offer) => offer.id === id)
}

export function stepsText(steps: readonly string[]): string {
  return steps.map((step, index) => `${index + 1}. ${step}`).join('\n')
}
