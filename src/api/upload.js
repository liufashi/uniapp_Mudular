import { getApiBase } from '@/utils/env'
import { TOKEN_KEY } from '@/store/auth'
import { handleSessionExpired } from '@/utils/session'
import {
  createLoadingGuard,
  joinUrl,
  normalizeResponseBody,
  showErrorToast
} from './interceptors'

function parseUploadResponse(raw) {
  if (typeof raw === 'string') {
    try {
      return JSON.parse(raw)
    } catch {
      return raw
    }
  }
  return raw
}

export function upload(options = {}) {
  const {
    url,
    filePath,
    name = 'file',
    formData = {},
    header = {},
    showError = true,
    showLoading = true,
    loadingText = '上传中...',
    auth = true
  } = options

  if (!url || !filePath) {
    return Promise.reject(new Error('upload url and filePath are required'))
  }

  const finalHeader = { ...header }
  if (auth) {
    const token = uni.getStorageSync(TOKEN_KEY)
    if (token) {
      finalHeader.Authorization = `Bearer ${token}`
    }
  }

  return new Promise((resolve, reject) => {
    const hideLoading = showLoading ? createLoadingGuard(loadingText) : () => {}

    uni.uploadFile({
      url: joinUrl(getApiBase(), url),
      filePath,
      name,
      formData,
      header: finalHeader,
      success: (res) => {
        try {
          if (res.statusCode === 401) {
            handleSessionExpired({ redirect: showError })
            reject(new Error('Unauthorized'))
            return
          }

          if (res.statusCode < 200 || res.statusCode >= 300) {
            const body = parseUploadResponse(res.data)
            const message = body?.message || body?.msg || `HTTP ${res.statusCode}`
            if (showError) {
              showErrorToast(message)
            }
            reject(new Error(message))
            return
          }

          resolve(normalizeResponseBody(parseUploadResponse(res.data)))
        } catch (error) {
          if (showError) {
            showErrorToast(error.message)
          }
          reject(error)
        }
      },
      fail: (error) => {
        const message = error.errMsg || '上传失败，请稍后重试'
        if (showError) {
          showErrorToast(message)
        }
        reject(new Error(message))
      },
      complete: () => {
        hideLoading()
      }
    })
  })
}

export default upload
