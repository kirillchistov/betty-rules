import { stories } from '../content/stories'
import { useStore } from '../state/context'
import { Logo, Portrait, SaveWarning, TopBar, cx } from '../components/ui'

export function Zine({ stuck }: { stuck: boolean }) {
  const { state } = useStore()
  const ordered = stuck
    ? [...stories].sort((a, b) => Number(b.id === 'references') - Number(a.id === 'references'))
    : stories

  return (
    <section className="screen" data-screen="zine">
      <TopBar title="Затеи" />
      <SaveWarning />
      {stuck ? <p className="sticker">если застряла — можно отсюда</p> : null}
      <p className="meaning">
        Шесть затей. Три уже написаны. Три пустые — их можно назвать своими словами. Мы туда ничего не подставили.
      </p>
      <div className="catalog">
        {ordered.map((story) => (
          <a
            key={story.id}
            className={cx('catalog-card', stuck && story.id === 'references' && 'feature')}
            href={`#/story/${story.id}`}
          >
            <Portrait className="face-card" />
            <span className="card-copy">
              <span className="sticker">{story.topic}</span>
              <strong>{story.title}</strong>
              <span>{story.teaser}</span>
            </span>
          </a>
        ))}
        {state.openSlots.map((slot, index) => {
          const named = slot.customTitle.trim()
          return (
            <a key={slot.id} className="catalog-card empty" href={`#/slot/${slot.id}`}>
              <Logo className="face-card" />
              <span className="card-copy">
                <span className="sticker">без истории</span>
                <strong>{named || 'Пока без названия'}</strong>
                <span>{named ? 'Твоя формулировка' : `Слот ${index + 1}. Можно назвать самой.`}</span>
                {slot.note.trim() ? <em>{slot.note}</em> : null}
              </span>
            </a>
          )
        })}
      </div>
    </section>
  )
}
