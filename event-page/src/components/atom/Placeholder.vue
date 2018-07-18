<template>
    <div class="placeholder">
      <br/>
      <div>
        <slot></slot>
      </div>
      <br/>
    </div>
</template>

<script>
export default {
  name: 'placeholder'
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@import '../../styles/theme.scss';
.placeholder {
  @extend %page;
  @extend %h4;
  margin: auto;
  max-width: $max-column-width;
  border-radius: 5px;
  text-align: center;
  font-weight: bold;
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
