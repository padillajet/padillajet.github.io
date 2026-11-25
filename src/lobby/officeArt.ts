type Paint = (color: string, x: number, y: number, w: number, h: number) => void

import { furnishings, officeHeight, officeWidth } from './officeLayout'

const ink = '#363548'
const steel = ['#4c4d64', '#71738b', '#a8aabb', '#d9dbe0']
const oak = ['#8d655b', '#aa845e', '#cfac79', '#e8ca98']
const leaf = ['#354c43', '#476653', '#63835a', '#8eab70']
const colors = ['#e29481', '#e6ba66', '#62a195', '#8276a2', '#6795cb']

export function painter(ctx: CanvasRenderingContext2D): Paint {
  return (color, x, y, w, h) => { ctx.fillStyle = color; ctx.fillRect(x, y, w, h) }
}

function panel(p: Paint, x: number, y: number, w: number, h: number, palette = steel) {
  p(ink, x, y, w, h)
  p(palette[1], x + 1, y + 1, w - 2, h - 2)
  p(palette[2], x + 1, y + 1, w - 2, h - 4)
  p(palette[3], x + 2, y + 2, w - 4, 1)
  p(palette[0], x + 2, y + h - 3, w - 4, 1)
}

function windowFrame(p: Paint, x: number, y: number, w: number) {
  panel(p, x, y, w, 20, oak)
  p('#85869b', x + 3, y + 3, w - 6, 13)
  p('#a9a9b9', x + 3, y + 3, w - 6, 10)
  for (const offset of [4, w - 10]) {
    for (let i = 0; i < 6; i++) {
      p('#d2d4df', x + offset + i, y + 12 - i, 3, 1)
      p('#ece7ed', x + offset + i + 1, y + 10 - i, 1, 1)
    }
  }
  p('#f1d5af', x + Math.floor(w / 2), y + 2, 2, 15)
  p('#f7e6c9', x + 2, y + 16, w - 4, 2)
}

function print(p: Paint, x: number, y: number, index: number) {
  panel(p, x, y, 14, 17, oak)
  p('#ece1c4', x + 3, y + 3, 8, 10)
  p(colors[index % colors.length], x + 4, y + 4, 6, 7)
  p('#f5dfa5', x + 5, y + 5, 2, 2)
  p('#576980', x + 4, y + 10, 6, 2)
}

function plant(p: Paint, x: number, y: number, small = false) {
  panel(p, x + 3, y + 12, 8, 8, small ? oak : steel)
  p(leaf[0], x + 2, y + 2, 10, 12)
  p(leaf[0], x, y + 5, 14, 7)
  p(leaf[1], x + 1, y + 5, 12, 5)
  p(leaf[1], x + 3, y + 3, 7, 9)
  p(leaf[2], x + 4, y + 3, 4, 3)
  p(leaf[3], x + 3, y + 5, 2, 2)
  p(leaf[2], x + 9, y + 6, 3, 3)
  p(leaf[2], x + 2, y + 9, 3, 2)
  p(leaf[1], x + 5, y + 11, 6, 4)
  p(leaf[3], x + 6, y + 8, 2, 3)
}

function chair(p: Paint, x: number, y: number, faceBack: boolean) {
  p('#79798466', x + 2, y + 18, 12, 3)
  p(ink, x + 5, y + 14, 4, 8)
  p(ink, x + 3, y + 19, 8, 2)
  panel(p, x + 1, y + (faceBack ? 5 : 0), 13, 15)
  p(steel[0], x + 3, y + 3 + (faceBack ? 5 : 0), 9, 6)
  p(steel[1], x + 4, y + 4 + (faceBack ? 5 : 0), 7, 3)
  p(ink, x, y + 10, 2, 6)
  p(ink, x + 13, y + 10, 2, 6)
  p('#82859c', x + 1, y + 10, 1, 4)
  p('#82859c', x + 13, y + 10, 1, 4)
}

function screen(p: Paint, x: number, y: number, color: string) {
  p(ink, x + 6, y + 9, 3, 5)
  p(steel[1], x + 4, y + 13, 7, 1)
  panel(p, x, y, 15, 11)
  p('#3b527f', x + 2, y + 2, 11, 6)
  p(color, x + 3, y + 3, 8, 1)
  p('#8cb4e0', x + 3, y + 5, 5, 1)
  p('#d2e3f3', x + 10, y + 6, 2, 1)
  p('#94bd91', x + 12, y + 9, 1, 1)
}

function chess(p: Paint, x: number, y: number) {
  panel(p, x, y, 36, 34, oak)
  p(ink, x + 5, y + 2, 26, 26)
  for (let row = 0; row < 8; row++) for (let file = 0; file < 8; file++) {
    const square = (row + file) % 2 ? '#8d7367' : '#e1c894'
    const sx = x + 6 + file * 3
    const sy = y + 3 + row * 3
    p(square, sx, sy, 3, 3)
    if (row === 0 || row === 7 || ((row === 1 || row === 6) && file % 3 !== 0)) {
      p('#63574c', sx, sy + 2, 3, 1)
      p(row < 4 ? '#363449' : '#fbefd3', sx + 1, sy, 1, 2)
    }
  }
}

function poolTable(p: Paint) {
  const { x, y, w, h } = furnishings.billiards
  p('#564a4f55', x + 4, y + h - 5, w - 4, 8)
  p(ink, x + 5, y + h - 11, 6, 11)
  p(ink, x + w - 11, y + h - 11, 6, 11)
  panel(p, x, y, w, h - 4, ['#745052', '#845957', '#aa795e', '#d5a878'])
  p('#354944', x + 5, y + 5, w - 10, h - 16)
  p('#528779', x + 7, y + 7, w - 14, h - 20)
  p('#629687', x + 9, y + 8, w - 18, 1)
  p('#497c6d', x + 10, y + h - 14, w - 20, 1)
  for (const px of [x + 4, x + w / 2 - 2, x + w - 8]) {
    for (const py of [y + 4, y + h - 13]) {
      p('#473d44', px, py, 5, 5)
      p('#292532', px + 1, py + 1, 3, 3)
    }
  }
  for (const [dx, dy, color] of [[25, 16, '#f0ede0'], [57, 16, '#e0b75f'], [61, 14, '#d6836d'],
    [61, 18, '#354353'], [65, 12, '#679bd2'], [65, 16, '#a483bb'], [65, 20, '#dd9b69']] as const) {
    p('#386c5e', x + dx + 1, y + dy + 1, 3, 3)
    p(color, x + dx, y + dy, 3, 3)
    p('#fff2ce99', x + dx, y + dy, 1, 1)
  }
  p('#664852', x + 18, y + h - 5, 40, 1)
}

function arcadeCabinet(p: Paint) {
  const { x, y, w, h } = furnishings.arcade
  const top = y - 17
  const cabinet = ['#3c3651', '#665475', '#8973a0', '#c6a0c3']
  p('#50485a55', x + 3, y + h - 2, w - 2, 5)
  panel(p, x + 2, top, w - 4, h + 17, cabinet)
  p('#413650', x + 4, top + 9, w - 8, 25)
  panel(p, x + 5, top + 3, w - 10, 8, ['#546575', '#7281a3', '#9bb4bb', '#d1d7ca'])
  p('#f1cb80', x + 9, top + 6, 4, 2)
  p('#e295a0', x + 15, top + 6, 4, 2)
  p('#b9dac6', x + 21, top + 6, 3, 2)
  p('#292939', x + 6, top + 13, w - 12, 13)
  p('#405975', x + 8, top + 15, w - 16, 9)
  p('#a3cec7', x + 15, top + 17, 3, 4)
  p('#a3cec7', x + 13, top + 20, 7, 2)
  p('#f0c886', x + 10, top + 16, 1, 1)
  p('#bfd5d7', x + 22, top + 18, 1, 1)
  panel(p, x, top + 27, w, 8, cabinet)
  p('#30283c', x + 8, top + 28, 2, 4)
  p('#e19aa0', x + 7, top + 27, 4, 2)
  p('#e5bc7f', x + 20, top + 30, 3, 2)
  p('#a5d3bb', x + 25, top + 30, 3, 2)
  p('#3b3349', x + 13, top + 36, 7, 4)
  p('#d8bf9a', x + 15, top + 37, 3, 1)
}

export function officeGameProps(ctx: CanvasRenderingContext2D) {
  const p = painter(ctx)
  const { arcade, billiards, certificateFrames, chess: chessTable, chessChair } = furnishings
  return [
    { y: certificateFrames.y + certificateFrames.h, draw: () => {
      print(p, certificateFrames.x, certificateFrames.y, 2)
      print(p, certificateFrames.x + certificateFrames.w - 14, certificateFrames.y, 0)
    } },
    { y: arcade.y + arcade.h, draw: () => arcadeCabinet(p) },
    { y: billiards.y + billiards.h, draw: () => poolTable(p) },
    { y: chessTable.y + chessTable.h, draw: () => chess(p, chessTable.x, chessTable.y) },
    { y: chessChair.y + 22, draw: () => chair(p, chessChair.x, chessChair.y, true) },
  ]
}

export function drawOffice(ctx: CanvasRenderingContext2D, packedProps = false) {
  const p = painter(ctx)
  const { desk, deskChair, bookshelf, sofa, plants } = furnishings
  p('#aaa7a3', 0, 0, officeWidth, officeHeight)
  for (let y = 34; y < officeHeight; y += 16) {
    for (let x = 0; x < officeWidth; x += 16) {
      p((x / 16 + (y - 34) / 16) % 2 ? '#aea9a1' : '#b5afa6', x, y, 16, 16)
      p('#c2bbb0', x, y, 16, 1)
      p('#bcb4aa', x, y, 1, 16)
      p('#d1c9be66', x + 3, y + 4, 9, 1)
      p('#d1c9be44', x + 5, y + 11, 6, 1)
    }
  }

  // The runner ties the pool and chess corners together.
  p('#96918e60', 51, 108, 246, 77)
  p('#666273', 49, 106, 246, 77)
  p('#82758b', 51, 108, 242, 73)
  p('#9b8ea1', 55, 112, 234, 65)
  for (let y = 114; y < 176; y += 4) p('#b8a9b855', 57, y, 230, 1)
  for (const x of [52, 291]) {
    for (let y = 111; y < 179; y += 5) p('#d9bfac', x, y, 2, 2)
  }

  p(ink, 0, 0, officeWidth, 35)
  p('#d8d3d5', 2, 2, officeWidth - 4, 28)
  p('#e9e3e4', 2, 3, officeWidth - 4, 2)
  for (let y = 7; y < 28; y += 4) p('#e2dadd', 3, y, officeWidth - 6, 1)
  p('#8a8188', 2, 30, officeWidth - 4, 4)
  p('#c7bfc2', 2, 30, officeWidth - 4, 1)
  p('#847e8055', 2, 35, officeWidth - 4, 3)
  windowFrame(p, 66, 6, 44)
  windowFrame(p, 113, 6, 44)
  panel(p, 163, 12, 30, 11, oak)
  ctx.fillStyle = '#473b3c'
  ctx.font = 'bold 5px monospace'
  ctx.textAlign = 'center'
  ctx.fillText('JET P.', 178, 19)

  panel(p, bookshelf.x, bookshelf.y, bookshelf.w, bookshelf.h, oak)
  for (let row = 0; row < 2; row++) {
    const shelfY = bookshelf.y + 4 + row * 11
    p('#7e6058', bookshelf.x + 3, shelfY, bookshelf.w - 6, 9)
    for (let book = 0; book < 6; book++) {
      const bookX = bookshelf.x + 5 + book * 4
      const top = shelfY + (book + row) % 3
      p(colors[(book + row * 2) % colors.length], bookX, top, 3, shelfY + 8 - top)
      p('#f2dec0', bookX, shelfY + 6, 2, 1)
    }
    p('#e4bc8f', bookshelf.x + 3, shelfY + 8, bookshelf.w - 6, 1)
  }

  if (!packedProps) {
    p('#6c5d5355', desk.x + 2, desk.y + 25, desk.w, 7)
    panel(p, desk.x, desk.y, desk.w, desk.h, oak)
    for (let y = desk.y + 6; y < desk.y + desk.h - 4; y += 3) {
      p('#bb926c', desk.x + 4, y, desk.w - 8, 1)
    }
    screen(p, desk.x + 19, 47, '#7bb5da')
    screen(p, desk.x + 38, 46, '#8cc5ab')
    p(ink, 107, 66, 23, 6)
    for (let key = 0; key < 10; key++) p('#d1cccb', 109 + key * 2, 67, 1, 2)
    panel(p, desk.x + desk.w - 20, 67, 5, 7)
    p('#f1e4c8', desk.x + desk.w - 16, 61, 14, 10)
    p('#89766f', desk.x + desk.w - 14, 63, 8, 1)
    p('#a59486', desk.x + desk.w - 14, 66, 6, 1)
    p(ink, 74, 60, 3, 11)
    p(ink, 70, 70, 11, 2)
    p('#a76153', 69, 53, 12, 8)
    p('#d18b67', 71, 53, 8, 2)
    p('#faf1cd', 71, 60, 8, 1)
    chair(p, deskChair.x, deskChair.y, true)
  }

  const fabric = ['#435659', '#577074', '#719194', '#9ab5ab']
  panel(p, sofa.x, sofa.y, sofa.w, sofa.h, fabric)
  panel(p, sofa.x + 2, sofa.y - 5, sofa.w - 4, 11, fabric)
  for (const cushion of [7, 26, 45]) panel(p, sofa.x + cushion, sofa.y + 7, 17, 13, fabric)
  for (const arm of [0, sofa.w - 6]) panel(p, sofa.x + arm, sofa.y + 5, 6, 18, fabric)
  p('#dfb480', sofa.x + 52, sofa.y + 3, 7, 8)
  p('#f2d5a4', sofa.x + 53, sofa.y + 4, 5, 1)
  if (!packedProps) for (const [x, y] of plants) plant(p, x, y)

  // A door mat and threshold mark the front of the office.
  panel(p, 149, 188, 54, 15, ['#75685d', '#927c68', '#a48d74', '#c5ad8d'])
  p(ink, 0, 1, 3, officeHeight)
  p(ink, officeWidth - 3, 1, 3, officeHeight)
  p(ink, 0, officeHeight - 4, 154, 4)
  p(ink, 198, officeHeight - 4, officeWidth - 198, 4)
  p('#756d77', 154, officeHeight - 3, 44, 3)
}

const avatarColors = [
  ['#3f455a', '#66748b', '#e3ac88', '#94a4c4'],
  ['#574156', '#ad7292', '#f2bd9e', '#e494a5'],
  ['#3b4b50', '#3e818c', '#b78263', '#73aab3'],
  ['#664a3c', '#b17c56', '#efb586', '#8a9cbe'],
]

export function drawAvatar(p: Paint, x: number, y: number, variant: number, stride: number, facing: number, own: boolean) {
  const [hairShadow, hair, skin, shirt] = avatarColors[variant % avatarColors.length]
  p('#4a49535a', x - 7, y, 14, 2)
  if (own) p('#d7efc9', x - 7, y + 2, 14, 1)
  for (const side of [-1, 1]) {
    const leg = x + (side < 0 ? -4 : 1)
    p(ink, leg, y - 7 + stride * side, 3, 7)
    p('#676e89', leg, y - 6 + stride * side, 2, 3)
    p('#d5c6bf', leg, y - 2 + stride * side, 3, 1)
  }
  p(ink, x - 5, y - 13, 10, 8)
  p(shirt, x - 4, y - 12, 8, 5)
  p('#e7dfd9', x - 1, y - 12, 2, 2)
  p(hairShadow, x - 3, y - 7, 6, 1)
  p(ink, x - 6, y - 12 + stride, 2, 5)
  p(ink, x + 4, y - 12 - stride, 2, 5)
  p(skin, x - 6, y - 9 + stride, 1, 2)
  p(skin, x + 5, y - 9 - stride, 1, 2)

  p(ink, x - 3, y - 23, 6, 12)
  p(ink, x - 6, y - 20, 12, 8)
  p(hairShadow, x - 5, y - 20, 10, 7)
  p(hair, x - 4, y - 22, 8, 5)
  p(hair, x - 5, y - 20, 10, 3)
  p('#efe3d747', x - 3, y - 21, 4, 1)
  p(skin, x - 4 + facing, y - 16, 8, 4)
  p(hair, x - 4, y - 17, facing < 0 ? 2 : 4, 2)
  p(hairShadow, x + 3, y - 17, 2, 3)
  p(ink, x + facing - 2, y - 15, 1, 1)
  p(ink, x + facing + 2, y - 15, 1, 1)
  p('#936c61', x + facing, y - 13, 2, 1)
}
