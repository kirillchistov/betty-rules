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
    title: 'Референсы уже на стене. Я пока выбираю маркер',
    teaser: 'Папка открыла выставку. Твой лист может зайти без дресс-кода.',
    panels: [
      {
        kind: 'text',
        kicker: 'Ситуация',
        text: 'Референсы лежат папками: красивые, чужие, уже законченные. Они даже свет включили. Твой лист стоит рядом и делает вид, что тоже экспонат, — просто пока без рисунка.',
      },
      {
        kind: 'text',
        kicker: 'Поворот',
        text: 'Пока ты искала ещё один «тот самый», референсы завели чат. Тебе там оставили место. Входной билет — любая линия, не идеальная.',
      },
      {
        kind: 'split',
        kicker: 'Два варианта',
        anti: 'Сохранить ещё десять картинок и торжественно назвать это подготовкой.',
        example: 'Нарисовать три силуэта одежды. Неровные — нормально. Без обещания «потом по-настоящему».',
      },
      {
        kind: 'thought',
        kicker: 'Мысль',
        text: 'Референс — чужой финал в гостях. Силуэт — уже твоё начало.',
      },
    ],
    actions: [
      {
        id: 'silhouettes',
        label: 'Нарисовать три грубых силуэта одежды',
        nextStep: 'Нарисовать три силуэта. Неровные линии тоже считаются — это и есть шаг.',
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
    teaser: 'Первый дубль вышел в костюме катастрофы. Под ним обычный черновик.',
    panels: [
      {
        kind: 'text',
        kicker: 'Ситуация',
        text: 'Первый дубль уверен, что его сейчас увидят все и подпишут твоим именем навсегда. У дубля очень богатое воображение.',
      },
      {
        kind: 'text',
        kicker: 'Поворот',
        text: 'Черновик сидит за кадром и ждёт дубль, который «уже можно». Тот посмотрел расписание и не нашёл отдельного дня для смелости.',
      },
      {
        kind: 'split',
        kicker: 'Два варианта',
        anti: 'Снять и сразу стереть, не досмотрев. Даже себе не оставить билет.',
        example: 'Записать короткий фрагмент танца и никуда его не выкладывать. Премьера на один экран: твой.',
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
    title: 'Двадцать восемь начал. Финал опять в следующем',
    teaser: 'Новый файл приходит в пиджаке. Финал всё ещё ищет ключи.',
    panels: [
      {
        kind: 'text',
        kicker: 'Ситуация',
        text: 'Двадцать восемь файлов с началом. Каждый новый такой серьёзный, будто именно он всё доделает. Финал вежливо кивает и переезжает на папку дальше.',
      },
      {
        kind: 'text',
        kicker: 'Поворот',
        text: 'Незаконченное собрало фан-клуб. Президент — файл номер четыре. Почти пустой, зато с очень уверенным именем «финал_точно».',
      },
      {
        kind: 'split',
        kicker: 'Два варианта',
        anti: 'Открыть двадцать девятый и повесить ему бейдж «уже по-настоящему».',
        example: 'Выбрать один бит и одной фразой решить, что для тебя считается готовой демоверсией.',
      },
      {
        kind: 'thought',
        kicker: 'Мысль',
        text: 'Финал — это решение. Настроение может опоздать и всё равно его застать.',
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
