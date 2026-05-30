import { defineStore } from 'pinia'
import { login as loginApi } from '../api/user'
import {
  clearAuthStorage,
  getStoredToken,
  getStoredUserInfo,
  setAuthStorage
} from './auth'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: getStoredToken(),
    userInfo: getStoredUserInfo()
  }),
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  actions: {
    async login(payload) {
      const result = await loginApi(payload)
      this.token = result.token
      this.userInfo = result.userInfo
      setAuthStorage(this.token, this.userInfo)
      return result
    },
    logout() {
      this.token = ''
      this.userInfo = null
      clearAuthStorage()
    },
    hydrate() {
      this.token = getStoredToken()
      this.userInfo = getStoredUserInfo()
    }
  }
})
