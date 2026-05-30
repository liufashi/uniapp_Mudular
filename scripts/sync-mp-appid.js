/**
 * 从环境变量同步微信小程序 appid 到 manifest.json
 * 用法：node scripts/sync-mp-appid.js [--mode development|staging|production]
 */
const fs = require('fs')
const path = require('path')
const { loadEnv } = require('./load-env')

const root = path.resolve(__dirname, '..')
const manifestPath = path.join(root, 'src/manifest.json')

const modeArg = process.argv.find((arg) => arg.startsWith('--mode='))
const mode = modeArg ? modeArg.split('=')[1] : 'development'
const env = loadEnv({ mode, root })
const appid = env.VITE_MP_WEIXIN_APPID || ''
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))

if (!manifest['mp-weixin']) {
  manifest['mp-weixin'] = {}
}

if (appid) {
  manifest['mp-weixin'].appid = appid
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n')
  console.log(`[sync-mp-appid] mode=${mode} 已写入 appid: ${appid}`)
} else {
  console.log(`[sync-mp-appid] mode=${mode} 未配置 VITE_MP_WEIXIN_APPID，跳过`)
}
