<template>

  <div id="wrapper">

    <app-sidebar/>
    <div id="app" :class='{"is-active": isOpen}'>
      <app-header/>
      <app-shimmer/>
      <main>
        <router-view></router-view>
      </main>
      <app-footer/>
    </div>
  </div>
</template>

<script>
import AppHeader from '@/components/atom/AppHeader'
import AppFooter from '@/components/atom/AppFooter'
import AppSidebar from '@/components/atom/AppSidebar'
import AppShimmer from '@/components/atom/AppShimmer'
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'app',
  components: {
    AppHeader,
    AppFooter,
    AppSidebar,
    AppShimmer
  },
  beforeMount () {
    window.addEventListener('online', this.onUpdateOnlineStatus)
    window.addEventListener('offline', this.onUpdateOnlineStatus)
    window.addEventListener('resize', this.onWindowResize)
  },
  beforeDestroy () {
    window.removeEventListener('online', this.onUpdateOnlineStatus)
    window.removeEventListener('offline', this.onUpdateOnlineStatus)
    window.removeEventListener('resize', this.onWindowResize)
  },
  computed: {
    ...mapGetters('sidebar', ['isOpen'])
  },
  methods: {
    ...mapActions(['onOnline', 'onWindowResize']),
    onUpdateOnlineStatus () {
      this.onOnline(window.navigator.onLine)
    }
  }
}
</script>

<style lang="scss">

@import './styles/theme.scss';
@import './styles/main.scss';

</style>
