const fs = require('fs')
const path = require('path')

// 读取 src/pages.json
const pagesJson = JSON.parse(fs.readFileSync('src/pages.json', 'utf8'))
const appJson = {
  pages: pagesJson.pages.map(p => p.path)
}

// 读取 manifest.json 获取 appid
const manifest = JSON.parse(fs.readFileSync('src/manifest.json', 'utf8'))

// 创建 dist/dev/mp-weixin 目录
const outputDir = 'dist/dev/mp-weixin'
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true })
}

// 写入 app.json
fs.writeFileSync(path.join(outputDir, 'app.json'), JSON.stringify(appJson, null, 2))

// 写入 project.config.json
const projectConfig = {
  description: 'uniapp project',
  packOptions: { ignore: [], include: [] },
  setting: {
    es6: true,
    postcss: true,
    minified: true,
    uglifyFileName: false,
    enhance: false,
    packNpmManually: false,
    packNpmRelationList: [],
    minifyWXSS: true,
    minifyWXML: true,
    localPlugins: false,
    disableUseStrict: false,
    useCompilerPlugins: false,
    condition: false,
    swc: false,
    disableSWC: true,
    babelSetting: { ignore: [], disablePlugins: [], outputPath: '' }
  },
  compileType: 'miniprogram',
  appid: manifest['mp-weixin']?.appid || manifest.appid || '',
  projectname: manifest.name,
  simulatorPluginLibVersion: {},
  editorSetting: {}
}
fs.writeFileSync(path.join(outputDir, 'project.config.json'), JSON.stringify(projectConfig, null, 2))

// 写入 project.private.config.json
const privateConfig = {
  libVersion: '3.16.1',
  projectname: 'mp-weixin',
  setting: {
    urlCheck: true,
    coverView: true,
    lazyloadPlaceholderEnable: false,
    skylineRenderEnable: false,
    preloadBackgroundData: false,
    autoAudits: false,
    showShadowRootInWxmlPanel: true,
    compileHotReLoad: true
  }
}
fs.writeFileSync(path.join(outputDir, 'project.private.config.json'), JSON.stringify(privateConfig, null, 2))

// 为每个页面创建 json 文件
pagesJson.pages.forEach(page => {
  const pagePath = page.path.replace('pages/', '')
  const pageDir = path.join(outputDir, path.dirname(page.path))
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true })
  }
  const pageJsonPath = path.join(outputDir, page.path + '.json')
  const pageJson = {
    usingComponents: {},
    style: page.style || {}
  }
  fs.writeFileSync(pageJsonPath, JSON.stringify(pageJson, null, 2))
})

console.log('小程序配置生成完成！')