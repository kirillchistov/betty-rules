import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'
import { statusOptions, wouldStartOptions } from '../content/interests'
import { storyById } from '../content/stories'
import { go, type Route } from '../router'
import { attemptTitle, keptSummary, makeAttempt } from '../state/attempt'
import { useStore } from '../state/context'
import { useKeep } from '../state/keep'
import type { Item, ItemStatus, Reflection, WouldStart } from '../state/types'
import { Dialog, Field, SaveWarning, TopBar, isHttpLink, uid } from '../components/ui'

type ThingRoute = Extract<Route, { name: 'thing' }>

const emptyReflection = (): Reflection => ({
  whatHappened: '',
  minutes: '',
  wouldHaveStarted: null,
})

export function Thing({ route }: { route: ThingRoute }) {
  const { state, update } = useStore()
  const keep = useKeep()
  const existing = route.id === 'new' ? undefined : state.items.find((item) => item.id === route.id)
  const story = route.storyId ? storyById(route.storyId) : undefined
  const action = story?.actions.find((item) => item.id === route.actionId)
  const slot = route.slotId ? state.openSlots.find((item) => item.id === route.slotId) : undefined
  const missing = route.id !== 'new' && !existing

  const [title, setTitle] = useState(existing?.title ?? slot?.customTitle.trim() ?? '')
  const [note, setNote] = useState(existing?.note ?? (slot?.note ?? ''))
  const [link, setLink] = useState(existing?.link ?? '')
  const [nextStep, setNextStep] = useState(existing?.nextStep ?? action?.nextStep ?? '')
  const [status, setStatus] = useState<ItemStatus>(existing?.status ?? action?.status ?? 'idea')
  const [reflection, setReflection] = useState<Reflection>(existing?.reflection ?? emptyReflection())
  const [error, setError] = useState('')
  const [flash, setFlash] = useState(route.saved === true)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const [extra, setExtra] = useState<'link' | 'note' | null>(null)

  useEffect(() => {
    if (!route.saved || route.id === 'new') return
    setFlash(true)
    go({ name: 'thing', id: route.id }, 'replace')
  }, [route.saved, route.id])

  if (missing) {
    return (
      <section className="screen" data-screen="thing">
        <TopBar back="#/things" title="Затея" />
        <article className="panel">
          <h1>Этой записи нет</h1>
          <a className="btn" href="#/things">
            К моим затеям
          </a>
        </article>
      </section>
    )
  }

  const back = existing ? '#/things' : route.storyId ? `#/story/${route.storyId}` : '#/now'

  function persist(item: Item) {
    flushSync(() => {
      update((current) => ({
        ...current,
        items: [item, ...current.items.filter((entry) => entry.id !== item.id)],
      }))
    })
    setError('')
    setFlash(true)
  }

  function save() {
    const nextTitle = title.trim()
    if (!nextTitle) {
      setError('Нужно хотя бы название.')
      return
    }
    const now = new Date().toISOString()
    const cleaned = cleanReflection(reflection)
    const source = existing?.source ?? sourceFromRoute(route)
    const item: Item = {
      id: existing?.id ?? uid(),
      title: nextTitle,
      note: note.trim(),
      link: link.trim(),
      nextStep: nextStep.trim(),
      status,
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    }
    if (source) item.source = source
    if (cleaned) item.reflection = cleaned
    if (!existing) {
      keep(item)
      return
    }
    persist(item)
    setShowAll(false)
    setExtra(null)
  }

  function createOwn() {
    const source = sourceFromRoute(route)
    const item = makeAttempt({
      id: uid(),
      title: title.trim() ? attemptTitle(title.trim()) : attemptTitle(action?.label || 'Своя затея'),
      note: note.trim() || (!action && story ? `Из истории «${story.title}»` : ''),
      link,
      nextStep: nextStep.trim() || action?.nextStep || '',
      source,
    })
    if (status !== 'draft') item.status = status
    keep(item)
  }

  function remove() {
    if (!existing) return
    update((current) => ({ ...current, items: current.items.filter((item) => item.id !== existing.id) }))
    go({ name: 'things' }, 'replace')
  }

  if (!existing) {
    return (
      <section className="screen" data-screen="thing">
        <TopBar back={back} title="Новая затея" />
        <SaveWarning />
        <h1>{action ? action.label : 'Своя идея'}</h1>
        <p className="meaning">
          {action
            ? 'Можно оставить попытку с этим шагом. Название придумается само, с сегодняшней датой.'
            : 'Название можно не придумывать. Если поле пустое, сохранится «Своя затея» и дата.'}
        </p>
        {action ? <p className="attempt">{action.nextStep}</p> : null}
        <form
          className="stack"
          onSubmit={(event) => {
            event.preventDefault()
            createOwn()
          }}
        >
          {action ? null : (
            <Field
              label="Что хочется сделать"
              value={note}
              onChange={setNote}
              multiline
              maxLength={4000}
            />
          )}
          <Field
            label="Своё название, если хочется"
            value={title}
            onChange={setTitle}
            maxLength={400}
            hint="Необязательно."
          />
          <details className="reflection">
            <summary>Ссылка или следующий шаг</summary>
            <Field
              label="Внешняя ссылка, если есть"
              value={link}
              onChange={setLink}
              type="url"
              maxLength={2000}
              placeholder="https://"
            />
            <Field
              label="Следующий шаг"
              value={nextStep}
              onChange={setNextStep}
              multiline
              maxLength={400}
            />
          </details>
          <button type="submit" className="btn">
            Оставить у себя
          </button>
          <p className="quiet">Рисунок и видео сами не загружаются. Сюда попадает то, что написано.</p>
        </form>
      </section>
    )
  }

  const href = isHttpLink(link) ? link.trim() : ''

  if (!showAll) {
    return (
      <section className="screen" data-screen="thing">
        <TopBar back={back} title="Затея" />
        <SaveWarning />
        <p className="banner" role="status">
          {flash ? 'Попытка осталась в «Моих затеях».' : 'Она лежит в «Моих затеях».'}
        </p>
        <article className="panel">
          <h1>{existing.title}</h1>
          {existing.nextStep ? <p className="attempt">{existing.nextStep}</p> : null}
          {existing.note ? <p className="meaning">{existing.note}</p> : null}
          <p className="quiet">{keptSummary(existing)}</p>
          {href ? (
            <a className="text-btn" href={href} target="_blank" rel="noreferrer noopener">
              Открыть ссылку
            </a>
          ) : null}
        </article>
        <div className="row wrap">
          <button type="button" className="btn ghost" onClick={() => setExtra(extra === 'link' ? null : 'link')}>
            {existing.link ? 'Изменить ссылку' : 'Добавить ссылку'}
          </button>
          <button type="button" className="btn ghost" onClick={() => setExtra(extra === 'note' ? null : 'note')}>
            {existing.note ? 'Изменить пару слов' : 'Написать пару слов'}
          </button>
          <a className="btn" href="#/now">
            Продолжить потом
          </a>
        </div>
        {extra ? (
          <form
            className="stack"
            onSubmit={(event) => {
              event.preventDefault()
              save()
            }}
          >
            {extra === 'link' ? (
              <Field
                label="Внешняя ссылка"
                value={link}
                onChange={setLink}
                type="url"
                maxLength={2000}
                placeholder="https://"
                hint="Ссылка откроется снаружи. Это не публикация и не сам файл."
              />
            ) : (
              <Field label="Пара слов" value={note} onChange={setNote} multiline maxLength={4000} />
            )}
            {error ? <p className="form-error">{error}</p> : null}
            <button type="submit" className="btn">
              Оставить и это
            </button>
          </form>
        ) : null}
        <button type="button" className="text-btn" onClick={() => setShowAll(true)}>
          Дописать карточку
        </button>
        <button type="button" className="text-btn danger-text" onClick={() => setConfirmDelete(true)}>
          Убрать из коллекции
        </button>
        {confirmDelete ? (
          <Dialog
            title="Убрать эту затею?"
            text="Она исчезнет из «Моих затей» в этом браузере."
            confirm="Убрать"
            danger
            onConfirm={remove}
            onClose={() => setConfirmDelete(false)}
          />
        ) : null}
      </section>
    )
  }

  return (
    <section className="screen" data-screen="thing">
      <TopBar back={back} title="Затея" />
      <SaveWarning />
      {flash ? (
        <p className="banner" role="status">
          Сохранено в этом браузере. Это не публикация.
        </p>
      ) : null}
      <form
        className="stack"
        onSubmit={(event) => {
          event.preventDefault()
          save()
        }}
      >
        <Field label="Название" value={title} onChange={setTitle} maxLength={400} />
        <Field label="Короткая заметка" value={note} onChange={setNote} multiline maxLength={4000} />
        <Field
          label="Внешняя ссылка, если есть"
          value={link}
          onChange={setLink}
          type="url"
          maxLength={2000}
          placeholder="https://"
          hint="Ссылка откроется снаружи и не считается публикацией."
        />
        {href ? (
          <a className="text-btn" href={href} target="_blank" rel="noreferrer noopener">
            Открыть ссылку
          </a>
        ) : null}
        <Field label="Следующий маленький шаг" value={nextStep} onChange={setNextStep} multiline maxLength={400} />
        <fieldset className="status-set">
          <legend>Статус</legend>
          <div className="row wrap">
            {statusOptions.map((option) => (
              <button
                key={option.id}
                type="button"
                className={status === option.id ? 'chip on' : 'chip'}
                aria-pressed={status === option.id}
                onClick={() => setStatus(option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>
        </fieldset>
        <details className="reflection">
          <summary>Если уже что-то сделала</summary>
          <p className="quiet">
            Это про время на твоё дело, не про время внутри приложения. Можно не заполнять — и это не оценка.
          </p>
          <Field
            label="Что получилось сделать?"
            value={reflection.whatHappened}
            onChange={(whatHappened) => setReflection((current) => ({ ...current, whatHappened }))}
            multiline
            maxLength={4000}
          />
          <Field
            label="Примерно сколько времени ты этому уделила?"
            value={reflection.minutes}
            onChange={(minutes) => setReflection((current) => ({ ...current, minutes }))}
            placeholder="например, минут двадцать. Можно примерно"
            maxLength={200}
          />
          <fieldset className="status-set">
            <legend>Как думаешь, без приложения ты бы сегодня это начала?</legend>
            <div className="row wrap">
              {wouldStartOptions.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  className={reflection.wouldHaveStarted === option.id ? 'chip on' : 'chip'}
                  aria-pressed={reflection.wouldHaveStarted === option.id}
                  onClick={() =>
                    setReflection((current) => ({
                      ...current,
                      wouldHaveStarted: current.wouldHaveStarted === option.id ? null : option.id,
                    }))
                  }
                >
                  {option.label}
                </button>
              ))}
            </div>
          </fieldset>
        </details>
        {error ? <p className="form-error">{error}</p> : null}
        <button type="submit" className="btn">
          Сохранить
        </button>
      </form>
      <button type="button" className="text-btn" onClick={() => setShowAll(false)}>
        Вернуться к попытке
      </button>
    </section>
  )
}

function cleanReflection(reflection: Reflection): Reflection | undefined {
  const whatHappened = reflection.whatHappened.trim()
  const minutes = reflection.minutes.trim()
  const wouldHaveStarted: WouldStart | null = reflection.wouldHaveStarted
  if (!whatHappened && !minutes && !wouldHaveStarted) return undefined
  return { whatHappened, minutes, wouldHaveStarted }
}

function sourceFromRoute(route: ThingRoute): Item['source'] {
  if (route.storyId) {
    return {
      type: 'story',
      storyId: route.storyId,
      ...(route.actionId ? { actionId: route.actionId } : {}),
    }
  }
  if (route.slotId) return { type: 'slot', slotId: route.slotId }
  return { type: 'own' }
}
