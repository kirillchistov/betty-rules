import type { Route } from '../router'

const links: { name: Route['name']; href: string; label: string }[] = [
  { name: 'now', href: '#/now', label: 'Сейчас' },
  { name: 'zine', href: '#/zine', label: 'Затея' },
  { name: 'things', href: '#/things', label: 'Мои затеи' },
]

export function Nav({ current }: { current: Route['name'] }) {
  return (
    <nav className="nav" aria-label="Разделы">
      {links.map((link) => (
        <a key={link.href} href={link.href} className={current === link.name ? 'active' : undefined} aria-current={current === link.name ? 'page' : undefined}>
          {link.label}
        </a>
      ))}
    </nav>
  )
}
