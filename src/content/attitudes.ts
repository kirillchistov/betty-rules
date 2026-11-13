import type { AttitudeId } from '../state/types'

export type Attitude = {
  id: AttitudeId
  source: string
  proposed: string
  meaning: string
  aside?: string
  stepHref: string
  stepName: string
}

export const attitudes: Attitude[] = [
  {
    id: 'study',
    source: 'Учёба — твой выбор',
    proposed: 'Бери скиллы под свои идеи',
    meaning:
      'Не обязательно любить каждый предмет. Можно находить знания, которые помогают делать своё.',
    stepHref: '#/try/cover',
    stepName: 'Обложка для своего бита',
  },
  {
    id: 'think',
    source: 'Не учишься думать — решают за тебя',
    proposed: 'Не отдавай свой пульт чужим мнениям',
    meaning: 'Проверять информацию, задавать вопросы и менять мнение — нормально.',
    stepHref: '#/thing/new',
    stepName: 'Своя идея, без готового варианта',
  },
  {
    id: 'mistakes',
    source: 'Ошибки — опыт',
    proposed: 'Первый дубль не обязан залететь',
    meaning: 'Черновик нужен не для оценки тебя, а чтобы понять следующий шаг.',
    stepHref: '#/try/move',
    stepName: 'Три движения под любимый кусок',
  },
  {
    id: 'people',
    source: 'Окружение определяет тебя',
    proposed: 'С тобой можно по-разному. Унижать — нельзя',
    meaning: 'Друзья не обязаны разделять все увлечения, но уважение важно.',
    stepHref: '#/try/look',
    stepName: 'Эскиз образа для выдуманной группы',
  },
  {
    id: 'money',
    source: 'Деньги и независимость',
    proposed: 'Деньги — инструмент для твоих планов',
    meaning: 'Учиться распоряжаться ресурсами, а не измерять свою ценность заработком.',
    stepHref: '#/story/twenty-eight',
    stepName: 'Довести один начатый файл',
  },
  {
    id: 'agency',
    source: 'Никто ничего не должен',
    proposed: 'Не всё в твоих руках. Следующий ход — иногда да',
    meaning:
      'Различать то, на что можно повлиять, и то, где нужны помощь, время или отдых.',
    aside:
      'Самостоятельность не запрещает просить помощь. Здесь попробуем разобраться, на что ты можешь повлиять сейчас.',
    stepHref: '#/story/references',
    stepName: 'Начать с трёх силуэтов',
  },
]
