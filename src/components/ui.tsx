import { useEffect, useId, type ReactNode, type TextareaHTMLAttributes } from 'react'
import logoUrl from '../../assets/mhlogo.png'
import portraitUrl from '../../assets/sailor-photo.jpg'
import { useStore } from '../state/context'
import type { TimeChoice } from '../state/types'

export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ')
}

export function uid(): string {
  return crypto.randomUUID()
}

export function formatWhen(iso: string): string {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function isHttpLink(value: string): boolean {
  return /^https?:\/\//i.test(value.trim())
}

export function Logo({ className }: { className?: string }) {
  return <img className={cx('logo', className)} src={logoUrl} alt="" />
}

export function Portrait({ className }: { className?: string }) {
  return <img className={cx('portrait', className)} src={portraitUrl} alt="" />
}

export function ThemeSwitch() {
  const { state, update } = useStore()
  const collage = state.theme === 'collage'
  return (
    <button
      type="button"
      className="theme-switch"
      aria-pressed={collage}
      onClick={() => update((current) => ({ ...current, theme: collage ? 'lunar' : 'collage' }))}
    >
      {collage ? 'Коллаж' : 'Лунный'}
    </button>
  )
}

export function TopBar({
  back,
  title,
  extra,
}: {
  back?: string
  title?: string
  extra?: ReactNode
}) {
  return (
    <header className="topbar">
      {back ? (
        <a className="back" href={back}>
          Назад
        </a>
      ) : (
        <span className="brand">
          <Logo />
          <span className="wordmark">Мой курс</span>
        </span>
      )}
      {title ? <strong className="top-title">{title}</strong> : <span />}
      {extra ?? (
        <a className="gear" href="#/settings" aria-label="Настройки">
          <Gear />
        </a>
      )}
    </header>
  )
}

function Gear() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M10.2 2.6h3.6l.5 2.2a7.7 7.7 0 0 1 1.8 1l2.1-.9 1.8 3.1-1.7 1.5a8 8 0 0 1 0 2.1l1.7 1.5-1.8 3.1-2.1-.9a7.7 7.7 0 0 1-1.8 1l-.5 2.2h-3.6l-.5-2.2a7.7 7.7 0 0 1-1.8-1l-2.1.9-1.8-3.1 1.7-1.5a8 8 0 0 1 0-2.1L4 8l1.8-3.1 2.1.9a7.7 7.7 0 0 1 1.8-1l.5-2.2Zm1.8 6.1a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6Z"
      />
    </svg>
  )
}

export function Field({
  label,
  value,
  onChange,
  onBlur,
  multiline,
  placeholder,
  hint,
  maxLength,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (value: string) => void
  onBlur?: (value: string) => void
  multiline?: boolean
  placeholder?: string
  hint?: string
  maxLength?: number
  type?: string
}) {
  const id = useId()
  const shared = {
    id,
    value,
    maxLength,
    placeholder,
    onChange: (event: { target: { value: string } }) => onChange(event.target.value),
    onBlur: onBlur ? (event: { target: { value: string } }) => onBlur(event.target.value) : undefined,
  }
  return (
    <label className="field" htmlFor={id}>
      <span>{label}</span>
      {multiline ? (
        <textarea {...(shared as TextareaHTMLAttributes<HTMLTextAreaElement>)} rows={4} />
      ) : (
        <input {...shared} type={type} autoComplete="off" />
      )}
      {hint ? <small>{hint}</small> : null}
    </label>
  )
}

export function Dialog({
  title,
  text,
  confirm,
  cancel = 'Оставить',
  danger,
  onConfirm,
  onClose,
}: {
  title: string
  text: string
  confirm: string
  cancel?: string
  danger?: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="dialog-back" onClick={onClose} role="presentation">
      <div
        className="dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="dialog-title">{title}</h2>
        <p>{text}</p>
        <div className="dialog-actions">
          <button type="button" className="btn ghost" onClick={onClose}>
            {cancel}
          </button>
          <button type="button" className={cx('btn', danger && 'danger')} onClick={onConfirm}>
            {confirm}
          </button>
        </div>
      </div>
    </div>
  )
}

export function TimeNote({ choice }: { choice: TimeChoice | null }) {
  if (!choice) return null
  const text =
    choice === 'uncounted'
      ? 'Без счёта — нормальный вариант.'
      : `Около ${choice} минут, если захочешь. Это не таймер.`
  return <p className="hand note">{text}</p>
}

export function SaveWarning() {
  const { saveWarning } = useStore()
  if (!saveWarning) return null
  return (
    <p className="banner" role="status">
      В браузер не записалось. Пока это только на экране.
    </p>
  )
}
