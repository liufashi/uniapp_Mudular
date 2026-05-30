<template>
  <view class="container">
    <Header title="演示页" />
    <view class="content">
      <text class="title">Hello uniapp 多端开发</text>
      <text class="desc">支持 iOS / Android / 微信小程序 / H5</text>

      <view class="platform-tags">
        <!-- #ifdef APP-PLUS -->
        <text class="tag app">App 端</text>
        <!-- #endif -->
        <!-- #ifdef MP-WEIXIN -->
        <text class="tag weixin">微信小程序</text>
        <!-- #endif -->
        <!-- #ifdef H5 -->
        <text class="tag h5">H5 端</text>
        <!-- #endif -->
      </view>

      <button @tap="goBack" class="btn">返回首页</button>
    </view>
  </view>
</template>

<script>
import Header from '@/components/Header.vue'
import { guardCurrentPage } from '@/utils/auth'

export default {
  components: { Header },
  data() {
    return {}
  },
  onLoad() {
    console.log('Demo onLoad')
  },
  onShow() {
    guardCurrentPage()
  },
  methods: {
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style scoped>
.container {
  min-height: 100vh;
  background: #f8f8f8;
}
.content {
  padding: 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 20rpx;
}
.desc {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 60rpx;
}
.platform-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 20rpx;
  margin-bottom: 60rpx;
}
.tag {
  padding: 10rpx 30rpx;
  border-radius: 20rpx;
  font-size: 24rpx;
}
.tag.app {
  background: #007AFF;
  color: #fff;
}
.tag.weixin {
  background: #07C160;
  color: #fff;
}
.tag.h5 {
  background: #FF9500;
  color: #fff;
}
.btn {
  width: 300rpx;
  height: 80rpx;
  line-height: 80rpx;
  background: #007AFF;
  color: #fff;
  border-radius: 40rpx;
  font-size: 28rpx;
}
</style>