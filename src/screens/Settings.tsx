import { useRef, useState } from 'react'
import { attitudes } from '../content/attitudes'
import { interests } from '../content/interests'
import { go } from '../router'
import { useStore } from '../state/context'
import { createDefaultState, downloadBackup, parseBackup } from '../state/storage'
import type { AppState, InterestId } from '../state/types'
import { Dialog, Field, SaveWarning, ThemeSwitch, TopBar, formatWhen, uid } from '../components/ui'

export function Settings() {
  const { state, update, replaceAll } = useStore()
  const fileRef = useRef<HTMLInputElement>(null)
  const [note, setNote] = useState('')
  const [importError, setImportError] = useState('')
  const [pending, setPending] = useState<AppState | null>(null)
  const [confirmWipe, setConfirmWipe] = useState(false)
  const [imported, setImported] = useState(false)

  function toggleInterest(id: InterestId) {
    update((current) => ({
      ...current,
      interests: current.interests.includes(id)
        ? current.interests.filter((item) => item !== id)
        : [...current.interests, id],
    }))
  }

  function addNote() {
    const text = note.trim()
    if (!text) return
    update((current) => ({
      ...current,
      feedback: [{ id: uid(), text, createdAt: new Date().toISOString() }, ...current.feedback],
    }))
    setNote('')
  }

  function onFile(file: File | undefined) {
    setImportError('')
    setImported(false)
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = parseBackup(JSON.parse(String(reader.result)))
        if (!parsed) {
          setImportError('Этот файл не похож на выгрузку «Своего курса».')
          return
        }
        setPending(parsed)
      } catch {
        setImportError('Не получилось прочитать файл.')
      }
    }
    reader.readAsText(file)
    if (fileRef.current) fileRef.current.value = ''
  }

  return (
    <section className="screen" data-screen="settings">
      <TopBar back="#/now" title="Настройки" extra={<span />} />
      <SaveWarning />
      <article className="panel">
        <h1>Это память браузера</h1>
        <p>
          Не облачный аккаунт. Если очистить браузер или открыть сайт на другом телефоне, данные сами не переедут.
          Между устройствами их можно перенести только файлом выгрузки.
        </p>
      </article>

      <section className="stack">
        <h2>Вид</h2>
        <p className="quiet">Одни и те же экраны. Лунный — мягче, коллаж — резче. Можно сравнить и оставить любой.</p>
        <ThemeSwitch />
      </section>

      <section className="stack">
        <h2>Мантры</h2>
        <p className="quiet">
          Если минуту ничего не нажимать, поверх экрана появятся карточки с этими формулировками. Пункт «Мантры»
          внизу открывает их сразу.
        </p>
        <button
          type="button"
          className={state.mantrasEnabled ? 'chip on' : 'chip'}
          aria-pressed={state.mantrasEnabled}
          onClick={() => update((current) => ({ ...current, mantrasEnabled: !current.mantrasEnabled }))}
        >
          {state.mantrasEnabled ? 'Отключить мантры' : 'Включить мантры'}
        </button>
      </section>

      <section className="stack">
        <h2>Интересы</h2>
        <p className="quiet">На историях поднимем похожие шаги выше. Ничего не спрячем.</p>
        <div className="row wrap">
          {interests.map((interest) => {
            const on = state.interests.includes(interest.id)
            return (
              <button
                key={interest.id}
                type="button"
                className={on ? 'chip on' : 'chip'}
                aria-pressed={on}
                onClick={() => toggleInterest(interest.id)}
              >
                {interest.label}
              </button>
            )
          })}
        </div>
      </section>

      <section className="stack">
        <h2>Свои названия</h2>
        <p className="quiet">Исходная формулировка остаётся. Пустое поле — это предложенный вариант.</p>
        {attitudes.map((attitude) => (
          <Field
            key={attitude.id}
            label={attitude.source}
            value={state.attitudes[attitude.id].customTitle}
            placeholder={attitude.proposed}
            maxLength={400}
            onChange={(customTitle) =>
              update((current) => ({
                ...current,
                attitudes: {
                  ...current.attitudes,
                  [attitude.id]: { ...current.attitudes[attitude.id], customTitle },
                },
              }))
            }
            onBlur={(customTitle) =>
              update((current) => ({
                ...current,
                attitudes: {
                  ...current.attitudes,
                  [attitude.id]: { ...current.attitudes[attitude.id], customTitle: customTitle.trim() },
                },
              }))
            }
          />
        ))}
        <h2>Темы без истории</h2>
        {state.openSlots.map((slot, index) => (
          <Field
            key={slot.id}
            label={`Слот ${index + 1}`}
            value={slot.customTitle}
            placeholder="Пока без названия"
            maxLength={400}
            onChange={(customTitle) =>
              update((current) => ({
                ...current,
                openSlots: current.openSlots.map((item) => (item.id === slot.id ? { ...item, customTitle } : item)),
              }))
            }
            onBlur={(customTitle) =>
              update((current) => ({
                ...current,
                openSlots: current.openSlots.map((item) =>
                  item.id === slot.id ? { ...item, customTitle: customTitle.trim() } : item,
                ),
              }))
            }
          />
        ))}
      </section>

      <section className="stack">
        <h2>Короткая записка</h2>
        <p className="quiet">Без звёзд и без обязанности. Записка останется в этом браузере и попадёт в выгрузку.</p>
        <Field label="Записка" value={note} onChange={setNote} multiline maxLength={4000} />
        <button type="button" className="btn ghost" onClick={addNote}>
          Оставить записку
        </button>
        {state.feedback.length === 0 ? <p className="quiet">Записок пока нет. Это не обязанность.</p> : null}
        <ul className="notes">
          {state.feedback.map((entry) => (
            <li key={entry.id}>
              <p>{entry.text}</p>
              <div className="row">
                <span className="quiet">{formatWhen(entry.createdAt)}</span>
                <button
                  type="button"
                  className="text-btn"
                  onClick={() =>
                    update((current) => ({
                      ...current,
                      feedback: current.feedback.filter((item) => item.id !== entry.id),
                    }))
                  }
                >
                  Убрать
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="stack">
        <h2>Файл с данными</h2>
        <div className="row wrap">
          <button type="button" className="btn" onClick={() => downloadBackup(state)}>
            Выгрузить
          </button>
          <button type="button" className="btn ghost" onClick={() => fileRef.current?.click()}>
            Восстановить из файла
          </button>
        </div>
        <input
          ref={fileRef}
          className="file"
          type="file"
          accept="application/json,.json"
          onChange={(event) => onFile(event.target.files?.[0])}
        />
        {importError ? <p className="form-error">{importError}</p> : null}
        {imported ? (
          <p className="banner" role="status">
            Данные из файла на месте.
          </p>
        ) : null}
      </section>

      <a className="text-btn" href="#/onboarding">
        Как этим пользоваться
      </a>

      <a className="text-btn" href="#/splash">
        Открыть заставку ещё раз
      </a>

      <button type="button" className="btn danger" onClick={() => setConfirmWipe(true)}>
        Удалить сохранённые данные
      </button>

      {pending ? (
        <Dialog
          title="Заменить данные в браузере?"
          text={`В файле ${pending.items.length} затей и ${pending.feedback.length} записок. То, что сейчас сохранено, будет заменено.`}
          confirm="Заменить"
          onConfirm={() => {
            replaceAll(pending)
            setPending(null)
            setImported(true)
          }}
          onClose={() => setPending(null)}
        />
      ) : null}
      {confirmWipe ? (
        <Dialog
          title="Удалить всё из этого браузера?"
          text="Названия, затеи, записки и выбранный вид исчезнут."
          confirm="Удалить"
          danger
          onConfirm={() => {
            replaceAll(createDefaultState())
            setConfirmWipe(false)
            go({ name: 'splash' }, 'replace')
          }}
          onClose={() => setConfirmWipe(false)}
        />
      ) : null}
    </section>
  )
}
