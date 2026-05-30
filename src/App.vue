<script>
import { useUserStore } from '@/store/index'
import { registerLogoutHandler } from '@/utils/session'

export default {
  onLaunch() {
    const userStore = useUserStore()
    userStore.hydrate()
    registerLogoutHandler(() => userStore.logout())
  }
}
</script>

<style lang="scss">
@import '@/styles/variables.scss';

page {
  background-color: $bg-color;
}
</style>
