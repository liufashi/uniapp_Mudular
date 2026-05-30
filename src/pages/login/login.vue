<template>
  <view class="container page-safe">
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
import { useUserStore } from '@/store/index'

const TAB_PAGES = ['/pages/index/index', '/pages/mine/mine']

export default {
  data() {
    return {
      loading: false,
      redirect: '',
      form: {
        account: 'demo',
        password: '123456'
      }
    }
  },
  onLoad(options) {
    if (options.redirect) {
      this.redirect = decodeURIComponent(options.redirect)
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
          this.navigateAfterLogin()
        }, 400)
      } catch (error) {
        console.error('login failed', error)
      } finally {
        this.loading = false
      }
    },
    navigateAfterLogin() {
      if (!this.redirect) {
        uni.switchTab({ url: '/pages/mine/mine' })
        return
      }

      const path = this.redirect.split('?')[0]
      if (TAB_PAGES.includes(path)) {
        uni.switchTab({ url: path })
        return
      }

      uni.redirectTo({ url: this.redirect })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.container {
  padding: 80rpx $spacing-lg;
  box-sizing: border-box;
}

.form-card {
  background: $card-bg;
  border-radius: $border-radius-lg;
  padding: 48rpx $spacing-lg;
}

.title {
  display: block;
  font-size: 44rpx;
  font-weight: bold;
  color: $text-color;
  margin-bottom: 12rpx;
}

.subtitle {
  display: block;
  font-size: $font-size-sm;
  color: $text-color-lighter;
  margin-bottom: 48rpx;
}

.field {
  margin-bottom: 32rpx;
}

.label {
  display: block;
  font-size: 26rpx;
  color: $text-color-light;
  margin-bottom: 12rpx;
}

.input {
  height: 88rpx;
  padding: 0 24rpx;
  background: #f5f5f5;
  border-radius: $border-radius-md;
  font-size: $font-size-md;
  color: $text-color;
}

.placeholder {
  color: #bbb;
}

.btn {
  margin-top: $spacing-sm;
  height: 88rpx;
  line-height: 88rpx;
  background: $primary-color;
  color: #fff;
  border-radius: $border-radius-full;
  font-size: 30rpx;
}
</style>
