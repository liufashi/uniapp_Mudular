export function getApiBase() {
  return import.meta.env.VITE_API_BASE || ''
}

export function useMock() {
  return import.meta.env.VITE_USE_MOCK === 'true'
}
