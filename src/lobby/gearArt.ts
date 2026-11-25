import type { GearId } from '../data/gear'

export const gearSpriteSize = { width: 48, height: 32 } as const

type Paint = (color: string, x: number, y: number, width: number, height: number) => void

const ink = '#302d3b'
const caseDark = '#414352'
const caseLight = '#69717f'
const ice = '#a2c9cf'
const gold = '#e8be73'
const green = '#78b1a0'

const sprites: Record<GearId, (p: Paint) => void> = {
  laptop(p) {
    p(ink, 9, 4, 30, 20)
    p(caseLight, 10, 4, 28, 1)
    p('#37465d', 11, 6, 26, 15)
    p('#4b5f78', 12, 7, 24, 13)
    p('#9ab7c8', 13, 8, 22, 1)
    p('#3a4c64', 13, 10, 22, 9)
    p(ice, 15, 12, 9, 1)
    p(green, 15, 14, 14, 1)
    p('#ac9dc6', 15, 16, 7, 1)
    p(ink, 6, 23, 36, 5)
    p(ink, 4, 25, 40, 3)
    p(caseLight, 7, 24, 34, 2)
    p('#9b9eaa', 5, 27, 38, 1)
    p(caseDark, 19, 25, 10, 2)
    p(ice, 22, 22, 4, 1)
  },
  monitor(p) {
    p(ink, 5, 3, 38, 21)
    p(caseLight, 6, 3, 36, 1)
    p('#3d4b60', 7, 5, 34, 16)
    p('#52627a', 8, 6, 32, 14)
    for (let i = 0; i < 5; i++) p('#8499a7', 9 + i * 2, 8 + i, 5, 1)
    p('#657d87', 28, 16, 11, 1)
    p(caseLight, 7, 22, 34, 1)
    p(green, 39, 22, 2, 1)
    p(ink, 22, 24, 5, 5)
    p(caseLight, 23, 24, 2, 4)
    p(ink, 17, 28, 14, 2)
    p(caseDark, 14, 29, 20, 1)
  },
  phone(p) {
    p('#84765c', 9, 4, 15, 24)
    p('#b7ab80', 10, 3, 13, 26)
    p('#e9daaa', 10, 4, 13, 23)
    p('#d6deab', 11, 16, 12, 11)
    p(ink, 12, 6, 7, 9)
    p(caseLight, 13, 7, 3, 3)
    p(caseLight, 13, 11, 3, 3)
    p(ice, 14, 8, 1, 1)
    p(ice, 14, 12, 1, 1)
    p(ink, 22, 3, 16, 26)
    p(caseLight, 24, 2, 12, 1)
    p('#e8ac61', 24, 5, 12, 21)
    p('#f0ca74', 24, 5, 9, 13)
    p('#f1daa1', 24, 17, 12, 8)
    p('#f8ebce', 24, 21, 12, 5)
    p(ink, 28, 5, 4, 2)
    p('#dddadd', 27, 26, 6, 1)
  },
  keyboard(p) {
    p(ink, 4, 9, 40, 15)
    p(caseLight, 5, 9, 38, 2)
    p(caseDark, 5, 11, 38, 10)
    p('#777989', 6, 23, 36, 1)
    const backlight = ['#c599a8', ice, green, gold]
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 12; col++) {
        const x = 6 + col * 3
        const y = 11 + row * 3
        p('#515766', x, y, 2, 2)
        p(backlight[row], x, y, 1, 1)
      }
    }
    p(ink, 14, 20, 19, 3)
    p('#797e90', 15, 20, 17, 2)
    p(gold, 20, 21, 7, 1)
  },
  mouse(p) {
    p(ink, 18, 3, 12, 2)
    p(ink, 15, 5, 18, 21)
    p(ink, 18, 26, 12, 3)
    p(caseDark, 16, 6, 16, 18)
    p('#535868', 17, 6, 14, 9)
    p(caseDark, 19, 23, 10, 3)
    p(ink, 23, 5, 2, 10)
    p(caseLight, 23, 8, 2, 4)
    p(ink, 17, 15, 14, 1)
    p(green, 23, 20, 3, 2)
    p(gold, 17, 25, 3, 1)
    p(green, 20, 26, 8, 2)
    p(ice, 28, 25, 3, 1)
  },
  earphone(p) {
    p('#9babae', 14, 18, 2, 4)
    p('#9babae', 15, 22, 5, 1)
    p('#9babae', 19, 23, 2, 2)
    p('#9babae', 32, 18, 2, 6)
    p('#9babae', 27, 23, 5, 2)
    p('#9babae', 20, 25, 8, 1)
    p('#9babae', 23, 26, 2, 4)
    for (const x of [9, 27]) {
      p(caseLight, x + 2, 7, 7, 1)
      p(caseLight, x + 1, 8, 1, 4)
      p(caseLight, x + 9, 8, 1, 5)
      p(ink, x, 12, 11, 6)
      p(ink, x + 2, 18, 8, 2)
      p(caseDark, x + 1, 13, 9, 5)
      p(caseLight, x + 9, 14, 3, 3)
      p(gold, x + 3, 15, 2, 1)
      p(gold, x + 5, 14, 1, 1)
    }
  },
}

export function drawGearSprite(ctx: CanvasRenderingContext2D, id: GearId) {
  ctx.clearRect(0, 0, gearSpriteSize.width, gearSpriteSize.height)
  sprites[id]((color, x, y, width, height) => {
    ctx.fillStyle = color
    ctx.fillRect(x, y, width, height)
  })
}
