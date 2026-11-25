export const officeWidth = 352
export const officeHeight = 208
export const playerStart = { x: 176, y: 94 }

export const furnishings = {
  desk: { x: 72, y: 54, w: 68, h: 29 },
  deskChair: { x: 100, y: 80 },
  bookshelf: { x: 286, y: 15, w: 37, h: 29 },
  sofa: { x: 239, y: 63, w: 69, h: 24 },
  billiards: { x: 56, y: 117, w: 90, h: 41 },
  arcade: { x: 160, y: 42, w: 33, h: 25 },
  chess: { x: 248, y: 116, w: 36, h: 34 },
  chessChair: { x: 259, y: 153 },
  certificateFrames: { x: 201, y: 7, w: 32, h: 17 },
  plants: [[27, 29], [315, 144]],
} as const

const { desk, deskChair, bookshelf, sofa, billiards, arcade, chess, chessChair, plants } = furnishings
const footprint = [
  desk, bookshelf, { ...sofa, y: sofa.y - 5, h: sofa.h + 5 }, billiards, arcade, chess,
  { x: deskChair.x - 3, y: deskChair.y + 4, w: 26, h: 18 },
  { x: chessChair.x, y: chessChair.y + 4, w: 15, h: 18 },
  ...plants.map(([x, y]) => ({ x: x + 2, y: y + 8, w: 11, h: 12 })),
]

export function canWalk(x: number, y: number) {
  const radius = 4
  return x >= radius + 3 && x <= officeWidth - radius - 3 && y >= 34 + radius && y <= officeHeight - radius - 5
    && !footprint.some(({ x: left, y: top, w, h }) =>
      x + radius > left && x - radius < left + w && y + radius > top && y - radius < top + h)
}

export type OfficePoint = { x: number; y: number }
export type OfficeInventory = 'gear' | 'certificates'

export function officeInventoryAt(point: OfficePoint): OfficeInventory | null {
  const isNear = ({ x, y, w, h }: typeof desk | typeof furnishings.certificateFrames) => {
    const dx = Math.max(x - point.x, 0, point.x - x - w)
    const dy = Math.max(y - point.y, 0, point.y - y - h)
    return Math.hypot(dx, dy) <= 26
  }
  if (isNear(desk)) return 'gear'
  if (isNear(furnishings.certificateFrames)) return 'certificates'
  return null
}

export function officePath(from: OfficePoint, to: OfficePoint): OfficePoint[] {
  const x = Math.round(to.x)
  const y = Math.round(to.y)
  if (!canWalk(x, y)) return []

  const start = Math.round(from.y) * officeWidth + Math.round(from.x)
  const goal = y * officeWidth + x
  const visited = new Int32Array(officeWidth * officeHeight).fill(-1)
  const queue = [start]
  visited[start] = start
  for (let i = 0; i < queue.length && visited[goal] === -1; i++) {
    const tile = queue[i]
    for (const next of [tile - 1, tile + 1, tile - officeWidth, tile + officeWidth]) {
      if (visited[next] !== -1 || !canWalk(next % officeWidth, Math.floor(next / officeWidth))) continue
      visited[next] = tile
      queue.push(next)
    }
  }
  if (visited[goal] === -1) return []
  const path: OfficePoint[] = [{ x, y }]
  for (let tile = goal; tile !== start;) {
    const previous = visited[tile]
    if (previous - tile !== visited[previous] - previous) {
      path.push({ x: previous % officeWidth, y: Math.floor(previous / officeWidth) })
    }
    tile = previous
  }
  return path.reverse()
}
