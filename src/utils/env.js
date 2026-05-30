export function getAppEnv() {
  return import.meta.env.VITE_APP_ENV || import.meta.env.MODE || 'development'
}

export function getApiBase() {
  return import.meta.env.VITE_API_BASE || ''
}

export function useMock() {
  return import.meta.env.VITE_USE_MOCK === 'true'
}

/**
 * 按模块判断是否使用 Mock
 * 优先级：VITE_MOCK_{MODULE} > VITE_USE_MOCK
 * @param {'user'|'home'|string} module
 */
export function useMockModule(module) {
  const envKey = `VITE_MOCK_${String(module).toUpperCase()}`
  const moduleValue = import.meta.env[envKey]

  if (moduleValue === 'true') return true
  if (moduleValue === 'false') return false
  return useMock()
}

export function isDevelopment() {
  return import.meta.env.DEV || getAppEnv() === 'development'
}

export function isStaging() {
  return getAppEnv() === 'staging'
}

export function isProduction() {
  return import.meta.env.PROD || getAppEnv() === 'production'
}
