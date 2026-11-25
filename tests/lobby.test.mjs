import assert from 'node:assert/strict'
import { test } from 'node:test'
import { canWalk, furnishings, officeInventoryAt, officePath, officeWidth, playerStart } from '../src/lobby/officeLayout.ts'
import { npcDialogue, officeNpcs } from '../src/lobby/officeNpcs.ts'

test('the compact office has a clear spawn and solid walls and furniture', () => {
  assert.equal(canWalk(playerStart.x, playerStart.y), true)
  for (const { x, y, w, h } of [furnishings.desk, furnishings.sofa, furnishings.chess, furnishings.billiards, furnishings.arcade]) {
    assert.equal(canWalk(x + w / 2, y + h / 2), false)
  }
  assert.equal(canWalk(officeWidth / 2, 0), false)
})

test('office paths route around furniture', () => {
  const origin = { x: 35, y: 68 }
  const destination = { x: 212, y: 68 }
  const path = officePath(origin, destination)
  assert.deepEqual(path.at(-1), destination)
  assert.ok(path.length > 2)
  let last = origin
  for (const point of path) {
    const distance = Math.abs(point.x - last.x) + Math.abs(point.y - last.y)
    for (let step = 1; step <= distance; step++) {
      assert.ok(canWalk(last.x + (point.x - last.x) * step / distance, last.y + (point.y - last.y) * step / distance))
    }
    last = point
  }
  assert.deepEqual(officePath(playerStart, furnishings.desk), [])
  for (const table of [furnishings.billiards, furnishings.arcade, furnishings.chess]) {
    const approach = { x: table.x - 6, y: table.y + Math.floor(table.h / 2) }
    assert.deepEqual(officePath(playerStart, approach).at(-1), approach)
  }
})

test('the desk and certificate frames open different inventories from reachable floor tiles', () => {
  const { desk, certificateFrames } = furnishings
  const gear = { x: desk.x + desk.w + 9, y: desk.y + desk.h }
  const certificates = { x: certificateFrames.x + certificateFrames.w / 2, y: 43 }
  assert.equal(officeInventoryAt(playerStart), null)
  for (const [kind, approach] of Object.entries({ gear, certificates })) {
    assert.equal(canWalk(approach.x, approach.y), true)
    assert.equal(officeInventoryAt(approach), kind)
    assert.deepEqual(officePath(playerStart, approach).at(-1), approach)
  }
})

test('office NPCs stay on clear paths and face a partner when talking', () => {
  const start = officeNpcs(0, false)
  let previous = start
  for (let at = 100; at <= 42000; at += 100) {
    const current = officeNpcs(at, false)
    current.forEach((npc, i) => {
      assert.equal(canWalk(npc.x, npc.y), true, npc.name + ' at ' + at)
      assert.ok(Math.hypot(npc.x - previous[i].x, npc.y - previous[i].y) < 8, npc.name + ' at ' + at)
    })
    previous = current
  }
  assert.equal(officeNpcs(10000, false).some(npc => npc.moving), true)
  assert.deepEqual(officeNpcs(10000, true), start)
  for (const time of [1500, 4800, 15400, 18200]) {
    const dialogue = npcDialogue(time, false)
    const [wilster, diether] = officeNpcs(time, false)
    assert.equal(dialogue?.name, time === 1500 || time === 15400 ? 'Wilster' : 'Diether')
    assert.equal(wilster.moving || diether.moving, false)
    assert.equal(wilster.facing, 'right')
    assert.equal(diether.facing, 'left')
    assert.equal(wilster.y, diether.y)
  }
})
