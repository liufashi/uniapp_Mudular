import { LOGIN_PAGE } from '../config/auth'

let logoutHandler = null

export function registerLogoutHandler(handler) {
  logoutHandler = handler
}

export function handleSessionExpired({ redirect = true } = {}) {
  if (typeof logoutHandler === 'function') {
    logoutHandler()
  }

  if (!redirect) return

  uni.showToast({ title: '登录已过期', icon: 'none' })

  setTimeout(() => {
    const pages = getCurrentPages()
    const currentRoute = pages[pages.length - 1]?.route
    const loginRoute = LOGIN_PAGE.replace(/^\//, '')

    if (currentRoute === loginRoute) return

    uni.navigateTo({
      url: `${LOGIN_PAGE}?redirect=${encodeURIComponent('/' + (currentRoute || 'pages/index/index'))}`
    })
  }, 300)
}
