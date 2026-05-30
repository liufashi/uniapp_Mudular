export const TOKEN_KEY = 'uniapp_token'
export const USER_INFO_KEY = 'uniapp_user_info'

export function getStoredToken() {
  return uni.getStorageSync(TOKEN_KEY) || ''
}

export function getStoredUserInfo() {
  const raw = uni.getStorageSync(USER_INFO_KEY)
  if (!raw) return null
  if (typeof raw === 'object') return raw
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setAuthStorage(token, userInfo) {
  uni.setStorageSync(TOKEN_KEY, token)
  uni.setStorageSync(USER_INFO_KEY, userInfo)
}

export function clearAuthStorage() {
  uni.removeStorageSync(TOKEN_KEY)
  uni.removeStorageSync(USER_INFO_KEY)
}
