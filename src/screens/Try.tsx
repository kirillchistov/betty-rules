import { offerById, stepsText } from '../content/offers'
import { attemptTitle, makeAttempt } from '../state/attempt'
import { useKeep } from '../state/keep'
import { TopBar, uid } from '../components/ui'

export function Try({ id }: { id: string }) {
  const offer = offerById(id)
  const keep = useKeep()

  if (!offer) {
    return (
      <section className="screen" data-screen="try">
        <TopBar back="#/now" title="Попытка" />
        <article className="panel">
          <h1>Такого варианта нет</h1>
          <a className="btn" href="#/now">
            К началу
          </a>
        </article>
      </section>
    )
  }

  function leave() {
    const item = makeAttempt({
      id: uid(),
      title: attemptTitle(offer!.short),
      nextStep: stepsText(offer!.steps),
      source: { type: 'story', storyId: offer!.storyId, actionId: offer!.actionId },
    })
    keep(item)
  }

  return (
    <section className="screen" data-screen="try">
      <TopBar back="#/now" title="Попытка" />
      <p className="kicker">Один из вариантов, не образец для оценки</p>
      <h1>{offer.result}</h1>
      <article className="panel">
        <p className="meaning">{offer.example}</p>
        <ol className="steps">
          {offer.steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </article>
      <button type="button" className="btn" onClick={leave}>
        Оставить у себя
      </button>
      <p className="quiet">
        В «Моих затеях» останутся название и эти шаги. Сам рисунок или запись — у тебя, пока не добавишь ссылку.
      </p>
      <a className="text-btn" href={`#/story/${offer.storyId}`}>
        Почитать историю, если интересно
      </a>
    </section>
  )
}
