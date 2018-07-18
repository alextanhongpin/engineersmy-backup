<template>
    <div class="app-footer">{{title}}</div>
</template>

<script>
export default {
  name: 'app-footer',
  data () {
    return {
      title: 'Copyright 2017'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';

.app-footer {
  grid-row: 4;
  grid-column: 1 / 4;
}

.app-footer {
  height: 40px;
  line-height: 40px;
  background-color: $gallery;
  padding: 0 10px;
  @extend %h6;
  font-weight: bold;
}

</style>
