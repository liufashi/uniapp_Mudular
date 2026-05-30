/**
 * 生成 tabBar 图标（81x81，纯 Node，无依赖）
 * 用法：node scripts/generate-tab-icons.js
 */
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

const SIZE = 81
const outputDir = path.resolve(__dirname, '../src/static/tab')

function crc32(buffer) {
  let crc = 0xffffffff
  for (let i = 0; i < buffer.length; i += 1) {
    crc ^= buffer[i]
    for (let j = 0; j < 8; j += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
    }
  }
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const length = Buffer.alloc(4)
  length.writeUInt32BE(data.length, 0)
  const typeBuffer = Buffer.from(type)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 0)
  return Buffer.concat([length, typeBuffer, data, crc])
}

function encodePng(pixels) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(SIZE, 0)
  ihdr.writeUInt32BE(SIZE, 4)
  ihdr[8] = 8
  ihdr[9] = 6
  ihdr[10] = 0
  ihdr[11] = 0
  ihdr[12] = 0

  const rowSize = 1 + SIZE * 4
  const raw = Buffer.alloc(rowSize * SIZE)
  for (let y = 0; y < SIZE; y += 1) {
    const rowStart = y * rowSize
    raw[rowStart] = 0
    for (let x = 0; x < SIZE; x += 1) {
      const src = (y * SIZE + x) * 4
      const dst = rowStart + 1 + x * 4
      raw[dst] = pixels[src]
      raw[dst + 1] = pixels[src + 1]
      raw[dst + 2] = pixels[src + 2]
      raw[dst + 3] = pixels[src + 3]
    }
  }

  return Buffer.concat([
    signature,
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0))
  ])
}

function createCanvas() {
  return new Uint8Array(SIZE * SIZE * 4)
}

function setPixel(pixels, x, y, color) {
  if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return
  const index = (y * SIZE + x) * 4
  pixels[index] = color[0]
  pixels[index + 1] = color[1]
  pixels[index + 2] = color[2]
  pixels[index + 3] = color[3]
}

function fillRect(pixels, x, y, w, h, color) {
  for (let py = y; py < y + h; py += 1) {
    for (let px = x; px < x + w; px += 1) {
      setPixel(pixels, px, py, color)
    }
  }
}

function fillPolygon(pixels, points, color) {
  const ys = points.map((point) => point[1])
  const minY = Math.max(0, Math.floor(Math.min(...ys)))
  const maxY = Math.min(SIZE - 1, Math.ceil(Math.max(...ys)))

  for (let y = minY; y <= maxY; y += 1) {
    const intersections = []
    for (let i = 0; i < points.length; i += 1) {
      const [x1, y1] = points[i]
      const [x2, y2] = points[(i + 1) % points.length]
      if ((y1 <= y && y2 > y) || (y2 <= y && y1 > y)) {
        const x = x1 + ((y - y1) * (x2 - x1)) / (y2 - y1)
        intersections.push(x)
      }
    }
    intersections.sort((a, b) => a - b)
    for (let i = 0; i < intersections.length; i += 2) {
      const start = Math.max(0, Math.floor(intersections[i]))
      const end = Math.min(SIZE - 1, Math.ceil(intersections[i + 1]))
      for (let x = start; x <= end; x += 1) {
        setPixel(pixels, x, y, color)
      }
    }
  }
}

function fillCircle(pixels, cx, cy, radius, color) {
  for (let y = Math.floor(cy - radius); y <= Math.ceil(cy + radius); y += 1) {
    for (let x = Math.floor(cx - radius); x <= Math.ceil(cx + radius); x += 1) {
      const dx = x - cx
      const dy = y - cy
      if (dx * dx + dy * dy <= radius * radius) {
        setPixel(pixels, x, y, color)
      }
    }
  }
}

function drawHome(color) {
  const pixels = createCanvas()
  fillPolygon(pixels, [
    [40, 16],
    [66, 38],
    [66, 66],
    [14, 66],
    [14, 38]
  ], color)
  fillRect(pixels, 30, 42, 20, 24, [255, 255, 255, 255])
  return pixels
}

function drawMine(color) {
  const pixels = createCanvas()
  fillCircle(pixels, 40, 28, 12, color)
  fillCircle(pixels, 40, 62, 20, color)
  fillRect(pixels, 0, 0, SIZE, 46, [0, 0, 0, 0])
  fillCircle(pixels, 40, 28, 12, color)
  return pixels
}

function writeIcon(filename, pixels) {
  fs.writeFileSync(path.join(outputDir, filename), encodePng(pixels))
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

const gray = [153, 153, 153, 255]
const blue = [0, 122, 255, 255]

writeIcon('home.png', drawHome(gray))
writeIcon('home-active.png', drawHome(blue))
writeIcon('mine.png', drawMine(gray))
writeIcon('mine-active.png', drawMine(blue))

console.log('[generate-tab-icons] 已生成 81x81 tabBar 图标')
