import {
  applyRequestInterceptor,
  buildRequestKey,
  createLoadingGuard,
  handleHttpStatus,
  normalizeResponseBody,
  showErrorToast
} from './interceptors'

const DEFAULT_TIMEOUT = 15000
const pendingTasks = new Map()

export function abortRequest(requestKey) {
  const task = pendingTasks.get(requestKey)
  if (task) {
    task.abort()
    pendingTasks.delete(requestKey)
  }
}

export function abortAllRequests() {
  pendingTasks.forEach((task) => task.abort())
  pendingTasks.clear()
}

export function request(options = {}) {
  const {
    url,
    method = 'GET',
    data,
    header = {},
    timeout = DEFAULT_TIMEOUT,
    showError = true,
    showLoading = false,
    loadingText = '加载中...',
    auth = true,
    dedupe = false,
    requestKey: customRequestKey
  } = options

  if (!url) {
    return Promise.reject(new Error('request url is required'))
  }

  const config = applyRequestInterceptor({
    url,
    method,
    data,
    header,
    timeout,
    showError,
    showLoading,
    loadingText,
    auth
  })

  const requestKey = customRequestKey || (dedupe ? buildRequestKey(config) : '')

  if (requestKey && pendingTasks.has(requestKey)) {
    pendingTasks.get(requestKey).abort()
    pendingTasks.delete(requestKey)
  }

  return new Promise((resolve, reject) => {
    const hideLoading = showLoading ? createLoadingGuard(loadingText) : () => {}

    const task = uni.request({
      url: config.url,
      method: config.method,
      data: config.data,
      header: config.header,
      timeout: config.timeout,
      success: (res) => {
        try {
          handleHttpStatus(res.statusCode, res.data, config)
          resolve(normalizeResponseBody(res.data))
        } catch (error) {
          if (showError) {
            showErrorToast(error.message)
          }
          reject(error)
        }
      },
      fail: (error) => {
        const message = error.errMsg || '网络异常，请稍后重试'
        if (showError) {
          showErrorToast(message)
        }
        reject(new Error(message))
      },
      complete: () => {
        hideLoading()
        if (requestKey) {
          pendingTasks.delete(requestKey)
        }
      }
    })

    if (requestKey) {
      pendingTasks.set(requestKey, task)
    }
  })
}

export default request
