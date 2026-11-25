import { useEffect, useRef } from 'react'
import { gearItems } from '../data/gear'
import type { GearId } from '../data/gear'
import { drawGearSprite, gearSpriteSize } from './gearArt'
import InventoryPanel from './InventoryPanel'

function GearSprite({ id }: { id: GearId }) {
  const canvas = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const ctx = canvas.current?.getContext('2d')
    if (ctx) drawGearSprite(ctx, id)
  }, [id])

  return <canvas ref={canvas} className="pixel-gear-sprite" width={gearSpriteSize.width}
    height={gearSpriteSize.height} aria-hidden="true" />
}

export default function GearPreview({ onBack }: { onBack: () => void }) {
  return <InventoryPanel kind="gear" onBack={onBack}>
    {gearItems.map(({ id, name, detail }) => <li key={id}>
      <GearSprite id={id} />
      <strong>{name}</strong>
      <span>{detail}</span>
    </li>)}
  </InventoryPanel>
}
