import { useEffect, useRef, useState, type ReactNode } from 'react'
import { go } from '../router'
import { useStore } from '../state/context'
import { Logo, Portrait, cx } from '../components/ui'

const cards: { kicker: string; title: string; body: ReactNode; face: 'portrait' | 'logo' | 'both' }[] = [
  {
    kicker: 'Что это',
    title: 'Свой курс',
    face: 'portrait',
    body: (
      <p className="meaning">
        Место для своих затей. Не учёба, не правила «как правильно жить» и не контрольная.
      </p>
    ),
  },
  {
    kicker: 'Зачем',
    title: 'Чтобы своё было проще начать',
    face: 'logo',
    body: (
      <p className="meaning">
        Можно поймать идею, сделать маленький шаг и не потерять то, что уже получилось. Оценок здесь нет.
      </p>
    ),
  },
  {
    kicker: 'Как',
    title: 'Три хода',
    face: 'both',
    body: (
      <ol className="steps">
        <li>На «Сейчас» выбрать, с чем пришла.</li>
        <li>Полистать затеи или записать свою.</li>
        <li>Вернуться к ней в «Моих затеях», когда захочется.</li>
      </ol>
    ),
  },
]

export function Onboarding() {
  const { update } = useStore()
  const [index, setIndex] = useState(0)
  const start = useRef<{ x: number; y: number } | null>(null)
  const swiped = useRef(false)
  const last = index === cards.length - 1
  const card = cards[index]

  function show(next: number) {
    setIndex(Math.max(0, Math.min(cards.length - 1, next)))
  }

  function enter() {
    update((current) => ({ ...current, seenOnboarding: true }))
    go({ name: 'now' })
  }

  function openSplash() {
    update((current) => ({ ...current, seenOnboarding: true }))
    go({ name: 'splash' })
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight' && !last) show(index + 1)
      if (event.key === 'ArrowLeft') show(index - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <section className="screen" data-screen="onboarding">
      <header className="topbar">
        <span className="brand">
          <Logo />
          <span className="wordmark">Свой курс</span>
        </span>
        <button type="button" className="text-btn" onClick={enter}>
          Пропустить
        </button>
      </header>
      <article
        className="panel taped"
        onPointerDown={(event) => {
          const target = event.target as HTMLElement
          if (target.closest('button, a')) return
          start.current = { x: event.clientX, y: event.clientY }
        }}
        onPointerUp={(event) => {
          if (!start.current) return
          const dx = event.clientX - start.current.x
          const dy = event.clientY - start.current.y
          start.current = null
          if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return
          swiped.current = true
          if (dx < 0) {
            if (last) enter()
            else show(index + 1)
          } else show(index - 1)
        }}
        onClick={() => {
          if (swiped.current) {
            swiped.current = false
            return
          }
          if (!last) show(index + 1)
        }}
      >
        <div className="face-row">
          {card.face !== 'logo' ? <Portrait className="face-lg" /> : null}
          {card.face !== 'portrait' ? <Logo className="face-lg" /> : null}
        </div>
        <p className="kicker">
          {card.kicker} · {index + 1} / {cards.length}
        </p>
        <h1>
          <span className="headline">{card.title}</span>
        </h1>
        {card.body}
      </article>
      <div className="pager">
        <button type="button" className="btn ghost" onClick={() => show(index - 1)} disabled={index === 0}>
          Назад
        </button>
        <div className="dots" role="tablist" aria-label="Онбординг">
          {cards.map((item, dot) => (
            <button
              key={item.kicker}
              type="button"
              className={cx('dot', dot === index && 'on')}
              aria-label={item.kicker}
              aria-current={dot === index ? 'true' : undefined}
              onClick={() => show(dot)}
            />
          ))}
        </div>
        {last ? (
          <button type="button" className="btn" onClick={enter}>
            К делу
          </button>
        ) : (
          <button type="button" className="btn" onClick={() => show(index + 1)}>
            Дальше
          </button>
        )}
      </div>
      {last ? (
        <button type="button" className="text-btn" onClick={openSplash}>
          Сначала короткие установки
        </button>
      ) : null}
    </section>
  )
}
