import { getApiBase } from '@/utils/env'
import { TOKEN_KEY } from '@/store/auth'
import { handleSessionExpired } from '@/utils/session'
import { isSuccessCode, resolveErrorMessage } from '@/constants/errorCode'

let loadingCount = 0

export function joinUrl(base, path) {
  if (!base) return path
  if (/^https?:\/\//.test(path)) return path
  const normalizedBase = base.replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBase}${normalizedPath}`
}

export function buildRequestUrl(url) {
  return joinUrl(getApiBase(), url)
}

/** 请求拦截：注入 Token 与默认 Header */
export function applyRequestInterceptor(config) {
  const token = uni.getStorageSync(TOKEN_KEY)
  const header = {
    'Content-Type': 'application/json',
    ...config.header
  }

  if (config.auth !== false && token) {
    header.Authorization = `Bearer ${token}`
  }

  return {
    ...config,
    header,
    url: buildRequestUrl(config.url)
  }
}

/** 响应拦截：解析业务响应体 */
export function normalizeResponseBody(body) {
  if (body && typeof body === 'object' && 'code' in body) {
    if (isSuccessCode(body.code)) {
      return body.data
    }
    const message = resolveErrorMessage(body)
    const error = new Error(message)
    error.code = body.code
    error.response = body
    throw error
  }
  return body
}

/** 响应拦截：处理 HTTP 状态码 */
export function handleHttpStatus(statusCode, body, config) {
  if (statusCode === 401) {
    handleSessionExpired({ redirect: config.showError })
    const error = new Error('Unauthorized')
    error.statusCode = 401
    throw error
  }

  if (statusCode < 200 || statusCode >= 300) {
    const message = resolveErrorMessage(body, `HTTP ${statusCode}`)
    const error = new Error(message)
    error.statusCode = statusCode
    error.response = body
    throw error
  }
}

export function showErrorToast(message) {
  if (!message) return
  uni.showToast({ title: message, icon: 'none' })
}

export function createLoadingGuard(title = '加载中...') {
  if (loadingCount === 0) {
    uni.showLoading({ title, mask: true })
  }
  loadingCount += 1

  let closed = false
  return () => {
    if (closed) return
    closed = true
    loadingCount = Math.max(0, loadingCount - 1)
    if (loadingCount === 0) {
      uni.hideLoading()
    }
  }
}

export function buildRequestKey(config) {
  const { method = 'GET', url, data } = config
  return `${method}:${url}:${JSON.stringify(data || {})}`
}
