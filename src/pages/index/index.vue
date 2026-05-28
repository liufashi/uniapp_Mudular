<template>
  <view class="content">
    <text class="title">Hello uniapp</text>
    <text class="subtitle">欢迎使用 uniapp 多端开发框架</text>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  onLoad() {
    console.log('Index onLoad')
  },
  onShow() {
    console.log('Index onShow')
  }
}
</script>

<style scoped>
.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 200rpx;
}
.title {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  margin-bottom: 30rpx;
}
.subtitle {
  font-size: 28rpx;
  color: #666;
}
</style>