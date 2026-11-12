import { useEffect, useRef, useState } from 'react'
import { attitudes } from '../content/attitudes'
import { go } from '../router'
import { useStore } from '../state/context'
import type { Reaction } from '../state/types'
import { cx, Logo, Portrait, ThemeSwitch } from '../components/ui'

const reactions: { id: Reaction; label: string }[] = [
  { id: 'resonates', label: 'Откликается' },
  { id: 'not-quite', label: 'Не совсем' },
  { id: 'otherwise', label: 'Я думаю иначе' },
]

export function Splash() {
  const { state, update } = useStore()
  const [index, setIndex] = useState(0)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState('')
  const start = useRef<{ x: number; y: number } | null>(null)
  const swiped = useRef(false)

  const attitude = attitudes[index]
  const saved = state.attitudes[attitude.id]
  const own = saved.customTitle.trim()
  const title = own || attitude.proposed
  const last = index === attitudes.length - 1

  function show(next: number) {
    const clamped = Math.max(0, Math.min(attitudes.length - 1, next))
    setIndex(clamped)
    setEditing(false)
  }

  function finish() {
    update((current) => ({ ...current, seenSplash: true }))
    go({ name: 'now' })
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (target.closest('input, textarea')) return
      if (editing) return
      if (event.key === 'ArrowRight') show(index + 1)
      if (event.key === 'ArrowLeft') show(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <section className="screen splash" data-screen="splash">
      <header className="topbar">
        <span className="brand">
          <Logo />
          <span className="wordmark">Мой курс</span>
        </span>
        <ThemeSwitch />
      </header>
      <p className="hand note">
        {index === 0
          ? 'Шесть установок. Можно листать, переименовать и не соглашаться.'
          : 'Тот же кадр можно посмотреть в другом виде.'}
      </p>

      <article
        className="panel taped"
        onPointerDown={(event) => {
          const target = event.target as HTMLElement
          if (target.closest('button, a, input, textarea, label')) return
          start.current = { x: event.clientX, y: event.clientY }
        }}
        onPointerUp={(event) => {
          if (!start.current) return
          const dx = event.clientX - start.current.x
          const dy = event.clientY - start.current.y
          start.current = null
          if (editing || Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return
          swiped.current = true
          show(dx < 0 ? index + 1 : index - 1)
        }}
        onClick={(event) => {
          if (swiped.current) {
            swiped.current = false
            return
          }
          const target = event.target as HTMLElement
          if (editing || target.closest('button, a, input, textarea, label')) return
          if (!last) show(index + 1)
        }}
      >
        <p className="kicker">
          {index + 1} / {attitudes.length}
        </p>
        <div className="face-row">
          <Portrait className="face-lg" />
          <Logo className="face-md" />
        </div>
        <p className="source">{attitude.source}</p>
        <h1>
          <span className="headline">{title}</span>
        </h1>
        <p className={cx('badge', own && 'own')}>{own ? 'Твоя формулировка' : 'Предложенный вариант · Можно назвать по-своему'}</p>
        <p className="meaning">{attitude.meaning}</p>
        {attitude.aside ? <p className="hand aside">{attitude.aside}</p> : null}

        {editing ? (
          <div className="editor">
            <label className="field">
              <span>Как это звучит у тебя</span>
              <textarea
                value={draft}
                maxLength={400}
                rows={3}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault()
                    saveTitle()
                  }
                }}
              />
            </label>
            <div className="row">
              <button type="button" className="btn" onClick={saveTitle}>
                Оставить это название
              </button>
              <button type="button" className="btn ghost" onClick={() => setEditing(false)}>
                Отмена
              </button>
              {own ? (
                <button type="button" className="btn ghost" onClick={restore}>
                  Вернуть предложенное
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="btn ghost"
            onClick={() => {
              setDraft(saved.customTitle)
              setEditing(true)
            }}
          >
            {own ? 'Поменять название' : 'У меня это звучит иначе'}
          </button>
        )}
      </article>

      <div className="reactions">
        <p className="kicker">Можно не выбирать</p>
        <div className="row wrap">
          {reactions.map((reaction) => (
            <button
              key={reaction.id}
              type="button"
              className={cx('chip', saved.reaction === reaction.id && 'on')}
              aria-pressed={saved.reaction === reaction.id}
              onClick={() =>
                update((current) => ({
                  ...current,
                  attitudes: {
                    ...current.attitudes,
                    [attitude.id]: {
                      ...current.attitudes[attitude.id],
                      reaction: current.attitudes[attitude.id].reaction === reaction.id ? null : reaction.id,
                    },
                  },
                }))
              }
            >
              {reaction.label}
            </button>
          ))}
        </div>
        {saved.reaction === 'otherwise' ? (
          <label className="field">
            <span>Как думаешь ты</span>
            <textarea
              rows={3}
              maxLength={2000}
              value={saved.otherwiseNote}
              placeholder="Необязательно. Это не проверка."
              onChange={(event) => {
                const value = event.target.value
                update((current) => ({
                  ...current,
                  attitudes: {
                    ...current.attitudes,
                    [attitude.id]: { ...current.attitudes[attitude.id], otherwiseNote: value },
                  },
                }))
              }}
            />
          </label>
        ) : null}
      </div>

      <div className="pager">
        <button type="button" className="btn ghost" onClick={() => show(index - 1)} disabled={index === 0}>
          Назад
        </button>
        <div className="dots" role="tablist" aria-label="Кадры заставки">
          {attitudes.map((item, dot) => (
            <button
              key={item.id}
              type="button"
              className={cx('dot', dot === index && 'on')}
              aria-label={`Кадр ${dot + 1}`}
              aria-current={dot === index ? 'true' : undefined}
              onClick={() => show(dot)}
            />
          ))}
        </div>
        {last ? (
          <button type="button" className="btn" onClick={finish}>
            Дальше
          </button>
        ) : (
          <button type="button" className="btn" onClick={() => show(index + 1)}>
            Вперёд
          </button>
        )}
      </div>
      <button type="button" className="text-btn" onClick={finish}>
        Пропустить заставку
      </button>
    </section>
  )

  function saveTitle() {
    const customTitle = draft.trim()
    update((current) => ({
      ...current,
      attitudes: {
        ...current.attitudes,
        [attitude.id]: { ...current.attitudes[attitude.id], customTitle },
      },
    }))
    setEditing(false)
  }

  function restore() {
    update((current) => ({
      ...current,
      attitudes: {
        ...current.attitudes,
        [attitude.id]: { ...current.attitudes[attitude.id], customTitle: '' },
      },
    }))
    setDraft('')
    setEditing(false)
  }
}
