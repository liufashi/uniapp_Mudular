/** 后端业务错误码 → 用户可读文案 */
export const ERROR_CODE_MAP = {
  10001: '账号或密码错误',
  10002: '账号已被禁用',
  10003: '验证码错误或已过期',
  401: '登录已过期，请重新登录',
  403: '暂无访问权限',
  404: '请求的资源不存在',
  500: '服务器繁忙，请稍后重试'
}

export function resolveErrorMessage(payload, fallback = '请求失败') {
  if (!payload || typeof payload !== 'object') {
    return fallback
  }

  const code = payload.code
  if (code !== undefined && code !== null && ERROR_CODE_MAP[code]) {
    return ERROR_CODE_MAP[code]
  }

  return payload.message || payload.msg || fallback
}

export function isSuccessCode(code) {
  return code === 0 || code === 200
}
