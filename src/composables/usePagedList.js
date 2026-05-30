import { getCurrentInstance, nextTick, ref } from 'vue'

export function usePagedList(options = {}) {
  const {
    fetchFn,
    pageSize = 10,
    scrollRootSelector = '.page',
    sentinelSelector = '.load-sentinel',
    viewportBottom = 80
  } = options

  const instance = getCurrentInstance()

  const list = ref([])
  const page = ref(1)
  const loading = ref(false)
  const loadingMore = ref(false)
  const finished = ref(false)
  const error = ref('')

  let loadObserver = null

  function getContext() {
    return instance?.proxy
  }

  async function fetchList({ reset }) {
    if (reset) {
      loading.value = true
    } else {
      loadingMore.value = true
    }

    try {
      const data = await fetchFn(page.value, pageSize)
      const nextList = data.list || []
      list.value = reset ? nextList : list.value.concat(nextList)
      finished.value = data.hasMore === false || nextList.length === 0
      if (reset) {
        error.value = ''
      }
      await nextTick()
      tryFillScreen()
      setupLoadObserver()
    } catch (err) {
      if (!reset) {
        page.value -= 1
      }
      const message = err.message || '加载失败'
      if (reset) {
        error.value = message
      } else {
        uni.showToast({ title: message, icon: 'none' })
      }
    } finally {
      loading.value = false
      loadingMore.value = false
    }
  }

  async function reload() {
    page.value = 1
    finished.value = false
    error.value = ''
    await fetchList({ reset: true })
  }

  async function loadMore() {
    if (loading.value || loadingMore.value || finished.value) return
    page.value += 1
    await fetchList({ reset: false })
  }

  async function handleRefresh() {
    if (loading.value || loadingMore.value) return
    try {
      await reload()
      uni.showToast({ title: '已刷新', icon: 'none', duration: 1200 })
    } finally {
      uni.stopPullDownRefresh()
    }
  }

  function setupLoadObserver() {
    const ctx = getContext()
    if (!ctx || finished.value || loading.value || loadingMore.value) return

    teardownLoadObserver()
    loadObserver = uni.createIntersectionObserver(ctx, {
      observeAll: false
    })
    loadObserver
      .relativeToViewport({ bottom: viewportBottom })
      .observe(sentinelSelector, (res) => {
        if (res.intersectionRatio > 0) {
          loadMore()
        }
      })
  }

  function teardownLoadObserver() {
    if (loadObserver) {
      loadObserver.disconnect()
      loadObserver = null
    }
  }

  function tryFillScreen() {
    const ctx = getContext()
    if (!ctx || finished.value || loading.value || loadingMore.value) return

    const query = uni.createSelectorQuery().in(ctx)
    query.select(scrollRootSelector).boundingClientRect()
    query.exec((res) => {
      const pageRect = res[0]
      if (!pageRect) return
      const { windowHeight } = uni.getSystemInfoSync()
      if (pageRect.height <= windowHeight + 20) {
        loadMore()
      }
    })
  }

  return {
    list,
    loading,
    loadingMore,
    finished,
    error,
    reload,
    loadMore,
    handleRefresh,
    setupLoadObserver,
    teardownLoadObserver
  }
}
