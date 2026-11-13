import { useEffect, useRef, useState } from 'react'
import { attitudes } from '../content/attitudes'
import { useStore } from '../state/context'
import { Logo, Portrait, TopBar, cx } from '../components/ui'

export function Mantras({ onClose }: { onClose?: () => void }) {
  const { state } = useStore()
  const [index, setIndex] = useState(0)
  const start = useRef<{ x: number; y: number } | null>(null)
  const swiped = useRef(false)
  const attitude = attitudes[index]
  const own = state.attitudes[attitude.id].customTitle.trim()
  const title = own || attitude.source

  function show(next: number) {
    setIndex(Math.max(0, Math.min(attitudes.length - 1, next)))
  }

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (target.closest('input, textarea')) return
      if (event.key === 'ArrowRight') show(index + 1)
      if (event.key === 'ArrowLeft') show(index - 1)
      if (event.key === 'Escape') onClose?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  return (
    <section className="screen" data-screen="mantras">
      <TopBar title="Мантры" extra={onClose ? <span /> : undefined} />
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
          show(dx < 0 ? index + 1 : index - 1)
        }}
        onClick={(event) => {
          if (swiped.current) {
            swiped.current = false
            return
          }
          const target = event.target as HTMLElement
          if (target.closest('button, a')) return
          show(index + 1 === attitudes.length ? 0 : index + 1)
        }}
      >
        <div className="face-row">
          <Portrait className="face-md" />
          <Logo className="face-md" />
        </div>
        <p className="kicker">
          {index + 1} / {attitudes.length}
        </p>
        {own ? <p className="source">{attitude.source}</p> : null}
        <h1>
          <span className="headline">{title}</span>
        </h1>
        {own ? null : <p className="quiet">{attitude.proposed}</p>}
        <p className="meaning">{attitude.meaning}</p>
        {attitude.aside ? <p className="hand aside">{attitude.aside}</p> : null}
        <a className="btn" href={attitude.stepHref} onClick={onClose}>
          Сделать шаг
        </a>
        <p className="quiet">{attitude.stepName}</p>
      </article>
      <div className="pager">
        <button type="button" className="btn ghost" onClick={() => show(index - 1)} disabled={index === 0}>
          Назад
        </button>
        <div className="dots" role="tablist" aria-label="Мантры">
          {attitudes.map((item, dot) => (
            <button
              key={item.id}
              type="button"
              className={cx('dot', dot === index && 'on')}
              aria-label={item.source}
              aria-current={dot === index ? 'true' : undefined}
              onClick={() => show(dot)}
            />
          ))}
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => show(index + 1 === attitudes.length ? 0 : index + 1)}
        >
          Дальше
        </button>
      </div>
      {onClose ? (
        <button type="button" className="text-btn" onClick={onClose}>
          Вернуться к делу
        </button>
      ) : null}
    </section>
  )
}
