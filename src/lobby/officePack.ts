import atlasUrl from './office-pixel-art.png'
import { furnishings } from './officeLayout'

export { atlasUrl }

export type Direction = 'down' | 'left' | 'right' | 'up'
const directionRows = { down: 0, left: 1, right: 2, up: 3 } as const
const workerVariantOffsets = [266, 394, 522]

// Crops of the free Imersa Studios artwork used in this room.
type Frame = readonly [x: number, y: number, width: number, height: number]
const frames = {
  desk: [128, 0, 68, 53],
  chair: [196, 0, 34, 42],
  computer: [230, 0, 32, 34],
  plant: [128, 53, 35, 57],
  lamp: [163, 53, 26, 33],
  mug: [189, 53, 15, 17],
  papers: [204, 53, 30, 30],
  clock: [234, 53, 32, 23],
} as const

function prop(ctx: CanvasRenderingContext2D, atlas: HTMLImageElement, frame: Frame, x: number, bottom: number, width = frame[2]) {
  const height = Math.round(frame[3] * width / frame[2])
  ctx.drawImage(atlas, ...frame, x, bottom - height, width, height)
}

export function drawPackClock(ctx: CanvasRenderingContext2D, atlas: HTMLImageElement) {
  prop(ctx, atlas, frames.clock, 252, 25, 24)
}

export function officePackProps(ctx: CanvasRenderingContext2D, atlas: HTMLImageElement) {
  const { desk, deskChair, plants } = furnishings
  const deskBottom = desk.y + desk.h
  const chairBottom = deskChair.y + 22
  return [
    {
      y: deskBottom,
      draw() {
        prop(ctx, atlas, frames.desk, desk.x, deskBottom, desk.w)
        const surface = deskBottom - 37
        prop(ctx, atlas, frames.lamp, desk.x + 5, surface - 1, 14)
        prop(ctx, atlas, frames.computer, desk.x + 24, surface + 2, 22)
        prop(ctx, atlas, frames.papers, desk.x + 49, surface + 5, 14)
        prop(ctx, atlas, frames.mug, desk.x + 18, surface + 5, 7)
      },
    },
    {
      y: chairBottom,
      draw() { prop(ctx, atlas, frames.chair, deskChair.x - 3, chairBottom, 26) },
    },
    ...plants.map(([x, y]) => ({
      y: y + 20,
      draw() { prop(ctx, atlas, frames.plant, x - 3, y + 20, 20) },
    })),
  ]
}

export function drawOfficePortrait(ctx: CanvasRenderingContext2D, atlas: HTMLImageElement, variant: number, x: number, y: number) {
  const offset = workerVariantOffsets[variant] ?? 0
  ctx.drawImage(atlas, offset + 8, 2, 16, 16, x, y, 14, 14)
}

export function drawOfficeWorker(ctx: CanvasRenderingContext2D, atlas: HTMLImageElement, x: number, y: number,
  direction: Direction, moving: boolean, elapsed: number, variant?: number) {
  const offset = variant === undefined ? 0 : workerVariantOffsets[variant] ?? 0
  ctx.fillStyle = '#4a49535a'
  ctx.fillRect(x - 7, y, 14, 2)
  if (variant === undefined) {
    ctx.fillStyle = '#d7efc9'
    ctx.fillRect(x - 7, y + 2, 14, 1)
  }
  const row = directionRows[direction] + (moving ? 4 : 0)
  const frame = Math.floor(elapsed / (moving ? 125 : 250)) % 4
  ctx.drawImage(atlas, offset + frame * 32, row * 32, 32, 32, x - 16, y - 30, 32, 32)
}
