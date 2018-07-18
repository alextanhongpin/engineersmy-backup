<template>
    <div>{{title}}</div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: 'template',
  beforeMount () {
    this.handlePasswordless()
  },
  data () {
    return {
      title: 'Template'
    }
  },
  methods: {
    ...mapActions('login', [
      'handleAuthentication',
      'handlePasswordless'
    ])
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';

</style>
