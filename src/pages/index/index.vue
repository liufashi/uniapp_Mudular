<template>
  <view class="page page-tab">
    <view class="hero">
      <text class="title">首页列表</text>
      <text class="subtitle">下拉刷新 · 上拉或点击加载更多</text>
      <!-- #ifdef H5 -->
      <text class="action-link" @tap="handleRefresh">点击刷新</text>
      <!-- #endif -->
    </view>

    <EmptyState v-if="loading && !list.length" text="加载中..." />
    <ErrorState
      v-else-if="error && !list.length"
      :message="error"
      @retry="reload"
    />
    <view v-else class="list">
      <view v-for="item in list" :key="item.id" class="card">
        <text class="card-title">{{ item.title }}</text>
        <text class="card-desc">{{ item.desc }}</text>
      </view>

      <view class="footer" @tap="loadMore">
        <text v-if="loadingMore" class="footer-text">加载中...</text>
        <text v-else-if="finished" class="footer-text">没有更多了</text>
        <text v-else class="footer-text footer-link">上拉或点击加载更多</text>
      </view>

      <view v-if="!finished" class="load-sentinel" />
    </view>
  </view>
</template>

<script>
import { getHomeList } from '@/api/user'
import { usePagedList } from '@/composables/usePagedList'
import EmptyState from '@/components/EmptyState.vue'
import ErrorState from '@/components/ErrorState.vue'

export default {
  components: {
    EmptyState,
    ErrorState
  },
  setup() {
    return usePagedList({
      fetchFn: (page, pageSize) => getHomeList({ page, pageSize }),
      pageSize: 5,
      scrollRootSelector: '.page'
    })
  },
  onLoad() {
    this.reload()
  },
  onReady() {
    this.setupLoadObserver()
  },
  onUnload() {
    this.teardownLoadObserver()
  },
  onPullDownRefresh() {
    this.handleRefresh()
  },
  onReachBottom() {
    this.loadMore()
  }
}
</script>

<style lang="scss" scoped>
@import '@/styles/variables.scss';

.page {
  box-sizing: border-box;
}

.hero {
  padding: 24rpx 24rpx 16rpx;
  box-sizing: border-box;
}

.title {
  display: block;
  font-size: 40rpx;
  font-weight: bold;
  color: $text-color;
  margin-bottom: 8rpx;
}

.subtitle {
  display: block;
  font-size: $font-size-sm;
  color: $text-color-lighter;
}

.action-link {
  display: inline-block;
  margin-top: $spacing-sm;
  font-size: $font-size-sm;
  color: $primary-color;
}

.list {
  display: flex;
  flex-direction: column;
  gap: $spacing-sm;
  padding: 0 24rpx;
  box-sizing: border-box;
}

.card {
  background: $card-bg;
  border-radius: $border-radius-lg;
  padding: 28rpx;
}

.card-title {
  display: block;
  font-size: 30rpx;
  font-weight: bold;
  color: $text-color;
  margin-bottom: 12rpx;
}

.card-desc {
  display: block;
  font-size: 26rpx;
  color: $text-color-light;
  line-height: 1.6;
}

.footer {
  padding: 32rpx 0 16rpx;
  text-align: center;
}

.footer-text {
  font-size: $font-size-sm;
  color: $text-color-lighter;
}

.footer-link {
  color: $primary-color;
}

.load-sentinel {
  height: 2px;
}
</style>
