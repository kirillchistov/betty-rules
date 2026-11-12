import { statusLabel } from '../content/interests'
import { useStore } from '../state/context'
import { OPEN_STATUSES, type TimeChoice } from '../state/types'
import { SaveWarning, TopBar } from '../components/ui'

const entries = [
  { href: '#/thing/new', title: 'У меня есть идея', note: 'Сразу к своей, без чужого задания.' },
  { href: '#/zine', title: 'Хочу что-нибудь, но не знаю что', note: 'Можно полистать истории и пустые темы.' },
  { href: '#/zine?stuck=1', title: 'Застряла и не могу начать', note: 'История про трудное начало будет сверху.' },
  { href: '#/zine', title: 'Просто полистаю затеи', note: 'Без шага и без отчёта.' },
]

const times: { id: TimeChoice; label: string }[] = [
  { id: '2', label: '2 минуты' },
  { id: '5', label: '5 минут' },
  { id: '15', label: '15 минут' },
  { id: 'uncounted', label: 'не хочу считать' },
]

export function Now() {
  const { state, update } = useStore()
  const unfinished = state.items
    .filter((item) => OPEN_STATUSES.includes(item.status))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  const latest = unfinished[0]

  return (
    <section className="screen" data-screen="now">
      <TopBar />
      <SaveWarning />
      <p className="hand note">Затеи, не контрольная.</p>
      {latest ? (
        <a className="continue" href={`#/thing/${latest.id}`}>
          <span className="sticker">продолжить</span>
          <strong>{latest.title}</strong>
          <span>
            {statusLabel(latest.status)}
            {unfinished.length > 1 ? ` · ещё ${unfinished.length - 1} в коллекции` : ''}
          </span>
        </a>
      ) : null}
      <h1>Есть что-то, что хочется сделать для себя?</h1>
      <div className="choices">
        {entries.map((entry) => (
          <a key={entry.title} className="choice" href={entry.href}>
            <strong>{entry.title}</strong>
            <span>{entry.note}</span>
          </a>
        ))}
      </div>
      <div className="time-block">
        <p className="kicker">Если хочется опереться на время</p>
        <p className="quiet">Необязательно. Это не норма и не таймер.</p>
        <div className="row wrap">
          {times.map((time) => {
            const on = state.timeChoice === time.id
            return (
              <button
                key={time.id}
                type="button"
                className={on ? 'chip on' : 'chip'}
                aria-pressed={on}
                onClick={() =>
                  update((current) => ({
                    ...current,
                    timeChoice: current.timeChoice === time.id ? null : time.id,
                  }))
                }
              >
                {time.label}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
