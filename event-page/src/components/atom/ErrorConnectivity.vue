<template>
  <div class="placeholder">
    <br>
    <div>
      <Icon name="sync_problem" class="md-48"/> 
      <span>
        <div v-for="msg in messageFallback">{{msg}}.</div>
      </span>
    </div>
    <div><button @click="onRetry">Retry</button></div>
    <br>
  </div>
</template>

<script>
import Icon from '../atom/Icon'
export default {
  name: 'template',
  props: ['message'],
  components: {
    Icon
  },
  computed: {
    messageFallback () {
      const messages = this.message || 'Connectivity issue detected. Please try again later.'
      return messages.split('.').filter(x => x)
    }
  },
  methods: {
    onRetry () {
      this.$emit('retry')
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';

.placeholder {
  @extend %page;
  margin: auto;
  max-width: $max-column-width;
  border-radius: 5px;
  text-align: center;
  font-size: 20px;
  // line-height: 48px;
  color: $dove-gray;
  background: rgba($pickled-bluewood, .15);
}

.placeholder span,
.placeholder i {
  display: inline-block;
  vertical-align: middle;
}

</style>
