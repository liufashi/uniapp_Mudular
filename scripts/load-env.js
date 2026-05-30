const fs = require('fs')
const path = require('path')

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return {}

  return fs.readFileSync(filePath, 'utf8')
    .split('\n')
    .reduce((acc, line) => {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) return acc
      const index = trimmed.indexOf('=')
      if (index === -1) return acc
      const key = trimmed.slice(0, index).trim()
      let value = trimmed.slice(index + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      acc[key] = value
      return acc
    }, {})
}

/**
 * 按 Vite 规则合并环境变量（后者覆盖前者）
 * @param {object} options
 * @param {string} options.mode development | staging | production
 * @param {string} options.root 项目根目录
 */
function loadEnv({ mode = 'development', root = path.resolve(__dirname, '..') } = {}) {
  const files = [
    '.env',
    `.env.${mode}`,
    '.env.local',
    `.env.${mode}.local`
  ]

  return files.reduce((acc, file) => ({
    ...acc,
    ...parseEnvFile(path.join(root, file))
  }), {})
}

module.exports = {
  loadEnv,
  parseEnvFile
}
