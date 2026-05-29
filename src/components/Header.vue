<template>
  <view class="header">
    <text class="title">{{ title }}</text>
  </view>
</template>

<script>
export default {
  name: 'Header',
  props: {
    title: {
      type: String,
      default: 'uniapp'
    }
  }
}
</script>

<style scoped>
.header {
  height: 88rpx;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  border-bottom: 1rpx solid #eee;
}
.title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
}
</style>