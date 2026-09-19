import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

const COLS = 3
const ROWS = 3
const SNAP = 0.24
const TAB = 20

const H_EDGES = [
  [1, -1],
  [-1, 1],
  [1, 1],
]

const V_EDGES = [
  [1, -1, 1],
  [-1, 1, -1],
]

const FILLS = [
  'rgba(15,27,45,0.055)',
  'rgba(107,124,147,0.11)',
  'rgba(232,93,76,0.08)',
  'rgba(15,27,45,0.07)',
  'rgba(107,124,147,0.08)',
  'rgba(226,230,236,0.72)',
  'rgba(15,27,45,0.05)',
  'rgba(232,93,76,0.055)',
  'rgba(107,124,147,0.13)',
]

const START = [
  { x: 0.035, y: 0.17 },
  { x: 0.4, y: 0.055 },
  { x: 0.8, y: 0.13 },
  { x: 0.02, y: 0.44 },
  { x: 0.84, y: 0.4 },
  { x: 0.05, y: 0.7 },
  { x: 0.74, y: 0.68 },
  { x: 0.36, y: 0.8 },
  { x: 0.88, y: 0.58 },
]

function sidesFor(col, row) {
  return {
    t: row === 0 ? 0 : -V_EDGES[row - 1][col],
    r: col === COLS - 1 ? 0 : H_EDGES[row][col],
    b: row === ROWS - 1 ? 0 : V_EDGES[row][col],
    l: col === 0 ? 0 : -H_EDGES[row][col - 1],
  }
}

function puzzlePath(size, { t, r, b, l }) {
  const u = size / 100
  const k = (value) => value * u

  let d = `M ${k(0)} ${k(0)}`

  if (t === 0) d += ` L ${k(100)} ${k(0)}`
  else {
    d += ` L ${k(38)} ${k(0)}`
    d += ` C ${k(40)} ${k(-8 * t)}, ${k(32)} ${k(-20 * t)}, ${k(50)} ${k(-20 * t)}`
    d += ` C ${k(68)} ${k(-20 * t)}, ${k(60)} ${k(-8 * t)}, ${k(62)} ${k(0)}`
    d += ` L ${k(100)} ${k(0)}`
  }

  if (r === 0) d += ` L ${k(100)} ${k(100)}`
  else {
    d += ` L ${k(100)} ${k(38)}`
    d += ` C ${k(100 + 8 * r)} ${k(40)}, ${k(100 + 20 * r)} ${k(32)}, ${k(100 + 20 * r)} ${k(50)}`
    d += ` C ${k(100 + 20 * r)} ${k(68)}, ${k(100 + 8 * r)} ${k(60)}, ${k(100)} ${k(62)}`
    d += ` L ${k(100)} ${k(100)}`
  }

  if (b === 0) d += ` L ${k(0)} ${k(100)}`
  else {
    d += ` L ${k(62)} ${k(100)}`
    d += ` C ${k(60)} ${k(100 + 8 * b)}, ${k(68)} ${k(100 + 20 * b)}, ${k(50)} ${k(100 + 20 * b)}`
    d += ` C ${k(32)} ${k(100 + 20 * b)}, ${k(40)} ${k(100 + 8 * b)}, ${k(38)} ${k(100)}`
    d += ` L ${k(0)} ${k(100)}`
  }

  if (l === 0) d += ` L ${k(0)} ${k(0)}`
  else {
    d += ` L ${k(0)} ${k(62)}`
    d += ` C ${k(-8 * l)} ${k(60)}, ${k(-20 * l)} ${k(68)}, ${k(-20 * l)} ${k(50)}`
    d += ` C ${k(-20 * l)} ${k(32)}, ${k(-8 * l)} ${k(40)}, ${k(0)} ${k(38)}`
    d += ` L ${k(0)} ${k(0)}`
  }

  return `${d} Z`
}

function pieceSize(width, height) {
  return Math.round(Math.min(108, Math.max(58, Math.min(width, height) * 0.092)))
}

function makePieces(width, height, size) {
  return Array.from({ length: COLS * ROWS }, (_, id) => {
    const col = id % COLS
    const row = Math.floor(id / COLS)
    const start = START[id]
    return {
      id,
      col,
      row,
      sides: sidesFor(col, row),
      x: start.x * (width - size),
      y: Math.max(76, start.y * (height - size)),
    }
  })
}

function groupOf(id, links) {
  const seen = new Set([id])
  const queue = [id]
  while (queue.length) {
    const current = queue.pop()
    for (const [a, b] of links) {
      const next = a === current ? b : b === current ? a : null
      if (next == null || seen.has(next)) continue
      seen.add(next)
      queue.push(next)
    }
  }
  return seen
}

function neighborIds(piece) {
  const next = []
  if (piece.col > 0) next.push(piece.id - 1)
  if (piece.col < COLS - 1) next.push(piece.id + 1)
  if (piece.row > 0) next.push(piece.id - COLS)
  if (piece.row < ROWS - 1) next.push(piece.id + COLS)
  return next
}

function clampGroup(origins, moving, dx, dy, width, height, size) {
  let shiftX = dx
  let shiftY = dy
  const pad = 10
  const top = 80

  moving.forEach((id) => {
    const origin = origins.get(id)
    if (!origin) return
    const x = origin.x + shiftX
    const y = origin.y + shiftY
    if (x < pad) shiftX += pad - x
    if (y < top) shiftY += top - y
    if (x > width - size - pad) shiftX -= x - (width - size - pad)
    if (y > height - size - pad) shiftY -= y - (height - size - pad)
  })

  return { dx: shiftX, dy: shiftY }
}

function snapMoving(pieces, moving, links, size) {
  const threshold = size * SNAP
  const nextLinks = links.map((pair) => pair.slice())
  let nextPieces = pieces.map((piece) => ({ ...piece }))
  let guard = 0

  while (guard < 12) {
    guard += 1
    let hit = null

    for (const id of moving) {
      const piece = nextPieces[id]
      for (const otherId of neighborIds(piece)) {
        if (moving.has(otherId)) continue
        const other = nextPieces[otherId]
        const wantX = piece.x + (other.col - piece.col) * size
        const wantY = piece.y + (other.row - piece.row) * size
        const dist = Math.hypot(other.x - wantX, other.y - wantY)
        if (dist > threshold) continue
        hit = {
          dx: other.x - wantX,
          dy: other.y - wantY,
          a: Math.min(id, otherId),
          b: Math.max(id, otherId),
        }
        break
      }
      if (hit) break
    }

    if (!hit) break

    nextPieces = nextPieces.map((piece) =>
      moving.has(piece.id) ? { ...piece, x: piece.x + hit.dx, y: piece.y + hit.dy } : piece,
    )
    if (!nextLinks.some(([a, b]) => a === hit.a && b === hit.b)) {
      nextLinks.push([hit.a, hit.b])
    }
  }

  return { pieces: nextPieces, links: nextLinks }
}

export default function HeroPuzzle() {
  const hostRef = useRef(null)
  const boxRef = useRef({ w: 0, h: 0 })
  const piecesRef = useRef([])
  const linksRef = useRef([])
  const dragRef = useRef(null)
  const reduce = useReducedMotion()
  const [pieces, setPieces] = useState([])
  const [links, setLinks] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [size, setSize] = useState(88)

  piecesRef.current = pieces
  linksRef.current = links

  const paths = useMemo(
    () => pieces.map((piece) => puzzlePath(size, piece.sides)),
    [pieces, size],
  )

  const grouped = useMemo(() => {
    const counts = new Map()
    pieces.forEach((piece) => {
      counts.set(piece.id, groupOf(piece.id, links).size)
    })
    return counts
  }, [pieces, links])

  const onPointerMove = useCallback((event) => {
    const drag = dragRef.current
    const host = hostRef.current
    if (!drag || !host) return
    const { dx, dy } = clampGroup(
      drag.origins,
      drag.group,
      event.clientX - drag.startX,
      event.clientY - drag.startY,
      host.clientWidth,
      host.clientHeight,
      drag.size,
    )
    setPieces((current) =>
      current.map((piece) => {
        if (!drag.group.has(piece.id)) return piece
        const origin = drag.origins.get(piece.id)
        if (!origin) return piece
        return { ...piece, x: origin.x + dx, y: origin.y + dy }
      }),
    )
  }, [])

  const endDrag = useCallback((event) => {
    const drag = dragRef.current
    if (!drag) return
    if (event.currentTarget?.hasPointerCapture?.(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    const snapped = snapMoving(piecesRef.current, drag.group, linksRef.current, drag.size)
    setPieces(snapped.pieces)
    setLinks(snapped.links)
    dragRef.current = null
    setActiveId(null)
  }, [])

  useEffect(() => {
    const host = hostRef.current
    if (!host) return undefined

    const layout = () => {
      const width = host.clientWidth
      const height = host.clientHeight
      if (!width || !height) return
      const prev = boxRef.current
      if (prev.w === width && prev.h === height) return
      const nextSize = pieceSize(width, height)
      setSize(nextSize)
      setPieces((current) => {
        if (!current.length || !prev.w) return makePieces(width, height, nextSize)
        const sx = width / prev.w
        const sy = height / prev.h
        return current.map((piece) => ({
          ...piece,
          x: piece.x * sx,
          y: piece.y * sy,
        }))
      })
      boxRef.current = { w: width, h: height }
    }

    layout()
    const observer = new ResizeObserver(layout)
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  function onPointerDown(event, id) {
    if (event.button != null && event.button !== 0) return
    event.preventDefault()
    event.stopPropagation()
    const group = groupOf(id, linksRef.current)
    const origins = new Map(
      piecesRef.current
        .filter((piece) => group.has(piece.id))
        .map((piece) => [piece.id, { x: piece.x, y: piece.y }]),
    )
    dragRef.current = {
      group,
      startX: event.clientX,
      startY: event.clientY,
      origins,
      size,
    }
    setActiveId(id)
    try {
      event.currentTarget.setPointerCapture(event.pointerId)
    } catch {
      /* untrusted pointer events cannot capture */
    }
  }

  const pad = size * (TAB / 100) + 4

  return (
    <div
      ref={hostRef}
      className="absolute inset-0 z-[1] overflow-hidden pointer-events-none"
      aria-label="Interactive puzzle. Drag the pieces together."
    >
      {pieces.map((piece, index) => {
        const live = !reduce && (grouped.get(piece.id) || 1) === 1
        const dragging = activeId != null && groupOf(activeId, links).has(piece.id)
        return (
          <div
            key={piece.id}
            className={`absolute left-0 top-0 pointer-events-auto touch-none select-none ${
              dragging ? 'cursor-grabbing' : 'cursor-grab'
            } ${live ? 'hero-piece-live' : 'hero-piece-set'}`}
            style={{
              width: size,
              height: size,
              transform: `translate3d(${piece.x}px, ${piece.y}px, 0)`,
              zIndex: dragging ? 5 : 1,
              animationDelay: live ? `${index * -0.38}s` : undefined,
            }}
            aria-label={`Puzzle piece ${index + 1}`}
            role="img"
            onPointerDown={(event) => onPointerDown(event, piece.id)}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <svg
              width={size + pad * 2}
              height={size + pad * 2}
              viewBox={`${-pad} ${-pad} ${size + pad * 2} ${size + pad * 2}`}
              className="absolute overflow-visible"
              style={{ left: -pad, top: -pad }}
            >
              <path
                d={paths[index]}
                fill={FILLS[index]}
                stroke="rgba(15,27,45,0.16)"
                strokeWidth="1.15"
              />
            </svg>
          </div>
        )
      })}
    </div>
  )
}
