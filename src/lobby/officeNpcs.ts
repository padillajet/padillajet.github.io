import { officePath } from './officeLayout.ts'
import type { OfficePoint } from './officeLayout.ts'
import type { Direction } from './officePack.ts'

const cycleLength = 42000
type Stop = readonly [at: number, x: number, y: number, facing: Direction]

const cast = [
  { name: 'Wilster', stops: [
    [0, 198, 83, 'right'], [6500, 198, 83, 'right'],
    [13700, 97, 170, 'right'], [21000, 97, 170, 'right'],
    [29100, 232, 137, 'right'], [33500, 232, 137, 'right'], [cycleLength, 198, 83, 'right'],
  ] },
  { name: 'Diether', stops: [
    [0, 224, 83, 'left'], [6500, 224, 83, 'left'],
    [13700, 127, 170, 'left'], [21000, 127, 170, 'left'],
    [29100, 292, 132, 'left'], [33500, 292, 132, 'left'], [cycleLength, 224, 83, 'left'],
  ] },
  { name: 'Jules', stops: [
    [0, 220, 147, 'up'], [4200, 220, 147, 'up'],
    [11200, 221, 53, 'right'], [15600, 221, 53, 'right'],
    [22400, 325, 110, 'left'], [25500, 325, 110, 'left'],
    [32500, 214, 189, 'up'], [36000, 214, 189, 'up'], [cycleLength, 220, 147, 'up'],
  ] },
] as const satisfies ReadonlyArray<{ name: string; stops: readonly Stop[] }>

function route(from: Stop, to: Stop) {
  const origin = { x: from[1], y: from[2] }
  const points = officePath(origin, { x: to[1], y: to[2] })
  const steps: { from: OfficePoint; to: OfficePoint; distance: number; facing: Direction }[] = []
  let previous = origin
  let length = 0
  for (const point of points) {
    const dx = point.x - previous.x
    const dy = point.y - previous.y
    const distance = Math.abs(dx) + Math.abs(dy)
    if (distance === 0) continue
    steps.push({ from: previous, to: point, distance, facing: dx < 0 ? 'left' : dx > 0 ? 'right' : dy < 0 ? 'up' : 'down' })
    length += distance
    previous = point
  }
  return { steps, length }
}

const schedules = cast.map(({ name, stops }, sprite) => ({
  name,
  sprite,
  legs: stops.slice(1).map((to, i) => ({ from: stops[i], to, ...route(stops[i], to) })),
}))

export function officeNpcs(elapsed: number, reducedMotion: boolean) {
  const phase = reducedMotion ? 0 : elapsed % cycleLength
  return schedules.map(({ name, sprite, legs }) => {
    const leg = legs.find(({ to }) => phase < to[0]) ?? legs[0]
    const { from, to, length, steps } = leg
    const [, x, y, facing] = from
    let remaining = (phase - from[0]) / (to[0] - from[0]) * length
    for (const step of steps) {
      if (remaining <= step.distance) {
        const progress = remaining / step.distance
        return {
          name, sprite,
          x: Math.round(step.from.x + (step.to.x - step.from.x) * progress),
          y: Math.round(step.from.y + (step.to.y - step.from.y) * progress),
          facing: step.facing, moving: true,
        }
      }
      remaining -= step.distance
    }
    return { name, sprite, x, y, facing, moving: false }
  })
}

export type OfficeNpc = ReturnType<typeof officeNpcs>[number]

const arcadeChats = [
  ['Did you beat the arcade score?', 'Almost. One more round.'],
  ['Quick game before lunch?', 'Only if I get first turn.'],
]
const poolChats = [
  ['Pool after this round?', "Sure. I'll rack the balls."],
  ['Your break or mine?', "Yours. I'll keep score."],
]

export function npcDialogue(elapsed: number, reducedMotion: boolean) {
  const phase = elapsed % cycleLength
  const round = Math.floor(elapsed / cycleLength)
  const byPool = !reducedMotion && phase >= 14100
  const chats = byPool ? poolChats : arcadeChats
  const lines = chats[round % chats.length]
  const time = phase - (byPool ? 13700 : 0)
  if (time >= 1000 && time < 3400) return { name: cast[0].name, text: lines[0] }
  if (time >= 3800 && time < 6200) return { name: cast[1].name, text: lines[1] }
}
