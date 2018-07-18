<template>
    <div class="break" :style="{height: height}"></div>
</template>

<script>
export default {
  name: 'break',
  props: ['space'],
  computed: {
    height () {
      return this.toPX(this.space || 20)
    }
  },
  methods: {
    toPX (value) {
      return `${value}px`
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';
.break {
  display: block;
  width: 100%;
}
</style>
