<template>
  <view class="container">
    <view class="form-card">
      <text class="title">登录</text>
      <text class="subtitle">Mock 模式下可直接登录体验流程</text>

      <view class="field">
        <text class="label">账号</text>
        <input
          v-model="form.account"
          class="input"
          placeholder="请输入账号"
          placeholder-class="placeholder"
        />
      </view>

      <view class="field">
        <text class="label">密码</text>
        <input
          v-model="form.password"
          class="input"
          password
          placeholder="请输入密码"
          placeholder-class="placeholder"
        />
      </view>

      <button class="btn" :loading="loading" :disabled="loading" @tap="handleLogin">
        登录
      </button>
    </view>
  </view>
</template>

<script>
import { useUserStore } from '../../store/index'

export default {
  data() {
    return {
      loading: false,
      form: {
        account: 'demo',
        password: '123456'
      }
    }
  },
  methods: {
    async handleLogin() {
      if (!this.form.account || !this.form.password) {
        uni.showToast({ title: '请输入账号和密码', icon: 'none' })
        return
      }

      this.loading = true
      try {
        const userStore = useUserStore()
        await userStore.login({
          account: this.form.account,
          password: this.form.password
        })
        uni.showToast({ title: '登录成功', icon: 'success' })
        setTimeout(() => {
          uni.switchTab({ url: '/pages/mine/mine' })
        }, 400)
      } catch (error) {
        console.error('login failed', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  padding: 80rpx 40rpx;
  background: #f8f8f8;
  box-sizing: border-box;
}

.form-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 48rpx 40rpx;
}

.title {
  display: block;
  font-size: 44rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}

.subtitle {
  display: block;
  font-size: 24rpx;
  color: #999;
  margin-bottom: 48rpx;
}

.field {
  margin-bottom: 32rpx;
}

.label {
  display: block;
  font-size: 26rpx;
  color: #666;
  margin-bottom: 12rpx;
}

.input {
  height: 88rpx;
  padding: 0 24rpx;
  background: #f5f5f5;
  border-radius: 16rpx;
  font-size: 28rpx;
  color: #333;
}

.placeholder {
  color: #bbb;
}

.btn {
  margin-top: 16rpx;
  height: 88rpx;
  line-height: 88rpx;
  background: #007aff;
  color: #fff;
  border-radius: 44rpx;
  font-size: 30rpx;
}
</style>
