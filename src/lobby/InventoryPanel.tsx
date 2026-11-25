import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import type { OfficeInventory } from './officeLayout'

const titles: Record<OfficeInventory, string> = {
  gear: 'My Gear',
  certificates: 'My Certificates',
}

export default function InventoryPanel({ kind, children, onBack }: {
  kind: OfficeInventory
  children: ReactNode
  onBack: () => void
}) {
  const back = useRef<HTMLButtonElement>(null)
  useEffect(() => { back.current?.focus({ preventScroll: true }) }, [])

  return <section className="pixel-inventory" data-kind={kind} aria-labelledby="pixel-inventory-title">
    <div className="pixel-inventory-heading">
      <h2 id="pixel-inventory-title">{titles[kind]}</h2>
      <button type="button" ref={back} onClick={onBack}>Back to office</button>
    </div>
    <ul className="pixel-inventory-grid" tabIndex={0} aria-label={titles[kind]}>
      {children}
    </ul>
  </section>
}
