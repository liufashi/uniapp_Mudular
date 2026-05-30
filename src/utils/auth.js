import { AUTH_REQUIRED_PAGES, LOGIN_PAGE } from '../config/auth'
import { getStoredToken } from '../store/auth'

export function isLoggedIn() {
  return !!getStoredToken()
}

export function redirectToLogin(redirectPath = '') {
  const base = LOGIN_PAGE
  const url = redirectPath
    ? `${base}?redirect=${encodeURIComponent(redirectPath)}`
    : base

  uni.navigateTo({ url })
}

export function ensureLoggedIn(redirectPath = '') {
  if (isLoggedIn()) return true
  redirectToLogin(redirectPath)
  return false
}

export function guardCurrentPage() {
  const pages = getCurrentPages()
  const current = pages[pages.length - 1]
  const route = current?.route

  if (!route || !AUTH_REQUIRED_PAGES.includes(route)) {
    return true
  }

  return ensureLoggedIn('/' + route)
}
