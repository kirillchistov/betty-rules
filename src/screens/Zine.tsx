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
        Три истории. Их можно почитать после попытки — или вместо неё. Пустые темы мы сюда пачкой не выставили.
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
        {state.openSlots
          .filter((slot) => slot.customTitle.trim())
          .map((slot) => (
            <a key={slot.id} className="catalog-card empty" href={`#/slot/${slot.id}`}>
              <Logo className="face-card" />
              <span className="card-copy">
                <span className="sticker">твоя тема</span>
                <strong>{slot.customTitle.trim()}</strong>
                {slot.note.trim() ? <em>{slot.note}</em> : <span>Твоя формулировка</span>}
              </span>
            </a>
          ))}
      </div>
      {state.openSlots.some((slot) => !slot.customTitle.trim()) ? (
        <a
          className="text-btn"
          href={`#/slot/${state.openSlots.find((slot) => !slot.customTitle.trim())!.id}`}
        >
          Своя тема, если хочется назвать самой
        </a>
      ) : null}
    </section>
  )
}
