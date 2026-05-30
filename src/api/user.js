import request from './request'
import upload from './upload'
import { useMockModule } from '@/utils/env'

const PAGE_SIZE = 5
const MOCK_TOTAL = 15

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

function buildMockList(page, pageSize) {
  const start = (page - 1) * pageSize
  const count = Math.min(pageSize, Math.max(MOCK_TOTAL - start, 0))
  const list = Array.from({ length: count }, (_, index) => {
    const id = start + index + 1
    const preset = MOCK_HOME_LIST[id - 1]
    if (preset) return { ...preset }
    return {
      id,
      title: `列表条目 ${id}`,
      desc: `这是第 ${id} 条 Mock 数据，用于演示上拉加载更多。`
    }
  })
  return {
    list,
    total: MOCK_TOTAL,
    page,
    pageSize,
    hasMore: start + list.length < MOCK_TOTAL
  }
}

export function login(data) {
  if (useMockModule('user')) {
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
    auth: false,
    showLoading: true,
    loadingText: '登录中...'
  })
}

export function getHomeList(params = {}) {
  const page = Number(params.page) || 1
  const pageSize = Number(params.pageSize) || PAGE_SIZE

  if (useMockModule('home')) {
    return mockDelay(buildMockList(page, pageSize))
  }

  return request({
    url: '/home/list',
    method: 'GET',
    data: { page, pageSize, ...params },
    dedupe: true
  })
}

export function getUserProfile() {
  if (useMockModule('user')) {
    return mockDelay({
      id: 1,
      nickname: '演示用户',
      avatar: ''
    })
  }

  return request({
    url: '/user/profile',
    method: 'GET',
    showLoading: true
  })
}

export function uploadAvatar(filePath) {
  if (useMockModule('user')) {
    return mockDelay({ url: filePath || '/static/mock-avatar.png' })
  }

  return upload({
    url: '/user/avatar',
    filePath,
    name: 'avatar'
  })
}
