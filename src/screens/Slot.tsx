import { useState } from 'react'
import { flushSync } from 'react-dom'
import { go } from '../router'
import { useStore } from '../state/context'
import { TopBar } from '../components/ui'

export function Slot({ id }: { id: string }) {
  const { state, update } = useStore()
  const slot = state.openSlots.find((item) => item.id === id)
  const [title, setTitle] = useState(slot?.customTitle ?? '')
  const [note, setNote] = useState(slot?.note ?? '')
  const [saved, setSaved] = useState(false)

  if (!slot) {
    return (
      <section className="screen" data-screen="slot">
        <TopBar back="#/zine" title="Тема" />
        <article className="panel">
          <h1>Такого слота нет</h1>
          <a className="btn" href="#/zine">
            Вернуться в каталог
          </a>
        </article>
      </section>
    )
  }

  function save() {
    const customTitle = title.trim()
    const nextNote = note.trim()
    update((current) => ({
      ...current,
      openSlots: current.openSlots.map((item) =>
        item.id === id ? { ...item, customTitle, note: nextNote } : item,
      ),
    }))
    setTitle(customTitle)
    setNote(nextNote)
    setSaved(true)
  }

  return (
    <section className="screen" data-screen="slot">
      <TopBar back="#/zine" title="Пустая тема" />
      <article className="panel taped">
        <p className="sticker">без истории</p>
        <h1>Мы её не придумывали</h1>
        <p className="meaning">Если хочешь, назови тему сама и оставь одну строку, зачем она тебе.</p>
        <label className="field">
          <span>Название</span>
          <input
            value={title}
            maxLength={400}
            onChange={(event) => {
              setSaved(false)
              setTitle(event.target.value)
            }}
          />
        </label>
        <label className="field">
          <span>Зачем это тебе</span>
          <input
            value={note}
            maxLength={400}
            placeholder="Одна строка, можно пустую"
            onChange={(event) => {
              setSaved(false)
              setNote(event.target.value)
            }}
          />
        </label>
        {title.trim() ? <p className="badge own">Твоя формулировка</p> : <p className="badge">Пока без названия</p>}
        <button type="button" className="btn" onClick={save}>
          Оставить так
        </button>
        {saved ? (
          <p className="banner" role="status">
            Название сохранилось в этом браузере.
          </p>
        ) : null}
        {title.trim() ? (
          <button
            type="button"
            className="text-btn"
            onClick={() => {
              const customTitle = title.trim()
              const nextNote = note.trim()
              flushSync(() => {
                update((current) => ({
                  ...current,
                  openSlots: current.openSlots.map((item) =>
                    item.id === id ? { ...item, customTitle, note: nextNote } : item,
                  ),
                }))
              })
              go({ name: 'thing', id: 'new', slotId: id })
            }}
          >
            Завести затею с этим названием
          </button>
        ) : null}
      </article>
    </section>
  )
}
