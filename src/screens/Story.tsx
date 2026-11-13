import { useEffect, useRef, useState } from 'react'
import { interestLabel } from '../content/interests'
import { orderActions, storyById, type StoryAction, type StoryPanel } from '../content/stories'
import { attemptTitle, makeAttempt } from '../state/attempt'
import { useStore } from '../state/context'
import { useKeep } from '../state/keep'
import { Logo, Portrait, TimeNote, TopBar, cx, uid } from '../components/ui'

export function Story({ id }: { id: string }) {
  const { state } = useStore()
  const keep = useKeep()
  const story = storyById(id)
  const [index, setIndex] = useState(0)
  const start = useRef<{ x: number; y: number } | null>(null)
  const swiped = useRef(false)

  useEffect(() => {
    setIndex(0)
  }, [id])

  useEffect(() => {
    if (!story) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') setIndex((current) => Math.min(story.panels.length, current + 1))
      if (event.key === 'ArrowLeft') setIndex((current) => Math.max(0, current - 1))
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [story])

  if (!story) {
    return (
      <section className="screen" data-screen="story">
        <TopBar back="#/zine" title="Затеи" />
        <article className="panel">
          <h1>Такой истории здесь нет</h1>
          <a className="btn" href="#/zine">
            Вернуться в каталог
          </a>
        </article>
      </section>
    )
  }

  const total = story.panels.length + 1
  const actions = orderActions(story.actions, state.interests)
  const onActions = index === story.panels.length
  const lead = actions[0]

  function keepAction(action: StoryAction) {
    keep(
      makeAttempt({
        id: uid(),
        title: attemptTitle(action.label),
        nextStep: action.nextStep,
        source: { type: 'story', storyId: story!.id, actionId: action.id },
      }),
    )
  }

  function show(next: number) {
    setIndex(Math.max(0, Math.min(story!.panels.length, next)))
  }

  return (
    <section className="screen" data-screen="story">
      <TopBar back="#/zine" title={story.topic} />
      <p className="hand note">
        {index + 1} / {total}
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
          if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy)) return
          swiped.current = true
          show(dx < 0 ? index + 1 : index - 1)
        }}
        onClick={(event) => {
          if (swiped.current) {
            swiped.current = false
            return
          }
          const target = event.target as HTMLElement
          if (target.closest('button, a, input, textarea, label')) return
          if (!onActions) show(index + 1)
        }}
      >
        {onActions ? (
          <>
            <Logo className="face-md" />
            <Actions
              storyId={story.id}
              actions={actions}
              boosted={state.interests.length > 0}
              onKeep={keepAction}
            />
          </>
        ) : (
          <>
            {index === 0 ? <Portrait className="face-md" /> : null}
            <Panel panel={story.panels[index]} />
            {index === 0 && lead ? (
              <div className="stack">
                <p className="meaning">{lead.label}</p>
                <button type="button" className="btn" onClick={() => keepAction(lead)}>
                  Оставить попытку
                </button>
              </div>
            ) : null}
          </>
        )}
      </article>
      <TimeNote choice={state.timeChoice} />
      <div className="pager">
        <button type="button" className="btn ghost" onClick={() => show(index - 1)} disabled={index === 0}>
          Назад
        </button>
        <div className="dots" role="tablist" aria-label="Панели истории">
          {Array.from({ length: total }, (_, dot) => (
            <button
              key={dot}
              type="button"
              className={cx('dot', dot === index && 'on')}
              aria-label={`Панель ${dot + 1}`}
              aria-current={dot === index ? 'true' : undefined}
              onClick={() => show(dot)}
            />
          ))}
        </div>
        {onActions ? (
          <a className="btn ghost" href="#/zine">
            Закрыть
          </a>
        ) : (
          <button type="button" className="btn" onClick={() => show(index + 1)}>
            Дальше
          </button>
        )}
      </div>
    </section>
  )
}

function Panel({ panel }: { panel: StoryPanel }) {
  if (panel.kind === 'split') {
    return (
      <>
        <p className="kicker">{panel.kicker}</p>
        <div className="split">
          <div className="mini anti">
            <span className="kicker">Антипример</span>
            <p>{panel.anti}</p>
          </div>
          <div className="mini example">
            <span className="kicker">Пример</span>
            <p>{panel.example}</p>
          </div>
        </div>
      </>
    )
  }
  if (panel.kind === 'thought') {
    return (
      <>
        <p className="kicker">{panel.kicker}</p>
        <blockquote className="thought">{panel.text}</blockquote>
      </>
    )
  }
  return (
    <>
      <p className="kicker">{panel.kicker}</p>
      <p className="story-text">{panel.text}</p>
    </>
  )
}

function Actions({
  storyId,
  actions,
  boosted,
  onKeep,
}: {
  storyId: string
  actions: ReturnType<typeof orderActions>
  boosted: boolean
  onKeep: (action: StoryAction) => void
}) {
  return (
    <>
      <p className="kicker">Что можно сделать</p>
      <p className="meaning">Можно оставить попытку сразу. Форма не обязательна.</p>
      <p className="quiet">
        Рисунок, одежда, танцы и музыка здесь — варианты шага, не отдельные курсы.
        {boosted ? ' Сначала то, что ближе к выбранным интересам. Остальное тоже здесь.' : ''}
      </p>
      <div className="choices">
        {actions.map((action) => (
          <button key={action.id} type="button" className="choice" onClick={() => onKeep(action)}>
            <strong>{action.label}</strong>
            {action.interests.length > 0 ? (
              <span>{action.interests.map(interestLabel).join(' · ')}</span>
            ) : (
              <span>любое дело</span>
            )}
          </button>
        ))}
        <a className="choice own" href={`#/thing/new?story=${storyId}`}>
          <strong>Хочу сделать иначе</strong>
          <span>Своё действие, без готового текста.</span>
        </a>
      </div>
    </>
  )
}
