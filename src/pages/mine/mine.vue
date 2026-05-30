<template>
  <view class="container">
    <view class="profile-card">
      <view class="avatar">{{ avatarText }}</view>
      <view class="info">
        <text class="nickname">{{ displayName }}</text>
        <text class="desc">{{ isLoggedIn ? '已登录' : '登录后可使用完整功能' }}</text>
      </view>
    </view>

    <view class="action-card">
      <button v-if="!isLoggedIn" class="btn primary" @tap="goLogin">去登录</button>
      <button v-else class="btn danger" @tap="handleLogout">退出登录</button>
      <button class="btn ghost" @tap="goDemo">查看演示页</button>
    </view>
  </view>
</template>

<script>
import { useUserStore } from '@/store/index'

export default {
  computed: {
    userStore() {
      return useUserStore()
    },
    isLoggedIn() {
      return this.userStore.isLoggedIn
    },
    displayName() {
      return this.userStore.userInfo?.nickname || '未登录用户'
    },
    avatarText() {
      const name = this.displayName
      return name ? name.slice(0, 1) : '?'
    }
  },
  methods: {
    goLogin() {
      uni.navigateTo({ url: '/pages/login/login' })
    },
    handleLogout() {
      this.userStore.logout()
      uni.showToast({ title: '已退出', icon: 'none' })
    },
    goDemo() {
      uni.navigateTo({ url: '/pages/demo/demo' })
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  padding: 40rpx;
  background: #f8f8f8;
  box-sizing: border-box;
}

.profile-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 24rpx;
  padding: 40rpx;
  margin-bottom: 24rpx;
}

.avatar {
  width: 112rpx;
  height: 112rpx;
  border-radius: 56rpx;
  background: #007aff;
  color: #fff;
  font-size: 40rpx;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 24rpx;
}

.info {
  flex: 1;
}

.nickname {
  display: block;
  font-size: 36rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.desc {
  display: block;
  font-size: 24rpx;
  color: #999;
}

.action-card {
  background: #fff;
  border-radius: 24rpx;
  padding: 32rpx;
}

.btn {
  height: 88rpx;
  line-height: 88rpx;
  border-radius: 44rpx;
  font-size: 30rpx;
  margin-bottom: 20rpx;
}

.btn:last-child {
  margin-bottom: 0;
}

.btn.primary {
  background: #007aff;
  color: #fff;
}

.btn.danger {
  background: #ff3b30;
  color: #fff;
}

.btn.ghost {
  background: #f5f5f5;
  color: #333;
}
</style>
