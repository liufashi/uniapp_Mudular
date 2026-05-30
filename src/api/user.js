import request from './request'
import { useMock } from '../utils/env'

const MOCK_HOME_LIST = [
  { id: 1, title: '欢迎使用 uniapp_Mudular', desc: '多端项目骨架已就绪，可在此基础上扩展业务。' },
  { id: 2, title: '网络请求层', desc: 'src/api/request.js 已封装 uni.request，支持 Token 与统一错误处理。' },
  { id: 3, title: '登录模块', desc: 'Mock 模式下可在登录页体验完整流程，接入后端后切换 VITE_USE_MOCK=false。' }
]

function mockDelay(data, ms = 300) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), ms)
  })
}

export function login(data) {
  if (useMock()) {
    return mockDelay({
      token: 'mock-token-' + Date.now(),
      userInfo: {
        id: 1,
        nickname: data.account || '演示用户',
        avatar: ''
      }
    })
  }

  return request({
    url: '/auth/login',
    method: 'POST',
    data,
    auth: false
  })
}

export function getHomeList(params = {}) {
  if (useMock()) {
    return mockDelay({
      list: MOCK_HOME_LIST,
      total: MOCK_HOME_LIST.length
    })
  }

  return request({
    url: '/home/list',
    method: 'GET',
    data: params
  })
}

export function getUserProfile() {
  if (useMock()) {
    return mockDelay({
      id: 1,
      nickname: '演示用户',
      avatar: ''
    })
  }

  return request({
    url: '/user/profile',
    method: 'GET'
  })
}
