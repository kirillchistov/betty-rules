import type { InterestId, ItemStatus } from '../state/types'

export type StoryAction = {
  id: string
  label: string
  nextStep: string
  interests: InterestId[]
  status: Extract<ItemStatus, 'idea' | 'draft'>
}

export type StoryPanel =
  | { kind: 'text'; kicker: string; text: string }
  | { kind: 'split'; kicker: string; anti: string; example: string }
  | { kind: 'thought'; kicker: string; text: string }

export type Story = {
  id: string
  topic: string
  title: string
  teaser: string
  panels: StoryPanel[]
  actions: StoryAction[]
}

export const stories: Story[] = [
  {
    id: 'references',
    topic: 'Трудно начать',
    title: 'Референсы уже собрали свою коллекцию. А я — ещё нет',
    teaser: 'Папка референсов уже толще, чем всё, что ты сделала.',
    panels: [
      {
        kind: 'text',
        kicker: 'Ситуация',
        text: 'Референсы уже лежат папками. Красивые, чужие, законченные. А у тебя — если повезёт — три кривые линии и чувство, что начинать ещё рано.',
      },
      {
        kind: 'text',
        kicker: 'Поворот',
        text: 'Пока ты искала ещё один «тот самый», референсы завели свой чат. Тебя туда не добавили: ты же ещё не начала.',
      },
      {
        kind: 'split',
        kicker: 'Два варианта',
        anti: 'Сохранить ещё десять картинок и назвать это подготовкой.',
        example: 'Нарисовать три грубых силуэта одежды. Прямо кривых. Без обещания «потом нормально».',
      },
      {
        kind: 'thought',
        kicker: 'Мысль',
        text: 'Референс — это уже чей-то финал. Силуэт — уже твоё.',
      },
    ],
    actions: [
      {
        id: 'silhouettes',
        label: 'Нарисовать три грубых силуэта одежды',
        nextStep: 'Нарисовать три грубых силуэта. Линии могут быть кривыми — это и есть шаг.',
        interests: ['drawing', 'clothes'],
        status: 'draft',
      },
      {
        id: 'one-change',
        label: 'Взять один референс и изменить одну вещь',
        nextStep: 'Выбрать одну сохранённую картинку и изменить одну деталь: цвет, силуэт или настроение.',
        interests: ['drawing', 'clothes'],
        status: 'draft',
      },
      {
        id: 'three-versions',
        label: 'Набросать три грубых версии в своём деле',
        nextStep: 'Три черновых варианта того, что хочется сделать самой. Не эталон — просто начало.',
        interests: ['own'],
        status: 'draft',
      },
    ],
  },
  {
    id: 'first-take',
    topic: 'Страх неидеального результата',
    title: 'Первый дубль не обязан залететь',
    teaser: 'Первый дубль кажется уликой, а не черновиком.',
    panels: [
      {
        kind: 'text',
        kicker: 'Ситуация',
        text: 'Первый дубль кажется уликой. Как будто его сразу увидят все и решат, что это и есть ты.',
      },
      {
        kind: 'text',
        kicker: 'Поворот',
        text: 'Черновик тоже не выходит на свет. Сидит за кадром и ждёт дубль, который «уже можно». Этот дубль в расписание не вписан.',
      },
      {
        kind: 'split',
        kicker: 'Два варианта',
        anti: 'Снять и стереть, не досмотрев. Чтобы даже ты это не видела.',
        example: 'Записать короткий фрагмент танца и никуда его не выкладывать.',
      },
      {
        kind: 'thought',
        kicker: 'Мысль',
        text: 'Работа первого дубля — существовать. Залететь он не обязан.',
      },
    ],
    actions: [
      {
        id: 'dance-fragment',
        label: 'Записать фрагмент танца и не выкладывать',
        nextStep: 'Короткий кусок, один дубль. Он остаётся у тебя, без публикации.',
        interests: ['dance'],
        status: 'draft',
      },
      {
        id: 'twenty-seconds',
        label: 'Записать двадцать секунд голоса или музыки',
        nextStep: 'Двадцать секунд. Можно фальшиво. Это не релиз.',
        interests: ['music'],
        status: 'draft',
      },
      {
        id: 'four-frames',
        label: 'Набросать четыре кадра движения',
        nextStep: 'Четыре грубых кадра: начало, середина, ещё середина, конец.',
        interests: ['drawing', 'dance'],
        status: 'draft',
      },
    ],
  },
  {
    id: 'twenty-eight',
    topic: 'Завершение проекта',
    title: 'У меня 28 начал и ни одного финала',
    teaser: 'Новый файл снова кажется серьёзнее, чем финал старого.',
    panels: [
      {
        kind: 'text',
        kicker: 'Ситуация',
        text: 'Двадцать восемь файлов с началом. Каждый новый кажется честнее старого. Финал всё время живёт в следующем.',
      },
      {
        kind: 'text',
        kicker: 'Поворот',
        text: 'Незаконченное собрало фан-клуб. Президент — файл номер четыре. Он пустой, но очень уверенно называется «финал_точно».',
      },
      {
        kind: 'split',
        kicker: 'Два варианта',
        anti: 'Открыть двадцать девятый и назвать его «уже по-настоящему».',
        example: 'Выбрать один бит и одной фразой решить, что считается готовой демоверсией.',
      },
      {
        kind: 'thought',
        kicker: 'Мысль',
        text: 'Финал — это решение, не настроение, которое само придёт.',
      },
    ],
    actions: [
      {
        id: 'done-when',
        label: 'Выбрать один файл и дописать: готово, когда…',
        nextStep: 'Открыть один начатый файл и дописать фразу: демо готово, когда…',
        interests: ['music'],
        status: 'draft',
      },
      {
        id: 'smallest-piece',
        label: 'Доделать самый маленький кусок',
        nextStep: 'Найти в одном файле самый маленький недоделанный кусок и довести только его.',
        interests: [],
        status: 'draft',
      },
      {
        id: 'last-line',
        label: 'Дописать последнюю строку или подпись',
        nextStep: 'Одна последняя строка, подпись или финальный жест — и этот кусок для тебя закончен.',
        interests: [],
        status: 'draft',
      },
    ],
  },
]

export function orderActions(actions: StoryAction[], selected: string[]): StoryAction[] {
  return actions
    .map((action, index) => ({
      action,
      index,
      boost: action.interests.some((id) => selected.includes(id)) ? 0 : 1,
    }))
    .sort((a, b) => a.boost - b.boost || a.index - b.index)
    .map((row) => row.action)
}

export function storyById(id: string): Story | undefined {
  return stories.find((story) => story.id === id)
}
