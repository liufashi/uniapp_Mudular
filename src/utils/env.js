export function getAppEnv() {
  return import.meta.env.VITE_APP_ENV || import.meta.env.MODE || 'development'
}

export function getApiBase() {
  return import.meta.env.VITE_API_BASE || ''
}

export function useMock() {
  return import.meta.env.VITE_USE_MOCK === 'true'
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
