<template>
    <div>{{title}}</div>
</template>

<script>
export default {
  name: 'template',
  data () {
    return {
      title: 'Template'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';

</style>
