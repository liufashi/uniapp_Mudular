/**
 * 从 .env.local 同步微信小程序 appid 到 manifest.json
 * 用法：node scripts/sync-mp-appid.js
 */
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const envPath = path.join(root, '.env.local')
const manifestPath = path.join(root, 'src/manifest.json')

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {}

  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .reduce((acc, line) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return acc
      const index = trimmed.indexOf('=')
      if (index === -1) return acc
      const key = trimmed.slice(0, index).trim()
      const value = trimmed.slice(index + 1).trim()
      acc[key] = value
      return acc
    }, {})
}

const env = {
  ...readEnvFile(path.join(root, '.env.example')),
  ...readEnvFile(envPath)
}

const appid = env.VITE_MP_WEIXIN_APPID || ''
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))

if (!manifest['mp-weixin']) {
  manifest['mp-weixin'] = {}
}

if (appid) {
  manifest['mp-weixin'].appid = appid
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
  console.log(`[sync-mp-appid] 已写入 appid: ${appid}`)
} else {
  console.log('[sync-mp-appid] 未配置 VITE_MP_WEIXIN_APPID，跳过（请在 .env.local 填写）')
}
