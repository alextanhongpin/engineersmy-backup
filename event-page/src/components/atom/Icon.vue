<template>
    <i class="material-icons" :title="name" @click="onClick">{{name}}</i>
</template>

<script>
export default {
  name: 'template',
  props: [ 'name' ],
  methods: {
    onClick (evt) {
      this.$emit('click', evt)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';

</style>
