<template>
  <view class="container">
    <view class="hero">
      <text class="title">首页列表</text>
      <text class="subtitle">首个业务模块：内容列表（Mock 数据）</text>
    </view>

    <view v-if="loading" class="state">加载中...</view>
    <view v-else-if="error" class="state error" @tap="fetchList">
      {{ error }}，点击重试
    </view>
    <view v-else class="list">
      <view v-for="item in list" :key="item.id" class="card">
        <text class="card-title">{{ item.title }}</text>
        <text class="card-desc">{{ item.desc }}</text>
      </view>
    </view>
  </view>
</template>

<script>
import { getHomeList } from '../../api/user'

export default {
  data() {
    return {
      loading: false,
      error: '',
      list: []
    }
  },
  onLoad() {
    this.fetchList()
  },
  onPullDownRefresh() {
    this.fetchList().finally(() => {
      uni.stopPullDownRefresh()
    })
  },
  methods: {
    async fetchList() {
      this.loading = true
      this.error = ''
      try {
        const data = await getHomeList()
        this.list = data.list || []
      } catch (error) {
        this.error = error.message || '加载失败'
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
  background: #f8f8f8;
  padding: 24rpx;
  box-sizing: border-box;
}

.hero {
  margin-bottom: 24rpx;
}

.title {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 8rpx;
}

.subtitle {
  display: block;
  font-size: 24rpx;
  color: #999;
}

.state {
  text-align: center;
  padding: 80rpx 0;
  color: #999;
  font-size: 28rpx;
}

.state.error {
  color: #ff3b30;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.card {
  background: #fff;
  border-radius: 20rpx;
  padding: 28rpx;
}

.card-title {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 12rpx;
}

.card-desc {
  display: block;
  font-size: 26rpx;
  color: #666;
  line-height: 1.6;
}
</style>
