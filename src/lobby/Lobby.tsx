import { useCallback, useRef, useState } from 'react'
import CertificatesPreview from './CertificatesPreview'
import GearPreview from './GearPreview'
import OfficeCanvas from './OfficeCanvas'
import type { OfficeInventory } from './officeLayout'

const inventoryHints: Record<OfficeInventory, string> = {
  gear: 'E: My Gear',
  certificates: 'E: My Certificates',
}

export default function Lobby() {
  const [nearby, setNearby] = useState<OfficeInventory | null>(null)
  const [inventory, setInventory] = useState<OfficeInventory | null>(null)
  const room = useRef<HTMLDivElement>(null)

  const closeInventory = useCallback(() => {
    setInventory(null)
    requestAnimationFrame(() => room.current?.querySelector<HTMLCanvasElement>('.pixel-canvas')?.focus({ preventScroll: true }))
  }, [])

  return <>
    <div className="pixel-room" ref={room} data-inventory-open={inventory ? '' : undefined}>
      <OfficeCanvas inventoryOpen={inventory !== null} onOpenInventory={setInventory}
        onCloseInventory={closeInventory} onNearbyInventoryChange={setNearby} />
      {inventory === 'gear' && <GearPreview onBack={closeInventory} />}
      {inventory === 'certificates' && <CertificatesPreview onBack={closeInventory} />}
    </div>
    <div className="pixel-caption">
      <a className="pixel-art-credit" href="https://imersastudios.itch.io/office-pixel-art" target="_blank" rel="noreferrer">Office Pixel Art by Imersa Studios</a>
      {inventory
        ? <p>E or Esc to return to the office</p>
        : <p>WASD or arrows to move · <span role="status">{nearby ? inventoryHints[nearby] : 'Approach the desk or wall frames'}</span> · Esc to close</p>}
    </div>
  </>
}
