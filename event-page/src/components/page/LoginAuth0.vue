<template>
    <div class="page">
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'login',
  beforeMount () {
    this.onBeforeLoadLoginPage()
  },
  methods: {
    ...mapActions('login', [
      'onBeforeLoadLoginPage'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';

</style>
