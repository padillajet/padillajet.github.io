import { useEffect, useRef } from 'react'
import { drawAvatar, drawOffice, officeGameProps, painter } from './officeArt'
import { canWalk, furnishings, officeHeight, officeInventoryAt, officeWidth, playerStart } from './officeLayout'
import type { OfficeInventory } from './officeLayout'
import { atlasUrl, drawOfficePortrait, drawOfficeWorker, drawPackClock, officePackProps } from './officePack'
import type { Direction } from './officePack'
import { npcDialogue, officeNpcs } from './officeNpcs'
import type { OfficeNpc } from './officeNpcs'

const canvasWidth = 528
const canvasHeight = 312
const zoom = 2
const walkSpeed = 60
const movementKeys = new Set(['KeyW', 'KeyA', 'KeyS', 'KeyD', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'])

type Actor = {
  npc?: OfficeNpc
  x: number
  y: number
  stride: number
  facing: number
  own: boolean
}

function drawInteractionGlow(ctx: CanvasRenderingContext2D, x: number, y: number, radius: number, aspect: number, nearby: boolean) {
  ctx.save()
  ctx.translate(x, y)
  ctx.scale(1, aspect)
  ctx.globalAlpha = nearby ? .43 : .25
  const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, radius)
  glow.addColorStop(0, '#fff2bd')
  glow.addColorStop(.52, '#fff2bd')
  glow.addColorStop(.76, '#fff2bd80')
  glow.addColorStop(1, '#fff2bd00')
  ctx.fillStyle = glow
  ctx.fillRect(-radius, -radius, radius * 2, radius * 2)
  ctx.restore()
}

function drawBubble(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, npc: OfficeNpc, atlas?: HTMLImageElement) {
  const nameFont = 'bold 11px system-ui, sans-serif'
  const messageFont = '11px system-ui, sans-serif'
  const label = npc.name + ':'
  ctx.textAlign = 'left'
  ctx.textBaseline = 'alphabetic'
  ctx.font = nameFont
  const nameWidth = Math.ceil(ctx.measureText(label).width)
  ctx.font = messageFont
  const width = Math.ceil(Math.min(270, 38 + nameWidth + ctx.measureText(text).width))
  const left = Math.round(Math.min(canvasWidth - width - 4, Math.max(4, x - width / 2)))
  const height = 25
  const above = y - 52 - height >= 4 || y + 9 + height > canvasHeight - 4
  const top = above ? y - 52 - height : y + 9
  const paint = painter(ctx)
  const ink = '#514e5b'
  const tip = Math.round(Math.min(left + width - 10, Math.max(left + 10, x)))
  const seam = above ? top + height - 1 : top
  const outward = above ? 1 : -1
  for (let step = 0; step < 4; step++) {
    paint(ink, tip - 4 + step, seam + step * outward, 9 - step * 2, 1)
  }
  // Squared pixel corners soften the outline without blurring the artwork.
  paint(ink, left + 4, top, width - 8, height)
  paint(ink, left + 2, top + 1, width - 4, height - 2)
  paint(ink, left, top + 3, width, height - 6)
  paint('#fff', left + 4, top + 1, width - 8, height - 2)
  paint('#fff', left + 1, top + 4, width - 2, height - 8)
  paint('#fff', left + 2, top + 2, width - 4, height - 4)
  for (let step = 0; step < 3; step++) {
    paint('#fff', tip - 3 + step, seam + step * outward, 7 - step * 2, 1)
  }
  paint('#f0f1f5', left + 5, top + 4, 20, 17)
  if (atlas) drawOfficePortrait(ctx, atlas, npc.sprite, left + 8, top + 5)
  const baseline = top + 16
  ctx.font = nameFont
  ctx.fillStyle = '#4b405d'
  ctx.fillText(label, left + 30, baseline)
  ctx.font = messageFont
  ctx.fillStyle = '#272832'
  ctx.fillText(text, left + 34 + nameWidth, baseline, width - 38 - nameWidth)
}

type OfficeCanvasProps = {
  inventoryOpen: boolean
  onOpenInventory: (inventory: OfficeInventory) => void
  onCloseInventory: () => void
  onNearbyInventoryChange: (inventory: OfficeInventory | null) => void
}

export default function OfficeCanvas({ inventoryOpen, onOpenInventory, onCloseInventory, onNearbyInventoryChange }: OfficeCanvasProps) {
  const canvas = useRef<HTMLCanvasElement>(null)
  const showingInventory = useRef(inventoryOpen)
  useEffect(() => { showingInventory.current = inventoryOpen }, [inventoryOpen])

  useEffect(() => {
    const element = canvas.current
    const ctx = element?.getContext('2d')
    const dialog = element?.closest('dialog')
    if (!ctx || !dialog) return
    const set = document.createElement('canvas')
    set.width = officeWidth
    set.height = officeHeight
    const scene = set.getContext('2d')
    if (!scene) return
    drawOffice(scene)
    ctx.imageSmoothingEnabled = false
    const paint = painter(ctx)
    const atlas = new Image()
    let spriteReady = false
    const gameProps = officeGameProps(ctx).sort((a, b) => a.y - b.y)
    let roomProps = gameProps
    atlas.onload = () => {
      drawOffice(scene, true)
      scene.imageSmoothingEnabled = false
      drawPackClock(scene, atlas)
      roomProps = [...gameProps, ...officePackProps(ctx, atlas)].sort((a, b) => a.y - b.y)
      spriteReady = true
    }
    atlas.src = atlasUrl
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const { desk, certificateFrames } = furnishings
    const keys = new Set<string>()
    const player = { ...playerStart, direction: 'down' as Direction }
    let nearbyInventory: OfficeInventory | null = null
    let frame: number
    let last: number | undefined
    let started: number | undefined

    function editing(target: EventTarget | null) {
      return target instanceof HTMLElement && (target.isContentEditable || Boolean(target.closest('input, textarea, select')))
    }
    function press(event: KeyboardEvent) {
      if (editing(event.target) || event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return
      if (showingInventory.current) {
        if (event.key === 'Escape' || event.code === 'KeyE') {
          event.preventDefault()
          if (!event.repeat) onCloseInventory()
        }
        return
      }
      if (event.code === 'KeyE') {
        event.preventDefault()
        const inventory = officeInventoryAt(player)
        if (!event.repeat && inventory) {
          showingInventory.current = true
          keys.clear()
          onOpenInventory(inventory)
        }
        return
      }
      if (!movementKeys.has(event.code)) return
      event.preventDefault()
      keys.add(event.code)
    }
    function release(event: KeyboardEvent) { keys.delete(event.code) }
    function clearKeys() { keys.clear() }
    function focus(event: FocusEvent) { if (editing(event.target)) clearKeys() }
    dialog.addEventListener('keydown', press)
    dialog.addEventListener('focusin', focus)
    window.addEventListener('keyup', release)
    window.addEventListener('blur', clearKeys)
    document.addEventListener('visibilitychange', clearKeys)

    function draw(time: number) {
      frame = requestAnimationFrame(draw)
      if (!ctx || document.hidden) return
      if (showingInventory.current) {
        last = time
        return
      }
      started ??= time
      const step = Math.min(.04, (time - (last ?? time)) / 1000) * walkSpeed
      last = time
      const dx = Number(keys.has('KeyD') || keys.has('ArrowRight')) - Number(keys.has('KeyA') || keys.has('ArrowLeft'))
      const dy = Number(keys.has('KeyS') || keys.has('ArrowDown')) - Number(keys.has('KeyW') || keys.has('ArrowUp'))
      const distance = step / (Math.hypot(dx, dy) || 1)
      const beforeX = player.x
      const beforeY = player.y
      if (dx !== 0 || dy !== 0) {
        if (canWalk(player.x + dx * distance, player.y)) player.x += dx * distance
        if (canWalk(player.x, player.y + dy * distance)) player.y += dy * distance
        player.direction = dx < 0 ? 'left' : dx > 0 ? 'right' : dy < 0 ? 'up' : 'down'
      }
      const moving = beforeX !== player.x || beforeY !== player.y
      const target = officeInventoryAt(player)
      if (nearbyInventory !== target) {
        nearbyInventory = target
        onNearbyInventoryChange(target)
      }
      const viewWidth = canvasWidth / zoom
      const viewHeight = canvasHeight / zoom
      const cameraX = Math.round(Math.max(0, Math.min(officeWidth - viewWidth, player.x - viewWidth / 2)))
      const cameraY = Math.round(Math.max(0, Math.min(officeHeight - viewHeight, player.y - 12 - viewHeight / 2)))
      ctx.setTransform(zoom, 0, 0, zoom, -cameraX * zoom, -cameraY * zoom)
      ctx.drawImage(set, 0, 0)
      drawInteractionGlow(ctx, desk.x + desk.w / 2, desk.y + desk.h - 26, 60, .82, nearbyInventory === 'gear')
      drawInteractionGlow(ctx, certificateFrames.x + certificateFrames.w / 2, certificateFrames.y + certificateFrames.h / 2,
        30, .7, nearbyInventory === 'certificates')
      const elapsed = time - started
      const actors: Actor[] = officeNpcs(elapsed, motion.matches).map(npc => ({
        npc,
        x: npc.x,
        y: npc.y,
        stride: npc.moving ? Math.round(Math.sin(elapsed / 75)) : 0,
        facing: npc.facing === 'left' ? -1 : npc.facing === 'right' ? 1 : 0,
        own: false,
      }))
      actors.push({
        x: Math.round(player.x),
        y: Math.round(player.y),
        stride: moving && !motion.matches ? Math.round(Math.sin(elapsed / 75)) : 0,
        facing: player.direction === 'left' ? -1 : player.direction === 'right' ? 1 : 0,
        own: true,
      })
      actors.sort((a, b) => a.y - b.y || Number(a.own) - Number(b.own))
      let propIndex = 0
      for (const { npc, x, y, stride, facing, own } of actors) {
        while (propIndex < roomProps.length && roomProps[propIndex].y <= y) roomProps[propIndex++].draw()
        if (spriteReady && (own || npc)) {
          drawOfficeWorker(ctx, atlas, x, y, npc?.facing ?? player.direction,
            !motion.matches && (npc?.moving ?? moving), motion.matches ? 0 : elapsed, npc?.sprite)
        } else {
          drawAvatar(paint, x, y, npc?.sprite ?? 2, stride, facing, own)
        }
      }
      while (propIndex < roomProps.length) roomProps[propIndex++].draw()

      ctx.resetTransform()
      const dialogue = npcDialogue(elapsed, motion.matches)
      const npcSpeaker = dialogue && actors.find(({ npc, x, y }) =>
        npc?.name === dialogue.name && x > cameraX + 4 && x < cameraX + viewWidth - 4
        && y > cameraY + 25 && y < cameraY + viewHeight - 3)
      if (dialogue && npcSpeaker?.npc) {
        drawBubble(ctx, dialogue.text, (npcSpeaker.x - cameraX) * zoom, (npcSpeaker.y - cameraY) * zoom,
          npcSpeaker.npc, spriteReady ? atlas : undefined)
      }
    }
    frame = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(frame)
      atlas.onload = null
      dialog.removeEventListener('keydown', press)
      dialog.removeEventListener('focusin', focus)
      window.removeEventListener('keyup', release)
      window.removeEventListener('blur', clearKeys)
      document.removeEventListener('visibilitychange', clearKeys)
    }
  }, [onCloseInventory, onNearbyInventoryChange, onOpenInventory])

  return <canvas ref={canvas} className="pixel-canvas" width={canvasWidth} height={canvasHeight} tabIndex={-1} inert={inventoryOpen}
    onPointerDown={event => event.currentTarget.focus({ preventScroll: true })}
    role="img" aria-label="Jet's pixel office. Use WASD or the arrow keys to walk. Press E by the desk for My Gear or the wall frames for Certificates." />
}
