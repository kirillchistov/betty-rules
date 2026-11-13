import { statusLabel } from '../content/interests'
import { keptSummary } from '../state/attempt'
import { useStore } from '../state/context'
import type { Item } from '../state/types'
import { TopBar, Portrait, Logo } from '../components/ui'

function origin(item: Item): string | null {
  if (item.source?.type === 'story') return 'из истории'
  if (item.source?.type === 'slot') return 'твоя тема'
  return null
}

export function Things() {
  const { state } = useStore()
  const items = [...state.items].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))

  return (
    <section className="screen" data-screen="things">
      <TopBar title="Мои затеи" />
      <p className="meaning">Идеи, черновики и готовое — без оценок и рейтингов.</p>
      {items.length === 0 ? (
        <article className="panel">
          <div className="face-row">
            <Portrait className="face-lg" />
            <Logo className="face-md" />
          </div>
          <h1>Пока здесь пусто</h1>
          <p>Сюда попадёт первая попытка: название и шаги. Сам рисунок или видео остаются у тебя.</p>
          <div className="row wrap">
            <a className="btn" href="#/now">
              Выбрать, что попробовать
            </a>
            <a className="btn ghost" href="#/thing/new">
              Своя идея
            </a>
          </div>
        </article>
      ) : (
        <div className="catalog">
          {items.map((item) => {
            const from = origin(item)
            const fromStory = item.source?.type === 'story'
            return (
              <a key={item.id} className="catalog-card" href={`#/thing/${item.id}`}>
                {fromStory ? <Portrait className="face-card" /> : <Logo className="face-card" />}
                <span className="card-copy">
                  <span className="sticker">{statusLabel(item.status)}</span>
                  <strong>{item.title}</strong>
                  <span>{keptSummary(item)}</span>
                  {from ? <em>{from}</em> : null}
                </span>
              </a>
            )
          })}
        </div>
      )}
    </section>
  )
}
