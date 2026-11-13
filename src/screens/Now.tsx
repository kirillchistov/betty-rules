import { offers } from '../content/offers'
import { statusLabel } from '../content/interests'
import { useStore } from '../state/context'
import { OPEN_STATUSES } from '../state/types'
import { SaveWarning, TopBar } from '../components/ui'

export function Now() {
  const { state } = useStore()
  const unfinished = state.items
    .filter((item) => OPEN_STATUSES.includes(item.status))
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
  const latest = unfinished[0]

  return (
    <section className="screen" data-screen="now">
      <TopBar />
      <SaveWarning />
      {latest ? (
        <a className="continue" href={`#/thing/${latest.id}`}>
          <span className="sticker">твоя попытка</span>
          <strong>{latest.title}</strong>
          <span>
            {statusLabel(latest.status)}
            {unfinished.length > 1 ? ` · ещё ${unfinished.length - 1}` : ''}
          </span>
        </a>
      ) : null}
      <h1>Что хочется иметь к концу?</h1>
      <p className="meaning">Три небольших результата. Попытку можно оставить сразу, без анкеты.</p>
      <div className="choices">
        {offers.map((offer) => (
          <a key={offer.id} className="choice" href={`#/try/${offer.id}`}>
            <strong>{offer.result}</strong>
            <span>{offer.pitch}</span>
          </a>
        ))}
      </div>
      <a className="text-btn" href="#/thing/new">
        Своя идея, без готового варианта
      </a>
      <a className="text-btn" href="#/zine">
        Истории — если захочется почитать
      </a>
    </section>
  )
}
