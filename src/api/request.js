import { getApiBase } from '../utils/env'
import { TOKEN_KEY } from '../store/auth'

const DEFAULT_TIMEOUT = 15000

function joinUrl(base, path) {
  if (!base) return path
  if (/^https?:\/\//.test(path)) return path
  const normalizedBase = base.replace(/\/$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBase}${normalizedPath}`
}

function normalizeResponse(payload) {
  if (payload && typeof payload === 'object' && 'code' in payload) {
    if (payload.code === 0 || payload.code === 200) {
      return payload.data
    }
    throw new Error(payload.message || payload.msg || '请求失败')
  }
  return payload
}

export function request(options = {}) {
  const {
    url,
    method = 'GET',
    data,
    header = {},
    timeout = DEFAULT_TIMEOUT,
    showError = true,
    auth = true
  } = options

  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync(TOKEN_KEY)
    const finalHeader = {
      'Content-Type': 'application/json',
      ...header
    }

    if (auth && token) {
      finalHeader.Authorization = `Bearer ${token}`
    }

    uni.request({
      url: joinUrl(getApiBase(), url),
      method,
      data,
      header: finalHeader,
      timeout,
      success: (res) => {
        const { statusCode, data: body } = res

        if (statusCode === 401) {
          uni.removeStorageSync(TOKEN_KEY)
          if (showError) {
            uni.showToast({ title: '登录已过期', icon: 'none' })
          }
          reject(new Error('Unauthorized'))
          return
        }

        if (statusCode < 200 || statusCode >= 300) {
          const message = body?.message || body?.msg || `HTTP ${statusCode}`
          if (showError) {
            uni.showToast({ title: message, icon: 'none' })
          }
          reject(new Error(message))
          return
        }

        try {
          resolve(normalizeResponse(body))
        } catch (error) {
          if (showError) {
            uni.showToast({ title: error.message, icon: 'none' })
          }
          reject(error)
        }
      },
      fail: (error) => {
        const message = error.errMsg || '网络异常，请稍后重试'
        if (showError) {
          uni.showToast({ title: message, icon: 'none' })
        }
        reject(new Error(message))
      }
    })
  })
}

export default request
